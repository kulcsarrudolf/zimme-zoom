---
'zimme-zoom': patch
---

Fix the loading placeholder staying up forever over an image that had already loaded.

`PhotoViewer`, `Image` and the `MediaGrid` thumbnails reset their loading flag in an effect.
A cached image can fire `load` before that effect runs, so the flag went back to loading and nothing cleared it again.
The loading state is now derived from which source has settled, and an image that is already complete when the component mounts is picked up.

`PhotoViewer` also clears the placeholder when the image fails to load, as `Image` and `MediaGrid` already did.
