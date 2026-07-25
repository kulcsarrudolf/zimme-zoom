const typescript = require('rollup-plugin-typescript2');
const dts = require('rollup-plugin-dts').default;

const external = ['react', 'react-dom'];

module.exports = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        // `.mjs` so Node parses this as ESM. The package has no `"type": "module"`,
        // so a `.js` extension would be treated as CJS and fail to load.
        file: 'dist/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
    ],
    external,
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        useTsconfigDeclarationDir: true,
        exclude: ['**/*.stories.tsx', '**/*.stories.ts', '**/*.stories.mdx', '.storybook/**/*'],
      }),
    ],
  },
  {
    // Flatten the per-file declarations emitted above into a single entry point.
    // `.d.mts` is what lets the `import` condition advertise ESM types; a copy of
    // the unbundled `.d.ts` would not work, since its relative re-exports are
    // extensionless and do not resolve under Node's ESM rules.
    input: 'dist/types/index.d.ts',
    output: [
      { file: 'dist/index.d.ts', format: 'es' },
      { file: 'dist/index.d.mts', format: 'es' },
    ],
    external,
    plugins: [dts()],
  },
];
