---
'zimme-zoom': minor
---

Expose download fallback results from PhotoViewer.

Adds an optional `onDownloadFallback` prop that receives the final download
result when canvas or fetch download attempts fail and the viewer falls back to
another method. `downloadImage` now returns the method used plus the failed
fallback attempts, while preserving the existing default fallback behavior.

Canvas conversion returning `null` is now recorded as a canvas fallback failure
instead of silently continuing to the next method.
