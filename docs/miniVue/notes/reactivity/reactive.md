<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2021-11-14 19:51:15
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-21 23:15:20
 * @Description: effect & reactive & 依赖收集 & 触发依赖
-->

# effect & reactive & 依赖收集 & 触发依赖

::: tip
本篇笔记对应的分支号为: `main分支：e8bb112`
:::

在 Vue3 中，[reactive](https://v3.cn.vuejs.org/api/basic-reactivity.html#reactive) 方法被用于创建一个对象的 **响应式副本**。这里可以拆成两个部分来理解，即 **响应式** 以及 **副本**。

## 副本

我们先来看看 **副本** 这个部分。在实现 `reactive` 方法之前，我们先来写下它的测试用例，看看它需要做些啥：

:::: code-group
::: code-group-item reactive.spec.ts

```ts
// src/reactivity/__tests__/reactive.spec.ts

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

### 实现 `reactive`

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

## 响应式

现在我们已经可以通过 `reactive` 方法获取目标对象的 **副本** 了，那 **响应式** 部分又该如何实现呢？

所谓 **响应式**， 其实本质上就做了两件事情：

> 1. 在读取对象属性时进行 `依赖收集`
> 2. 在修改对象属性时执行 `依赖触发`

而这部分的逻辑则交由 `effect` 模块来实现。那 `依赖收集` 跟 `依赖触发` 具体是怎样的一个流程呢？请看下图：

![track&trigger](https://user-images.githubusercontent.com/9375823/173803951-43576337-7bba-423d-a985-5c0eb9dfb052.png)

对上图的内容简单描述如下：

> 1. 在读取响应式对象 `Target` 中的属性时进行 `依赖收集` 操作，所有的依赖会被收集到依赖池 `TargetMap` 中；
> 2. 在设置响应式对象 `Target` 的属性值时执行 `依赖触发` 操作，会根据对应的 `Target` 以及 `key` 将依赖从依赖池 `TargetMap` 中取出并执行。

现在我们已经知道了 `effect` 模块所要实现的功能，依据上述内容，先来编写下测试用例：

:::: code-group
::: code-group-item effect.spec.ts

```ts {14}
// src/reactivity/__test__/effect.spec.ts

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

### 实现 `effect`

接下来我们需要实现 `effect` 模块的功能。

根据上面的描述，`effect` 接受一个函数作为参数，既如此先定义一下 `effect` 方法：

:::: code-group
::: code-group-item effect.ts

```ts
// src/reactivity/effect.ts

export function effect(fn) {}
```

:::
::::

接下来，我们需要定义依赖池 `targetMap` 用于存放依赖。依赖池中存放的是响应式对象 `target` 所对应的依赖，需要使用对象类型作 key 的话，那么使用 [Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map) 自然再合适不过啦：

:::: code-group
::: code-group-item effect.ts

```ts
// src/reactivity/effect.ts

const targetMap = new Map()

export function effect(fn) {}
```

:::
::::

好了，现在存放依赖的地方有了，那么我们就开始收集它们吧~

上文中我们提到，`收集依赖` 的操作是在读取响应式对象 `target` 中的属性时进行的。还记得 `target` 对象是通过 `Proxy` 创建出来的么？在读取 `target` 的属性时，必然会触发 `get` 方法，那么 `收集依赖` 的操作也应该在 `get` 方法中进行。

我们先来定义一个方法 `tarck` 用于依赖收集，并在 `reactive.ts` 中引入它，以便在 `get` 方法中进行调用：

:::: code-group
::: code-group-item effect.ts

```ts
// src/reactivity/effect.ts

const targetMap = new Map()

/**
 * 收集依赖
 * @param target 需要收集依赖的对象
 * @param key 收集该key所对应的依赖
 */
export function track(target, key) {
}

export function effect(fn) {}
```

:::

::: code-group-item reactive.ts

```ts

// src/reactivity/reactive.ts

import { track } from './effect'

export const reactive = (raw) => {
  return new Proxy(raw, {
    // 取值
    get(target, key) {
      const res = Reflect.get(target, key)
      // 收集依赖
      track(target, key)
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

接下来，我们需要实现 `track` 这部分的功能。在动手实现之前，我们先来捋一捋 `track` 需要做哪些事情:

> 1. 由于在初始化时依赖池是空的（也为了避免覆盖），所以在存入 `targetMap` 依赖池之前，需要先判断依赖池中是否已经存在 `target` 所对应的依赖容器 `depsMap`：
>     - 如果存在，则取出 `depsMap`;
>     - 否则新建一个 `depsMap`, 并将其存入到依赖池 `targetMap` 中;
> 2. 从依赖容器 `depsMap` 中取出响应式对象 `target` 对应属性的依赖 `deps`，由 `步骤1` 可知，`depsMap` 可能是空的，因此也需要对 `deps` 进行判空处理：
>     - 如果存在，则取出，并将依赖存入
>     - 如果不存在，则新建一个 `deps`，将依赖存入其中，并将 `deps` 存入对应属性的依赖容器 `depsMap` 中。为了避免重复收集依赖，此处使用 [Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set) 进行存储。

为了方便理解，我们来一起看下流程图:

![tarck](https://user-images.githubusercontent.com/9375823/174035124-13a100ba-3e6a-4da0-a9f9-ff74acef6942.png)

代码实现如下：

:::: code-group
::: code-group-item effect.ts

```ts {25}
// src/reactivity/effect.ts

const targetMap = new Map()

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
  // TODO 将依赖对象保存到列表中
}

export function effect(fn) {}
```

:::
::::

好，代码写到这里的时候，我们遇到了一个

::: warning 问题：
**需要被收集的依赖在 `effect` 方法中，在 `tarck` 里要怎么获取到这个依赖呢？**
:::

针对这个问题，我们可以通过定义一个用于存储依赖的全局变量 `activeEffect` 来解决解决这个问题。那我们直接把依赖塞到 `activeEffect` 中就完事儿了么？当然。。。。

![达咩](https://user-images.githubusercontent.com/9375823/174023015-d484f98f-45e1-4a1e-a894-8333ce565729.png)

不是！如果只单单为了实现这个功能，无可厚非，但是后续我们还有其他操作（为了代码的健壮性，可读性， 可扩展性），这里我们定义 `ReactiveEffect` 类将依赖收集起来，之后将该类的实例赋值给 `activeEffect` 即可：

:::: code-group
::: code-group-item effect.ts

```ts {3,13,14,41,48}
// src/reactivity/effect.ts

let activeEffect

class ReactiveEffect {
  private _fn: any
  
  constructor(fn) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    this._fn()
  }
}

const targetMap = new Map()

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
  // 将依赖对象保存到列表中
  deps.add(activeEffect)
}

export function effect(fn) {
  // 实例化 ReactiveEffect 类，并将依赖传入
  const _effect = new ReactiveEffect(fn)
  
  _effect.run()
}
```

:::
::::

::: warning 注意
这里需要注意的是，传入 `effect` 中的方法会被立即执行一次（可以回看上述测试用例中的 `第14行代码`）。所以 `ReactiveEffect` 暴露的 `run` 方法中除了要将依赖存入全局变量 `activeEffect` 中，还得将传入的依赖返回出来用以执行。
:::

到目前为止，`依赖收集` 的功能就已经实现了。接下来便轮到 `依赖触发` 了。相较于 `依赖收集`，`依赖触发` 就简单了，只需要根据传入的 `target` 以及对应的属性 `key`，将依赖项取出执行便可。

这里我们在 `effect.ts` 中定义一个 `trigger` 方法用于触发依赖，之后在 `reactive.ts` 中引入。由于触发依赖发生在修改响应式对象 `target` 的属性阶段，所以需要放到 `set` 中执行:

:::: code-group
::: code-group-item effect.ts

```ts
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
    dep.run()
  }
}
```

:::

::: code-group-item reactive.ts

```ts
// src/reactivity/reactive.ts

import { track, trigger } from './effect'

export const reactive = (raw) => {
  return new Proxy(raw, {
    // 取值
    get(target, key) {
      const res = Reflect.get(target, key)
      // 收集依赖
      track(target, key)
      return res
    },
    // 赋值
    set(target, key, value) {
      const res = Reflect.set(target, key, value)
      // 触发依赖
      trigger(target, key)
      return res
    }
  })
}
```

:::
::::

至此，`依赖收集` & `触发依赖` 的功能就完成啦~
