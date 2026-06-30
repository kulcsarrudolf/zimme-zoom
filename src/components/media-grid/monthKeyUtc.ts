/** `YYYY-MM` in UTC for grouping and jump targets. */
export function monthKeyUtc(createdAt: number): string {
  const d = new Date(createdAt);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1;
  return `${y}-${pad2(m)}`;
}

export function formatMonthLabelUtc(monthKey: string, locale?: string): string {
  const [ys, ms] = monthKey.split('-');
  const y = Number(ys);
  const mo = Number(ms);
  if (!Number.isFinite(y) || !Number.isFinite(mo)) return monthKey;
  const stamp = Date.UTC(y, mo - 1, 1);
  return new Date(stamp).toLocaleDateString(locale ?? 'en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** First instant of calendar month in UTC. */
export function utcMonthStartMs(year: number, month1to12: number): number {
  return Date.UTC(year, month1to12 - 1, 1, 0, 0, 0, 0);
}

/** Last instant of calendar month in UTC (end of last day). */
export function utcMonthEndMs(year: number, month1to12: number): number {
  return Date.UTC(year, month1to12, 0, 23, 59, 59, 999);
}

/** Parse `YYYY-MM` from `<input type="month" />` value. */
export function parseMonthInputValue(value: string): { year: number; month: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return null;
  return { year, month };
}

/** Newest-first UTC `YYYY-MM` keys (e.g. jump menu for the last N months). */
export function utcMonthKeysDescending(
  count: number,
  refUtc: Date | number = Date.now(),
): string[] {
  const ref = typeof refUtc === 'number' ? new Date(refUtc) : refUtc;
  const keys: string[] = [];
  const y = ref.getUTCFullYear();
  const m = ref.getUTCMonth();
  for (let i = 0; i < count; i++) {
    const d = new Date(Date.UTC(y, m - i, 1));
    keys.push(`${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}`);
  }
  return keys;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
