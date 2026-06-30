import type { ColDef, ValueGetterParams } from "ag-grid-community";
import type { Employee } from "../../types/employee.types";
import {
  ActiveStatusRenderer,
  PerformanceRatingRenderer,
  SkillsRenderer,
} from "./cellRenderers";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatDateValue(value: string | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : dateFormatter.format(d);
}

/** AG Grid column definitions for the Employee table. Kept separate from
 * the filter config (employeeFilterConfig.ts) on purpose: not every
 * filterable field needs a dedicated column, and not every column needs
 * to be filterable — they're related but independent concerns. */
export const employeeGridColumns: ColDef<Employee>[] = [
  { field: "id", headerName: "ID", width: 80, sortable: true },
  { field: "name", headerName: "Name", flex: 1.2, minWidth: 160, sortable: true },
  { field: "email", headerName: "Email", flex: 1.4, minWidth: 200, sortable: true },
  { field: "department", headerName: "Department", flex: 1, minWidth: 140, sortable: true },
  { field: "role", headerName: "Role", flex: 1.2, minWidth: 170, sortable: true },
  {
    field: "salary",
    headerName: "Salary",
    flex: 1,
    minWidth: 120,
    sortable: true,
    type: "rightAligned",
    valueFormatter: (p) => (typeof p.value === "number" ? currencyFormatter.format(p.value) : ""),
  },
  {
    field: "joinDate",
    headerName: "Join Date",
    flex: 1,
    minWidth: 130,
    sortable: true,
    valueFormatter: (p) => formatDateValue(p.value as string),
  },
  {
    field: "lastReview",
    headerName: "Last Review",
    flex: 1,
    minWidth: 130,
    sortable: true,
    valueFormatter: (p) => formatDateValue(p.value as string),
  },
  {
    field: "isActive",
    headerName: "Status",
    width: 130,
    sortable: true,
    cellRenderer: ActiveStatusRenderer,
  },
  {
    field: "skills",
    headerName: "Skills",
    flex: 1.6,
    minWidth: 220,
    sortable: false,
    cellRenderer: SkillsRenderer,
  },
  {
    headerName: "Location",
    colId: "address",
    flex: 1.3,
    minWidth: 200,
    sortable: true,
    valueGetter: (p: ValueGetterParams<Employee>) =>
      p.data ? `${p.data.address.city}, ${p.data.address.state}, ${p.data.address.country}` : "",
  },
  { field: "projects", headerName: "Projects", width: 110, sortable: true, type: "rightAligned" },
  {
    field: "performanceRating",
    headerName: "Rating",
    width: 110,
    sortable: true,
    type: "rightAligned",
    cellRenderer: PerformanceRatingRenderer,
  },
];
