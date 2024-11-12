import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { markdownCountPlugin } from './src/utils/constructPost.js';


export default defineConfig({
  // plugins: [vue(), vueDevTools(), markdownCountPlugin()],
  plugins: [vue(), markdownCountPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
});
