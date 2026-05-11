import { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.NavItem[] = [
    { text: '首页', link: '/' },
    { text: '照片', link: '/photos/' },     // 指向照片模块
    { text: '场景', link: '/scenes/' },         // 指向场景模块
    { text: '分类', link: '/categories/' },     // 指向分类模块
    // { text: '数据源', link: '/sources/' }    // 暂缓
]