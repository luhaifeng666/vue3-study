<template><div><!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2021-11-14 19:51:15
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-15 18:26:55
 * @Description: effect & reactive & 依赖收集 & 触发依赖
-->
<h1 id="effect-reactive-依赖收集-触发依赖" tabindex="-1"><a class="header-anchor" href="#effect-reactive-依赖收集-触发依赖" aria-hidden="true">#</a> effect &amp; reactive &amp; 依赖收集 &amp; 触发依赖</h1>
<div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>本篇笔记对应的分支号为: <code v-pre>main分支：e8bb112</code></p>
</div>
<p>在 Vue3 中，<a href="https://v3.cn.vuejs.org/api/basic-reactivity.html#reactive" target="_blank" rel="noopener noreferrer">reactive<ExternalLinkIcon/></a> 方法被用于创建一个对象的 <strong>响应式副本</strong>。这里可以拆成两个部分来理解，即 <strong>响应式</strong> 以及 <strong>副本</strong>。</p>
<h3 id="副本" tabindex="-1"><a class="header-anchor" href="#副本" aria-hidden="true">#</a> 副本</h3>
<p>我们先来看看 <strong>副本</strong> 这个部分。在实现 <code v-pre>reactive</code> 方法之前，我们先来写下它的测试用例，看看它需要做些啥：</p>
<CodeGroup>
<CodeGroupItem title="reactive.spec.ts">
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// src/reactivity/__tests__/reactive.spec.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> reactive <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../reactive'</span>

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></CodeGroupItem>
</CodeGroup>
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
<h3 id="响应式" tabindex="-1"><a class="header-anchor" href="#响应式" aria-hidden="true">#</a> 响应式</h3>
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
<li>在读取响应式对象 <code v-pre>Target</code> 中的属性时，会触发 <code v-pre>get</code> 方法，并在此时进行 <code v-pre>依赖收集</code> 操作，所有的依赖会被收集到依赖池 <code v-pre>TargetMap</code> 中；</li>
<li>在设置响应式对象 <code v-pre>Target</code> 的属性值时，会触发 <code v-pre>set</code> 方法，并在此时执行 <code v-pre>依赖触发</code> 操作，会根据对应的 <code v-pre>Target</code> 以及 <code v-pre>key</code> 将依赖从依赖池 <code v-pre>TargetMap</code> 中取出并执行。</li>
</ol>
</blockquote>
<p>现在我们已经知道了 <code v-pre>effect</code> 模块所要实现的功能，依据上述内容，先来编写下测试用例：</p>
<CodeGroup>
<CodeGroupItem title="effect.spec.ts">
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// src/reactivity/__test__/effect.spec.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> reactive <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../reactive'</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> effect <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../effect'</span>

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
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></CodeGroupItem>
</CodeGroup>
<div class="custom-container warning"><p class="custom-container-title">第15行代码</p>
<p>这里需要注意的是，传入 <code v-pre>effect</code> 中的方法会被立即执行一次。</p>
</div>
</div></template>
