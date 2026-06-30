import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { SearchX } from "lucide-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import type { Employee } from "../../types/employee.types";
import { employeeGridColumns } from "./employeeGridColumns";

interface Props {
  rows: Employee[];
  loading: boolean;
}

const defaultColDef: ColDef = {
  resizable: true,
  sortable: true,
  filter: false,
};

export default function EmployeeDataGrid({ rows, loading }: Props) {
  const columnDefs = useMemo(() => employeeGridColumns, []);

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: 420 }} spacing={1.5}>
        <CircularProgress size={32} />
        <Typography variant="body2" color="text.secondary">
          Loading employee data…
        </Typography>
      </Stack>
    );
  }

  if (rows.length === 0) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: 420 }} spacing={1.5}>
        <SearchX size={36} strokeWidth={1.5} />
        <Typography variant="subtitle1">No results</Typography>
        <Typography variant="body2" color="text.secondary">
          No employees match the current filters. Try adjusting or clearing them.
        </Typography>
      </Stack>
    );
  }

  return (
    <Box className="ag-theme-quartz" sx={{ height: 560, width: "100%" }}>
      <AgGridReact<Employee>
        rowData={rows}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={(p) => String(p.data.id)}
        pagination
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50, 100]}
        animateRows
        suppressCellFocus
      />
    </Box>
  );
}
