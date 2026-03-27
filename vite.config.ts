import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { mockApiPlugin } from './vite/mockApiPlugin'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = process.env.VITE_BASE || env.VITE_BASE || '/'

  return {
    base,
    plugins: [vue(), mockApiPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss,
          autoprefixer,
        ],
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
          manualChunks: {
            // 將 Vue 相關的庫分離
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            // 將 TipTap 相關的庫分離（這些庫比較大）
            'tiptap-vendor': [
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
            ],
            // 將其他大型庫分離
            'utils-vendor': ['@vueuse/core', 'dayjs'],
          },
        },
      },
    },
  }
})
