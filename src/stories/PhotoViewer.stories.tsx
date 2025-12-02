import type { Meta, StoryObj } from '@storybook/react';
import { PhotoViewer } from '../components/PhotoViewer';
import { ZZImage } from '../types/image.type';
import React, { useState } from 'react';

const meta: Meta<typeof PhotoViewer> = {
  title: 'PhotoViewer',
  component: PhotoViewer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
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
const PhotoViewerWrapper = (args: any) => {
  const [selectedImage, setSelectedImage] = useState<ZZImage | null>(args.selectedImage);

  return (
    <div>
      <div style={{ padding: '20px', textAlign: 'center' }}>
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

export const Default: Story = {
  render: PhotoViewerWrapper,
  args: {
    images: sampleImages,
    selectedImage: null,
  },
};

export const WithCustomSettings: Story = {
  render: PhotoViewerWrapper,
  args: {
    images: sampleImages,
    selectedImage: null,
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
    selectedImage: null,
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
    selectedImage: null,
    settings: {
      allowZoom: true,
      allowRotate: false,
      allowReset: true,
    },
  },
};

export const KeyboardDisabled: Story = {
  render: PhotoViewerWrapper,
  args: {
    images: sampleImages,
    selectedImage: null,
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
    selectedImage: null,
  },
};

// Story showing the viewer opened by default (useful for testing)
export const OpenedByDefault: Story = {
  args: {
    images: sampleImages,
    selectedImage: sampleImages[0],
    onClose: () => console.log('Close called'),
  },
};
