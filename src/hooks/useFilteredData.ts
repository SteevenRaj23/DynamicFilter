import { useMemo } from "react";
import type { FilterCondition, FilterFieldConfig } from "../types/filter.types";
import { applyFilters } from "../utils/filterEngine";

export function useFilteredData<T>(
  data: T[],
  conditions: FilterCondition[],
  fieldConfigs: FilterFieldConfig<T>[]
): T[] {
  return useMemo(
    () => applyFilters(data, conditions, fieldConfigs),
    [data, conditions, fieldConfigs]
  );
}
