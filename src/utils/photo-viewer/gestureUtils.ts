import { SWIPE_MAX_TIME_MS, SWIPE_MIN_DISTANCE } from './constants';

type Point = { clientX: number; clientY: number };

export function getTouchDistance(t1: Point, t2: Point): number {
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

export function getTouchCenter(t1: Point, t2: Point): { x: number; y: number } {
  return {
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2,
  };
}

export type HorizontalSwipe = 'left' | 'right' | null;

type DetectSwipeInput = {
  deltaX: number;
  deltaY: number;
  deltaTime: number;
  minDistance?: number;
  maxTime?: number;
};

export function detectHorizontalSwipe({
  deltaX,
  deltaY,
  deltaTime,
  minDistance = SWIPE_MIN_DISTANCE,
  maxTime = SWIPE_MAX_TIME_MS,
}: DetectSwipeInput): HorizontalSwipe {
  if (deltaTime >= maxTime) return null;
  if (Math.abs(deltaX) <= minDistance) return null;
  if (Math.abs(deltaX) <= Math.abs(deltaY)) return null;
  return deltaX > 0 ? 'right' : 'left';
}
