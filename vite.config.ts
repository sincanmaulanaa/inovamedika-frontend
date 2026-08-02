import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        manualChunks: getManualChunk,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
  test: {
    clearMocks: true,
    environment: 'jsdom',
    restoreMocks: true,
    setupFiles: './src/test/setup.ts',
  },
})

function getManualChunk(moduleId: string): string | undefined {
  if (
    /node_modules\/(react|react-dom|react-router|scheduler)\//.test(moduleId)
  ) {
    return 'react-runtime'
  }

  if (/node_modules\/(@tanstack|axios|zod|zustand)\//.test(moduleId)) {
    return 'data-runtime'
  }

  if (
    /node_modules\/(@cloudflare|@base-ui|@phosphor-icons|motion|d3-|react-day-picker)\//.test(
      moduleId,
    )
  ) {
    return 'ui-runtime'
  }

  return undefined
}
