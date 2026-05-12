import { clamp, computeZoomToPoint, getContainerCenterOffset } from '../transformUtils';

describe('clamp', () => {
  it('returns value when within bounds', () => {
    expect(clamp(0.5, 0.1, 1)).toBe(0.5);
  });

  it('clamps to min', () => {
    expect(clamp(-1, 0, 5)).toBe(0);
  });

  it('clamps to max', () => {
    expect(clamp(10, 0, 5)).toBe(5);
  });

  it('handles equal min and max', () => {
    expect(clamp(7, 3, 3)).toBe(3);
  });
});

describe('computeZoomToPoint', () => {
  it('keeps the point under the cursor invariant when zooming from 1', () => {
    const result = computeZoomToPoint({
      pointX: 100,
      pointY: 50,
      currentZoom: 1,
      newZoom: 2,
      panX: 0,
      panY: 0,
    });
    // Image point under cursor before zoom: (100, 50).
    // After zoom, new pan must place 2 * imagePoint at cursor: pan = cursor - 2 * imagePoint.
    expect(result).toEqual({ panX: -100, panY: -50 });
  });

  it('returns (0,0) when zooming around origin from 1 to 1', () => {
    const result = computeZoomToPoint({
      pointX: 0,
      pointY: 0,
      currentZoom: 1,
      newZoom: 1,
      panX: 0,
      panY: 0,
    });
    expect(result).toEqual({ panX: 0, panY: 0 });
  });

  it('preserves the image point under the cursor when already panned and zoomed', () => {
    const result = computeZoomToPoint({
      pointX: 20,
      pointY: 30,
      currentZoom: 2,
      newZoom: 4,
      panX: 10,
      panY: 10,
    });
    // imageX = (20 - 10) / 2 = 5, imageY = (30 - 10) / 2 = 10
    // panX = 20 - 5 * 4 = 0, panY = 30 - 10 * 4 = -10
    expect(result).toEqual({ panX: 0, panY: -10 });
  });
});

describe('getContainerCenterOffset', () => {
  it('returns offset of client point from container center', () => {
    const rect = { left: 100, top: 50, width: 200, height: 100 };
    expect(getContainerCenterOffset(rect, 200, 100)).toEqual({ x: 0, y: 0 });
  });

  it('handles points to the right/below center', () => {
    const rect = { left: 0, top: 0, width: 100, height: 100 };
    expect(getContainerCenterOffset(rect, 80, 70)).toEqual({ x: 30, y: 20 });
  });
});
