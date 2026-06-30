import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import type { FilterFieldConfig, FilterValue } from "../../../types/filter.types";

interface Props {
  fieldConfig: FilterFieldConfig;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export default function MultiSelectValueInput({ fieldConfig, value, onChange }: Props) {
  const selected = Array.isArray(value) ? (value as string[]) : [];

  const handleChange = (e: SelectChangeEvent<string[]>) => {
    const next = e.target.value;
    onChange(typeof next === "string" ? next.split(",") : next);
  };

  return (
    <FormControl size="small" fullWidth>
      <InputLabel id={`${fieldConfig.key}-multi-label`}>Value</InputLabel>
      <Select
        labelId={`${fieldConfig.key}-multi-label`}
        label="Value"
        multiple
        value={selected}
        onChange={handleChange}
        renderValue={(vals) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {(vals as string[]).map((v) => (
              <Chip key={v} label={v} size="small" />
            ))}
          </Box>
        )}
      >
        {(fieldConfig.options ?? []).map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            <Checkbox checked={selected.includes(opt.value)} size="small" />
            <ListItemText primary={opt.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
