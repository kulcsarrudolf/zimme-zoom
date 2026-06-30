import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhotoViewer } from '../PhotoViewer';
import type { ZZImage } from '../../../types/image.type';

const images: ZZImage[] = [
  { id: '1', src: 'https://example.com/1.jpg', alt: 'First image' },
  { id: '2', src: 'https://example.com/2.jpg', alt: 'Second image' },
];

describe('PhotoViewer', () => {
  it('renders nothing when no image is selected', () => {
    const { container } = render(
      <PhotoViewer selectedImage={null} images={images} onClose={jest.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the selected image with its alt text and source', () => {
    render(<PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />);

    const img = screen.getByAltText('First image') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('https://example.com/1.jpg');
  });

  it('calls onClose when the Escape key is pressed', () => {
    const onClose = jest.fn();
    render(<PhotoViewer selectedImage={images[0]} images={images} onClose={onClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
