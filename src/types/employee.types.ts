/** Domain model for the demo dataset. The filter system itself never
 * imports this — it only sees `FilterFieldConfig<Employee>[]` from
 * config/employeeFilterConfig.ts, which is what keeps it reusable. */
export interface EmployeeAddress {
  city: string;
  state: string;
  country: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  joinDate: string; // ISO date "YYYY-MM-DD"
  isActive: boolean;
  skills: string[];
  address: EmployeeAddress;
  projects: number;
  lastReview: string; // ISO date "YYYY-MM-DD"
  performanceRating: number;
}
