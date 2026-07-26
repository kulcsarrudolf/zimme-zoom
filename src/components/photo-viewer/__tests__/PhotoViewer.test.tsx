import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhotoViewer } from '../PhotoViewer';
import type { ZZImage } from '../../../types/image.type';

const images: ZZImage[] = [
  { id: '1', src: 'https://example.com/1.jpg', alt: 'First image' },
  { id: '2', src: 'https://example.com/2.jpg', alt: 'Second image' },
  { id: '3', src: 'https://example.com/3.jpg', alt: 'Third image' },
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

  it('calls onClose when the close control is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<PhotoViewer selectedImage={images[0]} images={images} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('navigates with next and previous controls, including wrap-around', async () => {
    const user = userEvent.setup();
    const onImageChange = jest.fn();
    render(
      <PhotoViewer
        selectedImage={images[0]}
        images={images}
        onClose={jest.fn()}
        onImageChange={onImageChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Previous image' }));
    expect(screen.getByAltText('Third image')).toBeInTheDocument();
    expect(onImageChange).toHaveBeenLastCalledWith(images[2]);

    await user.click(screen.getByRole('button', { name: 'Next image' }));
    expect(screen.getByAltText('First image')).toBeInTheDocument();
    expect(onImageChange).toHaveBeenLastCalledWith(images[0]);

    await user.click(screen.getByRole('button', { name: 'Next image' }));
    expect(screen.getByAltText('Second image')).toBeInTheDocument();
    expect(onImageChange).toHaveBeenLastCalledWith(images[1]);
  });

  it('handles arrow-key navigation shortcuts', async () => {
    const user = userEvent.setup();
    const onImageChange = jest.fn();
    render(
      <PhotoViewer
        selectedImage={images[0]}
        images={images}
        onClose={jest.fn()}
        onImageChange={onImageChange}
      />,
    );

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByAltText('Third image')).toBeInTheDocument();
    expect(onImageChange).toHaveBeenLastCalledWith(images[2]);

    await user.keyboard('{ArrowRight}');
    expect(screen.getByAltText('First image')).toBeInTheDocument();
    expect(onImageChange).toHaveBeenLastCalledWith(images[0]);
  });

  it('handles zoom, rotate, and reset keyboard shortcuts', async () => {
    const user = userEvent.setup();
    render(<PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />);

    const imageWrapper = screen.getByAltText('First image').parentElement;
    expect(imageWrapper).toHaveStyle({
      transform: 'translate(0px, 0px) rotateZ(0deg) scale(1)',
    });

    await user.keyboard('+');
    expect(imageWrapper).toHaveStyle({
      transform: 'translate(0px, 0px) rotateZ(0deg) scale(1.3)',
    });

    await user.keyboard('-');
    expect(imageWrapper).toHaveStyle({
      transform: 'translate(0px, 0px) rotateZ(0deg) scale(1)',
    });

    await user.keyboard('=');
    expect(imageWrapper).toHaveStyle({
      transform: 'translate(0px, 0px) rotateZ(0deg) scale(1.3)',
    });

    await user.keyboard('0');
    expect(imageWrapper).toHaveStyle({
      transform: 'translate(0px, 0px) rotateZ(0deg) scale(1)',
    });

    await user.keyboard('r');
    expect(imageWrapper).toHaveStyle({
      transform: 'translate(0px, 0px) rotateZ(90deg) scale(1)',
    });

    await user.keyboard('0');
    expect(imageWrapper).toHaveStyle({
      transform: 'translate(0px, 0px) rotateZ(0deg) scale(1)',
    });
  });

  it('resets zoom and rotation through the reset control', async () => {
    const user = userEvent.setup();
    render(<PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Zoom in' }));
    await user.click(screen.getByRole('button', { name: 'Rotate right' }));

    const imageWrapper = screen.getByAltText('First image').parentElement;
    expect(imageWrapper).toHaveStyle({
      transform: 'translate(0px, 0px) rotateZ(90deg) scale(1.3)',
    });

    await user.click(screen.getByRole('button', { name: 'Reset zoom and rotation' }));

    expect(imageWrapper).toHaveStyle({
      transform: 'translate(0px, 0px) rotateZ(0deg) scale(1)',
    });
  });

  it('prefetches adjacent images while open and removes them on unmount', () => {
    const { unmount } = render(
      <PhotoViewer selectedImage={images[1]} images={images} onClose={jest.fn()} />,
    );

    const prefetches = [...document.head.querySelectorAll<HTMLLinkElement>('link[rel="prefetch"]')];
    expect(prefetches.map((link) => link.href).sort()).toEqual([
      'https://example.com/1.jpg',
      'https://example.com/3.jpg',
    ]);

    unmount();

    expect(document.head.querySelector('link[rel="prefetch"]')).toBeNull();
  });
});
