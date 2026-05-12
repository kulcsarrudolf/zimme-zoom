export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

type ZoomToPointInput = {
  pointX: number;
  pointY: number;
  currentZoom: number;
  newZoom: number;
  panX: number;
  panY: number;
};

export function computeZoomToPoint({
  pointX,
  pointY,
  currentZoom,
  newZoom,
  panX,
  panY,
}: ZoomToPointInput): { panX: number; panY: number } {
  const imageX = (pointX - panX) / currentZoom;
  const imageY = (pointY - panY) / currentZoom;
  return {
    panX: pointX - imageX * newZoom,
    panY: pointY - imageY * newZoom,
  };
}

export function getContainerCenterOffset(
  rect: { left: number; top: number; width: number; height: number },
  clientX: number,
  clientY: number
): { x: number; y: number } {
  return {
    x: clientX - (rect.left + rect.width / 2),
    y: clientY - (rect.top + rect.height / 2),
  };
}
