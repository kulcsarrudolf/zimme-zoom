import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Image } from '../components/image/Image';
import { ImageRatio } from '../types/image.type';

const meta: Meta<typeof Image> = {
  title: 'Image',
  component: Image,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Image>;

const Frame = ({
  children,
  width,
  height,
  label,
}: {
  children: React.ReactNode;
  width: number;
  height: number;
  label: string;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <span style={{ fontSize: '12px', color: '#666' }}>{label}</span>
    <div
      style={{
        width,
        height,
        padding: '12px',
        border: '1px dashed #cbd5e1',
        borderRadius: '12px',
        background: '#f8fafc',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  </div>
);

export const Default: Story = {
  args: {
    image: {
      id: '1',
      src: 'https://picsum.photos/1200/800?random=1',
      alt: 'A sample image',
    },
    size: { ratio: ImageRatio.Square, width: 240 },
  },
};

export const WithTitle: Story = {
  args: {
    image: {
      id: '2',
      src: 'https://picsum.photos/900/1200?random=2',
      alt: 'Mountain landscape',
      title: 'Beautiful mountain landscape',
    },
    size: { ratio: ImageRatio.Portrait, width: 240 },
  },
};

export const WithClickHandler: Story = {
  args: {
    image: {
      id: '3',
      src: 'https://picsum.photos/1200/800?random=3',
      alt: 'Clickable image',
      title: 'Click me',
    },
    size: { ratio: ImageRatio.Landscape, width: 320 },
  },
};

export const LoadingState: Story = {
  args: {
    image: {
      id: '4',
      src: 'https://picsum.photos/1200/800?random=99&delay=5000',
      alt: 'Slow loading image',
    },
    size: { ratio: ImageRatio.Landscape, width: 320 },
  },
};

export const WithoutAlt: Story = {
  args: {
    image: {
      id: '5',
      src: 'https://picsum.photos/1200/800?random=5',
    },
    size: { ratio: ImageRatio.Square, width: 240 },
  },
};

export const MultipleImages: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 200px)', gap: '12px' }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Image
          key={i}
          image={{
            id: String(i),
            src: `https://picsum.photos/1200/800?random=${i + 10}`,
            alt: `Sample image ${i}`,
          }}
          size={{ width: 200, height: 140 }}
          onClick={args.onClick}
        />
      ))}
    </div>
  ),
  args: {},
};

// Size & Ratio stories

export const SquareRatio: Story = {
  args: {
    image: { id: '10', src: 'https://picsum.photos/1200/800?random=10', alt: 'Square' },
    size: { ratio: ImageRatio.Square, width: 220 },
  },
};

export const PortraitRatio: Story = {
  args: {
    image: { id: '11', src: 'https://picsum.photos/1200/800?random=11', alt: 'Portrait' },
    size: { ratio: ImageRatio.Portrait, width: 220 },
  },
};

export const TallRatio: Story = {
  args: {
    image: { id: '12', src: 'https://picsum.photos/1200/800?random=12', alt: 'Tall' },
    size: { ratio: ImageRatio.Tall, width: 180 },
  },
};

export const LandscapeRatio: Story = {
  args: {
    image: { id: '13', src: 'https://picsum.photos/900/1200?random=13', alt: 'Landscape' },
    size: { ratio: ImageRatio.Landscape, width: 320 },
  },
};

export const ClassicRatio: Story = {
  args: {
    image: { id: '14', src: 'https://picsum.photos/900/1200?random=14', alt: 'Classic' },
    size: { ratio: ImageRatio.Classic, width: 280 },
  },
};

export const CinematicRatio: Story = {
  args: {
    image: { id: '15', src: 'https://picsum.photos/900/1200?random=15', alt: 'Cinematic' },
    size: { ratio: ImageRatio.Cinematic, width: 320 },
  },
};

export const GoldenRatio: Story = {
  args: {
    image: { id: '16', src: 'https://picsum.photos/1200/800?random=16', alt: 'Golden ratio' },
    size: { ratio: ImageRatio.Golden, width: 280 },
  },
};

export const FixedContainerSize: Story = {
  args: {
    image: { id: '17', src: 'https://picsum.photos/1200/800?random=17', alt: 'Fixed container size' },
    size: { width: 320, height: 180 },
  },
};

export const MaxWidthAndHeight: Story = {
  render: (args) => (
    <div
      style={{
        width: 520,
        height: 320,
        padding: '16px',
        border: '1px dashed #cbd5e1',
        borderRadius: '12px',
        background: '#f8fafc',
        boxSizing: 'border-box',
      }}
    >
      <Image {...args} />
    </div>
  ),
  args: {
    image: { id: '18', src: 'https://picsum.photos/1200/800?random=18', alt: 'Constrained by max size' },
    size: { width: '100%', height: '100%', maxWidth: 340, maxHeight: 220 },
  },
};

export const BlogPostImage: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        maxWidth: '640px',
        padding: '16px',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        background: '#fff',
        boxSizing: 'border-box',
      }}
    >
      <Image {...args} />
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <span
          style={{
            fontSize: '12px',
            color: '#64748b',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Apr 18, 2026 • Design Systems • 5 min read
        </span>
        <h3 style={{ margin: 0, fontSize: '20px', lineHeight: 1.3, color: '#0f172a' }}>
          How To Keep Blog Post Images Neat Inside Responsive Cards
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            color: '#475569',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          A single-line excerpt showing how the image stays constrained to a max width of 200px.
        </p>
      </div>
    </div>
  ),
  args: {
    image: {
      id: '18b',
      src: 'https://picsum.photos/1600/1190?random=180',
      alt: 'Blog post cover image',
    },
    size: { width: '100%', maxWidth: 200, ratio: ImageRatio.Classic },
  },
};

export const DifferentContainerSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Frame width={180} height={180} label="180x180 square container">
        <Image {...args} size={{ width: '100%', height: '100%' }} />
      </Frame>
      <Frame width={320} height={180} label="320x180 landscape container">
        <Image {...args} size={{ width: '100%', height: '100%' }} />
      </Frame>
      <Frame width={180} height={280} label="180x280 portrait container">
        <Image {...args} size={{ width: '100%', height: '100%' }} />
      </Frame>
    </div>
  ),
  args: {
    image: {
      id: '19',
      src: 'https://picsum.photos/1200/800?random=19',
      alt: 'Landscape image inside different container sizes',
    },
    onClick: undefined,
  },
};

export const DifferentAspectRatios: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {[
        {
          label: 'Landscape image in square container',
          image: { id: '20', src: 'https://picsum.photos/1200/800?random=20', alt: 'Landscape image' },
          size: { width: 220, height: 220 },
        },
        {
          label: 'Portrait image in landscape container',
          image: { id: '21', src: 'https://picsum.photos/800/1200?random=21', alt: 'Portrait image' },
          size: { width: 320, height: 180 },
        },
        {
          label: 'Square image in cinematic container',
          image: { id: '22', src: 'https://picsum.photos/1000/1000?random=22', alt: 'Square image' },
          size: { ratio: ImageRatio.Cinematic, width: 320 },
        },
        {
          label: 'Landscape image in tall container',
          image: { id: '23', src: 'https://picsum.photos/1200/800?random=23', alt: 'Landscape image in tall frame' },
          size: { ratio: ImageRatio.Tall, width: 180 },
        },
      ].map((example) => (
        <div key={example.image.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#666' }}>{example.label}</span>
          <Image
            {...args}
            image={example.image}
            size={example.size}
          />
        </div>
      ))}
    </div>
  ),
  args: {},
};
