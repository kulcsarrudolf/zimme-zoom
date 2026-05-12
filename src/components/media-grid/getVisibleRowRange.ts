/**
 * Returns [start, end) row indices to render for a vertical virtual list.
 * `offsets[i]` is the Y offset of row `i`; `heights[i]` is its height.
 *
 * `maxRenderableRows` caps how many rows we mount. That avoids freezing when the viewport
 * measures incorrectly (e.g. `%` height not resolving) and the naive range would span the
 * entire list.
 */
export function getVisibleRowRange(
  scrollTop: number,
  viewportHeight: number,
  offsets: number[],
  heights: number[],
  overscanPx: number,
  maxRenderableRows: number,
): { start: number; end: number } {
  const n = offsets.length;
  if (n === 0) return { start: 0, end: 0 };

  const top = scrollTop - overscanPx;
  const bottom = scrollTop + viewportHeight + overscanPx;

  let lo = 0;
  let hi = n;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const rowEnd = offsets[mid] + heights[mid];
    if (rowEnd <= top) lo = mid + 1;
    else hi = mid;
  }
  const start = Math.min(lo, n - 1);

  lo = start;
  hi = n;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (offsets[mid] < bottom) lo = mid + 1;
    else hi = mid;
  }
  let end = lo;

  end = Math.max(start + 1, Math.min(end, n));

  if (end - start > maxRenderableRows) {
    end = start + maxRenderableRows;
  }

  return { start, end };
}
