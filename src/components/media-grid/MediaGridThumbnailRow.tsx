import React, { memo } from 'react';
import { MediaGridThumbnail } from './MediaGridThumbnail';
import type { MediaGridItem } from './types';

export type MediaGridThumbnailRowProps = {
  items: MediaGridItem[];
  columns: number;
  gap: number;
  onThumbnailClick?: (item: MediaGridItem) => void;
};

export const MediaGridThumbnailRow = memo(function MediaGridThumbnailRow({
  items,
  columns,
  gap,
  onThumbnailClick,
}: MediaGridThumbnailRowProps) {
  const padded: (MediaGridItem | null)[] = [...items];
  while (padded.length < columns) padded.push(null);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap,
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {padded
        .slice(0, columns)
        .map((cell, idx) =>
          cell ? (
            <MediaGridThumbnail key={cell.id} item={cell} onClick={onThumbnailClick} />
          ) : (
            <div key={`empty-${idx}`} style={{ minHeight: 0 }} aria-hidden />
          ),
        )}
    </div>
  );
});
