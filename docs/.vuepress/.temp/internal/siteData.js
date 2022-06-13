export const siteData = JSON.parse("{\"base\":\"/vue3-study/\",\"lang\":\"en-US\",\"title\":\"vue3-study\",\"description\":\" \",\"head\":[[\"link\",{\"rel\":\"icon\",\"href\":\"/images/logo.svg\"}]],\"locales\":{}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSiteData) {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ siteData }) => {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  })
}
