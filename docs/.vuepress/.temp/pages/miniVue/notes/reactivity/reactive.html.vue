<template><div><h2 id="写在开始" tabindex="-1"><a class="header-anchor" href="#写在开始" aria-hidden="true">#</a> 写在开始</h2>
<p>在正式开始学习之前，我们先一起来了解一个思想：<code v-pre>TDD</code>。什么是 <code v-pre>TDD</code> 呢？我们先来看下它的概念：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>TDD是测试驱动开发（Test-Driven Development）的英文简称。
它是敏捷开发中的一项核心实践和技术，也是一种设计方法论。
TDD的原理是在开发功能代码之前，先编写单元测试用例代码，测试代码确定需要编写什么产品代码。
TDD虽是敏捷方法的核心实践，但不只适用于XP（Extreme Programming），同样可以适用于其他开发方法和过程。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>简而言之，就是 <code v-pre>测试驱动开发</code>，在动手开发之前先写好测试用例，然后再进行开发。<br>
在接下来的学习过程中，<code v-pre>TDD</code> 的思想将贯穿始终。话不多说，让我们一起进入vue3的源码学习吧~</p>
<blockquote>
<p><strong>声明：</strong><br>
笔记中的内容来源于 <strong>崔大(wx: cuixr1314)</strong> 的 <a href="https://github.com/cuixiaorui/mini-vue" target="_blank" rel="noopener noreferrer">mini-vue<ExternalLinkIcon/></a> 教学，目前已经 <code v-pre>4k+</code>的⭐️了，欢迎大家踊跃star~<br>
热爱学习的小伙伴们，可以搜索 <code v-pre>催学社</code> 微信群，里面都是一群热爱学习的小伙伴，学习氛围一级棒！期待你的加入~<br>
<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fab46bb312db444c8352d44cbe9f4c70~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"></p>
</blockquote>
<h2 id="正文开始" tabindex="-1"><a class="header-anchor" href="#正文开始" aria-hidden="true">#</a> 正文开始</h2>
<p>我们知道，不论是在 <code v-pre>vue2</code> 中，还是在 <code v-pre>vue3</code> 中， <code v-pre>响应式数据</code> 一直都是vue的核心概念。这一节，我们也先从 <code v-pre>响应式数据</code> 开始说起。</p>
<h3 id="vue2-与-vue3-中对响应式数据处理的区别" tabindex="-1"><a class="header-anchor" href="#vue2-与-vue3-中对响应式数据处理的区别" aria-hidden="true">#</a> vue2 与 vue3 中对响应式数据处理的区别</h3>
<p>熟悉 <code v-pre>vue2</code> 的小伙伴儿们都知道，在 <code v-pre>vue2</code> 中，数据的响应式是通过 <code v-pre>Object.defineProperty</code> 来实现的。针对对象，通过遍历对象的属性，来设置属性对应的 <code v-pre>getter</code> 以及 <code v-pre>setter</code> 方法，以达到 <code v-pre>依赖收集</code> 与 <code v-pre>触发依赖</code> 的目的；
而针对数组，则是通过重写数组一系列更新元素的方法来实现对数组元素修改的劫持。<br>
但是通过这种方式来实现数据响应式，存在以下几个问题：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>1. 对象直接新添加新的属性，或者删除已有的属性, 界面不会自动更新；
2. 直接通过替换数组对应下标的元素，或者更新数组的length, 界面也不会自动更新；
3. 如果对象的属性较多，且嵌套层次较深时，需要深度遍历，循环量大，性能损耗较大。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>针对以上几个问题，<code v-pre>vue3</code> 中使用了 <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy" target="_blank" rel="noopener noreferrer">Proxy<ExternalLinkIcon/></a> 来代替 <code v-pre>Object.defineProperty</code>。<br>
针对 <code v-pre>问题1</code> 和 <code v-pre>问题3</code>，<code v-pre>Proxy</code> 代理了整个对象，并且提供了多达13种对对象属性的操作（如属性查找、赋值、枚举、函数调用等），在对象发生变化时，<code v-pre>Proxy</code> 都可以进行捕获，与 <code v-pre>Object.defineProperty</code> 不同，无需遍历所有属性；<br>
针对 <code v-pre>问题2</code>，<code v-pre>Proxy</code> 对数组的监听相较于 <code v-pre>Object.defineProperty</code> 性能更优。具体大家可以参考 <a href="https://cloud.tencent.com/developer/news/485729" target="_blank" rel="noopener noreferrer">这篇文章<ExternalLinkIcon/></a> 。<br></p>
<p>那在 <code v-pre>vue3</code> 中具体是如何通过 <code v-pre>Proxy</code> 的方式实现响应式的呢？</p>
<h3 id="reactivity-第一步-reactive" tabindex="-1"><a class="header-anchor" href="#reactivity-第一步-reactive" aria-hidden="true">#</a> <code v-pre>reactivity</code> 第一步：reactive</h3>
<blockquote>
<p><strong>注：</strong> <br>
本文以 vue3 中的 <code v-pre>reactive</code> 为例，如果对 <code v-pre>reactive</code> 操作尚不熟悉的同学可以看下 <a href="https://v3.cn.vuejs.org/api/basic-reactivity.html" target="_blank" rel="noopener noreferrer">这篇文档<ExternalLinkIcon/></a>。至于 <code v-pre>ref</code>，其底层也是 <code v-pre>reactive</code>, 关于 <code v-pre>ref</code> 的内容，在完成 <code v-pre>reactive</code> 所有相关功能的梳理后，后续的文章中会做补充，这里先埋个伏笔~（手动🌺🐔）</p>
</blockquote>
<p>还记得开篇时提到的 <code v-pre>TDD</code> 么？开始之前，我们先从测试用例入手：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// miniVue/reactivity/__tests__/reactive.spec.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> reactive <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../reactive'</span>

<span class="token function">describe</span><span class="token punctuation">(</span><span class="token string">'reactive'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token function">it</span> <span class="token punctuation">(</span><span class="token string">'happy path'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> original <span class="token operator">=</span> <span class="token punctuation">{</span> foo<span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span>
    <span class="token comment">// 创建Proxy代理对象</span>
    <span class="token keyword">const</span> observeOriginal <span class="token operator">=</span> <span class="token function">reactive</span><span class="token punctuation">(</span>original<span class="token punctuation">)</span>
    <span class="token comment">// 响应式对象与原对象应该不相等，因为observeOriginal被Proxy包裹</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>observeOriginal<span class="token punctuation">)</span><span class="token punctuation">.</span>not<span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span>original<span class="token punctuation">)</span>
    <span class="token comment">// 取值</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>observeOriginal<span class="token punctuation">.</span>foo<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试用例中， <code v-pre>reactive</code> 将传入的对象转换成 <code v-pre>Proxy</code> 代理对象，之后通过代理对象来获取其中的值。既然如此，那我们就从 <code v-pre>reactive</code> 入手。先来看下 <code v-pre>reactive</code> 的定义：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// miniVue/reactivity/reactive.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> mutableHandlers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./baseHandlers'</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> reactiveMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">WeakMap</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token doc-comment comment">/**
 * 创建reactive对象
 * <span class="token keyword">@param</span> <span class="token parameter">target</span>
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">reactive</span> <span class="token punctuation">(</span>target<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">createReactiveObject</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> reactiveMap<span class="token punctuation">,</span> mutableHandlers<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 创建响应式对象
 * <span class="token keyword">@param</span> <span class="token parameter">target</span>
 * <span class="token keyword">@param</span> <span class="token parameter">proxyMap</span>
 * <span class="token keyword">@param</span> <span class="token parameter">baseHandlers</span>
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createReactiveObject</span> <span class="token punctuation">(</span>target<span class="token punctuation">,</span> proxyMap<span class="token punctuation">,</span> baseHandlers<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 判断proxy是否已经保存过</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>proxyMap<span class="token punctuation">.</span><span class="token function">has</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 如果存在，则返回</span>
    <span class="token keyword">return</span> proxyMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">const</span> proxy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Proxy</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> baseHandlers<span class="token punctuation">)</span>

  <span class="token comment">// 存储创建好的proxy</span>
  proxyMap<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> proxy<span class="token punctuation">)</span>
  <span class="token keyword">return</span> proxy
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从上述代码可以看出，<code v-pre>reactive</code> 中调用了 <code v-pre>createReactiveObject</code> 方法，既然 <code v-pre>reactive</code> 方法是用来返回 <code v-pre>Proxy</code> 对象的，那在 <code v-pre>createReactiveObject</code> 中又发生了什么呢？我们一起来分析一下：</p>
<ol>
<li><code v-pre>createReactiveObject</code> 接收三个参数：需要被代理的对象 <code v-pre>target</code>, 也就是在 <code v-pre>reactive</code> 接收的 <code v-pre>target</code> 参数、用于存储 <code v-pre>Proxy</code> 对象的 <code v-pre>proxyMap</code> 以及 <code v-pre>Proxy</code> 对象的处理器 <code v-pre>baseHandlers</code>;</li>
<li>先判断在 <code v-pre>proxyMap</code> 是否已经存在当前对象所对应的 <code v-pre>Proxy</code> 对象，如果存在，则直接返回, 否则新建一个 <code v-pre>Proxy</code> 对象，并以当前的 <code v-pre>target</code> 为key，存储到 <code v-pre>proxyMap</code>，以便下次取用，并将新建的 <code v-pre>Proxy</code> 返回。</li>
</ol>
<p>诶，写到这里，细心的小伙伴儿们就会问了，那 <code v-pre>baseHandlers</code> 这个处理器具体又干了啥嘞？别急别急，我们现在就一起来看一看。</p>
<p>这里的 <code v-pre>baseHandlers</code> 实际上是从 <code v-pre>reactive</code> 中传过来的 <code v-pre>mutableHandlers</code>, 我们来一起看下它的定义：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// miniVue/reactivity/baseHandlers.ts</span>

<span class="token keyword">const</span> get <span class="token operator">=</span> <span class="token function">createGetter</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> set <span class="token operator">=</span> <span class="token function">createSetter</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> mutableHandlers <span class="token operator">=</span> <span class="token punctuation">{</span>
  get<span class="token punctuation">,</span>
  set
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createGetter</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> receiver<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> res <span class="token operator">=</span>  Reflect<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> receiver<span class="token punctuation">)</span>
    <span class="token keyword">return</span> res
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createSetter</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">,</span> receiver<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> res <span class="token operator">=</span> Reflect<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">,</span> receiver<span class="token punctuation">)</span>
    <span class="token keyword">return</span> res
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从上述代码中不难看出，实际上 <code v-pre>mutableHandlers</code> 就是定义了 <code v-pre>Proxy</code> 对象的 <code v-pre>get</code> 和 <code v-pre>set</code> 方法。</p>
<p>回到测试用例中的 <code v-pre>expect(observeOriginal.foo).toBe(1)</code> 这个步骤，在获取代理对象的foo属性时，便会触发 <code v-pre>get</code> 方法，从而返回属性对应的值。同样，当设置代理对象的foo属性时，便会触发 <code v-pre>set</code> 方法，对属性的值做出改变。</p>
<p>写到这里，我们通过一张流程图，来捋一捋 <code v-pre>reactive</code> 的流程：</p>
<p><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b014fadb17d641048dcd12f01695afaf~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"></p>
<blockquote>
<p>扩展阅读：关于 <code v-pre>Proxy</code> 中为啥要用到 <code v-pre>Reflect</code>，有兴趣的小伙伴可以参考下 <code v-pre>张鑫旭</code> 大佬的这篇文章：<a href="https://www.zhangxinxu.com/wordpress/2021/07/js-proxy-reflect/" target="_blank" rel="noopener noreferrer">Proxy是代理，Reflect是干嘛用的？<ExternalLinkIcon/></a></p>
</blockquote>
<p><strong>综上：<code v-pre>reactive</code> 通过 <code v-pre>createReactiveObject</code> 方法，返回 <code v-pre>target</code> 所对应的 <code v-pre>proxy</code> 对象，并对 <code v-pre>target</code> 中属性的读取与写入操作做了拦截处理。</strong></p>
<h3 id="reactivity-第二步-依赖收集-触发依赖" tabindex="-1"><a class="header-anchor" href="#reactivity-第二步-依赖收集-触发依赖" aria-hidden="true">#</a> <code v-pre>reactivity</code> 第二步：依赖收集 &amp;&amp; 触发依赖</h3>
<p>现在我们已经知道了如何通过 <code v-pre>Proxy</code> 拦截对象的属性操作, 接下来我们一起看下如何实现 <code v-pre>依赖收集</code> 与 <code v-pre>依赖触发</code>。</p>
<p>老规矩，我们还是先从测试用例入手：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// miniVue/reactivity/__tests__/effect.spec.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> reactive <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../reactive'</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> effect <span class="token punctuation">}</span> <span class="token keyword">from</span>  <span class="token string">'../effect'</span>

<span class="token function">describe</span><span class="token punctuation">(</span><span class="token string">'effect'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token function">it</span> <span class="token punctuation">(</span><span class="token string">'should observe basic properties'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> dummy <span class="token operator">=</span> <span class="token number">0</span>
    <span class="token comment">// 获取proxy对象</span>
    <span class="token keyword">const</span> data <span class="token operator">=</span> <span class="token function">reactive</span><span class="token punctuation">(</span><span class="token punctuation">{</span> num<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token comment">// ？</span>
    <span class="token function">effect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span> dummy <span class="token operator">=</span> data<span class="token punctuation">.</span>num <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>dummy<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>
    <span class="token comment">// 改变值</span>
    data<span class="token punctuation">.</span>num <span class="token operator">=</span> <span class="token number">1</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>dummy<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试用例中，在调用了 <code v-pre>reactive</code> 方法获取到 <code v-pre>Proxy</code> 对象后，又调用了 <code v-pre>effect</code> 方法。那这个 <code v-pre>effect</code> 方法又是干啥的呢？我们先来看下 <code v-pre>effect</code> 方法的定义：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// miniVue/reactivity/effect.ts</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@param</span> <span class="token parameter">fn</span>
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">effect</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> reactiveEffect <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ReactiveEffect</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span>
  reactiveEffect<span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，<code v-pre>effect</code> 接受一个函数作为参数，并且在其内部实例化了一个名为 <code v-pre>ReactiveEffect</code> 的类，并将接收到的函数传入这个类中，然后执行 <code v-pre>ReactiveEffect</code> 类上提供的 <code v-pre>run</code> 方法。那这个 <code v-pre>ReactiveEffect</code> 类又是何方神圣呢？执行 <code v-pre>run</code> 又做了什么事情呢？让我们来一探究竟:</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// miniVue/reactivity/effect.ts</span>

<span class="token keyword">let</span> activeEffect <span class="token operator">=</span> <span class="token keyword">void</span> <span class="token number">0</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">ReactiveEffect</span> <span class="token punctuation">{</span>
  <span class="token comment">// 存放所有依赖</span>
  <span class="token keyword">public</span> deps<span class="token operator">:</span> <span class="token builtin">any</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

  <span class="token comment">// 初始化依赖列表</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>fn<span class="token punctuation">)</span> <span class="token keyword">this</span><span class="token punctuation">.</span>deps<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 执行收集到的所有依赖</span>
  <span class="token function">run</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    activeEffect <span class="token operator">=</span> <span class="token keyword">this</span> <span class="token keyword">as</span> <span class="token builtin">any</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>deps<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>dep <span class="token operator">=></span> <span class="token function">dep</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过上面的代码我们可以得知，<code v-pre>ReactiveEffect</code> 类在被实例化时，将接收到的函数存储到自己的 <code v-pre>deps</code> 属性中，并且在执行它的 <code v-pre>run</code> 方法时，则是遍历自身的 <code v-pre>deps</code> 属性，执行其中存储的函数。</p>
<p>由此可知，<strong>借助 <code v-pre>ReactiveEffect</code> 类所提供的能力，我们可以将方法保存起来，也可以触发已经被保存起来的方法。</strong></p>
<blockquote>
<p><strong>提问：</strong> 在调用 <code v-pre>run</code> 方法时，为什么还要将 <code v-pre>this</code> 赋值给全局变量 <code v-pre>activeEffect</code> 呢？</p>
</blockquote>
<p>带着这个问题，我们接着往下看。现在，我们已经拥有了 <code v-pre>收集方法</code> 以及 <code v-pre>触发被保存方法</code> 的能力。那我们又该如何将收集到的方法绑定到对应的对象及其属性上去呢？</p>
<p>我们一起来看下具体的实现：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// miniVue/reactivity/effect.ts</span>

<span class="token keyword">const</span> targetMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">WeakMap</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token doc-comment comment">/**
 * 依赖收集
 * <span class="token keyword">@param</span> <span class="token parameter">target</span>
 * <span class="token keyword">@param</span> <span class="token parameter">type</span>
 * <span class="token keyword">@param</span> <span class="token parameter">key</span>
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">track</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> type<span class="token punctuation">,</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 判断targetMap中是否保存有target对象对应的map</span>
  <span class="token keyword">let</span> depsMap <span class="token operator">=</span> targetMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>
  
  <span class="token comment">// 如果没有，则给该对象新建一个空的map，并绑定到targetMap中</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>depsMap<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    depsMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    targetMap<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> depsMap<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  
  <span class="token comment">// 取出target对应的map中，target属性key所对应的依赖</span>
  <span class="token keyword">let</span> dep <span class="token operator">=</span> depsMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span>
  
  <span class="token comment">// 如果依赖不存在，则给当前的key创建一个空的依赖集合，并保存到target对象对应的map中</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>dep<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    dep <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    depsMap<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> dep<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  
  <span class="token comment">// 添加依赖</span>
  dep<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>activeEffect<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>track</code> 接收三个参数，需要进行 <code v-pre>依赖收集</code> 的对象 <code v-pre>target</code> 、收集类型 <code v-pre>type</code> 以及绑定依赖的 <code v-pre>key</code>。具体流程如注释。</p>
<p><strong>注意最后一步中的 <code v-pre>添加依赖</code> 操作。</strong> 在这一步骤中，将先前保存有 <code v-pre>ReactiveEffect</code> 类的 <code v-pre>this</code> 的全局变量添加到了 <code v-pre>target</code> 对应属性的依赖中。</p>
<blockquote>
<p><strong>解答：</strong> 回到刚才的提问，之所以要将 <code v-pre>ReactiveEffect</code> 的 <code v-pre>this</code> 赋值给全局变量，就是在进行 <code v-pre>依赖收集</code> 的时候可以将其添加到对应属性的依赖中去。所以 <code v-pre>收集依赖</code> 其实就是收集的 <code v-pre>ReactiveEffect</code> 的实例。</p>
</blockquote>
<p>现在，我们已经可以成功收集到依赖了，那我们又该如何 <code v-pre>触发依赖</code> 呢？</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// miniVue/reactivity/effect.ts</span>

<span class="token doc-comment comment">/**
 * 触发依赖
 * <span class="token keyword">@param</span> <span class="token parameter">target</span>
 * <span class="token keyword">@param</span> <span class="token parameter">key</span>
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">trigger</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> depsMap <span class="token operator">=</span> targetMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>
  <span class="token keyword">const</span> dep <span class="token operator">=</span> depsMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span>

  <span class="token comment">// 遍历执行依赖</span>
  <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">const</span> effect <span class="token keyword">of</span> dep<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    effect<span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实依赖的触发很简单，只需要将 <code v-pre>key</code> 中保存的 <code v-pre>ReactiveEffect</code> 实例都取出来，然后执行它们的 <code v-pre>run</code> 方法即可。</p>
<p>现在，我们已经完成了依赖的收集与触发功能，那我们又该在何时 <code v-pre>收集</code>，又在何时 <code v-pre>触发</code> 呢？</p>
<p>答案是：<strong>在使用时 <code v-pre>收集</code>，在改变时 <code v-pre>触发</code>。</strong></p>
<p>回到刚才的测试用例中的 <code v-pre>effect(() =&gt; { dummy = data.num })</code> 这一步，在调用了 <code v-pre>effect</code> 方法后，会通过 <code v-pre>ReactiveEffect</code> 类上提供的 <code v-pre>run</code> 方法执行传入的函数，函数中读取了代理对象上的 <code v-pre>num</code> 属性，因此会触发 <code v-pre>get</code> 方法，在 <code v-pre>get</code> 方法中，我们需要进行 <code v-pre>依赖收集</code> 的操作；之后通过 <code v-pre>data.num = 1</code> 这一步骤，设置 <code v-pre>num</code> 属性的值，继而会触发 <code v-pre>set</code> 方法，在 <code v-pre>set</code> 方法中，我们需要进行 <code v-pre>依赖触发</code> 的操作。</p>
<p>综上所述，我们只需要在 <code v-pre>get</code> 中加入 <code v-pre>track</code> 方法，在 <code v-pre>set</code> 中加入 <code v-pre>trigger</code> 方法即可：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// miniVue/reactivity/baseHandlers.ts</span>

<span class="token comment">// ...省略部分代码</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createGetter</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> receiver<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> res <span class="token operator">=</span>  Reflect<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> receiver<span class="token punctuation">)</span>

    <span class="token comment">// 触发依赖收集</span>
    <span class="token function">track</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> <span class="token string">'get'</span><span class="token punctuation">,</span> key<span class="token punctuation">)</span>

    <span class="token keyword">return</span> res
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createSetter</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">,</span> receiver<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> res <span class="token operator">=</span> Reflect<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">,</span> receiver<span class="token punctuation">)</span>
    <span class="token function">trigger</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">)</span>
    <span class="token keyword">return</span> res
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后，我们将 <code v-pre>依赖收集</code> 与 <code v-pre>依赖触发</code> 的流程补充到先前的流程图中去，来完成的看下响应式的流程吧：</p>
<p><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c23ce7a3145b4e3f8580958b8a82297a~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"></p>
<h1 id="写在最后" tabindex="-1"><a class="header-anchor" href="#写在最后" aria-hidden="true">#</a> 写在最后</h1>
<p>行文至此，我们已经完成了基本的响应式操作，也捋清了其中的基本原理。如果有描述不当之处，还请各位大佬帮忙指正~</p>
</div></template>
