import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

export default defineConfig({
  plugins: [{
    name: 'studio-assets',
    resolveId(id) {
      if (id === 'public/studio-logo.svg' || id.startsWith('public/icons/')) return '\0' + id;
    },
    load(id) {
      if (id.startsWith('\0public/')) {
        const bytes = readFileSync(resolve(import.meta.dirname, id.slice(1)));
        return `export default new Uint8Array(${JSON.stringify(Array.from(bytes))}).buffer;`;
      }
    },
  }],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    globals: true,
    watch: false,
    alias: {
      '@takumi-rs/wasm/auto': resolve(
        import.meta.dirname,
        'src/__mocks__/takumi_wasm_bg.wasm.ts'
      ),
      'public/fonts/Inter,Plus_Jakarta_Sans/Plus_Jakarta_Sans/PlusJakartaSans-VariableFont_wght.ttf':
        resolve(import.meta.dirname, 'src/__mocks__/font.ts'),
      'public/favicon.ico': resolve(import.meta.dirname, 'src/__mocks__/favicon.ts'),
      'public/yehez-icon.svg': resolve(import.meta.dirname, 'src/__mocks__/icon.ts'),
    },
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'hono/jsx',
    target: 'es2020',
  },
});
