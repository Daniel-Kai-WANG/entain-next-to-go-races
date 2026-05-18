import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
  server: {
    proxy: {
      '/api/racing': {
        target: 'https://api.neds.com.au',
        changeOrigin: true,
        rewrite: (requestPath) => requestPath.replace(/^\/api/, '/rest/v1'),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/tests/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
})
