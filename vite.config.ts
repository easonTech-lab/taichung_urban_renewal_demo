import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { mockApiPlugin } from './vite/mockApiPlugin'

// https://vite.dev/config/
const getManualChunk = (id: string) => {
  if (id.includes('node_modules')) {
    if (['vue', 'vue-router', 'pinia'].some((pkg) => id.includes(`/node_modules/${pkg}/`))) {
      return 'vue-vendor'
    }

    if (
      [
        '@tiptap/core',
        '@tiptap/vue-3',
        '@tiptap/starter-kit',
        '@tiptap/extension-color',
        '@tiptap/extension-font-family',
        '@tiptap/extension-highlight',
        '@tiptap/extension-image',
        '@tiptap/extension-link',
        '@tiptap/extension-placeholder',
        '@tiptap/extension-text-align',
        '@tiptap/extension-text-style',
        '@tiptap/extension-underline',
        '@tiptap/extension-youtube',
      ].some((pkg) => id.includes(`/node_modules/${pkg}/`))
    ) {
      return 'tiptap-vendor'
    }

    if (['@vueuse/core', 'dayjs'].some((pkg) => id.includes(`/node_modules/${pkg}/`))) {
      return 'utils-vendor'
    }
  }

  return undefined
}

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [vue(), mockApiPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: getManualChunk,
      },
    },
  },
})
