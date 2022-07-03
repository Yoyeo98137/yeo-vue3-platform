import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// 自动导入
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// 依赖分析
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      isDev
        ? visualizer({ open: true, brotliSize: true, filename: 'report.html' })
        : null,
    ],

    // /* */ 的方式会导致 CSS 注释也被编译进最终产物，使用 // 即可
    // @see: https://juejin.cn/post/7080051004904833061
    // @see: https://www.zhihu.com/question/498190531
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },

    server: {
      // #server.host
      // 指定服务器应该监听哪个 IP 地址。
      // 如果将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
      host: '0.0.0.0',
      port: 8182,
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    build: {
      // terserOptions: {
      //   compress: {
      //     // 生产环境移除 console
      //     drop_console: process.env.NODE_ENV === "production",
      //     drop_debugger: process.env.NODE_ENV === "production",
      //   },
      // },
      // rollupOptions: {
      //   // 确保外部化处理那些你不想打包进库的依赖
      //   // external
      // },
    },
  };
});
