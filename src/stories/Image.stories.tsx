import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from '../components/image/Image';
import { ImageRatio } from '../types/image.type';
import React from 'react';

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

export const Default: Story = {
  args: {
    image: {
      id: '1',
      src: 'https://picsum.photos/400/400?random=1',
      alt: 'A sample image',
    },
  },
};

export const WithTitle: Story = {
  args: {
    image: {
      id: '2',
      src: 'https://picsum.photos/400/400?random=2',
      alt: 'Mountain landscape',
      title: 'Beautiful mountain landscape',
    },
  },
};

export const WithClickHandler: Story = {
  args: {
    image: {
      id: '3',
      src: 'https://picsum.photos/400/400?random=3',
      alt: 'Clickable image',
      title: 'Click me',
    },
  },
};

export const LoadingState: Story = {
  args: {
    image: {
      id: '4',
      src: 'https://picsum.photos/400/400?random=99&delay=5000',
      alt: 'Slow loading image',
    },
  },
};

export const WithoutAlt: Story = {
  args: {
    image: {
      id: '5',
      src: 'https://picsum.photos/400/400?random=5',
    },
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
            src: `https://picsum.photos/200/200?random=${i + 10}`,
            alt: `Sample image ${i}`,
          }}
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
    image: { id: '10', src: 'https://picsum.photos/400/400?random=10', alt: 'Square' },
    size: { ratio: ImageRatio.Square },
  },
};

export const PortraitRatio: Story = {
  args: {
    image: { id: '11', src: 'https://picsum.photos/400/500?random=11', alt: 'Portrait' },
    size: { ratio: ImageRatio.Portrait },
  },
};

export const TallRatio: Story = {
  args: {
    image: { id: '12', src: 'https://picsum.photos/360/640?random=12', alt: 'Tall' },
    size: { ratio: ImageRatio.Tall },
  },
};

export const LandscapeRatio: Story = {
  args: {
    image: { id: '13', src: 'https://picsum.photos/800/450?random=13', alt: 'Landscape' },
    size: { ratio: ImageRatio.Landscape },
  },
};

export const ClassicRatio: Story = {
  args: {
    image: { id: '14', src: 'https://picsum.photos/400/300?random=14', alt: 'Classic' },
    size: { ratio: ImageRatio.Classic },
  },
};

export const CinematicRatio: Story = {
  args: {
    image: { id: '15', src: 'https://picsum.photos/840/360?random=15', alt: 'Cinematic' },
    size: { ratio: ImageRatio.Cinematic },
  },
};

export const GoldenRatio: Story = {
  args: {
    image: { id: '16', src: 'https://picsum.photos/500/309?random=16', alt: 'Golden ratio' },
    size: { ratio: ImageRatio.Golden },
  },
};

export const CustomSize: Story = {
  args: {
    image: { id: '17', src: 'https://picsum.photos/400/300?random=17', alt: 'Custom size' },
    size: { width: 320, height: 180 },
  },
};

export const FullWidth: Story = {
  render: (args) => (
    <div style={{ width: '600px' }}>
      <Image {...args} />
    </div>
  ),
  args: {
    image: { id: '18', src: 'https://picsum.photos/800/450?random=18', alt: 'Full width' },
    size: { ratio: ImageRatio.Landscape, width: '100%' },
  },
};

export const AllRatios: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {Object.entries(ImageRatio).map(([name, ratio]) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '120px' }}>
            <Image
              image={{
                id: name,
                src: `https://picsum.photos/400/400?random=${name}`,
                alt: name,
              }}
              size={{ ratio, width: '100%' }}
              onClick={args.onClick}
            />
          </div>
          <span style={{ fontSize: '12px', color: '#666' }}>{name}</span>
          <span style={{ fontSize: '10px', color: '#aaa' }}>{ratio}</span>
        </div>
      ))}
    </div>
  ),
  args: {},
};
