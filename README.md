# zimme-zoom

A collection of image-related React components packaged as an npm package. The main component is **PhotoViewer**, a lightweight React photo viewer with zoom, navigation, blurred background, and SVG overlay support.

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

## Components

zimme-zoom provides the following React components:

- **PhotoViewer** - The main component: A lightweight photo viewer with zoom, navigation, blurred background, and SVG overlay support
- **Gallery** - A grid-based image gallery component that displays images and integrates with PhotoViewer
- **Image** - A reusable image component for displaying images with click handlers, built-in loading states (pulsing placeholder), and smooth fade-in transitions

All components are exported from the main package:

```tsx
import { PhotoViewer, Gallery, Image } from 'zimme-zoom';
import type { ZZImage, PhotoViewerProps } from 'zimme-zoom';
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

## Image Component Usage

The `Image` component is a reusable image component that provides built-in loading states and smooth transitions.

### Basic Example

```tsx
import { Image } from 'zimme-zoom';
import type { ZZImage } from 'zimme-zoom';

const image: ZZImage = {
  id: '1',
  src: 'https://example.com/image1.jpg',
  alt: 'Image 1',
};

function App() {
  return <Image image={image} onClick={() => console.log('Image clicked')} />;
}
```

#### Image Props

| Prop      | Type         | Required | Description                                    |
| --------- | ------------ | -------- | ---------------------------------------------- |
| `image`   | `ZZImage`    | Yes      | Image object containing `id`, `src`, and `alt` |
| `onClick` | `() => void` | No       | Callback function called when image is clicked |

The component is designed to work seamlessly within the `Gallery` component, but can also be used standalone in your own layouts.

## License

MIT
