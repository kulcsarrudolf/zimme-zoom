import React, { memo, useState } from 'react';
import type { MediaGridFilters } from './types';

export type MediaGridToolbarProps = {
  filters: MediaGridFilters;
  onFiltersChange: (next: MediaGridFilters) => void;
  jumpMonthKeysInOrder: string[];
  jumpMonthLabelsByKey: ReadonlyMap<string, string>;
  onJumpToMonthKey: (monthKey: string) => void;
};

export const MediaGridToolbar = memo(function MediaGridToolbar({
  filters,
  onFiltersChange,
  jumpMonthKeysInOrder,
  jumpMonthLabelsByKey,
  onJumpToMonthKey,
}: MediaGridToolbarProps) {
  const [jumpValue, setJumpValue] = useState('');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'stretch',
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', minWidth: 0 }}>
        <label htmlFor="zz-media-grid-search" style={{ fontSize: 12, color: '#bdbdbd' }}>
          Search by name
        </label>
        <input
          id="zz-media-grid-search"
          type="search"
          value={filters.searchQuery}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              searchQuery: e.target.value,
            })
          }
          autoComplete="off"
          placeholder="Type to filter…"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            borderRadius: 8,
            border: '1px solid #333',
            padding: '8px 10px',
            background: '#111',
            color: '#f5f5f5',
            fontSize: 14,
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', minWidth: 0 }}>
        <label htmlFor="zz-media-grid-jump" style={{ fontSize: 12, color: '#bdbdbd' }}>
          Jump to month
        </label>
        <select
          id="zz-media-grid-jump"
          value={jumpValue}
          onChange={(e) => {
            const v = e.target.value;
            setJumpValue('');
            if (!v) return;
            onJumpToMonthKey(v);
          }}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            borderRadius: 8,
            border: '1px solid #333',
            padding: '8px 10px',
            background: '#111',
            color: '#f5f5f5',
            fontSize: 14,
          }}
        >
          <option value="">Select…</option>
          {jumpMonthKeysInOrder.map((key) => (
            <option key={key} value={key}>
              {jumpMonthLabelsByKey.get(key) ?? key}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
});
