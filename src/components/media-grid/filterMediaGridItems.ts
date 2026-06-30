import type { MediaGridFilters, MediaGridItem } from './types';

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase();
}

export function filterMediaGridItems(
  items: MediaGridItem[],
  filters: MediaGridFilters,
): MediaGridItem[] {
  const q = normalizeQuery(filters.searchQuery);
  const { dateFromMs, dateToMs } = filters;

  return items.filter((item) => {
    if (q && !normalizeQuery(item.name).includes(q)) return false;
    if (dateFromMs != null && item.createdAt < dateFromMs) return false;
    if (dateToMs != null && item.createdAt > dateToMs) return false;
    return true;
  });
}
