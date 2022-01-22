import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

// 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server: {
    // #server.host
    // 指定服务器应该监听哪个 IP 地址。
    // 如果将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
    host: "0.0.0.0",
    port: 8182
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  }
})
