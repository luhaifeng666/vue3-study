<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-06-21 14:48:37
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-21 16:13:09
 * @Description: 
-->
# scheduler

::: tip
本篇笔记对应的分支号为: `main分支：1b55902`
:::

`effect` 方法的第二个入参是一个对象，该对象的其中一个属性就是 `scheduler`。

## 什么是 scheduler

`scheduler` 是个函数，在首次调用 `effect` 时不会被执行。传入 `scheduler` 后，当响应式对象的属性发生变化时，`effect` 的第一个参数 `fn` 不会再次执行。如果需要执行 `fn`， 需要执行 `effect` 返回的 `runner` 函数。

## 实现 scheduler

我们先来编写 `scheduler` 的测试用例：

:::: code-group
::: code-group-item effect.spec.ts

``` ts
// src/reactivity/__tests__/effect.spec.ts

it('scheduler', () => {
  let dummy
  let run: any
  const scheduler = jest.fn(() => {
    run = runner
  })
  const obj = reactive({ foo: 1 })
  const runner = effect(() => {
    dummy = obj.foo
  }, { scheduler })
  // 首次执行 effect 时不会调用 scheduler 方法
  expect(scheduler).not.toHaveBeenCalled()
  // 首次执行 effect 时会调用传入的第一个方法，此时给 dummy 赋值
  expect(dummy).toBe(1)
  // 触发响应式对象值改变
  obj.foo++
  // 会执行 scheduler 方法，但是不会执行第一个参数
  expect(scheduler).toHaveBeenCalledTimes(1)
  expect(dummy).toBe(1)
  // 执行 runner 方法时，会执行传入的第一个方法
  run()
  expect(dummy).toBe(2)
})
```

:::
::::

接下来，我们根据测试用例来改造下 `effect` 方法。

首先，我们需要给 `effect` 添加第二个参数。第二个参数是个对象，可以不传，所以我们设置下默认值为空对象：

:::: code-group
::: code-group-item effect.ts

``` ts {3}
// src/reactivity/effect.ts

export function effect (fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn)

  _effect.run()

  return _effect.run.bind(_effect)
}
```

:::
::::

由于传入 `scheduler` 后，传入 `effect` 的方法 `fn` 在响应式对象的属性发生变化时不会被再次触发，因此我们需要在 `trigger` 阶段进行判断 **是否传入了 `scheduler`**。

但是 `scheduler` 是在调用 `effect` 方法时传入的，那在 `trigger` 阶段如何判断是否传入了 `scheduler` 呢？

我们知道， `trigger` 阶段触发的是 `ReactiveEffect` 实例中的 `run` 方法，因此，我们可以在实例化 `ReactiveEffect` 阶段将 `scheduler` 传入，这样便可以在 `trigger` 时进行判断。

:::: code-group
::: code-group-item effect.ts

``` ts {6,17}
// src/reactivity/effect.ts

class ReactiveEffect {
  private _fn: any
  
  constructor(fn, public scheduler?) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    return this._fn()
  }
}

export function effect (fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)

  _effect.run()

  return _effect.run.bind(_effect)
}
```

:::
::::

最后，我们只需要在 `trigger` 时判断对应的 `ReactiveEffect` 实例中是否存在 `scheduler` 即可，如果存在 `scheduler`，则执行 `scheduler` 方法，否则执行 `run`:

:::: code-group
::: code-group-item effect.ts

``` ts {14}
// src/reactivity/effect.ts

/**
 * 触发依赖
 * @param target 触发依赖的对象
 * @param key 触发该key对应的依赖
 */
export function trigger(target, key) {
  // 根据对象与key获取到所有的依赖，并执行
  const depsMap = targetMap.get(target)
  const deps = depsMap.get(key)
  for(const dep of deps) {
    // 判断是否存在 scheduler 方法，存在的的话执行 scheduler，否则执行run
    if(dep.scheduler) {
      dep.scheduler()
    } else {
      dep.run()
    }
  }
}
```

:::
::::
