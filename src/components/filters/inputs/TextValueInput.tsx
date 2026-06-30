import { useState } from "react";
import TextField from "@mui/material/TextField";
import { useDebouncedCallback } from "../../../hooks/useDebouncedCallback";
import type { FilterFieldConfig, FilterValue } from "../../../types/filter.types";

interface Props {
  fieldConfig: FilterFieldConfig;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export default function TextValueInput({ fieldConfig, value, onChange }: Props) {
  const [draft, setDraft] = useState(typeof value === "string" ? value : "");
  const commit = useDebouncedCallback((next: string) => onChange(next), 300);

  return (
    <TextField
      size="small"
      fullWidth
      label="Value"
      placeholder={fieldConfig.placeholder}
      value={draft}
      onChange={(e) => {
        setDraft(e.target.value);
        commit(e.target.value);
      }}
    />
  );
}
