import { useState } from "react";
import TextField from "@mui/material/TextField";
import { useDebouncedCallback } from "../../../hooks/useDebouncedCallback";
import type { FilterValue } from "../../../types/filter.types";

interface Props {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export default function NumberValueInput({ value, onChange }: Props) {
  const [draft, setDraft] = useState(typeof value === "number" ? String(value) : "");
  const [error, setError] = useState(false);
  const commit = useDebouncedCallback((next: string) => {
    if (next === "") {
      onChange(null);
      setError(false);
      return;
    }
    const num = Number(next);
    if (Number.isNaN(num)) {
      setError(true);
      return;
    }
    setError(false);
    onChange(num);
  }, 300);

  return (
    <TextField
      size="small"
      fullWidth
      type="number"
      label="Value"
      value={draft}
      error={error}
      helperText={error ? "Enter a valid number" : undefined}
      onChange={(e) => {
        setDraft(e.target.value);
        commit(e.target.value);
      }}
    />
  );
}
