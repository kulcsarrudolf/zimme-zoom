import { formatMonthLabelUtc, monthKeyUtc } from './monthKeyUtc';
import type { BuiltMediaGridModel, MediaGridItem, MediaGridRow } from './types';

const DEFAULT_COLUMNS = 3;

/** Newest-first sort, then group by UTC month, then flatten to header + N thumbnail rows per group. */
export function buildMediaGridRows(
  items: MediaGridItem[],
  options?: { columns?: number; labelLocale?: string },
): BuiltMediaGridModel {
  const columns = options?.columns ?? DEFAULT_COLUMNS;
  const locale = options?.labelLocale;

  const sorted = items.slice().sort((a, b) => b.createdAt - a.createdAt);

  const groups: { monthKey: string; label: string; items: MediaGridItem[] }[] = [];
  for (const item of sorted) {
    const key = monthKeyUtc(item.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.monthKey === key) {
      last.items.push(item);
    } else {
      groups.push({ monthKey: key, label: formatMonthLabelUtc(key, locale), items: [item] });
    }
  }

  const rows: MediaGridRow[] = [];
  const monthHeaderRowIndex = new Map<string, number>();
  const monthKeysInOrder: string[] = [];

  for (const g of groups) {
    monthHeaderRowIndex.set(g.monthKey, rows.length);
    monthKeysInOrder.push(g.monthKey);
    rows.push({ type: 'header', monthKey: g.monthKey, label: g.label });

    for (let i = 0; i < g.items.length; i += columns) {
      rows.push({
        type: 'thumbnails',
        monthKey: g.monthKey,
        items: g.items.slice(i, i + columns),
      });
    }
  }

  return { rows, monthHeaderRowIndex, monthKeysInOrder };
}
