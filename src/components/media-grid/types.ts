import type { CSSProperties } from 'react';

export type MediaGridItem = {
  id: string;
  src: string;
  name: string;
  /** Unix timestamp in milliseconds (UTC grouping uses `Date#getUTC*` on this instant). */
  createdAt: number;
  alt?: string;
};

export type MediaGridFilters = {
  searchQuery: string;
  /** Inclusive UTC-day start ms, or undefined */
  dateFromMs?: number;
  /** Inclusive UTC-day end ms, or undefined */
  dateToMs?: number;
};

export type MediaGridRow =
  | { type: 'header'; monthKey: string; label: string }
  | { type: 'thumbnails'; monthKey: string; items: MediaGridItem[] };

export type BuiltMediaGridModel = {
  rows: MediaGridRow[];
  /** Virtual row index of each month header (for scroll-to-month). */
  monthHeaderRowIndex: ReadonlyMap<string, number>;
  /** Distinct month keys in visual order (headers top → bottom). */
  monthKeysInOrder: string[];
};

export type MediaGridProps = {
  items: MediaGridItem[];
  /** Fixed height of the scroll container (e.g. `480` or `"70vh"`). */
  height?: number | string;
  columns?: number;
  /** Gap between thumbnails in px (horizontal `column-gap` in each row). */
  gap?: number;
  /** Vertical gap between thumbnail rows in px. Defaults to **`gap`** so spacing matches columns. */
  rowGap?: number;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  /**
   * When `true`, search/date filters apply to `items` in the browser.
   * When `false`, filter changes only call `onFiltersChange`; the parent should replace `items`.
   * Default: `false` when `loadMore` is set, otherwise `true`.
   */
  localFiltering?: boolean;
  loadMore?: () => void | Promise<void>;
  hasMore?: boolean;
  loadingMore?: boolean;
  /** Controlled filters; pass with `onFiltersChange` for full control. */
  filters?: MediaGridFilters;
  defaultFilters?: MediaGridFilters;
  onFiltersChange?: (filters: MediaGridFilters) => void;
  onItemClick?: (item: MediaGridItem) => void;
  enablePhotoViewer?: boolean;
  /** Passed to `toLocaleDateString` for month labels (UTC). */
  labelLocale?: string;
  /** Max width of the grid panel (Messenger-like narrow column). Number = pixels. */
  maxWidth?: number | string;
  /**
   * UTC `YYYY-MM` keys for the Jump menu, newest first (e.g. full range from your API).
   * Defaults to months that appear in `items`.
   */
  jumpMonthKeys?: string[];
  /**
   * When the user jumps to a month that is not in the current row model (e.g. not loaded yet),
   * load data until that month can be shown, then the grid scrolls automatically.
   */
  onJumpToMonthNotLoaded?: (monthKey: string) => void;
};
