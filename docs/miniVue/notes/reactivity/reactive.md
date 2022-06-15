<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2021-11-14 19:51:15
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-15 18:26:55
 * @Description: effect & reactive & 依赖收集 & 触发依赖
-->

# effect & reactive & 依赖收集 & 触发依赖

::: tip
本篇笔记对应的分支号为: `main分支：e8bb112`
:::

在 Vue3 中，[reactive](https://v3.cn.vuejs.org/api/basic-reactivity.html#reactive) 方法被用于创建一个对象的 **响应式副本**。这里可以拆成两个部分来理解，即 **响应式** 以及 **副本**。

### 副本

我们先来看看 **副本** 这个部分。在实现 `reactive` 方法之前，我们先来写下它的测试用例，看看它需要做些啥：

:::: code-group
::: code-group-item reactive.spec.ts
```ts
// src/reactivity/__tests__/reactive.spec.ts

import { reactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const origin = { num: 0 }
    // 通过 reactive 创建响应式对象
    const reactiveData = reactive(origin)
    // 判断响应式对象与原对象不是同一个对象
    expect(reactiveData).not.toBe(origin)
    // 代理对象中的 num 值应与原对象中的相同
    expect(reactiveData.num).toBe(0)
  })
})
```
:::
::::

通过测试用例我们不难发现，其实 `reactive` 做的事情很简单，就是创建一个对象副本，那这个 **副本** 该怎么创建呢？答案是使用 [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 👇

:::: code-group
::: code-group-item reactive.ts
```ts
// src/reactivity/reactive.ts

export const reactive = (raw) => {
  return new Proxy(raw, {
    // 取值
    get(target, key) {
      const res = Reflect.get(target, key)
      return res
    },
    // 赋值
    set(target, key, value) {
      const res = Reflect.set(target, key, value)
      return res
    }
  })
}
```
:::
::::

### 响应式

现在我们已经可以通过 `reactive` 方法获取目标对象的 **副本** 了，那 **响应式** 部分又该如何实现呢？

所谓 **响应式**， 其实本质上就做了两件事情：

> 1. 在读取对象属性时进行 `依赖收集`
> 2. 在修改对象属性时执行 `依赖触发`

而这部分的逻辑则交由 `effect` 模块来实现。那 `依赖收集` 跟 `依赖触发` 具体是怎样的一个流程呢？请看下图：

![track&trigger](https://user-images.githubusercontent.com/9375823/173803951-43576337-7bba-423d-a985-5c0eb9dfb052.png)

对上图的内容简单描述如下：

> 1. 在读取响应式对象 `Target` 中的属性时，会触发 `get` 方法，并在此时进行 `依赖收集` 操作，所有的依赖会被收集到依赖池 `TargetMap` 中；
> 2. 在设置响应式对象 `Target` 的属性值时，会触发 `set` 方法，并在此时执行 `依赖触发` 操作，会根据对应的 `Target` 以及 `key` 将依赖从依赖池 `TargetMap` 中取出并执行。

现在我们已经知道了 `effect` 模块所要实现的功能，依据上述内容，先来编写下测试用例：

:::: code-group
::: code-group-item effect.spec.ts
```ts {15}
// src/reactivity/__test__/effect.spec.ts

import { reactive } from '../reactive'
import { effect } from '../effect'

describe('effect', () => {
  it('happy path', () => {
    // 创建响应式对象
    const user = reactive({
      age: 10
    })
    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })
    // 传入 effect 的方法会被立即执行一次
    expect(nextAge).toBe(11)
    // 修改响应式对象的属性值
    user.age++
    // 传入 effect 的方法会再次被执行
    expect(nextAge).toBe(12)
  })
})
```
:::
::::

::: warning 第15行代码
这里需要注意的是，传入 `effect` 中的方法会被立即执行一次。
:::
