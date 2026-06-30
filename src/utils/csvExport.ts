import { getValueByPath } from "./getValueByPath";

interface ExportColumn {
  key: string;
  label: string;
}

function toCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join("; ");
  if (typeof value === "object") return JSON.stringify(value);
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

/** Exports an arbitrary record array to CSV using dot-notation columns,
 * so it works for any table the filter system is wired up to. */
export function exportToCsv<T>(records: T[], columns: ExportColumn[], filename: string): void {
  const header = columns.map((c) => toCell(c.label)).join(",");
  const rows = records.map((record) =>
    columns.map((c) => toCell(getValueByPath(record, c.key))).join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToJson<T>(records: T[], filename: string): void {
  const blob = new Blob([JSON.stringify(records, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
