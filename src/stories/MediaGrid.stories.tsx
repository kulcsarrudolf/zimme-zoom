import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  MediaGrid,
  filterMediaGridItems,
  monthKeyUtc,
  utcMonthKeysDescending,
  type MediaGridFilters,
  type MediaGridItem,
} from '../components/media-grid';

const meta: Meta<typeof MediaGrid> = {
  title: 'MediaGrid',
  component: MediaGrid,
  parameters: {
    layout: 'padded',
    order: 3,
    docs: {
      description: {
        component: `
**Messenger-style media grid** with month sections, **name search**, jump-to-month (optional full month list + lazy load), and **native windowing** (no extra list libraries).

### UTC grouping
Rows are grouped by **\`YYYY-MM\` in UTC** (\`monthKeyUtc(createdAt)\`). Use \`createdAt\` as an instant (Unix ms); labeling uses \`toLocaleDateString\` with \`timeZone: 'UTC'\`. Pass **\`jumpMonthKeys\`** so the Jump menu lists your full range; use **\`onJumpToMonthNotLoaded\`** to load pages until that month appears.

### Full list vs \`loadMore\`
- **Default (\`loadMore\` unset)**: \`localFiltering\` defaults to **true** — search runs in the browser on \`items\` (optional \`dateFromMs\` / \`dateToMs\` in \`filters\` still work if you set them from code).
- **With \`loadMore\`**: \`localFiltering\` defaults to **false** — the toolbar still updates filter state and calls \`onFiltersChange\`; **you should refetch/reset** \`items\` from the server so results are not "only loaded pages". Pass \`filters\` + \`onFiltersChange\` for full control.

### Peer dependencies
Only **React**. Virtual scrolling uses a small internal offset/height model and \`requestAnimationFrame\` scroll batching.
        `.trim(),
      },
    },
  },
  argTypes: {
    items: { control: 'object', description: 'Items to render (grouped newest-first).' },
    height: { control: 'text', description: 'Scroll area height (number px or CSS length).' },
    columns: { control: { type: 'number', min: 1, max: 6 } },
    gap: { control: { type: 'number', min: 0, max: 24 } },
    localFiltering: {
      control: 'boolean',
      description: 'When false, parent owns filtering; toolbar still fires onFiltersChange.',
    },
    enablePhotoViewer: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof MediaGrid>;

function randomSeeded(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function daysInMonthUtc(year: number, monthIndex0to11: number): number {
  return new Date(Date.UTC(year, monthIndex0to11 + 1, 0)).getUTCDate();
}

/**
 * Deterministic catalog: every UTC month in the last 3 years gets a random (seeded) number of images.
 * Newest-first overall sort, realistic for chat-style media.
 */
function generateCatalogLastThreeYears(seed: number): MediaGridItem[] {
  const rnd = randomSeeded(seed);
  const now = new Date();
  const endYear = now.getUTCFullYear();
  const endMonth = now.getUTCMonth();
  const items: MediaGridItem[] = [];
  let idCounter = 0;

  const monthsToGenerate = 36;
  const minPerMonth = 6;
  const maxPerMonth = 64;

  for (let offset = 0; offset < monthsToGenerate; offset++) {
    const monthStart = new Date(Date.UTC(endYear, endMonth - offset, 1));
    const y = monthStart.getUTCFullYear();
    const mo = monthStart.getUTCMonth();
    const countThisMonth =
      minPerMonth + Math.floor(rnd() * (maxPerMonth - minPerMonth + 1));
    const dim = daysInMonthUtc(y, mo);

    for (let j = 0; j < countThisMonth; j++) {
      const day = 1 + Math.floor(rnd() * dim);
      const hour = Math.floor(rnd() * 24);
      const minute = Math.floor(rnd() * 60);
      const createdAt = Date.UTC(y, mo, day, hour, minute, 0, 0);
      const yLabel = y;
      const mLabel = String(mo + 1).padStart(2, '0');
      idCounter += 1;
      items.push({
        id: `3y-${seed}-${idCounter}`,
        name: `Memory ${yLabel}-${mLabel} #${j + 1}`,
        src: `https://picsum.photos/seed/${seed}-3y-${idCounter}/300/300`,
        alt: `Photo from ${yLabel}-${mLabel}`,
        createdAt,
      });
    }
  }

  items.sort((a, b) => b.createdAt - a.createdAt);
  return items;
}

function generateItems(count: number, options?: { seed?: number; namePrefix?: string }): MediaGridItem[] {
  const seed = options?.seed ?? 1;
  const rnd = randomSeeded(seed);
  const prefix = options?.namePrefix ?? 'Photo';
  const now = Date.UTC(2026, 4, 12, 12, 0, 0, 0);
  const out: MediaGridItem[] = [];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(i / 8) + Math.floor(rnd() * 4);
    const jitterHours = Math.floor(rnd() * 48);
    const createdAt = now - (daysAgo * 86400000 + jitterHours * 3600000);
    out.push({
      id: `mg-${seed}-${i}`,
      name: `${prefix} ${i} — ${daysAgo}d`,
      src: `https://picsum.photos/seed/${seed}-${i}/300/300`,
      alt: `${prefix} ${i}`,
      createdAt,
    });
  }

  return out;
}

const smallSet = generateItems(24, { seed: 11, namePrefix: 'Holiday' });

export const Default: Story = {
  args: {
    items: smallSet,
    height: 560,
    enablePhotoViewer: true,
  },
};

const TOTAL_JUMP_MONTHS = 36;

function firstIndexForMonthKey(catalog: MediaGridItem[], monthKey: string): number {
  for (let i = 0; i < catalog.length; i++) {
    if (monthKeyUtc(catalog[i].createdAt) === monthKey) return i;
  }
  return -1;
}

const LARGE_LIST_PAGE = 96;
const LARGE_LIST_SEED = 4242;
const JUMP_MONTH_KEYS_36 = utcMonthKeysDescending(TOTAL_JUMP_MONTHS);

function LargeListLoadMoreWrapper() {
  const catalogRef = useRef<MediaGridItem[] | null>(null);
  if (catalogRef.current === null) {
    catalogRef.current = generateCatalogLastThreeYears(LARGE_LIST_SEED);
  }
  const catalog = catalogRef.current;

  const [loadedCount, setLoadedCount] = useState(() =>
    Math.min(LARGE_LIST_PAGE, catalog.length),
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState<MediaGridFilters>({ searchQuery: '' });

  const hasMore = loadedCount < catalog.length;

  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    await new Promise<void>(resolve => {
      setTimeout(resolve, 450);
    });
    setLoadedCount(c => {
      if (c >= catalog.length) return c;
      return Math.min(c + LARGE_LIST_PAGE, catalog.length);
    });
    setLoadingMore(false);
  }, [catalog.length, loadingMore]);

  const accumulated = useMemo(() => catalog.slice(0, loadedCount), [catalog, loadedCount]);

  const visibleItems = useMemo(() => filterMediaGridItems(accumulated, filters), [accumulated, filters]);

  const onJumpToMonthNotLoaded = useCallback((monthKey: string) => {
    const idx = firstIndexForMonthKey(catalog, monthKey);
    if (idx < 0) return;
    setLoadedCount(c => Math.max(c, idx + 1));
  }, [catalog]);

  const totalMonths = TOTAL_JUMP_MONTHS;
  const approxTotal = catalog.length;

  return (
    <div>
      <p style={{ maxWidth: 720, color: '#666', fontSize: 14, marginTop: 0 }}>
        Large catalog (~{approxTotal} images) over the <strong>last {totalMonths} UTC months</strong> (~3 years),
        with a <strong>random (seeded) count per month</strong>. Scroll to the bottom to load the next chunk (
        <code>{LARGE_LIST_PAGE}</code> items). Parent filters the <em>loaded</em> slice only — in production you’d
        refetch when <code>onFiltersChange</code> fires.
      </p>
      <MediaGrid
        items={visibleItems}
        height={560}
        loadMore={loadMore}
        hasMore={hasMore}
        loadingMore={loadingMore}
        localFiltering={false}
        filters={filters}
        onFiltersChange={setFilters}
        enablePhotoViewer
        jumpMonthKeys={JUMP_MONTH_KEYS_36}
        onJumpToMonthNotLoaded={onJumpToMonthNotLoaded}
      />
    </div>
  );
}

export const LargeListLoadMore: Story = {
  render: () => <LargeListLoadMoreWrapper />,
};

export const EmptyAfterFilter: Story = {
  args: {
    items: generateItems(8, { seed: 7 }),
    height: 400,
    defaultFilters: { searchQuery: '___no_match___' },
  },
};

export const CrossYearSameMonth: Story = {
  args: {
    items: [
      {
        id: 'a',
        name: 'April 2026',
        src: 'https://picsum.photos/seed/cysm-1/300/300',
        createdAt: Date.UTC(2026, 3, 15, 10, 0, 0, 0),
      },
      {
        id: 'b',
        name: 'April 2025',
        src: 'https://picsum.photos/seed/cysm-2/300/300',
        createdAt: Date.UTC(2025, 3, 2, 10, 0, 0, 0),
      },
      {
        id: 'c',
        name: 'May 2026',
        src: 'https://picsum.photos/seed/cysm-3/300/300',
        createdAt: Date.UTC(2026, 4, 30, 23, 0, 0, 0),
      },
    ],
    height: 420,
    enablePhotoViewer: false,
  },
};
