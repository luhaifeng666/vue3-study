<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-06-29 10:41:10
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-29 11:21:03
 * @Description: 
-->
# reactive & readonly 对象嵌套功能

::: tip
本篇笔记对应的分支号为: `main分支： 26af116`
:::

截止目前为止，我们已经实现了 `reactive` 以及 `readonly` 功能。我们知道，在 `Vue3` 中，响应式对象内部嵌套的对象也应该是响应式的，那我们目前实现的功能是否符合这个特点呢？我们来一起验证下。

## nested reactive

先来看下 `reactive`，我们先来实现下它的测试用例：

:::: code-group
::: code-group-item reactive.spec.ts

```ts
// src/reactivity/__tests__/reactive.spec.ts

 it('nested reactive', () => {
  const original = {
    nested: {
      foo: 1
    },
    array: [{ bar: 2 }]
  }
  const observed = reactive(original)
  expect(isReactive(observed.nested)).toBe(true)
  expect(isReactive(observed.array)).toBe(true)
  expect(isReactive(observed.array[0])).toBe(true)
})
```

:::
::::

![nested_reactive](https://user-images.githubusercontent.com/9375823/176340959-9a38d9ef-f5b1-4504-b809-91d2c0cc741d.png)

我们可以看到，测试没有通过。这是为什么呢？

那是因为我们在获取对象属性时， `createGetter` 内部直接返回了 `Reflect.get(target, key)` ，但是没有判断该属性的值是否是个对象，也没有对其做相应的响应式处理。

因此，我们需要判断属性值的类型，如果是对象，则需要对其做响应式处理。我们先来定义一个 `isObject` 方法用于判断传入的值是否是对象类型，之后在 `createGetter` 中使用：

:::: code-group
::: code-group-item index.ts

```ts
// src/reactivity/shared/index.ts

export function isObject(val) {
  return val !== null && typeof(val) === 'object'
}
```

:::

::: code-group-item baseHandlers.ts

```ts {3-4,20}
// src/reactivity/baseHandlers.ts

import { ReactiveFlags, reactive } from './reactive'
import { isObject } from '../shared'

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

    if (isObject(res)) {
      return reactive(res)
    }
    // 收集依赖
    !isReadonly && track(target, key)
    return res
  }
}
```

:::
::::

这样一来，就符合了 **响应式对象内部嵌套的对象也是响应式的** 特征。

## nested readonly

同理，我们再来看一看 `readonly` 的实现是否符合预期：

:::: code-group
::: code-group-item readonly.ts

```ts{10-11}
// src/reactivity/__tests__/readonly.spec.ts

it('happy path', () => {
  const original = { foo: 1, bar: { baz: 2 }}
  const wrapped = readonly(original)
  expect(wrapped).not.toBe(original)
  expect(wrapped.foo).toBe(1)
  // 判断是否是 readonly 对象
  expect(isReadonly(original)).toBe(false)
  expect(isReadonly(original.bar)).toBe(false)
  expect(isReadonly(wrapped.bar)).toBe(true)
  expect(isReadonly(wrapped)).toBe(true)
})
```

:::
::::

![nested_readonly](https://user-images.githubusercontent.com/9375823/176342418-01bf7be1-ca54-449a-804d-96cd219d91c1.png)

哦豁，梅开二度！

<div align="center">

<img src="https://user-images.githubusercontent.com/9375823/176342580-ecc78418-3c7f-462f-86f0-418349cb9e87.png" />

</div>

其实道理是一样的，依旧是在 `createGetter` 时没有判断值类型。因此，我们只需要在刚才进行对象类型判断之处再加上 `isReadonly` 的判断即可。如果 `isReadonly === true` 且当前属性的值是对象类型，则返回 `readonly(res)`:

:::: code-group
::: code-group-item baseHandlers.ts

```ts{13}
// src/reactivity/baseHandlers.ts

/**
 * 用于生成 get 方法
 * @param isReadonly 是否是 readonly 对象
 * @returns 
 */
function createGetter(isReadonly = false) {
  return function(target, key) {
    // 省略一大波代码
    
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
  }
}
```

:::
::::
