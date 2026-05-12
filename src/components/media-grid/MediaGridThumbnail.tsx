import React, { memo, useEffect, useState } from 'react';
import type { MediaGridItem } from './types';

/** Matches `Image`: light gray tile + opacity pulsing (see `MediaGrid` root for `@keyframes`). */
const PLACEHOLDER_BG = '#f0f0f0';

export type MediaGridThumbnailProps = {
  item: MediaGridItem;
  onClick?: (item: MediaGridItem) => void;
};

export const MediaGridThumbnail = memo(function MediaGridThumbnail({ item, onClick }: MediaGridThumbnailProps) {
  const [isLoading, setIsLoading] = useState(true);
  const displaySrc = item.thumbnailSrc ?? item.src;

  useEffect(() => {
    setIsLoading(true);
  }, [item.id, item.src, item.thumbnailSrc]);

  return (
    <button
      type="button"
      onClick={() => onClick?.(item)}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        padding: 0,
        margin: 0,
        border: 'none',
        borderRadius: 8,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        background: '#1a1a1a',
      }}
    >
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: PLACEHOLDER_BG,
            animation: 'zzMediaGridImagePulse 1.5s infinite',
          }}
          aria-hidden
        />
      )}
      <img
        src={displaySrc}
        alt={item.alt ?? item.name}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />
    </button>
  );
});
