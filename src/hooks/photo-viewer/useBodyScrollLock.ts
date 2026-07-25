import { useEffect } from 'react';

/**
 * Module-level so that nested or sibling viewers cannot unlock each other.
 *
 * Saving only on the 0 -> 1 transition avoids a second viewer recording the
 * first one's `hidden` as the value to restore, which would leave the page
 * unscrollable for good. Restoring only on the return to 0 keeps the lock in
 * place while any viewer is still open.
 */
let lockCount = 0;
let savedOverflow: string | null = null;
let savedPaddingRight: string | null = null;

export function useBodyScrollLock({ enabled }: { enabled: boolean }): void {
  useEffect(() => {
    if (!enabled) return;
    const body = document.body;

    if (lockCount === 0) {
      savedOverflow = body.style.overflow;
      savedPaddingRight = body.style.paddingRight;

      // Replace the width the scrollbar was occupying, so the page behind the
      // backdrop does not jump sideways when it disappears.
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        const current = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
        body.style.paddingRight = `${current + scrollbarWidth}px`;
      }

      body.style.overflow = 'hidden';
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount > 0) return;

      body.style.overflow = savedOverflow ?? '';
      body.style.paddingRight = savedPaddingRight ?? '';
      savedOverflow = null;
      savedPaddingRight = null;
    };
  }, [enabled]);
}
