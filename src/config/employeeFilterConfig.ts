import type { FilterFieldConfig } from "../types/filter.types";
import type { Employee } from "../types/employee.types";
import employees from "../data/employees.json";

const distinctValues = (key: keyof Employee) =>
  Array.from(new Set((employees as Employee[]).map((e) => String(e[key]))))
    .sort()
    .map((v) => ({ label: v, value: v }));

const distinctCities = Array.from(
  new Set((employees as Employee[]).map((e) => e.address.city))
)
  .sort()
  .map((v) => ({ label: v, value: v }));

const allSkills = Array.from(
  new Set((employees as Employee[]).flatMap((e) => e.skills))
)
  .sort()
  .map((v) => ({ label: v, value: v }));


export const employeeFilterConfig: FilterFieldConfig<Employee>[] = [
  { key: "name", label: "Name", type: "text", placeholder: "e.g. John Smith" },
  { key: "email", label: "Email", type: "text", placeholder: "e.g. john@company.com" },
  { key: "department", label: "Department", type: "select", options: distinctValues("department") },
  { key: "role", label: "Role", type: "select", options: distinctValues("role") },
  { key: "salary", label: "Salary", type: "amount", unit: "$" },
  { key: "joinDate", label: "Join Date", type: "date" },
  { key: "lastReview", label: "Last Review Date", type: "date" },
  { key: "isActive", label: "Active", type: "boolean" },
  { key: "skills", label: "Skills", type: "multiselect", options: allSkills, isArrayField: true },
  { key: "address.city", label: "City", type: "select", options: distinctCities },
  { key: "projects", label: "Project Count", type: "number" },
  { key: "performanceRating", label: "Performance Rating", type: "number" },
];
