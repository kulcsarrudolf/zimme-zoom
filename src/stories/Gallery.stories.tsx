import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gallery } from '../components/gallery/Gallery';
import { ZZImage } from '../types/image.type';

const meta: Meta<typeof Gallery> = {
  title: 'Gallery',
  component: Gallery,
  parameters: {
    layout: 'padded',
    order: 2,
  },
  argTypes: {
    images: {
      control: 'object',
      description: 'Array of images to display in the gallery',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Gallery>;

// Sample images for the gallery
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
  },
  {
    id: '5',
    src: 'https://picsum.photos/600/600?random=5',
    alt: 'Square photo 2',
    title: 'Nature scene',
  },
  {
    id: '6',
    src: 'https://picsum.photos/800/1000?random=6',
    alt: 'Portrait photo 2',
    title: 'Portrait photography',
  },
  {
    id: '7',
    src: 'https://picsum.photos/1000/600?random=7',
    alt: 'Wide photo',
    title: 'Urban landscape',
  },
  {
    id: '8',
    src: 'https://picsum.photos/700/700?random=8',
    alt: 'Square photo 3',
    title: 'Abstract patterns',
  },
];

export const WithFewImages: Story = {
  args: {
    images: sampleImages.slice(0, 3),
  },
};

export const WithManyImages: Story = {
  args: {
    images: [
      ...sampleImages,
      {
        id: '9',
        src: 'https://picsum.photos/800/600?random=9',
        alt: 'Photo 9',
        title: 'Gallery Image 9',
      },
      {
        id: '10',
        src: 'https://picsum.photos/600/800?random=10',
        alt: 'Photo 10',
        title: 'Gallery Image 10',
      },
      {
        id: '11',
        src: 'https://picsum.photos/1200/800?random=11',
        alt: 'Photo 11',
        title: 'Gallery Image 11',
      },
      {
        id: '12',
        src: 'https://picsum.photos/800/800?random=12',
        alt: 'Photo 12',
        title: 'Gallery Image 12',
      },
    ],
  },
};
