<template><div><!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2021-11-14 19:51:15
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-21 23:15:20
 * @Description: effect & reactive & 依赖收集 & 触发依赖
-->
<h1 id="effect-reactive-依赖收集-触发依赖" tabindex="-1"><a class="header-anchor" href="#effect-reactive-依赖收集-触发依赖" aria-hidden="true">#</a> effect &amp; reactive &amp; 依赖收集 &amp; 触发依赖</h1>
<div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>本篇笔记对应的分支号为: <code v-pre>main分支：e8bb112</code></p>
</div>
<p>在 Vue3 中，<a href="https://v3.cn.vuejs.org/api/basic-reactivity.html#reactive" target="_blank" rel="noopener noreferrer">reactive<ExternalLinkIcon/></a> 方法被用于创建一个对象的 <strong>响应式副本</strong>。这里可以拆成两个部分来理解，即 <strong>响应式</strong> 以及 <strong>副本</strong>。</p>
<h2 id="副本" tabindex="-1"><a class="header-anchor" href="#副本" aria-hidden="true">#</a> 副本</h2>
<p>我们先来看看 <strong>副本</strong> 这个部分。在实现 <code v-pre>reactive</code> 方法之前，我们先来写下它的测试用例，看看它需要做些啥：</p>
<CodeGroup>
<CodeGroupItem title="reactive.spec.ts">
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// src/reactivity/__tests__/reactive.spec.ts</span>

<span class="token function">describe</span><span class="token punctuation">(</span><span class="token string">'reactive'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token function">it</span><span class="token punctuation">(</span><span class="token string">'happy path'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> origin <span class="token operator">=</span> <span class="token punctuation">{</span> num<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>
    <span class="token comment">// 通过 reactive 创建响应式对象</span>
    <span class="token keyword">const</span> reactiveData <span class="token operator">=</span> <span class="token function">reactive</span><span class="token punctuation">(</span>origin<span class="token punctuation">)</span>
    <span class="token comment">// 判断响应式对象与原对象不是同一个对象</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>reactiveData<span class="token punctuation">)</span><span class="token punctuation">.</span>not<span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span>origin<span class="token punctuation">)</span>
    <span class="token comment">// 代理对象中的 num 值应与原对象中的相同</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>reactiveData<span class="token punctuation">.</span>num<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></CodeGroupItem>
</CodeGroup>
<h3 id="实现-reactive" tabindex="-1"><a class="header-anchor" href="#实现-reactive" aria-hidden="true">#</a> 实现 <code v-pre>reactive</code></h3>
<p>通过测试用例我们不难发现，其实 <code v-pre>reactive</code> 做的事情很简单，就是创建一个对象副本，那这个 <strong>副本</strong> 该怎么创建呢？答案是使用 <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy" target="_blank" rel="noopener noreferrer">Proxy<ExternalLinkIcon/></a> 👇</p>
<CodeGroup>
<CodeGroupItem title="reactive.ts">
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// src/reactivity/reactive.ts</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">reactive</span> <span class="token operator">=</span> <span class="token punctuation">(</span>raw<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Proxy</span><span class="token punctuation">(</span>raw<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token comment">// 取值</span>
    <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> res <span class="token operator">=</span> Reflect<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">)</span>
      <span class="token keyword">return</span> res
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// 赋值</span>
    <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> res <span class="token operator">=</span> Reflect<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">)</span>
      <span class="token keyword">return</span> res
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></CodeGroupItem>
</CodeGroup>
<h2 id="响应式" tabindex="-1"><a class="header-anchor" href="#响应式" aria-hidden="true">#</a> 响应式</h2>
<p>现在我们已经可以通过 <code v-pre>reactive</code> 方法获取目标对象的 <strong>副本</strong> 了，那 <strong>响应式</strong> 部分又该如何实现呢？</p>
<p>所谓 <strong>响应式</strong>， 其实本质上就做了两件事情：</p>
<blockquote>
<ol>
<li>在读取对象属性时进行 <code v-pre>依赖收集</code></li>
<li>在修改对象属性时执行 <code v-pre>依赖触发</code></li>
</ol>
</blockquote>
<p>而这部分的逻辑则交由 <code v-pre>effect</code> 模块来实现。那 <code v-pre>依赖收集</code> 跟 <code v-pre>依赖触发</code> 具体是怎样的一个流程呢？请看下图：</p>
<p><img src="https://user-images.githubusercontent.com/9375823/173803951-43576337-7bba-423d-a985-5c0eb9dfb052.png" alt="track&amp;trigger"></p>
<p>对上图的内容简单描述如下：</p>
<blockquote>
<ol>
<li>在读取响应式对象 <code v-pre>Target</code> 中的属性时进行 <code v-pre>依赖收集</code> 操作，所有的依赖会被收集到依赖池 <code v-pre>TargetMap</code> 中；</li>
<li>在设置响应式对象 <code v-pre>Target</code> 的属性值时执行 <code v-pre>依赖触发</code> 操作，会根据对应的 <code v-pre>Target</code> 以及 <code v-pre>key</code> 将依赖从依赖池 <code v-pre>TargetMap</code> 中取出并执行。</li>
</ol>
</blockquote>
<p>现在我们已经知道了 <code v-pre>effect</code> 模块所要实现的功能，依据上述内容，先来编写下测试用例：</p>
<CodeGroup>
<CodeGroupItem title="effect.spec.ts">
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// src/reactivity/__test__/effect.spec.ts</span>

<span class="token function">describe</span><span class="token punctuation">(</span><span class="token string">'effect'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token function">it</span><span class="token punctuation">(</span><span class="token string">'happy path'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token comment">// 创建响应式对象</span>
    <span class="token keyword">const</span> user <span class="token operator">=</span> <span class="token function">reactive</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      age<span class="token operator">:</span> <span class="token number">10</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token keyword">let</span> nextAge
    <span class="token function">effect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      nextAge <span class="token operator">=</span> user<span class="token punctuation">.</span>age <span class="token operator">+</span> <span class="token number">1</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token comment">// 传入 effect 的方法会被立即执行一次</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>nextAge<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span>
    <span class="token comment">// 修改响应式对象的属性值</span>
    user<span class="token punctuation">.</span>age<span class="token operator">++</span>
    <span class="token comment">// 传入 effect 的方法会再次被执行</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>nextAge<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token number">12</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></CodeGroupItem>
</CodeGroup>
<h3 id="实现-effect" tabindex="-1"><a class="header-anchor" href="#实现-effect" aria-hidden="true">#</a> 实现 <code v-pre>effect</code></h3>
<p>接下来我们需要实现 <code v-pre>effect</code> 模块的功能。</p>
<p>根据上面的描述，<code v-pre>effect</code> 接受一个函数作为参数，既如此先定义一下 <code v-pre>effect</code> 方法：</p>
<CodeGroup>
<CodeGroupItem title="effect.ts">
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// src/reactivity/effect.ts</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">effect</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></CodeGroupItem>
</CodeGroup>
<p>接下来，我们需要定义依赖池 <code v-pre>targetMap</code> 用于存放依赖。依赖池中存放的是响应式对象 <code v-pre>target</code> 所对应的依赖，需要使用对象类型作 key 的话，那么使用 <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map" target="_blank" rel="noopener noreferrer">Map<ExternalLinkIcon/></a> 自然再合适不过啦：</p>
<CodeGroup>
<CodeGroupItem title="effect.ts">
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// src/reactivity/effect.ts</span>

<span class="token keyword">const</span> targetMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">effect</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></CodeGroupItem>
</CodeGroup>
<p>好了，现在存放依赖的地方有了，那么我们就开始收集它们吧~</p>
<p>上文中我们提到，<code v-pre>收集依赖</code> 的操作是在读取响应式对象 <code v-pre>target</code> 中的属性时进行的。还记得 <code v-pre>target</code> 对象是通过 <code v-pre>Proxy</code> 创建出来的么？在读取 <code v-pre>target</code> 的属性时，必然会触发 <code v-pre>get</code> 方法，那么 <code v-pre>收集依赖</code> 的操作也应该在 <code v-pre>get</code> 方法中进行。</p>
<p>我们先来定义一个方法 <code v-pre>tarck</code> 用于依赖收集，并在 <code v-pre>reactive.ts</code> 中引入它，以便在 <code v-pre>get</code> 方法中进行调用：</p>
<CodeGroup>
<CodeGroupItem title="effect.ts">
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// src/reactivity/effect.ts</span>

<span class="token keyword">const</span> targetMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token doc-comment comment">/**
 * 收集依赖
 * <span class="token keyword">@param</span> <span class="token parameter">target</span> 需要收集依赖的对象
 * <span class="token keyword">@param</span> <span class="token parameter">key</span> 收集该key所对应的依赖
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">track</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">effect</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></CodeGroupItem>
<CodeGroupItem title="reactive.ts">
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code>
<span class="token comment">// src/reactivity/reactive.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> track <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./effect'</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">reactive</span> <span class="token operator">=</span> <span class="token punctuation">(</span>raw<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Proxy</span><span class="token punctuation">(</span>raw<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token comment">// 取值</span>
    <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> res <span class="token operator">=</span> Reflect<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">)</span>
      <span class="token comment">// 收集依赖</span>
      <span class="token function">track</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">)</span>
      <span class="token keyword">return</span> res
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// 赋值</span>
    <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> res <span class="token operator">=</span> Reflect<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">)</span>
      <span class="token keyword">return</span> res
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></CodeGroupItem>
</CodeGroup>
<p>接下来，我们需要实现 <code v-pre>track</code> 这部分的功能。在动手实现之前，我们先来捋一捋 <code v-pre>track</code> 需要做哪些事情:</p>
<blockquote>
<ol>
<li>由于在初始化时依赖池是空的（也为了避免覆盖），所以在存入 <code v-pre>targetMap</code> 依赖池之前，需要先判断依赖池中是否已经存在 <code v-pre>target</code> 所对应的依赖容器 <code v-pre>depsMap</code>：
<ul>
<li>如果存在，则取出 <code v-pre>depsMap</code>;</li>
<li>否则新建一个 <code v-pre>depsMap</code>, 并将其存入到依赖池 <code v-pre>targetMap</code> 中;</li>
</ul>
</li>
<li>从依赖容器 <code v-pre>depsMap</code> 中取出响应式对象 <code v-pre>target</code> 对应属性的依赖 <code v-pre>deps</code>，由 <code v-pre>步骤1</code> 可知，<code v-pre>depsMap</code> 可能是空的，因此也需要对 <code v-pre>deps</code> 进行判空处理：
<ul>
<li>如果存在，则取出，并将依赖存入</li>
<li>如果不存在，则新建一个 <code v-pre>deps</code>，将依赖存入其中，并将 <code v-pre>deps</code> 存入对应属性的依赖容器 <code v-pre>depsMap</code> 中。为了避免重复收集依赖，此处使用 <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set" target="_blank" rel="noopener noreferrer">Set<ExternalLinkIcon/></a> 进行存储。</li>
</ul>
</li>
</ol>
</blockquote>
<p>为了方便理解，我们来一起看下流程图:</p>
<p><img src="https://user-images.githubusercontent.com/9375823/174035124-13a100ba-3e6a-4da0-a9f9-ff74acef6942.png" alt="tarck"></p>
<p>代码实现如下：</p>
<CodeGroup>
<CodeGroupItem title="effect.ts">
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// src/reactivity/effect.ts</span>

<span class="token keyword">const</span> targetMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token doc-comment comment">/**
 * 收集依赖
 * <span class="token keyword">@param</span> <span class="token parameter">target</span> 需要收集依赖的对象
 * <span class="token keyword">@param</span> <span class="token parameter">key</span> 收集该key所对应的依赖
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">track</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 查找该对象对应的依赖池</span>
  <span class="token keyword">let</span> depsMap <span class="token operator">=</span> targetMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>
  <span class="token comment">// 如果没有（首次初始化时），则创建新的依赖池</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>depsMap<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    depsMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    targetMap<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> depsMap<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 从获取到的依赖池中获取该key所对应的依赖列表</span>
  <span class="token keyword">let</span> deps <span class="token operator">=</span> depsMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span>
  <span class="token comment">// 如果没有，则新建一个该key对应的列表</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>deps<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    deps <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    depsMap<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> deps<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// TODO 将依赖对象保存到列表中</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">effect</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></CodeGroupItem>
</CodeGroup>
<p>好，代码写到这里的时候，我们遇到了一个</p>
<div class="custom-container warning"><p class="custom-container-title">问题：</p>
<p><strong>需要被收集的依赖在 <code v-pre>effect</code> 方法中，在 <code v-pre>tarck</code> 里要怎么获取到这个依赖呢？</strong></p>
</div>
<p>针对这个问题，我们可以通过定义一个用于存储依赖的全局变量 <code v-pre>activeEffect</code> 来解决解决这个问题。那我们直接把依赖塞到 <code v-pre>activeEffect</code> 中就完事儿了么？当然。。。。</p>
<p><img src="https://user-images.githubusercontent.com/9375823/174023015-d484f98f-45e1-4a1e-a894-8333ce565729.png" alt="达咩"></p>
<p>不是！如果只单单为了实现这个功能，无可厚非，但是后续我们还有其他操作（为了代码的健壮性，可读性， 可扩展性），这里我们定义 <code v-pre>ReactiveEffect</code> 类将依赖收集起来，之后将该类的实例赋值给 <code v-pre>activeEffect</code> 即可：</p>
<CodeGroup>
<CodeGroupItem title="effect.ts">
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// src/reactivity/effect.ts</span>

<span class="token keyword">let</span> activeEffect

<span class="token keyword">class</span> <span class="token class-name">ReactiveEffect</span> <span class="token punctuation">{</span>
  <span class="token keyword">private</span> _fn<span class="token operator">:</span> <span class="token builtin">any</span>
  
  <span class="token function">constructor</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>_fn <span class="token operator">=</span> fn
  <span class="token punctuation">}</span>

  <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    activeEffect <span class="token operator">=</span> <span class="token keyword">this</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_fn</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> targetMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token doc-comment comment">/**
 * 收集依赖
 * <span class="token keyword">@param</span> <span class="token parameter">target</span> 需要收集依赖的对象
 * <span class="token keyword">@param</span> <span class="token parameter">key</span> 收集该key所对应的依赖
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">track</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 查找该对象对应的依赖池</span>
  <span class="token keyword">let</span> depsMap <span class="token operator">=</span> targetMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>
  <span class="token comment">// 如果没有（首次初始化时），则创建新的依赖池</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>depsMap<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    depsMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    targetMap<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> depsMap<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 从获取到的依赖池中获取该key所对应的依赖列表</span>
  <span class="token keyword">let</span> deps <span class="token operator">=</span> depsMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span>
  <span class="token comment">// 如果没有，则新建一个该key对应的列表</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>deps<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    deps <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    depsMap<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> deps<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 将依赖对象保存到列表中</span>
  deps<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>activeEffect<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">effect</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 实例化 ReactiveEffect 类，并将依赖传入</span>
  <span class="token keyword">const</span> _effect <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ReactiveEffect</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span>
  
  _effect<span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></CodeGroupItem>
</CodeGroup>
<div class="custom-container warning"><p class="custom-container-title">注意</p>
<p>这里需要注意的是，传入 <code v-pre>effect</code> 中的方法会被立即执行一次（可以回看上述测试用例中的 <code v-pre>第14行代码</code>）。所以 <code v-pre>ReactiveEffect</code> 暴露的 <code v-pre>run</code> 方法中除了要将依赖存入全局变量 <code v-pre>activeEffect</code> 中，还得将传入的依赖返回出来用以执行。</p>
</div>
<p>到目前为止，<code v-pre>依赖收集</code> 的功能就已经实现了。接下来便轮到 <code v-pre>依赖触发</code> 了。相较于 <code v-pre>依赖收集</code>，<code v-pre>依赖触发</code> 就简单了，只需要根据传入的 <code v-pre>target</code> 以及对应的属性 <code v-pre>key</code>，将依赖项取出执行便可。</p>
<p>这里我们在 <code v-pre>effect.ts</code> 中定义一个 <code v-pre>trigger</code> 方法用于触发依赖，之后在 <code v-pre>reactive.ts</code> 中引入。由于触发依赖发生在修改响应式对象 <code v-pre>target</code> 的属性阶段，所以需要放到 <code v-pre>set</code> 中执行:</p>
<CodeGroup>
<CodeGroupItem title="effect.ts">
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// src/reactivity/effect.ts</span>

<span class="token doc-comment comment">/**
 * 触发依赖
 * <span class="token keyword">@param</span> <span class="token parameter">target</span> 触发依赖的对象
 * <span class="token keyword">@param</span> <span class="token parameter">key</span> 触发该key对应的依赖
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">trigger</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 根据对象与key获取到所有的依赖，并执行</span>
  <span class="token keyword">const</span> depsMap <span class="token operator">=</span> targetMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>
  <span class="token keyword">const</span> deps <span class="token operator">=</span> depsMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span>
  <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">const</span> dep <span class="token keyword">of</span> deps<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    dep<span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></CodeGroupItem>
<CodeGroupItem title="reactive.ts">
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// src/reactivity/reactive.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> track<span class="token punctuation">,</span> trigger <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./effect'</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">reactive</span> <span class="token operator">=</span> <span class="token punctuation">(</span>raw<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Proxy</span><span class="token punctuation">(</span>raw<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token comment">// 取值</span>
    <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> res <span class="token operator">=</span> Reflect<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">)</span>
      <span class="token comment">// 收集依赖</span>
      <span class="token function">track</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">)</span>
      <span class="token keyword">return</span> res
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// 赋值</span>
    <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> res <span class="token operator">=</span> Reflect<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">)</span>
      <span class="token comment">// 触发依赖</span>
      <span class="token function">trigger</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">)</span>
      <span class="token keyword">return</span> res
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></CodeGroupItem>
</CodeGroup>
<p>至此，<code v-pre>依赖收集</code> &amp; <code v-pre>触发依赖</code> 的功能就完成啦~</p>
</div></template>
