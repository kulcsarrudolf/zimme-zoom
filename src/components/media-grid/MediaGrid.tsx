import React, { useCallback, useDeferredValue, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ZZImage } from '../../types/image.type';
import { PhotoViewer } from '../photo-viewer/PhotoViewer';
import { buildMediaGridRows } from './buildMediaGridRows';
import { filterMediaGridItems } from './filterMediaGridItems';
import { formatMonthLabelUtc } from './monthKeyUtc';
import { mediaGridItemToZZImage, mediaGridItemsToZZImages } from './mapMediaGridToZZImage';
import { MediaGridToolbar } from './MediaGridToolbar';
import { MediaGridVirtualList, type MediaGridVirtualListHandle } from './MediaGridVirtualList';
import type { MediaGridFilters, MediaGridItem, MediaGridProps } from './types';

const DEFAULT_HEIGHT = 520;
const DEFAULT_COLUMNS = 3;
const DEFAULT_GAP = 4;
const DEFAULT_MAX_WIDTH = '20rem';

const defaultFiltersState: MediaGridFilters = { searchQuery: '' };

export const MediaGrid: React.FC<MediaGridProps> = ({
  items,
  height = DEFAULT_HEIGHT,
  columns = DEFAULT_COLUMNS,
  gap = DEFAULT_GAP,
  ariaLabel = 'Media grid',
  className,
  style,
  localFiltering: localFilteringProp,
  loadMore,
  hasMore,
  loadingMore,
  filters: filtersProp,
  defaultFilters,
  onFiltersChange,
  onItemClick,
  enablePhotoViewer = false,
  labelLocale,
  maxWidth = DEFAULT_MAX_WIDTH,
  rowGap: rowGapProp,
  jumpMonthKeys: jumpMonthKeysProp,
  onJumpToMonthNotLoaded,
}) => {
  const rowGap = rowGapProp ?? gap;
  const listRef = useRef<MediaGridVirtualListHandle>(null);
  const jumpTargetMonthRef = useRef<string | null>(null);
  const isControlled = filtersProp !== undefined;
  const [uncontrolledFilters, setUncontrolledFilters] = useState<MediaGridFilters>(
    () => defaultFilters ?? defaultFiltersState,
  );

  const localFiltering = localFilteringProp ?? loadMore == null;
  const filters: MediaGridFilters = isControlled ? (filtersProp as MediaGridFilters) : uncontrolledFilters;

  const setFilters = useCallback(
    (next: MediaGridFilters) => {
      if (!isControlled) setUncontrolledFilters(next);
      onFiltersChange?.(next);
    },
    [isControlled, onFiltersChange],
  );

  const filteredItems = useMemo(() => {
    if (!localFiltering) return items;
    return filterMediaGridItems(items, filters);
  }, [items, filters, localFiltering]);

  const deferredItems = useDeferredValue(filteredItems);

  const model = useMemo(
    () => buildMediaGridRows(deferredItems, { columns, labelLocale }),
    [deferredItems, columns, labelLocale],
  );

  const jumpMonthKeysResolved = useMemo(
    () => (jumpMonthKeysProp?.length ? jumpMonthKeysProp : model.monthKeysInOrder),
    [jumpMonthKeysProp, model.monthKeysInOrder],
  );

  const jumpMonthLabelsByKey = useMemo(() => {
    const m = new Map<string, string>();
    for (const key of jumpMonthKeysResolved) {
      m.set(key, formatMonthLabelUtc(key, labelLocale));
    }
    return m;
  }, [jumpMonthKeysResolved, labelLocale]);

  const viewerImages = useMemo(() => {
    if (!enablePhotoViewer) return [];
    return mediaGridItemsToZZImages(deferredItems);
  }, [enablePhotoViewer, deferredItems]);

  const [selectedZz, setSelectedZz] = useState<ZZImage | null>(null);

  const handleThumbClick = useCallback(
    (item: MediaGridItem) => {
      onItemClick?.(item);
      if (enablePhotoViewer) setSelectedZz(mediaGridItemToZZImage(item));
    },
    [onItemClick, enablePhotoViewer],
  );

  const handleJumpToMonthKey = useCallback(
    (monthKey: string) => {
      const idx = model.monthHeaderRowIndex.get(monthKey);
      if (idx != null) {
        jumpTargetMonthRef.current = null;
        listRef.current?.scrollToRowIndex(idx);
        return;
      }
      if (onJumpToMonthNotLoaded) {
        jumpTargetMonthRef.current = monthKey;
        onJumpToMonthNotLoaded(monthKey);
      }
    },
    [model.monthHeaderRowIndex, onJumpToMonthNotLoaded],
  );

  useLayoutEffect(() => {
    const key = jumpTargetMonthRef.current;
    if (!key) return;
    const idx = model.monthHeaderRowIndex.get(key);
    if (idx != null) {
      listRef.current?.scrollToRowIndex(idx);
      jumpTargetMonthRef.current = null;
    }
  }, [model.monthHeaderRowIndex, model.rows]);

  const heightStyle = typeof height === 'number' ? `${height}px` : height;
  const maxWidthStyle = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
  const isGridUpdating = deferredItems !== filteredItems;

  return (
    <section
      aria-label={ariaLabel}
      aria-busy={isGridUpdating || loadingMore}
      className={className}
      style={{
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: maxWidthStyle,
        marginLeft: 'auto',
        marginRight: 'auto',
        background: '#0b0b0b',
        color: '#e8e8e8',
        padding: '10px 8px',
        borderRadius: 12,
        ...style,
      }}
    >
      <style>
        {`
          @keyframes zzMediaGridImagePulse {
            0% { opacity: 0.6; }
            50% { opacity: 0.8; }
            100% { opacity: 0.6; }
          }
          .zz-media-grid-scroll {
            scrollbar-width: thin;
            scrollbar-color: #5a5a5a #141414;
          }
          .zz-media-grid-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .zz-media-grid-scroll::-webkit-scrollbar-track {
            background: #141414;
            border-radius: 3px;
          }
          .zz-media-grid-scroll::-webkit-scrollbar-thumb {
            background: #4a4a4a;
            border-radius: 3px;
          }
          .zz-media-grid-scroll::-webkit-scrollbar-thumb:hover {
            background: #666;
          }
        `}
      </style>
      <MediaGridToolbar
        filters={filters}
        onFiltersChange={setFilters}
        jumpMonthKeysInOrder={jumpMonthKeysResolved}
        jumpMonthLabelsByKey={jumpMonthLabelsByKey}
        onJumpToMonthKey={handleJumpToMonthKey}
      />

      {model.rows.length === 0 ? (
        <p style={{ margin: '24px 0', color: '#888', fontSize: 14 }}>No items match the current filters.</p>
      ) : (
        <div style={{ height: heightStyle, minHeight: 0, position: 'relative' }}>
          {isGridUpdating && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 2,
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                background: 'rgba(0, 0, 0, 0.25)',
              }}
              role="status"
              aria-live="polite"
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 16px',
                  borderRadius: 8,
                  backgroundColor: '#f0f0f0',
                  color: '#1a1a1a',
                  fontSize: 14,
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: '#1a1a1a',
                    opacity: 0.85,
                    animation: 'zzMediaGridImagePulse 1.5s infinite',
                  }}
                  aria-hidden
                />
                Updating grid…
              </span>
            </div>
          )}
          <MediaGridVirtualList
            ref={listRef}
            rows={model.rows}
            columns={columns}
            gap={gap}
            rowGap={rowGap}
            onThumbnailClick={handleThumbClick}
            loadMore={loadMore}
            hasMore={hasMore}
            loadingMore={loadingMore}
          />
          {loadingMore && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 12,
                zIndex: 3,
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
              role="status"
              aria-live="polite"
            >
              <div
                style={{
                  pointerEvents: 'auto',
                  width: 'calc(100% - 24px)',
                  maxWidth: '18rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: 8,
                  backgroundColor: 'rgba(240, 240, 240, 0.95)',
                  color: '#1a1a1a',
                  fontSize: 13,
                  fontWeight: 600,
                  boxShadow: '0 -2px 12px rgba(0,0,0,0.4)',
                }}
              >
              <div
                style={{
                  height: 4,
                  width: '100%',
                  borderRadius: 2,
                  backgroundColor: '#1a1a1a',
                  opacity: 0.85,
                  animation: 'zzMediaGridImagePulse 1.5s infinite',
                }}
                aria-hidden
              />
              Loading more photos…
            </div>
            </div>
          )}
        </div>
      )}

      {enablePhotoViewer && (
        <PhotoViewer selectedImage={selectedZz} images={viewerImages} onClose={() => setSelectedZz(null)} />
      )}
    </section>
  );
};
