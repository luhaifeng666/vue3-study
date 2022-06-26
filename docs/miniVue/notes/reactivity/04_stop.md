<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-06-21 22:58:23
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-25 00:21:04
 * @Description: 
-->
# stop

::: tip
本篇笔记对应的分支号为: `main分支：aadf196`
:::

`stop` 方法的入参为 `effect` 方法返回的 `runner` 函数。当调用 `stop` 方法后，响应式对象的属性发生变化时不会再触发依赖。

## 实现 stop

根据开头的描述，我们先来编写 `stop` 相关的测试用例：

:::: code-group
::: code-group-item effect.spec.ts

```ts
// src/reactivity/__tests__/effect.spec.ts

it('stop', () => {
  let dummy
  const obj = reactive({ prop: 1 })
  const runner = effect(() => {
    dummy = obj.prop
  })
  obj.prop = 2
  expect(dummy).toBe(2)
  // 调用 stop 后，响应式对象属性变化时不再触发 fn
  stop(runner)
  obj.prop = 3
  expect(dummy).toBe(2)
  // 被停用的 effect 仍可以被调用
  runner()
  expect(dummy).toBe(3)
})
```

:::
::::

`stop` 方法定义在 `effect.ts` 模块中，它接受 `effect` 返回的 `runner` 函数作为参数。我们首先在 `effect.ts` 文件中定义下它:

:::: code-group
::: code-group-item effect.ts

```ts
// src/reactivity/effect.ts

export function stop(runner) {}
```

:::
::::

接下来我们需要解决的问题是 **如何保证在执行完 `stop` 方法后，改变响应式对象的属性值时不会再次触发依赖。**

我们来回顾下依赖触发的流程：

![trigger](https://user-images.githubusercontent.com/9375823/175494804-d88de5dc-6f1b-4c9d-9ba4-389051456705.png)

1. 修改响应式对象 `Target` 的属性 `key` 的值；
2. 从响应池 `TargetMap` 中取出对应的 `deps`, 即: `TargetMap.get(Target).get(key)`
3. 遍历 `deps`，调用每个 `effect` 的 `run` 方法以触发依赖。

如果想要依赖不被触发，那么只要对应 `effect` 的 `run` 方法不被执行即可。而想要对应 `effect` 的 `run` 方法不被执行，那么我们只需要将对应的 `effect` 删除即可。

想要实现这个功能，主要需要完成两件事情：

> 1. 找到需要删除的 `effect` 对象；
> 2. 找到存放该 `effect` 对象的所有 `deps`，并将之移除;

### 找到需要删除的 `effect` 对象

现在 `stop` 接受的入参是 `effect` 返回的 `runner` 函数，我们如何能够找到需要删除的 `effect` 对象呢？

其实，所谓 **需要删除的 `effect` 对象** 指的就是删除 `runner` 所对应的 `effct`，那么我们可以给 `runner` 添加一个属性： `effect`， 并将实例化 `ReactiveEffect` 后的对象 `_effect` 赋值给它。

:::: code-group
::: code-group-item effect.ts

```ts{9}
// src/reactivity/effect.ts

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)

  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}
```

:::
::::

### 找到存放 `effect` 对象的所有 `deps`

将 `effect` 存放到对应的 `deps` 中是在 `依赖收集` 过程中完成的，要想知道 `effect` 被存放在哪些 `deps` 中，只需要做个 `反向收集` 即可。

我们可以在 `ReactiveEffect` 类中创建一个数组，并在 `依赖收集` 时将 `deps` 存入其中。之后，在 `ReactiveEffect` 中创建 `stop` 方法，用于清空该数组，并将之交给外部的 `stop` 方法执行即可。

:::: code-group
::: code-group-item effect.ts

```ts{6,18-21,49,54}
// src/reactivity/effect.ts

class ReactiveEffect {
  private _fn: any
  public scheduler: Function | undefined
  deps = []
  
  constructor(fn, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    activeEffect = this
    return this._fn()
  }

  stop() {
    this.deps.forEach((dep: any) => {
      dep.delete(this)
    })
  }
}

/**
 * 收集依赖
 * @param target 需要收集依赖的对象
 * @param key 收集该key所对应的依赖
 */
export function track(target, key) {
  // 查找该对象对应的依赖池
  let depsMap = targetMap.get(target)
  // 如果没有（首次初始化时），则创建新的依赖池
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  // 从获取到的依赖池中获取该key所对应的依赖列表
  let deps = depsMap.get(key)
  // 如果没有，则新建一个该key对应的列表
  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }

  if (activeEffect) {
    // 将依赖对象保存到列表中
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
  }
}

export function stop(runner) {
  runner.effect.stop()
}
```

:::
::::

至此，`stop` 方法就已经实现完成了~可以参考下面的流程图加深理解：

![stop](https://user-images.githubusercontent.com/9375823/175513006-07d2df12-3465-4522-9164-d9fbaf54a89a.png)

### 优化

代码写完后，我们可以对其做一些优化，这也是 `TDD` 的重要步骤之一。

#### 提高可读性

上述代码中 `19-21` 行是用于清除 `effect` 的。为了提高代码的可读性，我们可以将 `19-21` 的代码逻辑抽取出来，并取名为 `cleanEffect`:

:::: code-group
::: code-group-item effect.ts

```ts{9,13-17}
// src/reactivity/effect.ts

class ReactiveEffect {
  /**
   * 省略一大波代码
  */
  
  stop() {
    cleanEffect(this)
  }
}

function cleanEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
}
```

:::
::::

#### 避免重复调用 `stop`

当我们多次调用 `stop` 方法时，`ReactiveEffect` 中的 `stop` 方法总是会被执行。然而在第一次调用时，`runner` 相关的 `effect` 已经被清空了，所以在此之后没有必要再去执行 `stop` 方法了。因此，我们可以在 `ReactiveEffect` 中添加一个标记：`active`，用于标识 `effect` 是否已经被清空。如果被清空，则不必再次执行 `stop` 方法：

:::: code-group
::: code-group-item effect.ts

```ts{6,20-23}
// src/reactivity/effect.ts

class ReactiveEffect {
  private _fn: any
  public scheduler: Function | undefined
  active = true // 是否需要清空 deps
  deps = []
  
  constructor(fn, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    activeEffect = this
    return this._fn()
  }

  stop() {
    if (this.active) {
      cleanEffect(this)
      this.active = false
    }
  }
}
```

:::
::::

## 实现 onStop 方法

`onStop` 方法的执行时机是在 `stop` 方法被调用后，可以理解为 `stop` 之后的回调函数。

`onStop` 方法在 `effect` 的第二个参数中被传入。还记得上一篇的 `scheduler` 么？ `onStop` 的传入方式与其一致。

老规矩，在实现它之前，我们还是先来编写对应的测试用例：

:::: code-group
::: code-group-item effect.spec.ts

```ts
// src/reactivity/__test__/effect.spec.ts

it('onStop', () => {
  const obj = reactive({ prop: 1 })
  const onStop = jest.fn()
  let dummy
  const runner = effect(() => {
    dummy = obj.prop
  }, {
    onStop
  })
  expect(dummy).toBe(1)
  // 当调用stop时，onStop 会被调用一次
  stop(runner)
  expect(onStop).toBeCalledTimes(1)
})
```

:::
::::

既然要在 `stop` 被执行后执行，那么 `onStop` 需要在 `ReactiveEffect` 类中的 `stop` 方法中被调用。既然要在 `ReactiveEffect` 中能够调用到 `onStop`，那么我们就需要将其传入 `ReactiveEffect` 中：

:::: code-group
::: code-group-item effect.ts

```ts{4,13-15,23}
// src/reactivity/effect.ts

class ReactiveEffect {
  onStop?: () => void

  /**
   * 省略一些代码
   */

  stop() {
    if (this.active) {
      cleanEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.onStop = options.onStop

  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}
```

:::
::::

至此，`opStop` 也就实现完成了。

### 继续优化

#### 继续提升代码可读性

我们来看下上述 `effect` 方法中的 `_effect.onStop = options.onStop` 这一行代码。

在后续功能迭代的过程中，`effect` 的第二个参数 `options` 可能会继续新增其他的属性，而这些属性可能也需要绑定到 `_effect` 上。如果频繁的写 `_effct.xxx = options.xxx` 的话，代码可读性就会很差。

此时，我们可以使用 `Object.assign` 来对其进行优化：

```ts
Object.assign(_effect, options)
```

这样，后续的属性也可以添加到 `_effect` 对象上。这个行为其实是在对 `_effect` 的功能进行 **扩展**。那我们不妨用一个更加见名知意的方法 `extend` 来替换它，并且考虑到 `Object.assign` 未来可能会在多处使用，我们可以将其抽取到 `src/shared/index.ts` 模块中，并作为全局共享的方法暴露出去：

:::: code-group
::: code-group-item effect.ts

```ts
// src/reactivity/effect.ts
import { extend } from '../shared'

export function effect(fn, options: any = {}) {
  /** 省略一些代码 */
  extend(_effect, options)
}
```

:::

::: code-group-item index.ts

```ts
// src/shared/index.ts

export const extend = Object.assign
```

:::
::::

行文至此，`stop` 以及 `onStop` 方法实现完成~
