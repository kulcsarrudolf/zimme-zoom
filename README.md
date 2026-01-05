# zimme-zoom

A lightweight React photo viewer with zoom, navigation, blurred background, and SVG overlay support.

## Preview

![zimme-zoom preview](./assets/zimme-zoom-preview.gif)

## Prerequisites

- Node.js >= 14.0.0
- React >= 16.8.0
- React DOM >= 16.8.0
- Yarn >= 1.22.0 (or npm)

## Installation

```bash
yarn add zimme-zoom
```

## Usage

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

📖 **More examples and interactive demos:** [Storybook](https://zimme-zoom.vercel.app)

## License

MIT
