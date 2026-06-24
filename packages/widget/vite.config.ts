import preact from '@preact/preset-vite';
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const here = dirname(fileURLToPath(import.meta.url));
const webPublic = resolve(here, '../../apps/web/public/widget.js');

export default defineConfig({
  plugins: [
    preact(),
    {
      name: 'copy-widget-to-web-public',
      closeBundle() {
        mkdirSync(dirname(webPublic), { recursive: true });
        copyFileSync(resolve(here, 'dist/widget.js'), webPublic);
      },
    },
  ],
  build: {
    lib: {
      entry: resolve(here, 'src/index.ts'),
      formats: ['iife'],
      name: 'YbugWidget',
      fileName: () => 'widget.js',
    },
    rollupOptions: { output: { inlineDynamicImports: true } },
    emptyOutDir: true,
  },
});
