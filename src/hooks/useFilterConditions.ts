import { useCallback, useEffect, useState } from "react";
import type { FilterCondition, FilterFieldConfig } from "../types/filter.types";
import { getDefaultOperator } from "../config/operators";

function readPersisted(storageKey?: string): FilterCondition[] {
  if (!storageKey) return [];
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as FilterCondition[]) : [];
  } catch {
    return [];
  }
}

export function useFilterConditions(storageKey?: string) {
  const [conditions, setConditions] = useState<FilterCondition[]>(() =>
    readPersisted(storageKey)
  );

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(conditions));
  }, [conditions, storageKey]);

  const addCondition = useCallback((fieldConfig: FilterFieldConfig) => {
    const newCondition: FilterCondition = {
      id: crypto.randomUUID(),
      fieldKey: fieldConfig.key,
      operator: getDefaultOperator(fieldConfig.type).value,
      value: null,
    };
    setConditions((prev) => [...prev, newCondition]);
  }, []);

  const updateCondition = useCallback((id: string, patch: Partial<FilterCondition>) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }, []);

  const removeCondition = useCallback((id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearAll = useCallback(() => setConditions([]), []);

  return { conditions, addCondition, updateCondition, removeCondition, clearAll };
}
