import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format, parseISO, isValid } from "date-fns";
import type { FilterOperator, FilterValue } from "../../../types/filter.types";

interface Props {
  operator: FilterOperator;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

const ISO = "yyyy-MM-dd";

function toDateOrNull(iso: string | undefined | null): Date | null {
  if (!iso) return null;
  const d = parseISO(iso);
  return isValid(d) ? d : null;
}

/** Renders the right widget for whichever date operator is active:
 * a From/To calendar pair for "between", a single calendar for
 * "before"/"after", or a plain day-count field for "lastNDays". */
export default function DateValueInput({ operator, value, onChange }: Props) {
  if (operator === "lastNDays") {
    const days = typeof value === "string" || typeof value === "number" ? String(value) : "";
    return (
      <TextField
        size="small"
        fullWidth
        type="number"
        label="Days"
        value={days}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
      />
    );
  }

  if (operator === "before" || operator === "after") {
    const single = typeof value === "string" ? value : null;
    return (
      <DatePicker
        label={operator === "before" ? "Before date" : "After date"}
        value={toDateOrNull(single)}
        onChange={(date) => onChange(date && isValid(date) ? format(date, ISO) : null)}
        slotProps={{ textField: { size: "small", fullWidth: true } }}
      />
    );
  }

  // "between"
  const [from, to] = (Array.isArray(value) ? value : [null, null]) as [string | null, string | null];
  return (
    <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
      <DatePicker
        label="From"
        value={toDateOrNull(from)}
        onChange={(date) =>
          onChange([date && isValid(date) ? format(date, ISO) : "", to ?? ""] as FilterValue)
        }
        slotProps={{ textField: { size: "small", fullWidth: true } }}
      />
      <DatePicker
        label="To"
        value={toDateOrNull(to)}
        onChange={(date) =>
          onChange([from ?? "", date && isValid(date) ? format(date, ISO) : ""] as FilterValue)
        }
        slotProps={{ textField: { size: "small", fullWidth: true } }}
      />
    </Stack>
  );
}
