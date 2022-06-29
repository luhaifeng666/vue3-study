import{_ as p,r as c,o as l,c as i,b as a,w as t,e as u,a as n,d as s}from"./app.44d86716.js";const r={},k=u('<h1 id="isproxy" tabindex="-1"><a class="header-anchor" href="#isproxy" aria-hidden="true">#</a> isProxy</h1><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>\u672C\u7BC7\u7B14\u8BB0\u5BF9\u5E94\u7684\u5206\u652F\u53F7\u4E3A: <code>main\u5206\u652F\uFF1A 618f052</code></p></div><p>\u6211\u4EEC\u8FD8\u662F\u5148\u6765\u770B\u4E0B\u5B98\u65B9\u7684\u63CF\u8FF0\uFF1A</p><div class="custom-container tip"><p class="custom-container-title">\u6982\u5FF5</p><p>\u68C0\u67E5\u5BF9\u8C61\u662F\u5426\u662F\u7531 reactive \u6216 readonly \u521B\u5EFA\u7684 proxy\u3002</p></div><p>\u5176\u5B9E\u8FD9\u4E2A\u529F\u80FD\u975E\u5E38\u7B80\u5355\uFF0C\u8981\u60F3\u5224\u65AD\u4E00\u4E2A\u5BF9\u8C61\u662F\u5426\u662F <code>Proxy</code> \u5BF9\u8C61\uFF0C\u53EA\u9700\u8981\u5224\u65AD\u5B83\u662F\u5426\u662F <code>reactive</code> \u5BF9\u8C61\u6216\u8005 <code>readonly</code> \u5BF9\u8C61\u5373\u53EF\u3002</p><p>\u8FD8\u8BB0\u5F97\u6211\u4EEC\u4E4B\u524D\u7528\u4E8E\u5224\u65AD <code>reactive</code> \u4EE5\u53CA <code>readonly</code> \u65F6\u6240\u5B9A\u4E49\u7684 <code>isReactive</code> \u4EE5\u53CA <code>isReadonly</code> \u65B9\u6CD5\u4E48\uFF1F\u5728\u8FD9\u91CC\u6211\u4EEC\u76F4\u63A5\u4F7F\u7528\u5C31\u884C\u4E86\u3002</p><p>\u8001\u89C4\u77E9\uFF0C\u8FD8\u662F\u5148\u5949\u4E0A\u76F8\u5173\u7684\u6D4B\u8BD5\u7528\u4F8B\uFF1A</p>',7),d=n("div",{class:"language-typescript ext-ts line-numbers-mode"},[n("pre",{class:"language-typescript"},[n("code",null,[n("span",{class:"token comment"},"// src/reactivity/__tests__/reactive.spec.ts"),s(`

`),n("span",{class:"token function"},"it"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'happy path'"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" origin "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token punctuation"},"{"),s(" num"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"0"),s(),n("span",{class:"token punctuation"},"}"),s(`
  `),n("span",{class:"token comment"},"// \u901A\u8FC7 reactive \u521B\u5EFA\u54CD\u5E94\u5F0F\u5BF9\u8C61"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" reactiveData "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token function"},"reactive"),n("span",{class:"token punctuation"},"("),s("origin"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token comment"},"// \u5224\u65AD\u54CD\u5E94\u5F0F\u5BF9\u8C61\u4E0E\u539F\u5BF9\u8C61\u4E0D\u662F\u540C\u4E00\u4E2A\u5BF9\u8C61"),s(`
  `),n("span",{class:"token function"},"expect"),n("span",{class:"token punctuation"},"("),s("reactiveData"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),s("not"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"toBe"),n("span",{class:"token punctuation"},"("),s("origin"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token comment"},"// \u4EE3\u7406\u5BF9\u8C61\u4E2D\u7684 num \u503C\u5E94\u4E0E\u539F\u5BF9\u8C61\u4E2D\u7684\u76F8\u540C"),s(`
  `),n("span",{class:"token function"},"expect"),n("span",{class:"token punctuation"},"("),s("reactiveData"),n("span",{class:"token punctuation"},"."),s("num"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"toBe"),n("span",{class:"token punctuation"},"("),n("span",{class:"token number"},"0"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token comment"},"// \u5224\u65AD\u662F\u5426\u662F reactive \u5BF9\u8C61"),s(`
  `),n("span",{class:"token function"},"expect"),n("span",{class:"token punctuation"},"("),n("span",{class:"token function"},"isReactive"),n("span",{class:"token punctuation"},"("),s("origin"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"toBe"),n("span",{class:"token punctuation"},"("),n("span",{class:"token boolean"},"false"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token function"},"expect"),n("span",{class:"token punctuation"},"("),n("span",{class:"token function"},"isReactive"),n("span",{class:"token punctuation"},"("),s("reactiveData"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"toBe"),n("span",{class:"token punctuation"},"("),n("span",{class:"token boolean"},"true"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token comment"},"// \u5224\u65AD\u662F\u5426\u662F Proxy \u5BF9\u8C61"),s(`
  `),n("span",{class:"token function"},"expect"),n("span",{class:"token punctuation"},"("),n("span",{class:"token function"},"isProxy"),n("span",{class:"token punctuation"},"("),s("reactiveData"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"toBe"),n("span",{class:"token punctuation"},"("),n("span",{class:"token boolean"},"true"),n("span",{class:"token punctuation"},")"),s(`
`),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
`)])]),n("div",{class:"highlight-lines"},[n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("div",{class:"highlight-line"},"\xA0"),n("br")]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),b=n("div",{class:"language-typescript ext-ts line-numbers-mode"},[n("pre",{class:"language-typescript"},[n("code",null,[n("span",{class:"token comment"},"// src/reactivity/__tests__/readonly.spec.ts"),s(`

`),n("span",{class:"token function"},"it"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'happy path'"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" original "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token punctuation"},"{"),s(" foo"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"1"),n("span",{class:"token punctuation"},","),s(" bar"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"{"),s(" baz"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"2"),s(),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},"}"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" wrapped "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"readonly"),n("span",{class:"token punctuation"},"("),s("original"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token function"},"expect"),n("span",{class:"token punctuation"},"("),s("wrapped"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),s("not"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"toBe"),n("span",{class:"token punctuation"},"("),s("original"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token function"},"expect"),n("span",{class:"token punctuation"},"("),s("wrapped"),n("span",{class:"token punctuation"},"."),s("foo"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"toBe"),n("span",{class:"token punctuation"},"("),n("span",{class:"token number"},"1"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token comment"},"// \u5224\u65AD\u662F\u5426\u662F readonly \u5BF9\u8C61"),s(`
  `),n("span",{class:"token function"},"expect"),n("span",{class:"token punctuation"},"("),n("span",{class:"token function"},"isReadonly"),n("span",{class:"token punctuation"},"("),s("original"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"toBe"),n("span",{class:"token punctuation"},"("),n("span",{class:"token boolean"},"false"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token function"},"expect"),n("span",{class:"token punctuation"},"("),n("span",{class:"token function"},"isReadonly"),n("span",{class:"token punctuation"},"("),s("original"),n("span",{class:"token punctuation"},"."),s("bar"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"toBe"),n("span",{class:"token punctuation"},"("),n("span",{class:"token boolean"},"false"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token function"},"expect"),n("span",{class:"token punctuation"},"("),n("span",{class:"token function"},"isReadonly"),n("span",{class:"token punctuation"},"("),s("wrapped"),n("span",{class:"token punctuation"},"."),s("bar"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"toBe"),n("span",{class:"token punctuation"},"("),n("span",{class:"token boolean"},"true"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token function"},"expect"),n("span",{class:"token punctuation"},"("),n("span",{class:"token function"},"isReadonly"),n("span",{class:"token punctuation"},"("),s("wrapped"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"toBe"),n("span",{class:"token punctuation"},"("),n("span",{class:"token boolean"},"true"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token comment"},"// \u5224\u65AD\u662F\u5426\u662F Proxy \u5BF9\u8C61"),s(`
  `),n("span",{class:"token function"},"expect"),n("span",{class:"token punctuation"},"("),n("span",{class:"token function"},"isProxy"),n("span",{class:"token punctuation"},"("),s("wrapped"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"toBe"),n("span",{class:"token punctuation"},"("),n("span",{class:"token boolean"},"true"),n("span",{class:"token punctuation"},")"),s(`
`),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
`)])]),n("div",{class:"highlight-lines"},[n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("div",{class:"highlight-line"},"\xA0"),n("br")]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),m=n("p",null,[s("\u63A5\u4E0B\u6765\uFF0C\u6211\u4EEC\u9700\u8981\u53BB\u5B9A\u4E49\u4E0B "),n("code",null,"isProxy"),s(" \u65B9\u6CD5\uFF1A")],-1),v=n("div",{class:"language-typescript ext-ts line-numbers-mode"},[n("pre",{class:"language-typescript"},[n("code",null,[n("span",{class:"token comment"},"// src/reactivity/reactive.ts"),s(`

`),n("span",{class:"token comment"},"// \u5224\u65AD\u662F\u5426\u662F Proxy \u5BF9\u8C61"),s(`
`),n("span",{class:"token keyword"},"export"),s(),n("span",{class:"token keyword"},"const"),s(),n("span",{class:"token function-variable function"},"isProxy"),s(),n("span",{class:"token operator"},"="),s(" value "),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token function"},"isReactive"),n("span",{class:"token punctuation"},"("),s("value"),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"||"),s(),n("span",{class:"token function"},"isReadonly"),n("span",{class:"token punctuation"},"("),s("value"),n("span",{class:"token punctuation"},")"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),f=n("p",null,[s("\u81F3\u6B64\uFF0C"),n("code",null,"isProxy"),s(" \u529F\u80FD\u5C31\u5DF2\u7ECF\u5B9E\u73B0\u5B8C\u6210\u5566~\uFF08\u771F\u7684\u597D\u7B80\u5355\uFF09\u3002")],-1);function y(_,x){const e=c("CodeGroupItem"),o=c("CodeGroup");return l(),i("div",null,[k,a(o,null,{default:t(()=>[a(e,{title:"reactive.spec.ts"},{default:t(()=>[d]),_:1}),a(e,{title:"readonly.spec.ts"},{default:t(()=>[b]),_:1})]),_:1}),m,a(o,null,{default:t(()=>[a(e,{title:"reactive.ts"},{default:t(()=>[v]),_:1})]),_:1}),f])}var g=p(r,[["render",y],["__file","09_isProxy.html.vue"]]);export{g as default};
