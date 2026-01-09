import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageCarousel } from '../components/image-carousel/ImageCarousel';
import { ZZImage } from '../types/image.type';

const meta: Meta<typeof ImageCarousel> = {
  title: 'ImageCarousel',
  component: ImageCarousel,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    images: {
      control: 'object',
      description: 'Array of images to display in the carousel',
    },
    initialIndex: {
      control: 'number',
      description: 'Initial image index to display',
    },
    height: {
      control: 'text',
      description: 'Height of the carousel (number for pixels or string for CSS value)',
    },
    showIndicators: {
      control: 'boolean',
      description: 'Show dot indicators at the bottom',
    },
    showArrows: {
      control: 'boolean',
      description: 'Show navigation arrows',
    },
    preloadCount: {
      control: 'number',
      description: 'Number of adjacent images to preload',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageCarousel>;

const sampleImages: ZZImage[] = [
  {
    id: '1',
    src: 'https://picsum.photos/800/600?random=1',
    alt: 'Landscape photo 1',
    title: 'Mountain Vista',
  },
  {
    id: '2',
    src: 'https://picsum.photos/800/600?random=2',
    alt: 'Landscape photo 2',
    title: 'Ocean Sunset',
  },
  {
    id: '3',
    src: 'https://picsum.photos/800/600?random=3',
    alt: 'Landscape photo 3',
    title: 'Forest Path',
  },
  {
    id: '4',
    src: 'https://picsum.photos/800/600?random=4',
    alt: 'Landscape photo 4',
    title: 'City Skyline',
  },
  {
    id: '5',
    src: 'https://picsum.photos/800/600?random=5',
    alt: 'Landscape photo 5',
    title: 'Desert Dunes',
  },
];

export const Default: Story = {
  args: {
    images: sampleImages,
    height: 400,
    showIndicators: true,
    showArrows: true,
  },
};

export const SingleImage: Story = {
  args: {
    images: [sampleImages[0]],
    height: 400,
  },
};

export const TwoImages: Story = {
  args: {
    images: sampleImages.slice(0, 2),
    height: 400,
    showIndicators: true,
    showArrows: true,
  },
};

export const ManyImages: Story = {
  args: {
    images: [
      ...sampleImages,
      {
        id: '6',
        src: 'https://picsum.photos/800/600?random=6',
        alt: 'Landscape photo 6',
        title: 'Snowy Peaks',
      },
      {
        id: '7',
        src: 'https://picsum.photos/800/600?random=7',
        alt: 'Landscape photo 7',
        title: 'Tropical Beach',
      },
      {
        id: '8',
        src: 'https://picsum.photos/800/600?random=8',
        alt: 'Landscape photo 8',
        title: 'Autumn Leaves',
      },
      {
        id: '9',
        src: 'https://picsum.photos/800/600?random=9',
        alt: 'Landscape photo 9',
        title: 'Night Sky',
      },
      {
        id: '10',
        src: 'https://picsum.photos/800/600?random=10',
        alt: 'Landscape photo 10',
        title: 'Waterfall',
      },
    ],
    height: 400,
    showIndicators: true,
    showArrows: true,
  },
};

export const StartAtMiddle: Story = {
  args: {
    images: sampleImages,
    initialIndex: 2,
    height: 400,
    showIndicators: true,
    showArrows: true,
  },
};

export const NoIndicators: Story = {
  args: {
    images: sampleImages,
    height: 400,
    showIndicators: false,
    showArrows: true,
  },
};

export const NoArrows: Story = {
  args: {
    images: sampleImages,
    height: 400,
    showIndicators: true,
    showArrows: false,
  },
};

export const SwipeOnly: Story = {
  args: {
    images: sampleImages,
    height: 400,
    showIndicators: false,
    showArrows: false,
  },
};

export const CustomHeight: Story = {
  args: {
    images: sampleImages,
    height: '50vh',
    showIndicators: true,
    showArrows: true,
  },
};

export const WithClickHandler: Story = {
  args: {
    images: sampleImages,
    height: 400,
    showIndicators: true,
    showArrows: true,
    onImageClick: (image, index) => {
      alert(`Clicked on image ${index + 1}: ${image.title}`);
    },
  },
};

export const HighPreloadCount: Story = {
  args: {
    images: sampleImages,
    height: 400,
    showIndicators: true,
    showArrows: true,
    preloadCount: 3,
  },
};
