import { useEffect } from 'react';

type InertElement = Element & { inert?: boolean };

type HiddenSibling = {
  inert: boolean;
  ariaHidden: string | null;
  count: number;
};

const hiddenSiblings = new WeakMap<Element, HiddenSibling>();

function isBackgroundSibling(element: Element, dialog: HTMLElement): boolean {
  return (
    element !== dialog &&
    !element.contains(dialog) &&
    !(element.getAttribute('role') === 'dialog' && element.getAttribute('aria-modal') === 'true')
  );
}

function hideSibling(element: Element): void {
  const existing = hiddenSiblings.get(element);
  if (existing) {
    existing.count += 1;
  } else {
    hiddenSiblings.set(element, {
      inert: element.hasAttribute('inert'),
      ariaHidden: element.getAttribute('aria-hidden'),
      count: 1,
    });
  }

  element.setAttribute('inert', '');
  element.setAttribute('aria-hidden', 'true');
  if ('inert' in element) {
    (element as InertElement).inert = true;
  }
}

function restoreSibling(element: Element): void {
  const hidden = hiddenSiblings.get(element);
  if (!hidden) return;

  hidden.count -= 1;
  if (hidden.count > 0) return;

  if (hidden.inert) {
    element.setAttribute('inert', '');
  } else {
    element.removeAttribute('inert');
  }

  if (hidden.ariaHidden === null) {
    element.removeAttribute('aria-hidden');
  } else {
    element.setAttribute('aria-hidden', hidden.ariaHidden);
  }

  hiddenSiblings.delete(element);
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

    const siblings = new Set<Element>();
    const hideBackgroundSibling = (element: Element) => {
      if (!isBackgroundSibling(element, dialog) || siblings.has(element)) return;
      siblings.add(element);
      hideSibling(element);
    };

    Array.from(document.body.children).forEach(hideBackgroundSibling);

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            hideBackgroundSibling(node as Element);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true });

    return () => {
      observer.disconnect();
      for (const element of siblings) {
        restoreSibling(element);
      }
    };
  }, [dialogRef, enabled]);
}
