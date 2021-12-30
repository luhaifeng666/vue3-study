---
title: reactivity的核心流程
---

## 写在开始
在正式开始学习之前，我们先一起来了解一个思想：`TDD`。什么是 `TDD` 呢？我们先来看下它的概念：

```
TDD是测试驱动开发（Test-Driven Development）的英文简称。
它是敏捷开发中的一项核心实践和技术，也是一种设计方法论。
TDD的原理是在开发功能代码之前，先编写单元测试用例代码，测试代码确定需要编写什么产品代码。
TDD虽是敏捷方法的核心实践，但不只适用于XP（Extreme Programming），同样可以适用于其他开发方法和过程。
```

简而言之，就是 `测试驱动开发`，在动手开发之前先写好测试用例，然后再进行开发。<br>
在接下来的学习过程中，`TDD` 的思想将贯穿始终。话不多说，让我们一起进入vue3的源码学习吧~

> **声明：**<br>
> 笔记中的内容来源于 **崔大(wx: cuixr1314)** 的 [mini-vue](https://github.com/cuixiaorui/mini-vue) 教学，目前已经 `4k+`的⭐️了，欢迎大家踊跃star~<br>
>热爱学习的小伙伴们，可以搜索 `催学社` 微信群，里面都是一群热爱学习的小伙伴，学习氛围一级棒！期待你的加入~<br>
> ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fab46bb312db444c8352d44cbe9f4c70~tplv-k3u1fbpfcp-watermark.image?)

## 正文开始

我们知道，不论是在 `vue2` 中，还是在 `vue3` 中， `响应式数据` 一直都是vue的核心概念。这一节，我们也先从 `响应式数据` 开始说起。

### vue2 与 vue3 中对响应式数据处理的区别

熟悉 `vue2` 的小伙伴儿们都知道，在 `vue2` 中，数据的响应式是通过 `Object.defineProperty` 来实现的。针对对象，通过遍历对象的属性，来设置属性对应的 `getter` 以及 `setter` 方法，以达到 `依赖收集` 与 `触发依赖` 的目的；
而针对数组，则是通过重写数组一系列更新元素的方法来实现对数组元素修改的劫持。<br>
但是通过这种方式来实现数据响应式，存在以下几个问题：
```
1. 对象直接新添加新的属性，或者删除已有的属性, 界面不会自动更新；
2. 直接通过替换数组对应下标的元素，或者更新数组的length, 界面也不会自动更新；
3. 如果对象的属性较多，且嵌套层次较深时，需要深度遍历，循环量大，性能损耗较大。
```
针对以上几个问题，`vue3` 中使用了 [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 来代替 `Object.defineProperty`。<br>
针对 `问题1` 和 `问题3`，`Proxy` 代理了整个对象，并且提供了多达13种对对象属性的操作（如属性查找、赋值、枚举、函数调用等），在对象发生变化时，`Proxy` 都可以进行捕获，与 `Object.defineProperty` 不同，无需遍历所有属性；<br>
针对 `问题2`，`Proxy` 对数组的监听相较于 `Object.defineProperty` 性能更优。具体大家可以参考 [这篇文章](https://cloud.tencent.com/developer/news/485729) 。<br>

那在 `vue3` 中具体是如何通过 `Proxy` 的方式实现响应式的呢？

### `reactivity` 第一步：reactive

> **注：** <br>
> 本文以 vue3 中的 `reactive` 为例，如果对 `reactive` 操作尚不熟悉的同学可以看下 [这篇文档](https://v3.cn.vuejs.org/api/basic-reactivity.html)。至于 `ref`，其底层也是 `reactive`, 关于 `ref` 的内容，在完成 `reactive` 所有相关功能的梳理后，后续的文章中会做补充，这里先埋个伏笔~（手动🌺🐔）

还记得开篇时提到的 `TDD` 么？开始之前，我们先从测试用例入手：
```ts
// miniVue/reactivity/__tests__/reactive.spec.ts

import { reactive } from '../reactive'

describe('reactive', () => {
  it ('happy path', () => {
    const original = { foo: 1 }
    // 创建Proxy代理对象
    const observeOriginal = reactive(original)
    // 响应式对象与原对象应该不相等，因为observeOriginal被Proxy包裹
    expect(observeOriginal).not.toBe(original)
    // 取值
    expect(observeOriginal.foo).toBe(1)
  })
})
```
测试用例中， `reactive` 将传入的对象转换成 `Proxy` 代理对象，之后通过代理对象来获取其中的值。既然如此，那我们就从 `reactive` 入手。先来看下 `reactive` 的定义：
```ts
// miniVue/reactivity/reactive.ts

import { mutableHandlers } from './baseHandlers'

export const reactiveMap = new WeakMap()

/**
 * 创建reactive对象
 * @param target
 */
export function reactive (target) {
  return createReactiveObject(target, reactiveMap, mutableHandlers)
}

/**
 * 创建响应式对象
 * @param target
 * @param proxyMap
 * @param baseHandlers
 */
export function createReactiveObject (target, proxyMap, baseHandlers) {
  // 判断proxy是否已经保存过
  if (proxyMap.has(target)) {
    // 如果存在，则返回
    return proxyMap.get(target)
  }

  const proxy = new Proxy(target, baseHandlers)

  // 存储创建好的proxy
  proxyMap.set(target, proxy)
  return proxy
}
```
从上述代码可以看出，`reactive` 中调用了 `createReactiveObject` 方法，既然 `reactive` 方法是用来返回 `Proxy` 对象的，那在 `createReactiveObject` 中又发生了什么呢？我们一起来分析一下：

1. `createReactiveObject` 接收三个参数：需要被代理的对象 `target`, 也就是在 `reactive` 接收的 `target` 参数、用于存储 `Proxy` 对象的 `proxyMap` 以及 `Proxy` 对象的处理器 `baseHandlers`;
2. 先判断在 `proxyMap` 是否已经存在当前对象所对应的 `Proxy` 对象，如果存在，则直接返回, 否则新建一个 `Proxy` 对象，并以当前的 `target` 为key，存储到 `proxyMap`，以便下次取用，并将新建的 `Proxy` 返回。

诶，写到这里，细心的小伙伴儿们就会问了，那 `baseHandlers` 这个处理器具体又干了啥嘞？别急别急，我们现在就一起来看一看。

这里的 `baseHandlers` 实际上是从 `reactive` 中传过来的 `mutableHandlers`, 我们来一起看下它的定义：
```ts
// miniVue/reactivity/baseHandlers.ts

const get = createGetter()
const set = createSetter()

export const mutableHandlers = {
  get,
  set
}

export function createGetter () {
  return function (target, key, receiver) {
    const res =  Reflect.get(target, key, receiver)
    return res
  }
}

export function createSetter () {
  return function (target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver)
    return res
  }
}
```
从上述代码中不难看出，实际上 `mutableHandlers` 就是定义了 `Proxy` 对象的 `get` 和 `set` 方法。

回到测试用例中的 `expect(observeOriginal.foo).toBe(1)` 这个步骤，在获取代理对象的foo属性时，便会触发 `get` 方法，从而返回属性对应的值。同样，当设置代理对象的foo属性时，便会触发 `set` 方法，对属性的值做出改变。

写到这里，我们通过一张流程图，来捋一捋 `reactive` 的流程：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b014fadb17d641048dcd12f01695afaf~tplv-k3u1fbpfcp-watermark.image?)

> 扩展阅读：关于 `Proxy` 中为啥要用到 `Reflect`，有兴趣的小伙伴可以参考下 `张鑫旭` 大佬的这篇文章：[Proxy是代理，Reflect是干嘛用的？](https://www.zhangxinxu.com/wordpress/2021/07/js-proxy-reflect/)

**综上：`reactive` 通过 `createReactiveObject` 方法，返回 `target` 所对应的 `proxy` 对象，并对 `target` 中属性的读取与写入操作做了拦截处理。**

### `reactivity` 第二步：依赖收集 && 触发依赖
现在我们已经知道了如何通过 `Proxy` 拦截对象的属性操作, 接下来我们一起看下如何实现 `依赖收集` 与 `依赖触发`。

老规矩，我们还是先从测试用例入手：
```ts
// miniVue/reactivity/__tests__/effect.spec.ts

import { reactive } from '../reactive'
import { effect } from  '../effect'

describe('effect', () => {
  it ('should observe basic properties', () => {
    let dummy = 0
    // 获取proxy对象
    const data = reactive({ num: 0 })
    // ？
    effect(() => { dummy = data.num })
    expect(dummy).toBe(0)
    // 改变值
    data.num = 1
    expect(dummy).toBe(1)
  })
})
```
测试用例中，在调用了 `reactive` 方法获取到 `Proxy` 对象后，又调用了 `effect` 方法。那这个 `effect` 方法又是干啥的呢？我们先来看下 `effect` 方法的定义：
```ts
// miniVue/reactivity/effect.ts

/**
 * @param fn
 */
export function effect(fn) {
  const reactiveEffect = new ReactiveEffect(fn)
  reactiveEffect.run()
}
```
可以看到，`effect` 接受一个函数作为参数，并且在其内部实例化了一个名为 `ReactiveEffect` 的类，并将接收到的函数传入这个类中，然后执行 `ReactiveEffect` 类上提供的 `run` 方法。那这个 `ReactiveEffect` 类又是何方神圣呢？执行 `run` 又做了什么事情呢？让我们来一探究竟:
```ts
// miniVue/reactivity/effect.ts

let activeEffect = void 0

export class ReactiveEffect {
  // 存放所有依赖
  public deps: any = new Set()

  // 初始化依赖列表
  constructor(fn) {
    if (fn) this.deps.add(fn)
  }

  // 执行收集到的所有依赖
  run () {
    activeEffect = this as any
    this.deps.forEach(dep => dep())
  }
}
```
通过上面的代码我们可以得知，`ReactiveEffect` 类在被实例化时，将接收到的函数存储到自己的 `deps` 属性中，并且在执行它的 `run` 方法时，则是遍历自身的 `deps` 属性，执行其中存储的函数。

由此可知，**借助 `ReactiveEffect` 类所提供的能力，我们可以将方法保存起来，也可以触发已经被保存起来的方法。**

> **提问：** 在调用 `run` 方法时，为什么还要将 `this` 赋值给全局变量 `activeEffect` 呢？

带着这个问题，我们接着往下看。现在，我们已经拥有了 `收集方法` 以及 `触发被保存方法` 的能力。那我们又该如何将收集到的方法绑定到对应的对象及其属性上去呢？

我们一起来看下具体的实现：
```ts
// miniVue/reactivity/effect.ts

const targetMap = new WeakMap()

/**
 * 依赖收集
 * @param target
 * @param type
 * @param key
 */
export function track(target, type, key) {
  // 判断targetMap中是否保存有target对象对应的map
  let depsMap = targetMap.get(target)
  
  // 如果没有，则给该对象新建一个空的map，并绑定到targetMap中
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  
  // 取出target对应的map中，target属性key所对应的依赖
  let dep = depsMap.get(key)
  
  // 如果依赖不存在，则给当前的key创建一个空的依赖集合，并保存到target对象对应的map中
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  
  // 添加依赖
  dep.add(activeEffect)
}
```

`track` 接收三个参数，需要进行 `依赖收集` 的对象 `target` 、收集类型 `type` 以及绑定依赖的 `key`。具体流程如注释。

**注意最后一步中的 `添加依赖` 操作。** 在这一步骤中，将先前保存有 `ReactiveEffect` 类的 `this` 的全局变量添加到了 `target` 对应属性的依赖中。

> **解答：** 回到刚才的提问，之所以要将 `ReactiveEffect` 的 `this` 赋值给全局变量，就是在进行 `依赖收集` 的时候可以将其添加到对应属性的依赖中去。所以 `收集依赖` 其实就是收集的 `ReactiveEffect` 的实例。

现在，我们已经可以成功收集到依赖了，那我们又该如何 `触发依赖` 呢？
```ts
// miniVue/reactivity/effect.ts

/**
 * 触发依赖
 * @param target
 * @param key
 */
export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)

  // 遍历执行依赖
  for(const effect of dep) {
    effect.run()
  }
}
```
其实依赖的触发很简单，只需要将 `key` 中保存的 `ReactiveEffect` 实例都取出来，然后执行它们的 `run` 方法即可。

现在，我们已经完成了依赖的收集与触发功能，那我们又该在何时 `收集`，又在何时 `触发` 呢？

答案是：**在使用时 `收集`，在改变时 `触发`。**

回到刚才的测试用例中的 `effect(() => { dummy = data.num })` 这一步，在调用了 `effect` 方法后，会通过 `ReactiveEffect` 类上提供的 `run` 方法执行传入的函数，函数中读取了代理对象上的 `num` 属性，因此会触发 `get` 方法，在 `get` 方法中，我们需要进行 `依赖收集` 的操作；之后通过 `data.num = 1` 这一步骤，设置 `num` 属性的值，继而会触发 `set` 方法，在 `set` 方法中，我们需要进行 `依赖触发` 的操作。

综上所述，我们只需要在 `get` 中加入 `track` 方法，在 `set` 中加入 `trigger` 方法即可：
```ts
// miniVue/reactivity/baseHandlers.ts

// ...省略部分代码

export function createGetter () {
  return function (target, key, receiver) {
    const res =  Reflect.get(target, key, receiver)

    // 触发依赖收集
    track(target, 'get', key)

    return res
  }
}

export function createSetter () {
  return function (target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver)
    trigger(target, key)
    return res
  }
}
```

最后，我们将 `依赖收集` 与 `依赖触发` 的流程补充到先前的流程图中去，来完成的看下响应式的流程吧：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c23ce7a3145b4e3f8580958b8a82297a~tplv-k3u1fbpfcp-watermark.image?)

# 写在最后

行文至此，我们已经完成了基本的响应式操作，也捋清了其中的基本原理。如果有描述不当之处，还请各位大佬帮忙指正~
