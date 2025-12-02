import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const IntroductionComponent = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Zimme Zoom</h1>
      <p>A lightweight React photo viewer with zoom, navigation, blurred background, and SVG overlay support.</p>

      <h2>Features</h2>
      <ul>
        <li>
          🔍 <strong>Zoom functionality</strong> - Zoom in/out with mouse wheel or buttons
        </li>
        <li>
          🖱️ <strong>Pan support</strong> - Drag to pan when zoomed in
        </li>
        <li>
          🔄 <strong>Rotation</strong> - Rotate images with buttons or keyboard shortcuts
        </li>
        <li>
          📱 <strong>Touch gestures</strong> - Full touch support for mobile devices
        </li>
        <li>
          ⌨️ <strong>Keyboard navigation</strong> - Navigate with arrow keys, ESC to close
        </li>
        <li>
          🎨 <strong>SVG overlays</strong> - Add custom SVG overlays to images
        </li>
        <li>
          🌫️ <strong>Blurred background</strong> - Beautiful blurred backdrop
        </li>
        <li>
          📦 <strong>Lightweight</strong> - Minimal bundle size
        </li>
      </ul>

      <h2>Components</h2>

      <h3>Image</h3>
      <p>A thumbnail image component with loading states and click handling.</p>

      <h3>Gallery</h3>
      <p>A responsive grid layout for displaying multiple images with a built-in photo viewer.</p>

      <h3>PhotoViewer</h3>
      <p>A full-screen photo viewer with zoom, pan, rotation, and navigation capabilities.</p>

      <h2>Quick Start</h2>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
        {`import { Gallery, Image, PhotoViewer } from 'zimme-zoom';

const images = [
  {
    id: '1',
    src: 'https://example.com/image1.jpg',
    alt: 'Description',
    title: 'Image Title',
  },
  // ... more images
];

function App() {
  return <Gallery images={images} />;
}`}
      </pre>

      <h2>Customization</h2>
      <p>
        The PhotoViewer component accepts a <code>settings</code> prop to customize its behavior:
      </p>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
        {`const customSettings = {
  allowZoom: true,
  allowRotate: true,
  allowReset: true,
  doubleClickZoom: 4,
  clickOutsideToExit: true,
  keyboardInteraction: true,
  maxZoom: 4,
  minZoom: 0.5,
  zoomStep: 0.3,
};

<PhotoViewer 
  selectedImage={image} 
  images={images} 
  onClose={handleClose}
  settings={customSettings}
/>`}
      </pre>

      <p>
        <strong>Explore the component stories to see all the available options and use cases!</strong>
      </p>
    </div>
  );
};

const meta: Meta<typeof IntroductionComponent> = {
  title: 'Introduction',
  component: IntroductionComponent,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof IntroductionComponent>;

export const Welcome: Story = {};
