import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Trash2 } from "lucide-react";
import type { FilterCondition, FilterFieldConfig, FilterOperator, FilterValue } from "../../types/filter.types";
import { getOperatorsForType } from "../../config/operators";
import FilterValueInput from "./inputs/FilterValueInput";

interface Props {
  condition: FilterCondition;
  fieldConfigs: FilterFieldConfig[];
  onFieldChange: (id: string, fieldKey: string) => void;
  onOperatorChange: (id: string, operator: FilterOperator) => void;
  onValueChange: (id: string, value: FilterValue) => void;
  onRemove: (id: string) => void;
}

export default function FilterConditionRow({
  condition,
  fieldConfigs,
  onFieldChange,
  onOperatorChange,
  onValueChange,
  onRemove,
}: Props) {
  const fieldConfig = fieldConfigs.find((f) => f.key === condition.fieldKey);
  const operators = fieldConfig ? getOperatorsForType(fieldConfig.type) : [];

  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ md: "flex-start" }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id={`${condition.id}-field-label`}>Field</InputLabel>
          <Select
            labelId={`${condition.id}-field-label`}
            label="Field"
            value={condition.fieldKey}
            onChange={(e) => onFieldChange(condition.id, e.target.value)}
          >
            {fieldConfigs.map((f) => (
              <MenuItem key={f.key} value={f.key}>
                {f.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id={`${condition.id}-operator-label`}>Operator</InputLabel>
          <Select
            labelId={`${condition.id}-operator-label`}
            label="Operator"
            value={condition.operator}
            onChange={(e) => onOperatorChange(condition.id, e.target.value as FilterOperator)}
          >
            {operators.map((op) => (
              <MenuItem key={op.value} value={op.value}>
                {op.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1} sx={{ flex: 1, width: "100%" }} alignItems="center">
          {fieldConfig && (
            <FilterValueInput
              fieldConfig={fieldConfig}
              condition={condition}
              onChange={(value) => onValueChange(condition.id, value)}
            />
          )}
          <Tooltip title="Remove filter">
            <IconButton
              aria-label="Remove filter"
              size="small"
              color="error"
              onClick={() => onRemove(condition.id)}
            >
              <Trash2 size={18} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}
