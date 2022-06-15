export const data = JSON.parse("{\"key\":\"v-8daa1a0e\",\"path\":\"/\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{\"home\":true,\"heroImage\":\"/images/logo.svg\"},\"excerpt\":\"\",\"headers\":[],\"git\":{\"updatedTime\":1655196562000,\"contributors\":[{\"name\":\"luhaifeng\",\"email\":\"lhf222458@ncarzone.com\",\"commits\":2},{\"name\":\"luhaifeng666\",\"email\":\"youzui@hotmail.com\",\"commits\":1}]},\"filePathRelative\":\"README.md\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
