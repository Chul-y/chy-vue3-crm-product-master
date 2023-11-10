import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
//引入打包分析插件
import { visualizer } from "rollup-plugin-visualizer"
//自动导入插件
import autoImport from 'unplugin-auto-import/vite'
//自动导入组件
import autoComponents from "unplugin-vue-components/vite"
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
//setup增强
import vueSetupPlugin from "vite-plugin-vue-setup-extend"
// https://vitejs.dev/config/
export default defineConfig((config) => {
  //通过loadEnv获取环境变量
  //获取环境变量
  // console.log(config)
  //1.加载的环境文件的名字 2.环境文件对应的目录 3.环境变量的前缀,空字符串表示可以读取任意前缀不需要VITE_前缀
  let env = loadEnv(config.mode, process.cwd(), '')
  // console.log(env)
  // console.log(import.meta.url)
  return {
    base: "./",
    build: {
      outDir: 'dist-' + config.mode,
      rollupOptions: {
        output: {
          chunkFileNames: `assets/js/[name]-${env.VITE_APP_VERSION}-[hash]${+new Date()}.js`, // 引入文件名的名称
          assetFileNames: `assets/[ext]/[name]-${env.VITE_APP_VERSION}-[hash]-${+new Date()}.[ext]`,  // 包的入口文件名称
          entryFileNames: `assets/js/[name]-${env.VITE_APP_VERSION}-[hash]-${+new Date()}.js`,  // 资源文件像 字体，css 图片等
        }
      },
    },
    esbuild: {
      //去除console和debugger
      drop: ['console', 'debugger']
    },
    //插件配置
    plugins: [
      vue(),
      //引入打包分析插件
      visualizer(),
      //自动导入插件
      autoImport({
        //自动导入的模块
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/head', '@vueuse/core'],
        //默认导出的模块名字是文件名
        defaultExportByFilename: true,
        //自动按需导入ElementPlus
        resolvers: [ElementPlusResolver()]
      }),
      //自动按需导入ElementPlus
      autoComponents({
        resolvers: [ElementPlusResolver()]
      }),
      //setup增强
      vueSetupPlugin(),
    ],
    resolve: {
      //别名配置
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        "components": fileURLToPath(new URL('./src/components', import.meta.url)),
        "pages": fileURLToPath(new URL('./src/pages', import.meta.url)),
        "assets": fileURLToPath(new URL('./src/assets', import.meta.url)),
        "utils": fileURLToPath(new URL('./src/utils', import.meta.url)),
        "layout":fileURLToPath(new URL('./src/layout', import.meta.url))
      }
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_APP_BASEURL,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
