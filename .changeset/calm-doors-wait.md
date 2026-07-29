---
'zimme-zoom': patch
---

Render PhotoViewer through a document-body portal and hide background content while it is open.

The viewer now avoids ancestor stacking contexts, removes background content from the accessibility tree with `inert` and `aria-hidden`, restores focus after the background is re-enabled, and keeps late-mounted body children hidden until the viewer closes.
