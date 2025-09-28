import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.{ts,tsx}'],
    globals: true,
    watch: false,
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'hono/jsx',
    target: 'es2020',
  },
});
