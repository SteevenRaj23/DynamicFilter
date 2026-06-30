import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import type { FilterValue } from "../../../types/filter.types";

interface Props {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export default function BooleanValueInput({ value, onChange }: Props) {
  const current = typeof value === "boolean" ? value : false;
  return (
    <FormControlLabel
      sx={{ ml: 0 }}
      control={
        <Switch checked={current} onChange={(e) => onChange(e.target.checked)} size="small" />
      }
      label={current ? "True" : "False"}
    />
  );
}
