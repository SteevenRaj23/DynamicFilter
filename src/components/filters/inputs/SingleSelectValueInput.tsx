import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { FilterFieldConfig, FilterValue } from "../../../types/filter.types";

interface Props {
  fieldConfig: FilterFieldConfig;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export default function SingleSelectValueInput({ fieldConfig, value, onChange }: Props) {
  const current = typeof value === "string" ? value : "";
  return (
    <FormControl size="small" fullWidth>
      <InputLabel id={`${fieldConfig.key}-value-label`}>Value</InputLabel>
      <Select
        labelId={`${fieldConfig.key}-value-label`}
        label="Value"
        value={current}
        onChange={(e) => onChange(e.target.value)}
      >
        {(fieldConfig.options ?? []).map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
