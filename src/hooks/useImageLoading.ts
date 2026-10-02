import { useCallback, useEffect, useState } from 'react';
import type { RefObject } from 'react';

type ImageLoading = {
  isLoading: boolean;
  /** Pass to the image's `onLoad` and `onError`. */
  onSettled: () => void;
};

/**
 * Tracks whether the image behind `imageRef` is still loading `sourceKey`.
 *
 * The state stores which source has settled rather than a loading flag, so
 * there is nothing to reset when the source changes. A reset in an effect can
 * run after a cached image has already fired `load`, which leaves the
 * placeholder up forever.
 */
export function useImageLoading(
  sourceKey: string,
  imageRef: RefObject<HTMLImageElement>,
): ImageLoading {
  const [settledKey, setSettledKey] = useState<string | null>(null);

  // `load` can fire before React attaches the handler: a cached image, or one
  // that finished loading from server-rendered markup before hydration.
  useEffect(() => {
    if (imageRef.current?.complete) {
      setSettledKey(sourceKey);
    }
  }, [sourceKey, imageRef]);

  const onSettled = useCallback(() => setSettledKey(sourceKey), [sourceKey]);

  return { isLoading: settledKey !== sourceKey, onSettled };
}
