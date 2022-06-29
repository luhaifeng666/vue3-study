export const themeData = JSON.parse("{\"lastUpdated\":\"Last Updated\",\"sidebarDepth\":2,\"sidebar\":{\"/miniVue/notes/\":[{\"text\":\"开始之前\",\"link\":\"/miniVue/notes/prerequisites.md\"},{\"text\":\"Reactivity\",\"collapsible\":true,\"children\":[\"/miniVue/notes/reactivity/01_reactive.md\",\"/miniVue/notes/reactivity/02_runner.md\",\"/miniVue/notes/reactivity/03_scheduler.md\",\"/miniVue/notes/reactivity/04_stop.md\",\"/miniVue/notes/reactivity/05_readonly.md\",\"/miniVue/notes/reactivity/06_reactiveOrReadonly.md\",\"/miniVue/notes/reactivity/07_nestedReactiveAndReadonly.md\",\"/miniVue/notes/reactivity/08_shallowReadonly.md\",\"/miniVue/notes/reactivity/09_isProxy.md\"]}]},\"navbar\":[{\"text\":\"Home\",\"link\":\"/\"},{\"text\":\"Notes\",\"link\":\"/miniVue/notes/\"},{\"text\":\"酱豆腐精的小站\",\"link\":\"https://luhaifeng666.github.io\"},{\"text\":\"GitHub\",\"link\":\"https://github.com/luhaifeng666/vue3-study\"}],\"locales\":{\"/\":{\"selectLanguageName\":\"English\"}},\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"logo\":null,\"repo\":null,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"editLink\":true,\"editLinkText\":\"Edit this page\",\"lastUpdatedText\":\"Last Updated\",\"contributors\":true,\"contributorsText\":\"Contributors\",\"notFound\":[\"There's nothing here.\",\"How did we get here?\",\"That's a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"backToHome\":\"Take me home\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
