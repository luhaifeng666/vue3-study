<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-06-29 21:07:32
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-29 21:14:02
 * @Description: 
-->
# isProxy

::: tip
本篇笔记对应的分支号为: `main分支： 618f052`
:::

我们还是先来看下官方的描述：

:::tip 概念
检查对象是否是由 reactive 或 readonly 创建的 proxy。
:::

其实这个功能非常简单，要想判断一个对象是否是 `Proxy` 对象，只需要判断它是否是 `reactive` 对象或者 `readonly` 对象即可。

还记得我们之前用于判断 `reactive` 以及 `readonly` 时所定义的 `isReactive` 以及 `isReadonly` 方法么？在这里我们直接使用就行了。

老规矩，还是先奉上相关的测试用例：

:::: code-group
::: code-group-item reactive.spec.ts

```ts{15}
// src/reactivity/__tests__/reactive.spec.ts

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
  // 判断是否是 Proxy 对象
  expect(isProxy(reactiveData)).toBe(true)
})
```

:::

::: code-group-item readonly.spec.ts

```ts{14}
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
  // 判断是否是 Proxy 对象
  expect(isProxy(wrapped)).toBe(true)
})
```

:::

::::

接下来，我们需要去定义下 `isProxy` 方法：

:::: code-group
::: code-group-item reactive.ts

```ts
// src/reactivity/reactive.ts

// 判断是否是 Proxy 对象
export const isProxy = value => isReactive(value) || isReadonly(value)
```

:::
::::

至此，`isProxy` 功能就已经实现完成啦~（真的好简单）。
