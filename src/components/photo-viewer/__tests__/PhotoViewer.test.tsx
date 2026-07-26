import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhotoViewer } from '../PhotoViewer';
import type { ZZImage } from '../../../types/image.type';
import { downloadImage } from '../../../utils/downloadImage';
import type { DownloadImageResult } from '../../../utils/downloadImage';

jest.mock('../../../utils/downloadImage', () => ({
  downloadImage: jest.fn(),
}));

const mockedDownloadImage = downloadImage as jest.MockedFunction<typeof downloadImage>;

const images: ZZImage[] = [
  { id: '1', src: 'https://example.com/1.jpg', alt: 'First image' },
  { id: '2', src: 'https://example.com/2.jpg', alt: 'Second image' },
  { id: '3', src: 'https://example.com/3.jpg', alt: 'Third image' },
];

function expectTransform(
  alt: string,
  { scale = 1, rotation = 0 }: { scale?: number; rotation?: number } = {},
): void {
  const imageWrapper = screen.getByAltText(alt).parentElement as HTMLElement;
  expect(imageWrapper).toHaveStyle({
    transform: `translate(0px, 0px) rotateZ(${rotation}deg) scale(${scale})`,
  });
}

describe('PhotoViewer', () => {
  beforeEach(() => {
    mockedDownloadImage.mockResolvedValue({ method: 'canvas', errors: [] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it('calls onClose when the Escape key is pressed', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<PhotoViewer selectedImage={images[0]} images={images} onClose={onClose} />);

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onDownloadFallback when downloadImage reports a fallback', async () => {
    const user = userEvent.setup();
    const onDownloadFallback = jest.fn();
    const result: DownloadImageResult = {
      method: 'fetch',
      errors: [
        {
          method: 'canvas',
          fallbackMethod: 'fetch',
          error: new Error('Canvas conversion failed'),
        },
      ],
    };
    mockedDownloadImage.mockResolvedValue(result);

    render(
      <PhotoViewer
        selectedImage={images[0]}
        images={images}
        onClose={jest.fn()}
        onDownloadFallback={onDownloadFallback}
        settings={{ allowDownload: true }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Download image' }));

    await waitFor(() => expect(onDownloadFallback).toHaveBeenCalledWith(result));
  });

  it('does not call onDownloadFallback when the download succeeds without fallback', async () => {
    const user = userEvent.setup();
    const onDownloadFallback = jest.fn();

    render(
      <PhotoViewer
        selectedImage={images[0]}
        images={images}
        onClose={jest.fn()}
        onDownloadFallback={onDownloadFallback}
        settings={{ allowDownload: true }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Download image' }));

    await waitFor(() => expect(mockedDownloadImage).toHaveBeenCalledTimes(1));
    expect(onDownloadFallback).not.toHaveBeenCalled();
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
    expect(onImageChange).toHaveBeenCalledTimes(1);
    expect(onImageChange).toHaveBeenLastCalledWith(images[2]);

    await user.click(screen.getByRole('button', { name: 'Next image' }));
    expect(screen.getByAltText('First image')).toBeInTheDocument();
    expect(onImageChange).toHaveBeenCalledTimes(2);
    expect(onImageChange).toHaveBeenLastCalledWith(images[0]);

    await user.click(screen.getByRole('button', { name: 'Next image' }));
    expect(screen.getByAltText('Second image')).toBeInTheDocument();
    expect(onImageChange).toHaveBeenCalledTimes(3);
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
    expect(onImageChange).toHaveBeenCalledTimes(1);
    expect(onImageChange).toHaveBeenLastCalledWith(images[2]);

    await user.keyboard('{ArrowRight}');
    expect(screen.getByAltText('First image')).toBeInTheDocument();
    expect(onImageChange).toHaveBeenCalledTimes(2);
    expect(onImageChange).toHaveBeenLastCalledWith(images[0]);
  });

  it('handles zoom, rotate, and reset keyboard shortcuts', async () => {
    const user = userEvent.setup();
    render(<PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />);

    expectTransform('First image');

    await user.keyboard('+');
    expectTransform('First image', { scale: 1.3 });

    await user.keyboard('-');
    expectTransform('First image');

    await user.keyboard('=');
    expectTransform('First image', { scale: 1.3 });

    await user.keyboard('0');
    expectTransform('First image');

    await user.keyboard('r');
    expectTransform('First image', { rotation: 90 });

    await user.keyboard('0');
    expectTransform('First image');
  });

  it('resets zoom and rotation through the reset control', async () => {
    const user = userEvent.setup();
    render(<PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Zoom in' }));
    await user.click(screen.getByRole('button', { name: 'Rotate right' }));

    expectTransform('First image', { scale: 1.3, rotation: 90 });

    await user.click(screen.getByRole('button', { name: 'Reset zoom and rotation' }));

    expectTransform('First image');
  });

  it('hides navigation controls and skips adjacent prefetch for a single image', () => {
    render(<PhotoViewer selectedImage={images[0]} images={[images[0]]} onClose={jest.fn()} />);

    expect(screen.queryByRole('button', { name: 'Previous image' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next image' })).not.toBeInTheDocument();

    expect(document.head.querySelector('link[rel="prefetch"]')).toBeNull();
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
