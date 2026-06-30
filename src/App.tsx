import { useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { SlidersHorizontal } from "lucide-react";

import { theme } from "./theme";
import { employeeFilterConfig } from "./config/employeeFilterConfig";
import { useEmployeeData } from "./hooks/useEmployeeData";
import { useFilterConditions } from "./hooks/useFilterConditions";
import { useFilteredData } from "./hooks/useFilteredData";
import { exportToCsv, exportToJson } from "./utils/csvExport";
import FilterPanel from "./components/filters/FilterPanel";
import EmployeeDataGrid from "./components/table/EmployeeDataGrid";

const EXPORT_COLUMNS = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "department", label: "Department" },
  { key: "role", label: "Role" },
  { key: "salary", label: "Salary" },
  { key: "joinDate", label: "Join Date" },
  { key: "isActive", label: "Active" },
  { key: "skills", label: "Skills" },
  { key: "address.city", label: "City" },
  { key: "address.state", label: "State" },
  { key: "address.country", label: "Country" },
  { key: "projects", label: "Projects" },
  { key: "lastReview", label: "Last Review" },
  { key: "performanceRating", label: "Performance Rating" },
];

function App() {
  const { data, loading, error } = useEmployeeData();
  const { conditions, addCondition, updateCondition, removeCondition, clearAll } =
    useFilterConditions("filters:employees");

  const filteredData = useFilteredData(data, conditions, employeeFilterConfig);

  const activeFieldLabels = useMemo(() => {
    const keys = new Set(conditions.map((c) => c.fieldKey));
    return employeeFilterConfig.filter((f) => keys.has(f.key)).map((f) => f.label);
  }, [conditions]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <AppBar position="static" elevation={0} color="primary">
          <Toolbar>
            <SlidersHorizontal size={20} style={{ marginRight: 10 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Employee Directory — Dynamic Filter
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Paper elevation={0} variant="outlined" sx={{ p: 2.5, mb: 3 }}>
            <FilterPanel
              fieldConfigs={employeeFilterConfig}
              conditions={conditions}
              onAdd={addCondition}
              onUpdate={updateCondition}
              onRemove={removeCondition}
              onClearAll={clearAll}
              onExportCsv={() => exportToCsv(filteredData, EXPORT_COLUMNS, "employees-filtered.csv")}
              onExportJson={() => exportToJson(filteredData, "employees-filtered.json")}
            />

            {activeFieldLabels.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", rowGap: 1 }}>
                {activeFieldLabels.map((label) => (
                  <Chip key={label} label={`Filtering by ${label}`} size="small" color="primary" variant="outlined" />
                ))}
              </Stack>
            )}
          </Paper>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
            <Typography variant="subtitle1">
              Showing <strong>{filteredData.length}</strong> of <strong>{data.length}</strong> records
            </Typography>
          </Stack>

          <Paper elevation={0} variant="outlined">
            <EmployeeDataGrid rows={filteredData} loading={loading} />
          </Paper>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
