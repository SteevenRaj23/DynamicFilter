/** Resolves a dot-notation path (e.g. "address.city") against a record.
 * Returns undefined for missing intermediate segments instead of throwing,
 * so the filter engine can treat absent nested data as "no match" safely. */
export function getValueByPath(record: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, segment) => {
    if (acc === null || acc === undefined) return undefined;
    if (typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[segment];
  }, record);
}
