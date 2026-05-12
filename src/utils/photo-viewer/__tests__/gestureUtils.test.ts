import { detectHorizontalSwipe, getTouchCenter, getTouchDistance } from '../gestureUtils';

describe('getTouchDistance', () => {
  it('computes euclidean distance', () => {
    expect(getTouchDistance({ clientX: 0, clientY: 0 }, { clientX: 3, clientY: 4 })).toBe(5);
  });

  it('returns 0 for identical points', () => {
    expect(getTouchDistance({ clientX: 5, clientY: 5 }, { clientX: 5, clientY: 5 })).toBe(0);
  });
});

describe('getTouchCenter', () => {
  it('returns midpoint of two touches', () => {
    expect(getTouchCenter({ clientX: 0, clientY: 0 }, { clientX: 10, clientY: 20 })).toEqual({
      x: 5,
      y: 10,
    });
  });
});

describe('detectHorizontalSwipe', () => {
  it('detects rightward swipe', () => {
    expect(
      detectHorizontalSwipe({ deltaX: 80, deltaY: 5, deltaTime: 100 })
    ).toBe('right');
  });

  it('detects leftward swipe', () => {
    expect(
      detectHorizontalSwipe({ deltaX: -80, deltaY: 5, deltaTime: 100 })
    ).toBe('left');
  });

  it('returns null when time exceeds threshold', () => {
    expect(
      detectHorizontalSwipe({ deltaX: 80, deltaY: 5, deltaTime: 400 })
    ).toBeNull();
  });

  it('returns null when horizontal distance below threshold', () => {
    expect(
      detectHorizontalSwipe({ deltaX: 30, deltaY: 5, deltaTime: 100 })
    ).toBeNull();
  });

  it('returns null when vertical distance dominates', () => {
    expect(
      detectHorizontalSwipe({ deltaX: 60, deltaY: 80, deltaTime: 100 })
    ).toBeNull();
  });

  it('respects custom thresholds', () => {
    expect(
      detectHorizontalSwipe({ deltaX: 20, deltaY: 0, deltaTime: 50, minDistance: 10, maxTime: 100 })
    ).toBe('right');
  });
});
