import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const IntroductionComponent = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>zimme-zoom</h1>
      <p>
        A collection of image-related React components packaged as an npm package. The main component is{' '}
        <strong>PhotoViewer</strong>, a lightweight React photo viewer with zoom, navigation, blurred background, and
        SVG overlay support.
      </p>

      <h2>Prerequisites</h2>
      <ul>
        <li>Node.js &gt;= 14.0.0</li>
        <li>React &gt;= 16.8.0</li>
        <li>React DOM &gt;= 16.8.0</li>
        <li>Yarn &gt;= 1.22.0 (or npm)</li>
      </ul>

      <h2>Installation</h2>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
        {`yarn add zimme-zoom`}
      </pre>

      <h2>Components</h2>
      <p>zimme-zoom provides the following React components:</p>
      <ul>
        <li>
          <strong>PhotoViewer</strong> - The main component: A lightweight photo viewer with zoom, navigation, blurred
          background, and SVG overlay support
        </li>
        <li>
          <strong>Gallery</strong> - A grid-based image gallery component that displays images and integrates with
          PhotoViewer
        </li>
        <li>
          <strong>Image</strong> - A reusable image component for displaying images with click handlers, built-in
          loading states (pulsing placeholder), and smooth fade-in transitions
        </li>
      </ul>

      <p>All components are exported from the main package:</p>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
        {`import { PhotoViewer, Gallery, Image } from 'zimme-zoom';
import type { ZZImage, PhotoViewerProps } from 'zimme-zoom';`}
      </pre>

      <h2>PhotoViewer Usage</h2>

      <h3>Basic Example</h3>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
        {`import { PhotoViewer } from 'zimme-zoom';
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
      <PhotoViewer 
        images={images} 
        selectedImage={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </>
  );
}`}
      </pre>

      <h3>With SVG Overlay</h3>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
        {`const imageWithOverlay: ZZImage = {
  id: '2',
  src: 'https://example.com/image2.jpg',
  alt: 'Image with overlay',
  svgOverlay: <YourSVGComponent />,
  overlayPosition: 'bottom-right',
  overlaySize: { maxWidth: 200, maxHeight: 200 },
};`}
      </pre>

      <h2>Custom Settings</h2>
      <p>
        The <code>settings</code> prop allows you to customize the PhotoViewer behavior. All settings are optional and
        will use default values if not provided.
      </p>

      <h3>Available Settings</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Setting</th>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Type</th>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Default</th>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '0.5rem' }}>allowZoom</td>
            <td style={{ padding: '0.5rem' }}>boolean</td>
            <td style={{ padding: '0.5rem' }}>true</td>
            <td style={{ padding: '0.5rem' }}>Enable/disable zoom functionality (mouse wheel, zoom buttons)</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '0.5rem' }}>allowRotate</td>
            <td style={{ padding: '0.5rem' }}>boolean</td>
            <td style={{ padding: '0.5rem' }}>true</td>
            <td style={{ padding: '0.5rem' }}>Enable/disable image rotation</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '0.5rem' }}>allowReset</td>
            <td style={{ padding: '0.5rem' }}>boolean</td>
            <td style={{ padding: '0.5rem' }}>true</td>
            <td style={{ padding: '0.5rem' }}>Enable/disable reset button (resets zoom and rotation)</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '0.5rem' }}>allowDownload</td>
            <td style={{ padding: '0.5rem' }}>boolean</td>
            <td style={{ padding: '0.5rem' }}>false</td>
            <td style={{ padding: '0.5rem' }}>Enable/disable download button</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '0.5rem' }}>doubleClickZoom</td>
            <td style={{ padding: '0.5rem' }}>number</td>
            <td style={{ padding: '0.5rem' }}>4</td>
            <td style={{ padding: '0.5rem' }}>Zoom level when double-clicking the image</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '0.5rem' }}>clickOutsideToExit</td>
            <td style={{ padding: '0.5rem' }}>boolean</td>
            <td style={{ padding: '0.5rem' }}>true</td>
            <td style={{ padding: '0.5rem' }}>Close PhotoViewer when clicking outside the image</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '0.5rem' }}>keyboardInteraction</td>
            <td style={{ padding: '0.5rem' }}>boolean</td>
            <td style={{ padding: '0.5rem' }}>true</td>
            <td style={{ padding: '0.5rem' }}>Enable/disable keyboard shortcuts (Arrow keys, +/-, r, 0, Escape)</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '0.5rem' }}>maxZoom</td>
            <td style={{ padding: '0.5rem' }}>number</td>
            <td style={{ padding: '0.5rem' }}>4</td>
            <td style={{ padding: '0.5rem' }}>Maximum zoom level (multiplier)</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '0.5rem' }}>minZoom</td>
            <td style={{ padding: '0.5rem' }}>number</td>
            <td style={{ padding: '0.5rem' }}>0.5</td>
            <td style={{ padding: '0.5rem' }}>Minimum zoom level (multiplier)</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '0.5rem' }}>zoomStep</td>
            <td style={{ padding: '0.5rem' }}>number</td>
            <td style={{ padding: '0.5rem' }}>0.3</td>
            <td style={{ padding: '0.5rem' }}>Zoom increment/decrement step size</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '0.5rem' }}>showOverlayByDefault</td>
            <td style={{ padding: '0.5rem' }}>boolean</td>
            <td style={{ padding: '0.5rem' }}>false</td>
            <td style={{ padding: '0.5rem' }}>
              Show SVG overlay by default when PhotoViewer opens (only applies if image has svgOverlay)
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '0.5rem' }}>showOverlayButton</td>
            <td style={{ padding: '0.5rem' }}>boolean</td>
            <td style={{ padding: '0.5rem' }}>false</td>
            <td style={{ padding: '0.5rem' }}>
              Show overlay toggle button in navigation bar (only applies if image has svgOverlay)
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Settings Example</h3>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
        {`<PhotoViewer
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
/>`}
      </pre>

      <h2>Image Component Usage</h2>
      <p>
        The <code>Image</code> component is a reusable image component that provides built-in loading states and smooth
        transitions.
      </p>

      <h3>Basic Example</h3>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
        {`import { Image } from 'zimme-zoom';
import type { ZZImage } from 'zimme-zoom';

const image: ZZImage = {
  id: '1',
  src: 'https://example.com/image1.jpg',
  alt: 'Image 1',
};

function App() {
  return <Image image={image} onClick={() => console.log('Image clicked')} />;
}`}
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
    order: 1,
  },
};

export default meta;
type Story = StoryObj<typeof IntroductionComponent>;

export const Welcome: Story = {};
