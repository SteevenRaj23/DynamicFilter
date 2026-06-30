
export type FilterFieldType =
  | "text"
  | "number"
  | "amount"
  | "date"
  | "boolean"
  | "select"
  | "multiselect";

export interface SelectOption {
  label: string;
  value: string;
}

/** Operators, namespaced loosely by the field types that use them. */
export type FilterOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "notContains"
  | "startsWith"
  | "endsWith"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqual"
  | "lessThanOrEqual"
  | "between"
  | "is"
  | "isNot"
  | "in"
  | "notIn"
  | "before"
  | "after"
  | "lastNDays";

/** Declarative description of one filterable field. `key` supports dot
 * notation for nested objects (e.g. "address.city"). */
export interface FilterFieldConfig<T = unknown> {
  /** Dot-notation path into the record, e.g. "address.city" */
  key: string;
  label: string;
  type: FilterFieldType;
  /** Required for "select" / "multiselect" fields. */
  options?: SelectOption[];
  /** Optional currency/unit symbol, used by "amount" fields for display. */
  unit?: string;
  /** Placeholder text shown in text/number inputs. */
  placeholder?: string;
  /** Marks a field whose underlying value is an array (e.g. skills[]),
   * which changes how "in"/"notIn" are evaluated against the record. */
  isArrayField?: boolean;
  /** Type-only marker; not read at runtime. Lets call sites write
   * `FilterFieldConfig<Employee>` for IDE key-completion if desired. */
  _recordType?: T;
}

/** A single value type covers every operator's value shape. */
export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | [string, string] // date range / generic tuple
  | [number | null, number | null] // numeric / amount range
  | null;

/** One filter condition the user has configured in the UI. */
export interface FilterCondition {
  id: string;
  fieldKey: string;
  operator: FilterOperator;
  value: FilterValue;
}

/** Per-type operator metadata used to populate the operator dropdown. */
export interface OperatorDefinition {
  value: FilterOperator;
  label: string;
}
