import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhotoViewer } from '../components/photo-viewer/PhotoViewer';
import { ZZImage } from '../types/image.type';
import React, { useState } from 'react';

// Helper function to generate a random seed
const generateRandomSeed = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Star SVG component - maintains aspect ratio
const StarSvg: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg
    viewBox="0 0 1024 1024"
    className={className}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      width: '100%',
      height: '100%',
      ...style,
    }}
    preserveAspectRatio="xMidYMid meet"
  >
    <path
      d="M923.2 429.6H608l-97.6-304-97.6 304H97.6l256 185.6L256 917.6l256-187.2 256 187.2-100.8-302.4z"
      fill="#FAD97F"
    />
    <path
      d="M1024 396H633.6L512 21.6 390.4 396H0l315.2 230.4-121.6 374.4L512 770.4l316.8 232L707.2 628 1024 396zM512 730.4l-256 187.2 97.6-302.4-256-185.6h315.2l97.6-304 97.6 304h315.2l-256 185.6L768 917.6l-256-187.2z"
      fill=""
    />
  </svg>
);

const meta: Meta<typeof PhotoViewer> = {
  title: 'PhotoViewer',
  component: PhotoViewer,
  parameters: {
    layout: 'fullscreen',
    order: 3,
  },
  argTypes: {
    onClose: { action: 'close' },
    onImageChange: { action: 'image changed' },
    settings: {
      control: 'object',
      description: 'PhotoViewer settings to customize behavior',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PhotoViewer>;

// Sample images for the photo viewer
const sampleImages: ZZImage[] = [
  {
    id: '1',
    src: 'https://picsum.photos/800/600?random=1',
    alt: 'Landscape photo',
    title: 'Beautiful mountain landscape',
  },
  {
    id: '2',
    src: 'https://picsum.photos/600/800?random=2',
    alt: 'Portrait photo',
    title: 'City architecture',
  },
  {
    id: '3',
    src: 'https://picsum.photos/1200/800?random=3',
    alt: 'Wide landscape',
    title: 'Ocean view panorama',
  },
  {
    id: '4',
    src: 'https://picsum.photos/800/800?random=4',
    alt: 'Square photo',
    title: 'Abstract art composition',
    svgOverlay: (
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      >
        © Artist Name 2023
      </div>
    ),
  },
];

// Wrapper component for better Storybook experience
const PhotoViewerWrapper = (args: React.ComponentProps<typeof PhotoViewer>) => {
  const [selectedImage, setSelectedImage] = useState<ZZImage | null>(args.selectedImage);

  return (
    <div>
      <div style={{ padding: '20px', textAlign: 'center', height: '500px' }}>
        <h2>Click a button to open the PhotoViewer:</h2>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          {sampleImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              style={{
                padding: '10px 15px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              Open Image {index + 1}
            </button>
          ))}
        </div>
      </div>
      <PhotoViewer {...args} selectedImage={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export const WithCustomSettings: Story = {
  render: PhotoViewerWrapper,
  args: {
    images: sampleImages,
    selectedImage: sampleImages[0],
    settings: {
      allowZoom: true,
      allowRotate: true,
      allowReset: true,
      doubleClickZoom: 3,
      clickOutsideToExit: true,
      keyboardInteraction: true,
      maxZoom: 5,
      minZoom: 0.3,
      zoomStep: 0.5,
    },
  },
};

export const ZoomDisabled: Story = {
  render: PhotoViewerWrapper,
  args: {
    images: sampleImages,
    selectedImage: sampleImages[0],
    settings: {
      allowZoom: false,
      allowRotate: true,
      allowReset: false,
    },
  },
};

export const RotationDisabled: Story = {
  render: PhotoViewerWrapper,
  args: {
    images: sampleImages,
    selectedImage: sampleImages[0],
    settings: {
      allowZoom: true,
      allowRotate: false,
      allowReset: true,
    },
  },
};

export const ZoomAndRotationDisabled: Story = {
  render: PhotoViewerWrapper,
  args: {
    images: sampleImages,
    selectedImage: sampleImages[0],
    settings: {
      allowZoom: false,
      allowRotate: false,
      allowReset: false,
    },
  },
};

export const KeyboardDisabled: Story = {
  render: PhotoViewerWrapper,
  args: {
    images: sampleImages,
    selectedImage: sampleImages[0],
    settings: {
      keyboardInteraction: false,
      clickOutsideToExit: false,
    },
  },
};

export const SingleImageViewer: Story = {
  render: PhotoViewerWrapper,
  args: {
    images: [sampleImages[0]],
    selectedImage: sampleImages[0],
  },
};

const overlayImagesWithLabels: ZZImage[] = [
  {
    id: 'overlay-1',
    src: 'https://picsum.photos/800/600?random=10',
    alt: 'Photo with measurement overlay',
    title: 'Measurement Overlay Example',
    svgOverlay: (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        {/* Measurement lines */}
        <line x1="100" y1="100" x2="300" y2="100" stroke="rgba(0, 255, 0, 0.8)" strokeWidth="2" />
        <line x1="100" y1="95" x2="100" y2="105" stroke="rgba(0, 255, 0, 0.8)" strokeWidth="2" />
        <line x1="300" y1="95" x2="300" y2="105" stroke="rgba(0, 255, 0, 0.8)" strokeWidth="2" />
        <text x="200" y="90" fill="rgba(0, 255, 0, 1)" fontSize="16" textAnchor="middle" fontWeight="bold">
          200px
        </text>

        {/* Annotation box */}
        <rect x="500" y="400" width="250" height="150" fill="rgba(0, 0, 0, 0.8)" rx="5" />
        <text x="625" y="430" fill="white" fontSize="18" textAnchor="middle" fontWeight="bold">
          Annotation
        </text>
        <text x="625" y="460" fill="white" fontSize="14" textAnchor="middle">
          Click the overlay button
        </text>
        <text x="625" y="480" fill="white" fontSize="14" textAnchor="middle">
          in the navigation bar
        </text>
        <text x="625" y="500" fill="white" fontSize="14" textAnchor="middle">
          to toggle this overlay
        </text>
        <circle cx="625" cy="530" r="5" fill="rgba(255, 0, 0, 0.8)" />
        <line x1="625" y1="530" x2="700" y2="500" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: 'overlay-2',
    src: 'https://picsum.photos/600/800?random=11',
    alt: 'Photo with grid overlay',
    title: 'Grid Overlay Example',
    svgOverlay: (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <defs>
          <pattern id="grid-pattern" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid-pattern)" />
        <text x="50" y="95" fill="rgba(255, 255, 255, 0.9)" fontSize="8" textAnchor="middle" fontWeight="bold">
          Grid Overlay (Toggle ON/OFF)
        </text>
      </svg>
    ),
  },
];

// Examples using star.svg with different positions and sizes
const starOverlayImages: ZZImage[] = [
  {
    id: 'star-center',
    src: 'https://picsum.photos/800/600?random=20',
    alt: 'Photo with centered star overlay',
    title: 'Centered Star Overlay',
    svgOverlay: <StarSvg />,
    overlayPosition: 'center',
    overlaySize: {
      maxWidth: 200,
      maxHeight: 200,
    },
  },
  {
    id: 'star-top-left',
    src: 'https://picsum.photos/800/600?random=21',
    alt: 'Photo with top-left star overlay',
    title: 'Top-Left Star Overlay',
    svgOverlay: <StarSvg />,
    overlayPosition: 'top-left',
    overlaySize: {
      maxWidth: 150,
      maxHeight: 150,
    },
  },
  {
    id: 'star-bottom-right',
    src: 'https://picsum.photos/800/600?random=22',
    alt: 'Photo with bottom-right star overlay',
    title: 'Bottom-Right Star Overlay',
    svgOverlay: <StarSvg />,
    overlayPosition: 'bottom-right',
    overlaySize: {
      maxWidth: 180,
      maxHeight: 180,
    },
  },
  {
    id: 'star-top',
    src: 'https://picsum.photos/800/600?random=23',
    alt: 'Photo with top centered star overlay',
    title: 'Top Centered Star Overlay',
    svgOverlay: <StarSvg />,
    overlayPosition: 'top',
    overlaySize: {
      maxWidth: 250,
      maxHeight: 250,
    },
  },
  {
    id: 'star-large-center',
    src: 'https://picsum.photos/800/600?random=24',
    alt: 'Photo with large centered star overlay',
    title: 'Large Centered Star Overlay',
    svgOverlay: <StarSvg />,
    overlayPosition: 'center',
    overlaySize: {
      maxWidth: '40%',
      maxHeight: '40%',
    },
  },
];

// Examples using SVG overlays from URLs (e.g., Dicebear API)
const urlOverlayImages: ZZImage[] = [
  {
    id: 'url-overlay-1',
    src: 'https://picsum.photos/800/600?random=30',
    alt: 'Photo with URL-based SVG overlay',
    title: 'Dicebear Bot Overlay (Random Seed)',
    svgOverlay: `https://api.dicebear.com/7.x/bottts/svg?seed=${generateRandomSeed()}`,
    overlayPosition: 'top-right',
    overlaySize: {
      maxWidth: 150,
      maxHeight: 150,
    },
  },
  {
    id: 'url-overlay-2',
    src: 'https://picsum.photos/800/600?random=31',
    alt: 'Photo with URL-based SVG overlay centered',
    title: 'Dicebear Bot Overlay (Centered)',
    svgOverlay: `https://api.dicebear.com/7.x/bottts/svg?seed=${generateRandomSeed()}`,
    overlayPosition: 'center',
    overlaySize: {
      maxWidth: 200,
      maxHeight: 200,
    },
  },
  {
    id: 'url-overlay-3',
    src: 'https://picsum.photos/800/600?random=32',
    alt: 'Photo with full image URL overlay',
    title: 'Dicebear Bot Overlay (Full Image)',
    svgOverlay: `https://api.dicebear.com/7.x/bottts/svg?seed=${generateRandomSeed()}`,
  },
  {
    id: 'url-overlay-4',
    src: 'https://picsum.photos/800/600?random=33',
    alt: 'Photo with bottom-left URL overlay',
    title: 'Dicebear Bot Overlay (Bottom Left)',
    svgOverlay: `https://api.dicebear.com/7.x/bottts/svg?seed=${generateRandomSeed()}`,
    overlayPosition: 'bottom-left',
    overlaySize: {
      maxWidth: 120,
      maxHeight: 120,
    },
  },
];

export const WithURLSVGOverlays: Story = {
  name: 'With URLSVG Overlays',
  render: PhotoViewerWrapper,
  args: {
    images: urlOverlayImages,
    selectedImage: urlOverlayImages[0],
    settings: {
      showOverlayButton: true,
      showOverlayByDefault: true,
    },
  },
};

export const WithDownloadEnabled: Story = {
  render: PhotoViewerWrapper,
  args: {
    images: sampleImages,
    selectedImage: sampleImages[0],
    settings: {
      allowDownload: true,
      allowZoom: true,
      allowRotate: true,
      allowReset: true,
    },
  },
};

export const DownloadOnly: Story = {
  render: PhotoViewerWrapper,
  args: {
    images: sampleImages,
    selectedImage: sampleImages[0],
    settings: {
      allowDownload: true,
      allowZoom: false,
      allowRotate: false,
      allowReset: false,
    },
  },
};

// New stories for overlay configuration
export const OverlayShownByDefault: Story = {
  render: PhotoViewerWrapper,
  args: {
    images: overlayImagesWithLabels,
    selectedImage: overlayImagesWithLabels[0],
    settings: {
      showOverlayByDefault: true,
      showOverlayButton: false,
    },
  },
};

export const OverlayButtonShown: Story = {
  render: PhotoViewerWrapper,
  args: {
    images: overlayImagesWithLabels,
    selectedImage: overlayImagesWithLabels[0],
    settings: {
      showOverlayByDefault: false,
      showOverlayButton: true,
    },
  },
};

export const OverlayShownByDefaultWithButton: Story = {
  render: PhotoViewerWrapper,
  args: {
    images: overlayImagesWithLabels,
    selectedImage: overlayImagesWithLabels[0],
    settings: {
      showOverlayByDefault: true,
      showOverlayButton: true,
    },
  },
};

export const StarOverlayShownByDefault: Story = {
  render: PhotoViewerWrapper,
  args: {
    images: starOverlayImages,
    selectedImage: starOverlayImages[0],
    settings: {
      showOverlayByDefault: true,
      showOverlayButton: true,
    },
  },
};
