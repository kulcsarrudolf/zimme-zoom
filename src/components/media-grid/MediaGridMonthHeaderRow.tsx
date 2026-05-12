import React, { memo } from 'react';
import { MEDIA_GRID_HEADER_ROW_HEIGHT } from './mediaGridLayout';

export type MediaGridMonthHeaderRowProps = {
  label: string;
};

export const MediaGridMonthHeaderRow = memo(function MediaGridMonthHeaderRow({ label }: MediaGridMonthHeaderRowProps) {
  return (
    <div
      style={{
        height: MEDIA_GRID_HEADER_ROW_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 2,
        paddingRight: 2,
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: '#f2f2f2',
          letterSpacing: 0.2,
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>
    </div>
  );
});
