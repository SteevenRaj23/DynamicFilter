import type { FilterFieldType, OperatorDefinition } from "../types/filter.types";

export const OPERATORS_BY_TYPE: Record<FilterFieldType, OperatorDefinition[]> = {
  text: [
    { value: "equals", label: "Equals" },
    { value: "contains", label: "Contains" },
    { value: "startsWith", label: "Starts With" },
    { value: "endsWith", label: "Ends With" },
    { value: "notContains", label: "Does Not Contain" },
  ],
  number: [
    { value: "equals", label: "Equals" },
    { value: "greaterThan", label: "Greater Than" },
    { value: "lessThan", label: "Less Than" },
    { value: "greaterThanOrEqual", label: "Greater Than or Equal" },
    { value: "lessThanOrEqual", label: "Less Than or Equal" },
  ],
  amount: [{ value: "between", label: "Between" }],
  date: [
    { value: "between", label: "Between" },
    { value: "before", label: "Before" },
    { value: "after", label: "After" },
    { value: "lastNDays", label: "In the Last N Days" },
  ],
  boolean: [{ value: "is", label: "Is" }],
  select: [
    { value: "is", label: "Is" },
    { value: "isNot", label: "Is Not" },
  ],
  multiselect: [
    { value: "in", label: "In" },
    { value: "notIn", label: "Not In" },
  ],
};

export function getOperatorsForType(type: FilterFieldType): OperatorDefinition[] {
  return OPERATORS_BY_TYPE[type] ?? [];
}

export function getDefaultOperator(type: FilterFieldType): OperatorDefinition {
  return OPERATORS_BY_TYPE[type][0];
}
