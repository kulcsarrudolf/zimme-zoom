import { useCallback, useEffect, useState } from 'react';
import type { ZZImage } from '../../types/image.type';

type UseImageNavigationInput = {
  initialImage: ZZImage | null;
  images: ZZImage[];
  onImageChange?: (image: ZZImage) => void;
};

type UseImageNavigationResult = {
  currentImage: ZZImage | null;
  next: () => void;
  previous: () => void;
};

export function useImageNavigation({
  initialImage,
  images,
  onImageChange,
}: UseImageNavigationInput): UseImageNavigationResult {
  const [currentImage, setCurrentImage] = useState<ZZImage | null>(initialImage);

  useEffect(() => {
    setCurrentImage(initialImage);
  }, [initialImage]);

  const step = useCallback(
    (direction: 1 | -1) => {
      if (images.length === 0) return;
      const index = images.findIndex(img => img.id === currentImage?.id);
      const nextIndex = (index + direction + images.length) % images.length;
      const nextImage = images[nextIndex];
      setCurrentImage(nextImage);
      onImageChange?.(nextImage);
    },
    [images, currentImage, onImageChange]
  );

  const next = useCallback(() => step(1), [step]);
  const previous = useCallback(() => step(-1), [step]);

  return { currentImage, next, previous };
}
