import React, { useEffect, useRef } from 'react';
import {
  clamp,
  computeZoomToPoint,
  getContainerCenterOffset,
} from '../../utils/photo-viewer/transformUtils';

type UseWheelZoomInput = {
  enabled: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  imageContainerRef: React.RefObject<HTMLElement | null>;
  zoom: number;
  panX: number;
  panY: number;
  zoomStep: number;
  minZoom: number;
  maxZoom: number;
  onZoomTo: (zoom: number, panX: number, panY: number) => void;
};

export function useWheelZoom({
  enabled,
  containerRef,
  imageContainerRef,
  zoom,
  panX,
  panY,
  zoomStep,
  minZoom,
  maxZoom,
  onZoomTo,
}: UseWheelZoomInput): void {
  const stateRef = useRef({ zoom, panX, panY });
  stateRef.current = { zoom, panX, panY };

  const onZoomToRef = useRef(onZoomTo);
  onZoomToRef.current = onZoomTo;

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const imageContainer = imageContainerRef.current;
      if (!imageContainer) return;

      const { zoom: curZoom, panX: curPanX, panY: curPanY } = stateRef.current;
      const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
      const newZoom = clamp(curZoom + delta, minZoom, maxZoom);

      const rect = imageContainer.getBoundingClientRect();
      const offset = getContainerCenterOffset(rect, e.clientX, e.clientY);
      const newPan = computeZoomToPoint({
        pointX: offset.x,
        pointY: offset.y,
        currentZoom: curZoom,
        newZoom,
        panX: curPanX,
        panY: curPanY,
      });

      onZoomToRef.current(newZoom, newPan.panX, newPan.panY);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [enabled, containerRef, imageContainerRef, zoomStep, minZoom, maxZoom]);
}
