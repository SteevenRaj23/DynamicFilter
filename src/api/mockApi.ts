import employeesData from "../data/employees.json";
import type { Employee } from "../types/employee.types";

/**
 * Simulated REST layer over the local JSON dataset.
 */

const SIMULATED_LATENCY_MS = 400;
const SIMULATED_FAILURE_RATE = 0; // set > 0 to exercise the error UI path

function delay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function fetchEmployees(): Promise<Employee[]> {
  if (SIMULATED_FAILURE_RATE > 0 && Math.random() < SIMULATED_FAILURE_RATE) {
    await delay(null, SIMULATED_LATENCY_MS);
    throw new Error("Failed to load employee data from the API.");
  }
  return delay(employeesData as Employee[], SIMULATED_LATENCY_MS);
}
