import type { ZZImage } from '../../types/image.type';
import type { MediaGridItem } from './types';

export function mediaGridItemToZZImage(item: MediaGridItem): ZZImage {
  return {
    id: item.id,
    src: item.src,
    alt: item.alt ?? item.name,
    title: item.name,
  };
}

export function mediaGridItemsToZZImages(items: MediaGridItem[]): ZZImage[] {
  return items.map(mediaGridItemToZZImage);
}
