# zimme-zoom

## 0.3.0

### Minor Changes

- 95eb4da: Expose download fallback results from PhotoViewer.

  Adds an optional `onDownloadFallback` prop that receives the final download
  result when canvas or fetch download attempts fail and the viewer falls back to
  another method. `downloadImage` now returns the method used plus the failed
  fallback attempts, while preserving the existing default fallback behavior.

  Canvas conversion returning `null` is now recorded as a canvas fallback failure
  instead of silently continuing to the next method.

- 643b512: Make PhotoViewer usable by keyboard and screen readers.

  - Every control is now a real `<button type="button">` with an accessible name, instead of a `<div onClick>` with no role, no tab stop, and no name. The controls were previously unreachable by keyboard and invisible to screen readers.
  - Focus moves into the dialog on open, is confined to it while open, and returns to the element that opened the viewer on close.
  - Focus recovers when a control removes itself, such as Reset disappearing once the transform is back to its default.
  - Page scrolling behind the backdrop is locked while the viewer is open, with the scrollbar width compensated so the page does not shift.
  - The overlay toggle exposes its state through `aria-pressed`.
  - The control bar now brightens on keyboard focus, not only on hover.

  Adds an optional `labels` prop for translating the accessible names, along with an exported `PhotoViewerLabels` type. Unspecified keys keep their English defaults. `PhotoViewerSettings` is now exported too; it was already part of the public props but was not reachable from the package root.

  Visual appearance and existing props are unchanged, and there are still no runtime dependencies.

- 24b7b77: Modernize packaging.

  - Add `"sideEffects": false`, so bundlers can tree-shake the package. This is now safe because the module-level `document` access was removed.
  - Raise the TypeScript target from `es5` to `es2018`. Every browser that satisfies the React >=16.8 peer requirement supports it, and it cuts the bundle by roughly 10% (about 12 kB raw, 3 kB gzipped).
  - Rename the ESM output from `dist/index.esm.js` to `dist/index.mjs`. The package has no `"type": "module"`, so Node parsed the old `.js` ESM bundle as CommonJS and failed to load it.
  - Bundle the type declarations into a single `dist/index.d.ts` plus a `dist/index.d.mts`, and advertise them per condition in the `exports` map, so ESM consumers on `moduleResolution: node16`/`nodenext` no longer get CommonJS-flavored types.
  - Expose `./package.json` through the `exports` map.

  The public API is unchanged: all 27 exported values and types are identical.

### Patch Changes

- 33d4b58: Render PhotoViewer through a document-body portal and hide background content while it is open.

  The viewer now avoids ancestor stacking contexts, removes background content from the accessibility tree with `inert` and `aria-hidden`, restores focus after the background is re-enabled, and keeps late-mounted body children hidden until the viewer closes.

## 0.2.3

Versions up to and including 0.2.3 predate Changesets; see the
[git history](https://github.com/kulcsarrudolf/zimme-zoom/commits/main)
for earlier changes. Future releases are managed with
[Changesets](https://github.com/changesets/changesets) and documented below.
