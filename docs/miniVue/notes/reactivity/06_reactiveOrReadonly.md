<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-06-26 14:58:24
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-26 15:50:46
 * @Description: 
-->
# isReactive & isReadOnly

::: tip
本篇笔记对应的分支号为: `main分支：abec34d`
:::

到目前为止，我们已经初步实现了 `reactive` 以及 `readonly` 的基本功能。现在，我们需要添加两个方法用于判断某个对象是否是 `reactive` 对象或者 `readonly` 对象。

## 实现 isReactive

在实现之前，我们先来补充下 `reactive` 的测试用例：

:::: code-group
::: code-group-item reactive.spec.ts

```ts{3,15-16}
// src/reactivity/__tests__/reactive.spec.ts

import { reactive, isReactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const origin = { num: 0 }
    // 通过 reactive 创建响应式对象
    const reactiveData = reactive(origin)
    // 判断响应式对象与原对象不是同一个对象
    expect(reactiveData).not.toBe(origin)
    // 代理对象中的 num 值应与原对象中的相同
    expect(reactiveData.num).toBe(0)
    // 判断是否是 reactive 对象
    expect(isReactive(origin)).toBe(false)
    expect(isReactive(reactiveData)).toBe(true)
  })
})
```

:::
::::

根据测试用例，`isReactive` 方法接受一个对象作为入参，返回值为布尔值，用于判断传入的对象是否是 `reactive` 对象。那我们通过什么可以判断当前对象是否是 `reactive` 对象呢？

试想一下，如果传入 `isReactive` 的是 `reactive` 对象，那么它必然是个 `Proxy` 对象。还记得在上一篇 `readonly` 功能的实现中，我们给 `createGetter` 方法传入了一个 `isReadonly` 标记，用于判断是否是 `readonly` 对象么。**如果当前对象是个 `Proxy` 对象，并且 `isReadonly === false`**， 那么不就说明当前对象是个 `reactive` 对象了么！

顺着这个思路，要想触发 `get` 方法，我们可以定义一个静态标记 `__v_isReactive` 用于判断是否是 `reactive` 对象。当我们尝试获取传入对象的 `__v_isReactive` 属性时，就会触发 `get` 方法，此时，我们只要返回 `!isReadOnly` 即可：

:::: code-group
::: code-group-item reactive.ts

```ts
// src/reactivity/reactive.ts

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

// 判断是否是 reactive 对象
export const isReactive = value => value[ReactiveFlags.IS_REACTIVE]
```

:::

::: code-group-item baseHandlers.ts

```ts {13-15}
// src/reactivity/baseHandlers.ts

import { ReactiveFlags } from './reactive'

/**
 * 用于生成 get 方法
 * @param isReadonly 是否是 readonly 对象
 * @returns 
 */
function createGetter(isReadonly = false) {
  return function(target, key) {
    // 判断是否是 reactive 对象
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }
    const res = Reflect.get(target, key)
    // 收集依赖
    !isReadonly && track(target, key)
    return res
  }
}
```

:::
::::

现在，我们回过头来看下测试用例的运行结果，当我们传入的对象为普通对象时，测试用例报错，原因如下：

![isReactive](https://user-images.githubusercontent.com/9375823/175804230-c6534c26-1e43-449e-bdd6-0e7f12574d9d.png)

预期返回结果是 `false`，结果返回的却是 `undefined`。这是为什么呢？

那是因为普通对象并不是 `Proxy` 对象，直接访问 `__v_isReactive` 属性时，并不会触发 `get` 方法，而普通对象上又不存在 `__v_isReactive` 标记，因此测试用例不会通过。而实际上普通对象也的确不是 `reactive` 对象，因此，我们需要对 `isReactive` 方法进行改造，直接返回 `!!value[ReactiveFlags.IS_REACTIVE]` 即可：

:::: code-group
::: code-group-item reactive.ts

```ts
export const isReactive = value => !!value[ReactiveFlags.IS_REACTIVE]
```

:::
::::

## 实现 isReadOnly

`isReadOnly` 的判断方式与 `isReactive` 有异曲同工之妙，皆是通过 `isReadOnly` 来进行判断的，只不过不用取反罢了。

我们先来补充下 `isReadonly` 的测试用例：

:::: code-group
::: code-group-item readonly.spec.ts

```ts{9-10}
// src/reactivity/__tests__/readonly.spec.ts

it('happy path', () => {
    const original = { foo: 1, bar: { bar: 2 }}
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
    // 判断是否是 readonly 对象
    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(wrapped)).toBe(true)
  })
```

:::
::::

因此，我们可以参照 `isReactive` 的实现方式，定义一个名为 `__v_isReadonly` 的静态标记，并在 `get` 方法中进行判断即可：

:::: code-group
::: code-group-item reactive.ts

```ts
// src/reactivity/reactive.ts

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

// 判断是否是 reactive 对象
export const isReadonly = value => !!value[ReactiveFlags.IS_READONLY]

// 判断是否是 readonly 对象
export const isReadonly = value => !!value[ReactiveFlags.IS_READONLY]
```

:::

::: code-group-item baseHandlers.ts

```ts {15-18}
// src/reactivity/baseHandlers.ts

import { ReactiveFlags } from './reactive'

/**
 * 用于生成 get 方法
 * @param isReadonly 是否是 readonly 对象
 * @returns 
 */
function createGetter(isReadonly = false) {
  return function(target, key) {
    // 判断是否是 reactive 对象
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      // 判断是否是 readonly 对象
      return isReadonly
    }
    const res = Reflect.get(target, key)
    // 收集依赖
    !isReadonly && track(target, key)
    return res
  }
}
```

:::
::::

至此，我们就实现了 `isReactive` 以及 `isReadOnly` 功能。
