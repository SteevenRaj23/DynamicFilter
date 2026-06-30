import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { CheckCircle2, XCircle } from "lucide-react";
import type { ICellRendererParams } from "ag-grid-community";

export function ActiveStatusRenderer(params: ICellRendererParams<unknown, boolean>) {
  const isActive = Boolean(params.value);
  return (
    <Chip
      size="small"
      icon={isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
      label={isActive ? "Active" : "Inactive"}
      color={isActive ? "success" : "default"}
      variant={isActive ? "filled" : "outlined"}
    />
  );
}

export function SkillsRenderer(params: ICellRendererParams<unknown, string[]>) {
  const skills = Array.isArray(params.value) ? params.value : [];
  return (
    <Stack
      direction="row"
      spacing={0.5}
      title={skills.join(", ")}
      sx={{ overflow: "hidden", height: "100%", alignItems: "center" }}
    >
      {skills.slice(0, 3).map((s) => (
        <Chip key={s} label={s} size="small" variant="outlined" />
      ))}
      {skills.length > 3 && (
        <Chip label={`+${skills.length - 3}`} size="small" variant="outlined" />
      )}
    </Stack>
  );
}

export function PerformanceRatingRenderer(params: ICellRendererParams<unknown, number>) {
  const rating = typeof params.value === "number" ? params.value : 0;
  const color = rating >= 4 ? "#2e7d32" : rating >= 3 ? "#ed6c02" : "#d32f2f";
  return <span style={{ fontWeight: 600, color }}>{rating.toFixed(1)}</span>;
}
