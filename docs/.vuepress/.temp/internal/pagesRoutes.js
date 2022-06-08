import { Vuepress } from '@vuepress/client'

const routeItems = [
  ["v-8daa1a0e","/",{"title":""},["/index.html","/README.md"]],
  ["v-f4c6334e","/miniVue/",{"title":""},["/miniVue/index.html","/miniVue/README.md"]],
  ["v-402aedb2","/miniVue/notes/",{"title":"Vue3 源码学习"},["/miniVue/notes/index.html","/miniVue/notes/README.md"]],
  ["v-8b74b6cc","/miniVue/notes/reactivity/reactive.html",{"title":"reactivity的核心流程"},["/miniVue/notes/reactivity/reactive","/miniVue/notes/reactivity/reactive.md"]],
  ["v-3706649a","/404.html",{"title":""},["/404"]],
]

export const pagesRoutes = routeItems.reduce(
  (result, [name, path, meta, redirects]) => {
    result.push(
      {
        name,
        path,
        component: Vuepress,
        meta,
      },
      ...redirects.map((item) => ({
        path: item,
        redirect: path,
      }))
    )
    return result
  },
  [
    {
      name: '404',
      path: '/:catchAll(.*)',
      component: Vuepress,
    }
  ]
)
