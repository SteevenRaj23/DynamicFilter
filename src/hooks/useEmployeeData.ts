import { useEffect, useState } from "react";
import { fetchEmployees } from "../api/mockApi";
import type { Employee } from "../types/employee.types";

interface UseEmployeeDataResult {
  data: Employee[];
  loading: boolean;
  error: string | null;
}

export function useEmployeeData(): UseEmployeeDataResult {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchEmployees()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
