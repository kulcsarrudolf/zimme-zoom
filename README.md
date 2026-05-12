# zimme-zoom

[![npm version](https://img.shields.io/npm/v/zimme-zoom.svg)](https://www.npmjs.com/package/zimme-zoom)
[![license](https://img.shields.io/npm/l/zimme-zoom.svg)](https://github.com/kulcsarrudolf/zimme-zoom/blob/main/LICENSE)
[![npm downloads](https://img.shields.io/npm/dt/zimme-zoom.svg)](https://www.npmjs.com/package/zimme-zoom)
[![GitHub stars](https://img.shields.io/github/stars/kulcsarrudolf/zimme-zoom.svg)](https://github.com/kulcsarrudolf/zimme-zoom)

A collection of image-related React components packaged as an npm package. The main component is **PhotoViewer**, a lightweight React photo viewer with zoom, navigation, blurred background, and SVG overlay support. **MediaGrid** adds a Messenger-style, windowed month grid with search, jump-to-month, and optional infinite loading—without extra list libraries (React only).

## Components

zimme-zoom provides the following React components:

- **PhotoViewer** - The main component: A lightweight photo viewer with zoom, navigation, blurred background, and SVG overlay support
- **Gallery** - A grid-based image gallery component that displays images and integrates with PhotoViewer
- **MediaGrid** - Virtualized month-grouped image grid with search, jump-to-month, optional `loadMore`, and optional integration with PhotoViewer
- **ImageCarousel** - A swipeable image carousel with lazy loading and touch/mouse gesture support
- **Image** - A reusable image component for displaying images with click handlers, built-in loading states (pulsing placeholder), and smooth fade-in transitions

All components are exported from the main package:

```tsx
import { PhotoViewer, Gallery, MediaGrid, Image } from 'zimme-zoom';
import type { ZZImage, PhotoViewerProps, MediaGridItem, MediaGridProps } from 'zimme-zoom';
```

## Demo

📖 **Examples and interactive demos on [Storybook](https://zimme-zoom.vercel.app)**.

![zimme-zoom preview](./assets/zimme-zoom-preview.gif)

[Click here to view the video demo on YouTube](https://www.youtube.com/watch?v=wzfzD8HtJjk)

## Prerequisites

- Node.js >= 14.0.0
- React >= 16.8.0
- React DOM >= 16.8.0
- Yarn >= 1.22.0 (or npm)

## Installation

```bash
yarn add zimme-zoom
```

## PhotoViewer Usage

### Basic Example

```tsx
import { PhotoViewer } from 'zimme-zoom';
import type { ZZImage } from 'zimme-zoom';

const images: ZZImage[] = [
  {
    id: '1',
    src: 'https://example.com/image1.jpg',
    alt: 'Image 1',
    title: 'My Photo',
  },
];

function App() {
  const [selectedImage, setSelectedImage] = useState<ZZImage | null>(null);

  return (
    <>
      <button onClick={() => setSelectedImage(images[0])}>View Photo</button>
      <PhotoViewer images={images} selectedImage={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
}
```

### With SVG Overlay

```tsx
const imageWithOverlay: ZZImage = {
  id: '2',
  src: 'https://example.com/image2.jpg',
  alt: 'Image with overlay',
  svgOverlay: <YourSVGComponent />,
  overlayPosition: 'bottom-right',
  overlaySize: { maxWidth: 200, maxHeight: 200 },
};
```

### Custom Settings

The `settings` prop allows you to customize the PhotoViewer behavior. All settings are optional and will use default values if not provided.

```tsx
<PhotoViewer
  images={images}
  selectedImage={selectedImage}
  onClose={() => setSelectedImage(null)}
  settings={{
    allowZoom: true,
    allowRotate: true,
    maxZoom: 5,
    zoomStep: 0.3,
  }}
/>
```

#### PhotoViewer Props

| Prop            | Type                           | Required | Description                                                                         |
| --------------- | ------------------------------ | -------- | ----------------------------------------------------------------------------------- |
| `images`        | `ZZImage[]`                    | Yes      | Array of images to display                                                          |
| `selectedImage` | `ZZImage \| null`              | Yes      | Currently selected image to display                                                 |
| `onClose`       | `() => void`                   | Yes      | Callback function called when PhotoViewer is closed                                 |
| `onImageChange` | `(image: ZZImage) => void`     | No       | Callback function called when the displayed image changes                           |
| `settings`      | `Partial<PhotoViewerSettings>` | No       | Configuration object for PhotoViewer behavior (see [Settings](#available-settings)) |

#### Available Settings

All settings are configured through the `settings` prop:

| Setting                | Type      | Default | Description                                                                                 |
| ---------------------- | --------- | ------- | ------------------------------------------------------------------------------------------- |
| `allowZoom`            | `boolean` | `true`  | Enable/disable zoom functionality (mouse wheel, zoom buttons)                               |
| `allowRotate`          | `boolean` | `true`  | Enable/disable image rotation                                                               |
| `allowReset`           | `boolean` | `true`  | Enable/disable reset button (resets zoom and rotation)                                      |
| `allowDownload`        | `boolean` | `false` | Enable/disable download button                                                              |
| `doubleClickZoom`      | `number`  | `4`     | Zoom level when double-clicking the image                                                   |
| `clickOutsideToExit`   | `boolean` | `true`  | Close PhotoViewer when clicking outside the image                                           |
| `keyboardInteraction`  | `boolean` | `true`  | Enable/disable keyboard shortcuts (Arrow keys, +/-, r, 0, Escape)                           |
| `maxZoom`              | `number`  | `4`     | Maximum zoom level (multiplier)                                                             |
| `minZoom`              | `number`  | `0.5`   | Minimum zoom level (multiplier)                                                             |
| `zoomStep`             | `number`  | `0.3`   | Zoom increment/decrement step size                                                          |
| `showOverlayByDefault` | `boolean` | `false` | Show SVG overlay by default when PhotoViewer opens (only applies if image has `svgOverlay`) |
| `showOverlayButton`    | `boolean` | `false` | Show overlay toggle button in navigation bar (only applies if image has `svgOverlay`)       |

#### Settings Example

```tsx
<PhotoViewer
  images={images}
  selectedImage={selectedImage}
  onClose={() => setSelectedImage(null)}
  settings={{
    allowZoom: true,
    allowRotate: true,
    allowReset: true,
    allowDownload: true,
    doubleClickZoom: 3,
    clickOutsideToExit: true,
    keyboardInteraction: true,
    maxZoom: 5,
    minZoom: 0.3,
    zoomStep: 0.5,
    showOverlayByDefault: true,
    showOverlayButton: true,
  }}
/>
```

## MediaGrid Usage

**MediaGrid** renders a scrollable grid (default three columns) with **month headers**, **name search**, and **jump-to-month**. The scroll area uses a thin themed scrollbar; **row gaps** add vertical space between thumbnail rows (Messenger-like). Only rows near the viewport are mounted, so large lists stay responsive. There are **no extra peer dependencies** for virtualization—only React.

Items are grouped by **UTC calendar month** (`YYYY-MM`) derived from each item’s `createdAt` timestamp. Pass **`jumpMonthKeys`** (newest-first `YYYY-MM` list) so the Jump menu shows your **full** range; implement **`onJumpToMonthNotLoaded`** when data is paged so the grid can load until the chosen month exists, then it scrolls automatically.

### Basic example

```tsx
import { MediaGrid } from 'zimme-zoom';
import type { MediaGridItem } from 'zimme-zoom';

const items: MediaGridItem[] = [
  {
    id: '1',
    name: 'Sunset',
    src: 'https://example.com/full/sunset.jpg',
    thumbnailSrc: 'https://example.com/thumbs/sunset.jpg',
    createdAt: Date.UTC(2026, 4, 10, 12, 0, 0, 0),
    alt: 'Sunset',
  },
];

function App() {
  return <MediaGrid items={items} height={520} enablePhotoViewer />;
}
```

### MediaGridItem fields

| Field           | Type     | Required | Description                                      |
| -------------- | -------- | -------- | ------------------------------------------------ |
| `id`           | `string` | Yes      | Stable unique id                                 |
| `src`          | `string` | Yes      | Full-resolution URL (PhotoViewer and download)   |
| `thumbnailSrc` | `string` | No       | Optional smaller URL for grid cells only         |
| `name`         | `string` | Yes      | Display name; used for search                    |
| `createdAt`    | `number` | Yes      | Unix time in ms; UTC month grouping uses this instant |
| `alt`          | `string` | No       | Shown as `img` alt text                          |

In Storybook, **MediaGrid** demos generate **`thumbnailSrc`** (240×240) and **`src`** (1600×1200) for each picsum item so the grid stays light and the viewer loads a larger asset.

| Mode | Default `localFiltering` | Behavior |
| ---- | ------------------------ | -------- |
| Full in-memory list | `true` (when `loadMore` is not passed) | Search (and optional programmatic `dateFromMs` / `dateToMs`) run on `items` in the browser. |
| Paged / infinite (`loadMore` passed) | `false` | Toolbar still updates filters; pass **`filters`** and **`onFiltersChange`**, and replace **`items`** from your API so results are not limited to “whatever pages are loaded.” |

Example with controlled filters while appending pages (parent filters the combined list):

```tsx
import { useCallback, useMemo, useState } from 'react';
import { MediaGrid, filterMediaGridItems } from 'zimme-zoom';
import type { MediaGridFilters, MediaGridItem } from 'zimme-zoom';

function PagedGrid({ allLoadedItems }: { allLoadedItems: MediaGridItem[] }) {
  const [filters, setFilters] = useState<MediaGridFilters>({ searchQuery: '' });

  const visibleItems = useMemo(
    () => filterMediaGridItems(allLoadedItems, filters),
    [allLoadedItems, filters],
  );

  const loadMore = useCallback(async () => {
    // fetch next page, append to parent state driving allLoadedItems
  }, []);

  return (
    <MediaGrid
      items={visibleItems}
      height={520}
      loadMore={loadMore}
      hasMore
      loadingMore={false}
      localFiltering={false}
      filters={filters}
      onFiltersChange={setFilters}
    />
  );
}
```

### Helpers (optional)

You can reuse the same grouping and filter logic outside the component:

- `filterMediaGridItems`, `buildMediaGridRows`
- `monthKeyUtc`, `formatMonthLabelUtc`, `utcMonthStartMs`, `utcMonthEndMs`, `parseMonthInputValue`, `utcMonthKeysDescending`
- `mediaGridItemToZZImage`, `mediaGridItemsToZZImages` (for **PhotoViewer** / **ZZImage**)

### MediaGrid props

| Prop               | Type                         | Required | Description |
| ------------------ | ---------------------------- | -------- | ----------- |
| `items`            | `MediaGridItem[]`            | Yes      | Images to show (grouped by UTC month, newest first) |
| `height`           | `number \| string`           | No       | Scroll area height (default `520`; numbers are pixels) |
| `columns`          | `number`                     | No       | Columns per row (default `3`) |
| `gap`              | `number`                     | No       | Gap between cells in px (default `4`) |
| `rowGap`           | `number`                     | No       | Extra vertical space after each thumbnail row in px (default `6`) |
| `maxWidth`         | `number \| string`           | No       | Max width of the panel (default `20rem`; Messenger-style). Numbers are pixels. |
| `ariaLabel`        | `string`                     | No       | Accessible name for the grid region (default `Media grid`) |
| `className`        | `string`                     | No       | Root `section` class |
| `style`            | `CSSProperties`              | No       | Root inline styles |
| `localFiltering`   | `boolean`                    | No       | When `true`, filter `items` in the browser; when `false`, parent owns filtered data. Default: `false` if `loadMore` is set, else `true`. |
| `loadMore`         | `() => void \| Promise<void>` | No    | Called when the user scrolls near the bottom |
| `hasMore`          | `boolean`                    | No       | When `false`, `loadMore` stops being requested |
| `loadingMore`      | `boolean`                    | No       | While `true`, sentinel will not trigger another `loadMore` |
| `filters`          | `MediaGridFilters`           | No       | Controlled filter state (`searchQuery`, optional `dateFromMs` / `dateToMs`) |
| `defaultFilters`   | `MediaGridFilters`           | No       | Initial filters when uncontrolled |
| `onFiltersChange`  | `(filters: MediaGridFilters) => void` | No | Fires when search changes (filters still support `dateFromMs` / `dateToMs` if you set them in code). |
| `onItemClick`      | `(item: MediaGridItem) => void` | No  | Thumbnail click |
| `enablePhotoViewer`| `boolean`                    | No       | Opens **PhotoViewer** on thumbnail click (default `false`) |
| `labelLocale`      | `string`                     | No       | Locale for month labels (UTC); forwarded to `toLocaleDateString` |
| `jumpMonthKeys`    | `string[]`                   | No       | Full list of `YYYY-MM` keys for Jump (newest first). Defaults to months present in `items`. |
| `onJumpToMonthNotLoaded` | `(monthKey: string) => void` | No | User jumped to a month not in the current row model; load data until it appears (then grid scrolls). |

See the **MediaGrid** stories on [Storybook](https://zimme-zoom.vercel.app) for **LargeListLoadMore** (last ~3 years of random monthly volume + `loadMore`) and other examples.

## Image Component Usage

The `Image` component is a reusable image component that provides built-in loading states and smooth transitions.

### Basic Example

```tsx
import { Image } from 'zimme-zoom';
import type { ZZImage } from 'zimme-zoom';

const image: ZZImage = {
  id: '1',
  src: 'https://example.com/full/image1.jpg',
  thumbnailSrc: 'https://example.com/thumbs/image1.jpg',
  alt: 'Image 1',
};

function App() {
  return <Image image={image} onClick={() => console.log('Image clicked')} />;
}
```

`ZZImage` also supports optional **`thumbnailSrc`** for lighter inline loading; **`src`** is still used by **PhotoViewer** and downloads.

#### Image Props

| Prop      | Type         | Required | Description                                    |
| --------- | ------------ | -------- | ---------------------------------------------- |
| `image`   | `ZZImage`    | Yes      | Image object: `id`, **`src`** (full), optional **`thumbnailSrc`** (preview), `alt`, … |
| `onClick` | `() => void` | No       | Callback function called when image is clicked |

The component is designed to work seamlessly within the `Gallery` component, but can also be used standalone in your own layouts.

## License

MIT
