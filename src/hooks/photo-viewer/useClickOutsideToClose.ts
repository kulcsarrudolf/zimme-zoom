import { useEffect, useRef } from 'react';

const IGNORE_SELECTORS = ['.photo-viewer img', '.photo-viewer-navigation', '.nav-action-button'];

export function useClickOutsideToClose({
  enabled,
  onClose,
}: {
  enabled: boolean;
  onClose: () => void;
}): void {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      for (const selector of IGNORE_SELECTORS) {
        if (target.closest(selector)) return;
      }
      onCloseRef.current();
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [enabled]);
}
