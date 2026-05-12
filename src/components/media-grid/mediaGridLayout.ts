export const MEDIA_GRID_HEADER_ROW_HEIGHT = 36;
/** Extra pixels above/below viewport when deciding which rows to mount. */
export const MEDIA_GRID_OVERSCAN_PX = 480;

export function thumbnailRowHeightPx(containerWidth: number, columns: number, gap: number): number {
  if (containerWidth <= 0) return 0;
  const inner = containerWidth - gap * Math.max(0, columns - 1);
  const cell = inner / columns;
  return Math.max(0, cell);
}
