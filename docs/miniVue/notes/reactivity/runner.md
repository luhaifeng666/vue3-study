<!--
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2022-06-17 09:29:23
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-21 15:41:01
 * @Description: 
-->
# runner

::: tip
本篇笔记对应的分支号为: `main分支：8fcd786`
:::

在动手实现之前，我们需要先弄清楚两个问题：`runner` 是什么 以及 `runner` 实现了什么功能。

## `runner` 是什么 🤔

还记得上一节在实现 `依赖收集` 以及 `依赖触发` 时的 `effect` 方法么?

> **`runner` 就是 `effect` 的返回的一个 `函数`**。

## `runner` 实现了什么功能 🤔

`runner` 主要做了两件事情：

> 1. 执行 `runner` 时，会再次执行传入 `effect` 中的方法，我们暂且叫它 `fn`；
> 2. `runner` 会返回 `fn` 执行后的结果。

## 实现 `runner`

依据上面的描述，我们先来编写 `runner` 的测试用例：

:::: code-group
:::code-group-item effect.spec.ts

```ts
// src/reactivity/__tests__/effect.spec.ts

it('renturn a runner when call effect', () => {
  let foo = 10
  const runner = effect(() => {
    foo++
    return 'foo'
  })
  // 传入 effect 的方法 fn 会被立即执行一次，所以foo = 11
  expect(foo).toBe(11)
  const res = runner()
  // 执行 effect 返回的 runner 函数后，fn 会再次执行，所以foo = 12
  expect(foo).toBe(12)
  // runner 会返回 fn 的执行结果，所以 res = 'foo'
  expect(res).toBe('foo')
})
```

:::
::::

接下来，我们便可以根据测试用例来对 `effect` 方法进行改造。我们先来看下现在的 `effect` 方法定义：

:::: code-group
:::code-group-item effect.ts

```ts
// src/reactivity/effect.ts

export function effect(fn) {
  // 实例化 ReactiveEffect 类，并将依赖传入
  const _effect = new ReactiveEffect(fn)
  
  _effect.run()
}
```

:::
::::

现在，`effect` 需要返回一个 `runner` 函数，并且在执行 `runner` 函数时会再次执行传入 `effect` 的方法 `fn`，而现在 `fn` 的执行是通过 `ReactiveEffect` 暴露出来的 `run` 方法实现的。所以，我们只需要将 `ReactiveEffect` 实例上的 `run` 暴露出去即可：

::: warning 注意
由于 `fn` 被绑定在 `ReactiveEffect` 的实例属性 `_fn` 上，且 `run` 通过 `this._fn()` 的方式来调用它，所以在将 `_effect.run` 暴露出去的时候需要绑定 `this` 作用域。
:::

:::: code-group
:::code-group-item effect.ts

```ts
// src/reactivity/effect.ts

export function effect(fn) {
  // 实例化 ReactiveEffect 类，并将依赖传入
  const _effect = new ReactiveEffect(fn)
  
  _effect.run()

  return _effect.run.bind(_effect)
}
```

:::
::::

现在，`effect` 方法已经可以返回 `runner` 函数了，那么我们该如何拿到 `fn` 的返回值呢？其实很简单，只需要改造下 `ReactiveEffect` 中的 `run` 方法，将 `_fn` 的执行结果返回即可：

:::: code-group
:::code-group-item effect.ts

```ts
// src/reactivity/effect.ts

class ReactiveEffect {
  private _fn: any
  
  constructor(fn) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    return this._fn()
  }
}
```

:::
::::

至此，`runner` 功能就实现完成啦~
