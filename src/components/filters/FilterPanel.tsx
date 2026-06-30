import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { Plus, X, Download, FileJson } from "lucide-react";
import type {
  FilterCondition,
  FilterFieldConfig,
  FilterOperator,
  FilterValue,
} from "../../types/filter.types";
import { getDefaultOperator } from "../../config/operators";
import FilterConditionRow from "./FilterConditionRow";

interface Props {
  fieldConfigs: FilterFieldConfig[];
  conditions: FilterCondition[];
  onAdd: (fieldConfig: FilterFieldConfig) => void;
  onUpdate: (id: string, patch: Partial<FilterCondition>) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onExportCsv: () => void;
  onExportJson: () => void;
}

/**
 * The reusable, schema-agnostic filter builder. It only ever talks to a
 * `FilterFieldConfig[]` and a list of `FilterCondition`s — point it at a
 * different config array and it filters a completely different table
 * with zero changes to this component.
 */
export default function FilterPanel({
  fieldConfigs,
  conditions,
  onAdd,
  onUpdate,
  onRemove,
  onClearAll,
  onExportCsv,
  onExportJson,
}: Props) {
  const handleFieldChange = (id: string, fieldKey: string) => {
    const nextField = fieldConfigs.find((f) => f.key === fieldKey);
    if (!nextField) return;
    onUpdate(id, {
      fieldKey,
      operator: getDefaultOperator(nextField.type).value,
      value: null,
    });
  };

  const handleOperatorChange = (id: string, operator: FilterOperator) => {
    onUpdate(id, { operator, value: null });
  };

  const handleValueChange = (id: string, value: FilterValue) => {
    onUpdate(id, { value });
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="h6">Filters</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FileJson size={16} />}
            onClick={onExportJson}
          >
            Export JSON
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Download size={16} />}
            onClick={onExportCsv}
          >
            Export CSV
          </Button>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 1.5 }} />

      <Stack spacing={1.5}>
        {conditions.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No filters applied yet. Click "Add Filter" to narrow down the results.
          </Typography>
        )}

        {conditions.map((condition) => (
          <FilterConditionRow
            key={condition.id}
            condition={condition}
            fieldConfigs={fieldConfigs}
            onFieldChange={handleFieldChange}
            onOperatorChange={handleOperatorChange}
            onValueChange={handleValueChange}
            onRemove={onRemove}
          />
        ))}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button
          size="small"
          variant="contained"
          startIcon={<Plus size={16} />}
          onClick={() => onAdd(fieldConfigs[0])}
        >
          Add Filter
        </Button>
        {conditions.length > 0 && (
          <Button
            size="small"
            variant="text"
            color="error"
            startIcon={<X size={16} />}
            onClick={onClearAll}
          >
            Clear All
          </Button>
        )}
      </Stack>
    </Box>
  );
}
