import { defineAsyncComponent } from 'vue'

export const layoutComponents = {
  "404": defineAsyncComponent(() => import("/Users/luhaifeng/codes/mine/vue3-study/node_modules/.pnpm/@vuepress+theme-default@2.0.0-beta.46_sass-loader@12.6.0/node_modules/@vuepress/theme-default/lib/client/layouts/404.vue")),
  "Layout": defineAsyncComponent(() => import("/Users/luhaifeng/codes/mine/vue3-study/docs/.vuepress/public/themes/layouts/Layout.vue")),
}
