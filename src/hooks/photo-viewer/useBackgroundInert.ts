import { useEffect } from 'react';

type InertElement = HTMLElement & { inert?: boolean };

type HiddenSibling = {
  element: HTMLElement;
  inert: string | null;
  ariaHidden: string | null;
  inertProperty?: boolean;
  count: number;
};

const hiddenSiblings = new Map<HTMLElement, HiddenSibling>();

function getBackgroundSiblings(dialog: HTMLElement): HTMLElement[] {
  return Array.from(document.body.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child !== dialog && !child.contains(dialog),
  );
}

export function useBackgroundInert({
  enabled,
  dialogRef,
}: {
  enabled: boolean;
  dialogRef: React.RefObject<HTMLElement | null>;
}): void {
  useEffect(() => {
    if (!enabled) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const siblings = getBackgroundSiblings(dialog);

    for (const element of siblings) {
      const existing = hiddenSiblings.get(element);
      if (existing) {
        existing.count += 1;
      } else {
        hiddenSiblings.set(element, {
          element,
          inert: element.getAttribute('inert'),
          ariaHidden: element.getAttribute('aria-hidden'),
          inertProperty: 'inert' in element ? Boolean((element as InertElement).inert) : undefined,
          count: 1,
        });
      }

      element.setAttribute('inert', '');
      element.setAttribute('aria-hidden', 'true');
      if ('inert' in element) {
        (element as InertElement).inert = true;
      }
    }

    return () => {
      for (const element of siblings) {
        const hidden = hiddenSiblings.get(element);
        if (!hidden) continue;

        hidden.count -= 1;
        if (hidden.count > 0) continue;

        const { inert, ariaHidden, inertProperty } = hidden;
        if (inert === null) {
          element.removeAttribute('inert');
        } else {
          element.setAttribute('inert', inert);
        }

        if (ariaHidden === null) {
          element.removeAttribute('aria-hidden');
        } else {
          element.setAttribute('aria-hidden', ariaHidden);
        }

        if (inertProperty !== undefined) {
          (element as InertElement).inert = inertProperty;
        }

        hiddenSiblings.delete(element);
      }
    };
  }, [dialogRef, enabled]);
}
