import React, { useCallback, useEffect, useRef, useState } from 'react';

type UseMouseDragInput = {
  enabled: boolean;
  panX: number;
  panY: number;
  onPan: (panX: number, panY: number) => void;
};

export function useMouseDrag({ enabled, panX, panY, onPan }: UseMouseDragInput) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const onPanRef = useRef(onPan);
  onPanRef.current = onPan;

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || e.button !== 0) return;
      e.preventDefault();
      dragStartRef.current = { x: e.clientX - panX, y: e.clientY - panY };
      setIsDragging(true);
    },
    [enabled, panX, panY]
  );

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      e.preventDefault();
      onPanRef.current(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y);
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging]);

  return { isDragging, onMouseDown };
}
