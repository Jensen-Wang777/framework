import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import vueDevTools from 'vite-plugin-vue-devtools' // 完全禁用Vue DevTools插件
import nightwatchPlugin from 'vite-plugin-nightwatch'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // vueDevTools(), // 禁用Vue DevTools插件以移除浮动面板
    nightwatchPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
