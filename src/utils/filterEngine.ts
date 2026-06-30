import type {
  FilterCondition,
  FilterFieldConfig,
  FilterOperator,
} from "../types/filter.types";
import { getValueByPath } from "./getValueByPath";

/**
 * Pure, schema-agnostic client-side filtering engine.
 *
 * Combination rule (per the spec): conditions on DIFFERENT fields are
 * AND-ed together; multiple conditions stacked on the SAME field are
 * OR-ed together (e.g. department Is "Sales" OR department Is "Design").
 */

function toDate(value: unknown): Date | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

// ---- per-type evaluators -------------------------------------------------

function evaluateText(raw: unknown, operator: FilterOperator, filterValue: unknown): boolean {
  const needle = String(filterValue ?? "").toLowerCase();
  if (raw === null || raw === undefined) {
    return operator === "notContains";
  }
  const haystack = String(raw).toLowerCase();
  switch (operator) {
    case "equals":
      return haystack === needle;
    case "contains":
      return haystack.includes(needle);
    case "startsWith":
      return haystack.startsWith(needle);
    case "endsWith":
      return haystack.endsWith(needle);
    case "notContains":
      return !haystack.includes(needle);
    default:
      return false;
  }
}

function evaluateNumber(raw: unknown, operator: FilterOperator, filterValue: unknown): boolean {
  if (typeof raw !== "number" || Number.isNaN(raw)) return false;
  const target = Number(filterValue);
  if (Number.isNaN(target)) return false;
  switch (operator) {
    case "equals":
      return raw === target;
    case "greaterThan":
      return raw > target;
    case "lessThan":
      return raw < target;
    case "greaterThanOrEqual":
      return raw >= target;
    case "lessThanOrEqual":
      return raw <= target;
    default:
      return false;
  }
}

function evaluateAmountRange(raw: unknown, filterValue: unknown): boolean {
  if (typeof raw !== "number" || Number.isNaN(raw)) return false;
  const [min, max] = (filterValue as [number | null, number | null]) ?? [null, null];
  if (min !== null && min !== undefined && raw < min) return false;
  if (max !== null && max !== undefined && raw > max) return false;
  return true;
}

function evaluateDate(raw: unknown, operator: FilterOperator, filterValue: unknown): boolean {
  const rawDate = toDate(raw);
  if (!rawDate) return false;
  const rawTime = startOfDay(rawDate);

  switch (operator) {
    case "between": {
      const [start, end] = (filterValue as [string, string]) ?? ["", ""];
      const startDate = toDate(start);
      const endDate = toDate(end);
      if (!startDate || !endDate) return false;
      return rawTime >= startOfDay(startDate) && rawTime <= startOfDay(endDate);
    }
    case "before": {
      const d = toDate(filterValue);
      return d ? rawTime < startOfDay(d) : false;
    }
    case "after": {
      const d = toDate(filterValue);
      return d ? rawTime > startOfDay(d) : false;
    }
    case "lastNDays": {
      const n = Number(filterValue);
      if (Number.isNaN(n) || n <= 0) return false;
      const today = startOfDay(new Date());
      const threshold = today - n * 24 * 60 * 60 * 1000;
      return rawTime >= threshold && rawTime <= today;
    }
    default:
      return false;
  }
}

function evaluateBoolean(raw: unknown, filterValue: unknown): boolean {
  if (typeof raw !== "boolean") return false;
  return raw === Boolean(filterValue);
}

function evaluateSelect(raw: unknown, operator: FilterOperator, filterValue: unknown): boolean {
  if (raw === null || raw === undefined) return operator === "isNot";
  const matches = String(raw) === String(filterValue);
  return operator === "isNot" ? !matches : matches;
}

function evaluateMultiSelect(raw: unknown, operator: FilterOperator, filterValue: unknown): boolean {
  const recordValues = Array.isArray(raw) ? raw.map(String) : [];
  const selected = Array.isArray(filterValue) ? filterValue.map(String) : [];
  if (selected.length === 0) return true;
  const hasOverlap = selected.some((v) => recordValues.includes(v));
  return operator === "notIn" ? !hasOverlap : hasOverlap;
}

/** Returns false for conditions whose value hasn't been filled in yet, so
 * half-configured rows are excluded from filtering instead of silently
 * matching everything (e.g. empty "contains" text). */
export function isConditionComplete(condition: FilterCondition): boolean {
  const v = condition.value;
  if (v === null || v === undefined) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) {
    return v.length > 0 && v.every((part) => part !== null && part !== "" && part !== undefined);
  }
  return true;
}

export function evaluateCondition<T>(
  record: T,
  condition: FilterCondition,
  fieldConfig: FilterFieldConfig<T>
): boolean {
  const raw = getValueByPath(record, fieldConfig.key);
  switch (fieldConfig.type) {
    case "text":
      return evaluateText(raw, condition.operator, condition.value);
    case "number":
      return evaluateNumber(raw, condition.operator, condition.value);
    case "amount":
      return evaluateAmountRange(raw, condition.value);
    case "date":
      return evaluateDate(raw, condition.operator, condition.value);
    case "boolean":
      return evaluateBoolean(raw, condition.value);
    case "select":
      return evaluateSelect(raw, condition.operator, condition.value);
    case "multiselect":
      return evaluateMultiSelect(raw, condition.operator, condition.value);
    default:
      return true;
  }
}

/** Groups conditions by field, applies OR within a group and AND across
 * groups, and filters out incomplete conditions first. */
export function applyFilters<T>(
  records: T[],
  conditions: FilterCondition[],
  fieldConfigs: FilterFieldConfig<T>[]
): T[] {
  const active = conditions.filter(isConditionComplete);
  if (active.length === 0) return records;

  const configByKey = new Map(fieldConfigs.map((c) => [c.key, c]));

  const groups = new Map<string, FilterCondition[]>();
  for (const condition of active) {
    const list = groups.get(condition.fieldKey) ?? [];
    list.push(condition);
    groups.set(condition.fieldKey, list);
  }

  return records.filter((record) =>
    Array.from(groups.entries()).every(([fieldKey, fieldConditions]) => {
      const fieldConfig = configByKey.get(fieldKey);
      if (!fieldConfig) return true;
      return fieldConditions.some((condition) =>
        evaluateCondition(record, condition, fieldConfig)
      );
    })
  );
}
