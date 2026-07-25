---
'zimme-zoom': minor
---

Make PhotoViewer usable by keyboard and screen readers.

- Every control is now a real `<button type="button">` with an accessible name, instead of a `<div onClick>` with no role, no tab stop, and no name. The controls were previously unreachable by keyboard and invisible to screen readers.
- Focus moves into the dialog on open, is confined to it while open, and returns to the element that opened the viewer on close.
- Focus recovers when a control removes itself, such as Reset disappearing once the transform is back to its default.
- Page scrolling behind the backdrop is locked while the viewer is open, with the scrollbar width compensated so the page does not shift.
- The overlay toggle exposes its state through `aria-pressed`.
- The control bar now brightens on keyboard focus, not only on hover.

Adds an optional `labels` prop for translating the accessible names, along with an exported `PhotoViewerLabels` type. Unspecified keys keep their English defaults. `PhotoViewerSettings` is now exported too; it was already part of the public props but was not reachable from the package root.

Visual appearance and existing props are unchanged, and there are still no runtime dependencies.
