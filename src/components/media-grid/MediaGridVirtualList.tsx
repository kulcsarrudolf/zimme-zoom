import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getVisibleRowRange } from './getVisibleRowRange';
import { MediaGridMonthHeaderRow } from './MediaGridMonthHeaderRow';
import { MediaGridThumbnailRow } from './MediaGridThumbnailRow';
import {
  MEDIA_GRID_HEADER_ROW_HEIGHT,
  MEDIA_GRID_OVERSCAN_PX,
  thumbnailRowHeightPx,
} from './mediaGridLayout';
import { useLoadMoreSentinel } from './useLoadMoreSentinel';
import type { MediaGridItem, MediaGridRow } from './types';

export type MediaGridVirtualListHandle = {
  scrollToRowIndex: (index: number) => void;
};

export type MediaGridVirtualListProps = {
  rows: MediaGridRow[];
  columns: number;
  gap: number;
  /** Vertical gap between thumbnail rows in px (reserved in layout; thumbnails sit above this strip). */
  rowGap: number;
  onThumbnailClick?: (item: MediaGridItem) => void;
  loadMore?: () => void | Promise<void>;
  hasMore?: boolean;
  loadingMore?: boolean;
};

const VirtualRow = memo(function VirtualRow({
  row,
  columns,
  gap,
  onThumbnailClick,
}: {
  row: MediaGridRow;
  columns: number;
  gap: number;
  onThumbnailClick?: (item: MediaGridItem) => void;
}) {
  if (row.type === 'header') {
    return <MediaGridMonthHeaderRow label={row.label} />;
  }
  return (
    <MediaGridThumbnailRow
      items={row.items}
      columns={columns}
      gap={gap}
      onThumbnailClick={onThumbnailClick}
    />
  );
});

export const MediaGridVirtualList = forwardRef<
  MediaGridVirtualListHandle,
  MediaGridVirtualListProps
>(function MediaGridVirtualList(
  { rows, columns, gap, rowGap, onThumbnailClick, loadMore, hasMore = false, loadingMore = false },
  ref,
) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  const thumbRowHeight = useMemo(
    () => thumbnailRowHeightPx(containerWidth, columns, gap),
    [containerWidth, columns, gap],
  );

  const layout = useMemo(() => {
    const thumbH = (thumbRowHeight || 96) + rowGap;
    const heights = rows.map((r) => (r.type === 'header' ? MEDIA_GRID_HEADER_ROW_HEIGHT : thumbH));
    const offsets: number[] = new Array(heights.length);
    let y = 0;
    for (let i = 0; i < heights.length; i++) {
      offsets[i] = y;
      y += heights[i];
    }
    return { heights, offsets, totalHeight: y };
  }, [rows, thumbRowHeight, rowGap]);

  const setScrollRef = useCallback((el: HTMLDivElement | null) => {
    scrollRef.current = el;
    setScrollRoot(el);
  }, []);

  useLayoutEffect(() => {
    const el = scrollRoot;
    if (!el) return;

    const obs = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      setContainerWidth(cr.width);
      setViewportHeight(el.clientHeight);
    });

    obs.observe(el);
    setContainerWidth(el.clientWidth);
    setViewportHeight(el.clientHeight);
    return () => obs.disconnect();
  }, [scrollRoot]);

  useLayoutEffect(() => {
    const el = scrollRoot;
    if (!el) return;
    // Keep scroll clamped when layout height changes.
    const max = Math.max(0, layout.totalHeight - el.clientHeight);
    if (el.scrollTop > max) el.scrollTop = max;
  }, [layout.totalHeight, scrollRoot]);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (rafRef.current != null) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      const current = scrollRef.current;
      if (!current) return;
      setScrollTop(current.scrollTop);
      setViewportHeight(current.clientHeight);
    });
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const maxRenderableRows = useMemo(() => {
    const minRowH = Math.min(MEDIA_GRID_HEADER_ROW_HEIGHT, (thumbRowHeight || 96) + rowGap);
    const viewport = Math.max(viewportHeight, 320);
    return Math.max(
      64,
      Math.ceil((viewport + 2 * MEDIA_GRID_OVERSCAN_PX) / Math.max(1, minRowH)) + 24,
    );
  }, [thumbRowHeight, viewportHeight, rowGap]);

  const range = useMemo(() => {
    if (rows.length === 0) return { start: 0, end: 0 };
    return getVisibleRowRange(
      scrollTop,
      viewportHeight,
      layout.offsets,
      layout.heights,
      MEDIA_GRID_OVERSCAN_PX,
      maxRenderableRows,
    );
  }, [rows.length, scrollTop, viewportHeight, layout.offsets, layout.heights, maxRenderableRows]);

  useImperativeHandle(
    ref,
    () => ({
      scrollToRowIndex: (index: number) => {
        const el = scrollRef.current;
        if (!el || rows.length === 0) return;
        const clamped = Math.max(0, Math.min(index, rows.length - 1));
        el.scrollTop = layout.offsets[clamped] ?? 0;
        setScrollTop(el.scrollTop);
      },
    }),
    [layout.offsets, rows.length],
  );

  const sentinelRef = useLoadMoreSentinel({
    enabled: Boolean(loadMore),
    root: scrollRoot,
    loading: loadingMore,
    hasMore,
    onLoadMore: () => loadMore?.(),
  });

  return (
    <div
      ref={setScrollRef}
      className="zz-media-grid-scroll"
      onScroll={onScroll}
      style={{
        height: '100%',
        minHeight: 0,
        overflow: 'auto',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div style={{ height: layout.totalHeight || 0, position: 'relative' }}>
        {range.end > range.start &&
          Array.from({ length: range.end - range.start }, (_, k) => range.start + k).map(
            (index) => {
              const row = rows[index];
              const height = layout.heights[index];
              const top = layout.offsets[index];
              const key =
                row.type === 'header'
                  ? `h-${row.monthKey}-${index}`
                  : `t-${row.monthKey}-${row.items[0]?.id ?? index}-${index}`;
              return (
                <div
                  key={key}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top,
                    height,
                    boxSizing: 'border-box',
                    ...(row.type === 'header' ? {} : { paddingBottom: rowGap }),
                  }}
                >
                  <VirtualRow
                    row={row}
                    columns={columns}
                    gap={gap}
                    onThumbnailClick={onThumbnailClick}
                  />
                </div>
              );
            },
          )}
        {loadMore && layout.totalHeight > 0 && (
          <div
            ref={sentinelRef as React.LegacyRef<HTMLDivElement>}
            style={{
              position: 'absolute',
              top: Math.max(0, layout.totalHeight - 1),
              left: 0,
              width: '100%',
              height: 1,
              pointerEvents: 'none',
            }}
            aria-hidden
          />
        )}
      </div>
    </div>
  );
});
