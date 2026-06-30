import { useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useDebouncedCallback } from "../../../hooks/useDebouncedCallback";
import type { FilterFieldConfig, FilterValue } from "../../../types/filter.types";

interface Props {
  fieldConfig: FilterFieldConfig;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export default function AmountRangeValueInput({ fieldConfig, value, onChange }: Props) {
  const [min, max] = (Array.isArray(value) ? value : [null, null]) as [
    number | null,
    number | null,
  ];
  const [minDraft, setMinDraft] = useState(min !== null && min !== undefined ? String(min) : "");
  const [maxDraft, setMaxDraft] = useState(max !== null && max !== undefined ? String(max) : "");

  const commit = useDebouncedCallback((nextMin: string, nextMax: string) => {
    const minNum = nextMin === "" ? null : Number(nextMin);
    const maxNum = nextMax === "" ? null : Number(nextMax);
    onChange([
      minNum !== null && Number.isNaN(minNum) ? null : minNum,
      maxNum !== null && Number.isNaN(maxNum) ? null : maxNum,
    ]);
  }, 300);

  const unit = fieldConfig.unit ?? "";

  return (
    <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
      <TextField
        size="small"
        fullWidth
        type="number"
        label="Min"
        value={minDraft}
        slotProps={{
          input: unit
            ? { startAdornment: <InputAdornment position="start">{unit}</InputAdornment> }
            : undefined,
        }}
        onChange={(e) => {
          setMinDraft(e.target.value);
          commit(e.target.value, maxDraft);
        }}
      />
      <TextField
        size="small"
        fullWidth
        type="number"
        label="Max"
        value={maxDraft}
        slotProps={{
          input: unit
            ? { startAdornment: <InputAdornment position="start">{unit}</InputAdornment> }
            : undefined,
        }}
        onChange={(e) => {
          setMaxDraft(e.target.value);
          commit(minDraft, e.target.value);
        }}
      />
    </Stack>
  );
}
