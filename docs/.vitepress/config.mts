import { defineConfig } from 'vitepress'
import path from 'path' // 需要引入 path 模块
import { nav } from './nav.ts'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 引入刚才生成的两个侧边栏配置
import { photoSidebar } from './sidebar.config'
import { scenesSidebar, categoriesSidebar } from './sidebar.config'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "柚子木",
  description: "柚子木",
  base: '/img-app/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: '首页', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' },
      ...nav
    ],

    sidebar: {
      '/photos/': photoSidebar,
      '/scenes/': scenesSidebar,
      '/categories/': categoriesSidebar,
    },
    // search: {
    //   provider: 'local', // 使用本地搜索
    //   options: {
    //     locales: {
    //       root: {
    //         translations: {
    //           button: {
    //             buttonText: '搜索文档',
    //             buttonAriaLabel: '搜索文档',
    //           },
    //           modal: {
    //             noResultsText: '无法找到相关结果',
    //             resetButtonTitle: '清除查询条件',
    //             footer: {
    //               selectText: '选择',
    //               navigateText: '切换',
    //               closeText: '关闭',
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  },
  vite: {
    server: {
      host: '0.0.0.0',
      // 可选：自定义端口，默认是 5173
      port: 5173
    },
    plugins: [
      Components({
        resolvers: [ElementPlusResolver()],
        dts: true, // 生成 components.d.ts
      }),
    ],
    ssr: {
      noExternal: ['element-plus']
    }
  },
  // 👇 添加这一段配置
})
