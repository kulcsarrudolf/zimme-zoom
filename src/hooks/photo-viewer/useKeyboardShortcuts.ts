import { useEffect, useRef } from 'react';

export type KeyboardShortcutHandlers = {
  onClose?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRotate?: () => void;
  onReset?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
};

export function useKeyboardShortcuts({
  enabled,
  handlers,
}: {
  enabled: boolean;
  handlers: KeyboardShortcutHandlers;
}): void {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const h = handlersRef.current;
      switch (e.key) {
        case 'Escape':
          h.onClose?.();
          break;
        case '+':
        case '=':
          h.onZoomIn?.();
          break;
        case '-':
          h.onZoomOut?.();
          break;
        case 'r':
          h.onRotate?.();
          break;
        case '0':
          h.onReset?.();
          break;
        case 'ArrowRight':
          h.onNext?.();
          break;
        case 'ArrowLeft':
          h.onPrevious?.();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}
