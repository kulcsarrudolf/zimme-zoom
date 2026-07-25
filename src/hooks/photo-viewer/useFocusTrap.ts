import { useEffect, useRef } from 'react';
import { getFocusableElements } from '../../utils/photo-viewer/focusable';

/**
 * Only the most recently mounted trap acts. Without this, two open viewers
 * would each pull focus back into their own container inside a single
 * synchronous `focusin` dispatch and overflow the stack.
 */
const trapStack: symbol[] = [];

/**
 * Confines Tab focus to `containerRef` while `enabled`, and restores focus to
 * whatever was focused beforehand on cleanup.
 *
 * The container is expected to carry `tabIndex={-1}` so it can receive focus
 * itself; `getFocusableElements` filters it back out of the Tab cycle.
 */
export function useFocusTrap({
  enabled,
  containerRef,
}: {
  enabled: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
}): void {
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;

    const id = Symbol('zz-focus-trap');
    trapStack.push(id);
    const isTopMost = () => trapStack[trapStack.length - 1] === id;

    const active = document.activeElement as HTMLElement | null;
    // Skip when the container already holds focus, so StrictMode's second
    // effect pass does not record the dialog as its own restore target.
    if (active && active !== document.body && !container.contains(active)) {
      previousFocusRef.current = active;
    }

    container.focus({ preventScroll: true });

    const focusFirstOrLast = (backwards: boolean) => {
      const items = getFocusableElements(container);
      if (items.length === 0) {
        container.focus({ preventScroll: true });
        return;
      }
      (backwards ? items[items.length - 1] : items[0]).focus({ preventScroll: true });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!enabledRef.current || !isTopMost() || e.key !== 'Tab') return;
      if (!container.isConnected) return;

      const items = getFocusableElements(container);
      if (items.length === 0) {
        e.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }

      const current = document.activeElement as HTMLElement | null;
      const index = current ? items.indexOf(current) : -1;

      // Focus sits on the container, on `<body>`, or outside the dialog.
      if (index === -1) {
        e.preventDefault();
        focusFirstOrLast(e.shiftKey);
        return;
      }

      const atStart = e.shiftKey && index === 0;
      const atEnd = !e.shiftKey && index === items.length - 1;
      if (atStart || atEnd) {
        e.preventDefault();
        focusFirstOrLast(e.shiftKey);
      }
      // Interior tabs are left to the browser.
    };

    const onFocusIn = (e: FocusEvent) => {
      if (!enabledRef.current || !isTopMost() || !container.isConnected) return;
      const target = e.target as Node | null;
      // Cannot loop: refocusing the container re-fires `focusin` with the
      // container as target, which this check short-circuits.
      if (target && container.contains(target)) return;
      container.focus({ preventScroll: true });
    };

    /** Pull focus back to the container if it has ended up nowhere useful. */
    const recoverStrayFocus = () => {
      if (!enabledRef.current || !isTopMost() || !container.isConnected) return;
      const current = document.activeElement;
      if (current && current !== document.body && container.contains(current)) return;
      container.focus({ preventScroll: true });
    };

    const onFocusOut = (e: FocusEvent) => {
      if (!enabledRef.current || !isTopMost()) return;
      // Focus moved somewhere real; `focusin` is the authority.
      if (e.relatedTarget) return;
      // Defer so React's commit lands before we look at `activeElement`.
      queueMicrotask(recoverStrayFocus);
    };

    /**
     * Removing the focused element fires no focus event at all. Neither
     * browsers nor jsdom emit `focusout` or `focusin`; `activeElement` just
     * becomes `<body>`. This is reachable in a few keystrokes, since Reset
     * unmounts itself once the transform returns to its default, so watching
     * the DOM is the only way to catch it.
     */
    const observer = new MutationObserver(() => {
      if (!enabledRef.current || !isTopMost()) return;
      const current = document.activeElement;
      if (current && current !== document.body && container.contains(current)) return;
      queueMicrotask(recoverStrayFocus);
    });
    observer.observe(container, { childList: true, subtree: true });

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('focusin', onFocusIn);
    container.addEventListener('focusout', onFocusOut);

    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusin', onFocusIn);
      container.removeEventListener('focusout', onFocusOut);

      const index = trapStack.indexOf(id);
      if (index !== -1) trapStack.splice(index, 1);

      const previous = previousFocusRef.current;
      if (!previous || !previous.isConnected) {
        previousFocusRef.current = null;
        return;
      }

      // Something else legitimately holds focus, so leave it alone. This also
      // covers StrictMode's mount cleanup, where the dialog is still mounted
      // and focused: clearing the target here would discard the opener before
      // the second mount pass (which no longer re-records it, seeing the dialog
      // already focused), so the real close later restores nothing. Keep the
      // target and only clear it once we actually restore.
      const current = document.activeElement;
      if (current && current !== document.body && document.contains(current)) return;

      previousFocusRef.current = null;
      previous.focus({ preventScroll: true });
    };
  }, [enabled, containerRef]);
}
