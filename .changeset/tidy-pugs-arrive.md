---
'zimme-zoom': minor
---

Modernize packaging.

- Add `"sideEffects": false`, so bundlers can tree-shake the package. This is now safe because the module-level `document` access was removed.
- Raise the TypeScript target from `es5` to `es2018`. Every browser that satisfies the React >=16.8 peer requirement supports it, and it cuts the bundle by roughly 10% (about 12 kB raw, 3 kB gzipped).
- Rename the ESM output from `dist/index.esm.js` to `dist/index.mjs`. The package has no `"type": "module"`, so Node parsed the old `.js` ESM bundle as CommonJS and failed to load it.
- Bundle the type declarations into a single `dist/index.d.ts` plus a `dist/index.d.mts`, and advertise them per condition in the `exports` map, so ESM consumers on `moduleResolution: node16`/`nodenext` no longer get CommonJS-flavored types.
- Expose `./package.json` through the `exports` map.

The public API is unchanged: all 27 exported values and types are identical.
