import { useEffect } from 'react';
import type { ZZImage } from '../../types/image.type';

export function useImagePreloader({
  currentImage,
  images,
}: {
  currentImage: ZZImage | null;
  images: ZZImage[];
}): void {
  useEffect(() => {
    if (!currentImage || images.length <= 1) return;
    const index = images.findIndex(img => img.id === currentImage.id);
    if (index < 0) return;

    const adjacentSrcs = [
      images[(index + 1) % images.length].src,
      images[(index - 1 + images.length) % images.length].src,
    ];

    const links = adjacentSrcs.map(src => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = src;
      document.head.appendChild(link);
      return link;
    });

    return () => {
      for (const link of links) link.remove();
    };
  }, [currentImage, images]);
}
