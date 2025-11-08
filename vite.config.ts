/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';

export default defineConfig(({ mode }) => {

  return {
  root: __dirname,
  cacheDir: './node_modules/.vite/packages/aabha',
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    minify: false, // Keep code readable
    sourcemap: true, // Always include sourcemaps
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: 'aabha',
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [],
      output: {
        // Disable code splitting/chunking
        inlineDynamicImports: true,
        // Make output as readable as possible
        compact: false,
        // Preserve whitespace and formatting
        generatedCode: {
          constBindings: true,
        },
        // Use readable variable names
        preserveModules: false,
      },
    },
  },
  test: {
    name: 'aabha',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
};
});
