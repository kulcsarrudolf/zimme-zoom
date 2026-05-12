import React, { useCallback, useRef } from 'react';
import {
  clamp,
  computeZoomToPoint,
  getContainerCenterOffset,
} from '../../utils/photo-viewer/transformUtils';
import {
  detectHorizontalSwipe,
  getTouchCenter,
  getTouchDistance,
} from '../../utils/photo-viewer/gestureUtils';

type UseTouchGesturesInput = {
  allowZoom: boolean;
  zoom: number;
  panX: number;
  panY: number;
  minZoom: number;
  maxZoom: number;
  imagesCount: number;
  imageContainerRef: React.RefObject<HTMLElement | null>;
  onZoomTo: (zoom: number, panX: number, panY: number) => void;
  onPan: (panX: number, panY: number) => void;
  onNext: () => void;
  onPrevious: () => void;
};

export function useTouchGestures({
  allowZoom,
  zoom,
  panX,
  panY,
  minZoom,
  maxZoom,
  imagesCount,
  imageContainerRef,
  onZoomTo,
  onPan,
  onNext,
  onPrevious,
}: UseTouchGesturesInput) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTouchDistanceRef = useRef<number | null>(null);
  const touchPanStartRef = useRef<{ x: number; y: number } | null>(null);
  const isPinchingRef = useRef(false);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!allowZoom && imagesCount === 0) return;
      const touches = e.touches;

      if (touches.length === 1) {
        const t = touches[0];
        touchStartRef.current = { x: t.clientX, y: t.clientY, time: Date.now() };
        if (zoom > 1) {
          touchPanStartRef.current = { x: t.clientX - panX, y: t.clientY - panY };
        }
      } else if (touches.length === 2 && allowZoom) {
        e.preventDefault();
        isPinchingRef.current = true;
        lastTouchDistanceRef.current = getTouchDistance(touches[0], touches[1]);
      }
    },
    [allowZoom, zoom, panX, panY, imagesCount]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touches = e.touches;
      const imageContainer = imageContainerRef.current;
      if (!imageContainer) return;

      if (
        touches.length === 2 &&
        allowZoom &&
        isPinchingRef.current &&
        lastTouchDistanceRef.current !== null
      ) {
        e.preventDefault();
        const distance = getTouchDistance(touches[0], touches[1]);
        const scale = distance / lastTouchDistanceRef.current;
        const newZoom = clamp(zoom * scale, minZoom, maxZoom);

        const center = getTouchCenter(touches[0], touches[1]);
        const rect = imageContainer.getBoundingClientRect();
        const offset = getContainerCenterOffset(rect, center.x, center.y);
        const newPan = computeZoomToPoint({
          pointX: offset.x,
          pointY: offset.y,
          currentZoom: zoom,
          newZoom,
          panX,
          panY,
        });

        onZoomTo(newZoom, newPan.panX, newPan.panY);
        lastTouchDistanceRef.current = distance;
      } else if (touches.length === 1 && zoom > 1 && touchPanStartRef.current) {
        e.preventDefault();
        const t = touches[0];
        onPan(t.clientX - touchPanStartRef.current.x, t.clientY - touchPanStartRef.current.y);
      }
    },
    [allowZoom, zoom, panX, panY, minZoom, maxZoom, imageContainerRef, onZoomTo, onPan]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touches = e.touches;
      if (touches.length > 1) return;

      if (isPinchingRef.current) {
        isPinchingRef.current = false;
        lastTouchDistanceRef.current = null;
        return;
      }

      if (touchStartRef.current && zoom === 1 && imagesCount > 1) {
        const t = e.changedTouches[0];
        const swipe = detectHorizontalSwipe({
          deltaX: t.clientX - touchStartRef.current.x,
          deltaY: t.clientY - touchStartRef.current.y,
          deltaTime: Date.now() - touchStartRef.current.time,
        });
        if (swipe === 'right') onPrevious();
        else if (swipe === 'left') onNext();
      }

      touchStartRef.current = null;
      touchPanStartRef.current = null;
    },
    [zoom, imagesCount, onNext, onPrevious]
  );

  const reset = useCallback(() => {
    touchStartRef.current = null;
    lastTouchDistanceRef.current = null;
    touchPanStartRef.current = null;
    isPinchingRef.current = false;
  }, []);

  return { onTouchStart, onTouchMove, onTouchEnd, reset };
}
