export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  'audio[controls]',
  'video[controls]',
  'summary',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',');

/**
 * Focusable descendants of `container`, in document order.
 *
 * Deliberately does not filter on visibility. The usual `offsetParent` /
 * `getClientRects()` checks report every element as hidden under jsdom, which
 * has no layout engine, so adding one would silently empty the focus trap in
 * tests while still working in a browser. Everything inside the viewer is
 * library-controlled, so there is nothing invisible to filter out.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

  return nodes.filter(
    (el) =>
      // Drops `tabindex="-1"`, including the dialog container itself.
      el.tabIndex >= 0 &&
      !el.hasAttribute('disabled') &&
      !el.hasAttribute('hidden') &&
      !el.closest('[aria-hidden="true"]'),
  );
}
