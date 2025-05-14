# zimme-zoom

A lightweight React photo viewer with zoom, navigation, blurred background, and SVG overlay support.

## Installation

```bash
yarn add zimme-zoom
```

## Usage

```tsx
import { PhotoViewer } from 'zimme-zoom';

function App() {
  return (
    <PhotoViewer
      src="path/to/your/image.jpg"
      alt="Description of the image"
      initialZoom={1}
      maxZoom={3}
      minZoom={0.5}
      onZoomChange={(zoom) => console.log('Current zoom:', zoom)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | string | required | The URL of the image to display |
| alt | string | '' | Alternative text for the image |
| initialZoom | number | 1 | Initial zoom level |
| maxZoom | number | 3 | Maximum zoom level |
| minZoom | number | 0.5 | Minimum zoom level |
| onZoomChange | (zoom: number) => void | undefined | Callback function when zoom level changes |
| className | string | '' | Additional CSS class name |
| style | React.CSSProperties | {} | Additional inline styles |

## Development

```bash
# Install dependencies
yarn install

# Start development mode
yarn dev

# Build the package
yarn build

# Run tests
yarn test

# Lint code
yarn lint

# Format code
yarn format
```

## Requirements

- Node.js >= 14.0.0
- Yarn >= 1.22.0

## License

MIT
