import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.{ts,tsx}'],
    globals: true,
    watch: false,
    alias: {
      '@takumi-rs/wasm/takumi_wasm_bg.wasm': resolve(
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
