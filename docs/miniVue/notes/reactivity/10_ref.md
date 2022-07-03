<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-06-30 16:10:23
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-03 10:10:14
 * @Description: 
-->

# ref

::: tip
本篇笔记对应的分支号为: `main分支： b75748a`
:::

官方文档中，对于 `ref` 功能的描述如下：

:::tip
接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象仅有一个 `.value` property，指向该内部值。
:::

## happy path

我们先通过简单的 `happy path` 测试用例来看下 `ref` 所实现的功能：

:::: code-group
::: code-group-item ref.spec.ts

```ts
// src/reactivity/__tests__/ref.spec.ts

it('happy path', () => {
  const a = ref(1)
  expect(a.value).toBe(1)
})
```

:::
::::

通过测试用例我们可以看到，当我们给 `ref` 传入一个值之后，`ref` 返回了一个对象，对象上有个 `value` 属性，我们可以通过 `value` 访问到对应的值。

根据 `happy path`，我们先来实现一版简单的 `ref`。由于 `ref` 的返回值是个对象，因此我们可以定义一个名为 `RefImpl` 的类来包裹一下，当调用 `ref` 时，直接返回 `RefImpl` 的实例：

:::: code-group
::: code-group-item ref.ts

```ts
// src/reactivity/ref.ts

class RefImpl {
  private _value: any

  constructor(value: any) {
    this._value = value
  }

  // 通过 get 的方式获取值
  get value() {
    return this._value
  }
}

export function ref(value) {
  return new RefImpl(value)
}
```

:::
::::

这样一来，我们就实现了 `丐版` 的 `ref`。

## 响应式处理

通过开头的定义我们知道，`ref` 的返回值也是 **响应式** 的。如果这个值具有 **响应式** 的特征，那么它就应该可以进行 `依赖收集` 以及 `依赖触发`。

回顾下之前我们在实现 `reactive` 的功能时，`依赖收集` 是在 `get` 阶段进行的，而 `依赖触发` 则是在 `set` 阶段进行的。同理，在 `ref` 中的 `依赖收集` 以及 `依赖触发` 同样也应该发生在 `get` 以及 `set` 阶段。（这也就是为什么我们需要通过定义 `RefImpl` 类来包裹的原因。因为 `ref` 可以接受基本类型的值，通过 `RefImpl` 的包裹，我们才可以借助类的 `get` 以及 `set` 特性实现 `依赖收集` 以及 `依赖触发`。）

我们先来看下测试用例：

:::: code-group
::: code-group-item ref.spec.ts

```ts
// src/reactivity/__tests__/ref.spec.ts

it('should be reactive', () => {
  const a = ref(1)
  let dummy
  let calls = 0
  effect(() => {
    calls++
    dummy = a.value
  })
  expect(calls).toBe(1)
  expect(dummy).toBe(1)
  a.value = 2
  expect(calls).toBe(2)
  expect(dummy).toBe(2)
})
```

:::
::::

### 依赖收集

我们先来根据测试用例实现下 `依赖收集` 。先回忆下我们之前依赖收集的实现过程：

![reactive](https://user-images.githubusercontent.com/9375823/174035124-13a100ba-3e6a-4da0-a9f9-ff74acef6942.png)

与之前不同的是，当 `ref` 传入的是基本类型的值时，不需要 `targetMap` 以及 `depsMap`，只需要 `deps` 就可以了，因此我们可以在 `RefImpl` 中定义 `deps` 用于存放依赖。由于收集依赖到 `deps` 中的逻辑与之前 `reactive` 中的逻辑是一样的，因此，我们可以把这部分逻辑抽取出来，之后，在 `RefImpl` 的 `get` 中调用：

:::: code-group
::: code-group-item effect.ts

```ts{3-9,32}
// src/reactivity/effect.ts

export function trackEffects(deps: Set<any>) {
  // 避免重复收集
  if (deps.has(activeEffect)) return
  // 将依赖对象保存到列
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

/**
 * 收集依赖
 * @param target 需要收集依赖的对象
 * @param key 收集该key所对应的依赖
 */
export function track(target, key) {
  if (!isTracking()) return
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
  trackEffects(deps)
}
```

:::

::: code-group-item ref.ts

```ts
// src/reactivity/ref.ts

import { trackEffects } from './effect'

class RefImpl {
  private _value: any
  deps: Set<any>

  constructor(value: any) {
    this._value = value
    this.deps = new Set()
  }

  get value() {
    trackEffects(this.deps)
    return this._value
  }
}
```

:::
::::

### 依赖触发

完成 `依赖` 收集后，我们来看看依赖触发的实现。

我们知道，依赖应该在值发生改变时被触发， 因此我们首先要为 `RefImpl` 类添加 `set` 方法，用于设置 `_value` 的值：

:::: code-group
::: code-group-item ref.ts

```ts
// src/reactivity/ref.ts

class RefImpl {
  // 省略一大波代码

  set value(newValue: any) {
    this._value = newValue
  }
}
```

:::
::::

接下来，我们需要开始处理 `依赖触发` 环节。所谓的 `依赖触发`，其实就是将 `deps` 中的依赖取出来依次执行，这个逻辑在先前实现 `reactive` 的依赖触发逻辑时就已经实现过了。与 `track` 一样，`ref` 在触发时也不需要 `targetMap` 以及 `depsMap`，只需要直接遍历 `deps` 就可以了。因此，我们把这段逻辑也抽取到名为 `triggerEffects` 的方法中，并在 `ref` 的 `set` 方法中进行调用：

:::: code-group
::: code-group-item effect.ts

```ts{3-11,27}
// src/reactivity/effect.ts

export function triggerEffects(deps) {
  for(const dep of deps) {
    // 判断是否存在 scheduler 方法，存在的的话执行 scheduler，否则执行run
    if(dep.scheduler) {
      dep.scheduler()
    } else {
      dep.run()
    }
  }
}

/**
 * 触发依赖
 * @param target 触发依赖的对象
 * @param key 触发该key对应的依赖
 */
export function trigger(target, key) {
  // 根据对象与key获取到所有的依赖，并执行
  const depsMap = targetMap.get(target)
  // 如果没有找到 depsMap, 直接 return
  if (!depsMap) {
    return
  }
  const deps = depsMap.get(key)
  triggerEffects(deps)
}
```

:::

::: code-group-item ref.ts

```ts
// src/reactivity/ref.ts

import { trackEffects, triggerEffects } from './effect'

class RefImpl {
  // 省略一大波代码

  set value(newValue: any) {
    this._value = newValue
    triggerEffects(this.deps)
  }
}
```

:::
::::

好，这样一来 `依赖收集` 以及 `依赖触发` 的功能我们就已经实现完成了。回过头来看一看我们的测试用例：

![ref](https://user-images.githubusercontent.com/9375823/176814839-0ca2cb17-c1bc-4ff2-83cf-91130cd0ef6f.png)

嗯？？？？？（黑人问号）怎么回事？怎么 `happy path` 都通过不了了？通过报错信息我们可以得知，无法从 `undefined` 上获取 `deps` 属性。那么问题出在哪儿呢？

我们回过头来再看看 `happy path` 做了哪些事情：

> 1. 在 `happy path` 中，我们通过 `a.value` 的方式获取了 `ref` 返回对象上的值，因此会触发 `get`;
> 2. 而在 `get` 中会执行 `trackEffects` 方法进行依赖收集;
> 3. 在 `trackEffects` 中有个步骤 `activeEffect.deps.push(deps)` ，这一步是用来做反向收集的；
> 4. 此时，`activeEffect` 并不存在，因为没有经过 `effect` 的处理，`ReactiveEffect` 尚未被实例化。

好，问题找到了，那我们该如何解决它呢？还记得我们之前抽取的 `isTracking` 方法么：

```ts
// 判断是否在收集中
export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}
```

我们这里只需要引入它，并在 `依赖收集` 前进行判断即可：

:::: code-group
::: code-group-item ref.ts

```ts{9}
// src/reactivity/ref

import { trackEffects, triggerEffects, isTracking } from './effect'

class RefImpl {
  // 省略一大波代码
  get value() {
    // 可以进行 track 时才进行依赖收集
    isTracking() && trackEffects(this.deps)
    return this._value
  }
}
```

:::
::::

这样一来，我们的测试就可以通过啦~

### 阻止重复触发

当我们修改 `ref` 返回的对象属性值时，会触发 `set` ，之后会执行 `依赖触发` 操作。试想下，当我们为同一个属性设置相同的值时，如果也要进行 `依赖触发` 的话，是不是就造成性能浪费了呢？

因此，我们在 `依赖触发` 之前需要判断值是否发生了改变，如果没有发生改变，那么则不触发 `依赖收集`。我们先来补充下测试用例：

:::: code-group
::: code-group-item ref.spec.ts

```ts{17-19}
// src/reactivity/__tests__/ref.spec.ts

 it('should be reactive', () => {
  const a = ref(1)
  let dummy
  let calls = 0
  effect(() => {
    calls++
    dummy = a.value
  })
  expect(calls).toBe(1)
  expect(dummy).toBe(1)
  a.value = 2
  expect(calls).toBe(2)
  expect(dummy).toBe(2)
  // same value should not trigger
  a.value = 2
  expect(calls).toBe(2)
  expect(dummy).toBe(2)
})
```

:::
::::

之后，我们在 `RefImpl` 定义一个私有属性 `_rawValue` 用于存放原始值，而后在 `set` 时使用 [Object.is](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 判断是否需要更新值并触发依赖：

:::: code-group
::: code-group-item ref.ts

```ts{6,22}
// src/reactivity/ref.ts

class RefImpl {
  private _value: any
  deps: Set<any>
  private _rawValue: any // 保存原始值，用于 set 阶段对比值是否发生了变化

  constructor(value: any) {
    this._rawValue = value
    this._value = value
    this.deps = new Set()
  }

  get value() {
    // 可以进行 track 时才进行依赖收集
    isTracking() && trackEffects(this.deps)
    return this._value
  }

  set value(newValue: any) {
    // 如果值没有发生变化，不会触发 trigger
    if (Object.is(this._rawValue, newValue)) {
      this._rawValue = newValue
      this._value = newValue
      triggerEffects(this.deps)
    }
  }
}
```

:::
::::

## 复杂类型处理

在官方文档中，关于 `ref` 还有这样一句描述：

:::tip
如果将对象分配为 ref 值，则它将被 `reactive` 函数处理为深层的响应式对象。
:::

上面我们实现的功能只是针对基本类型做的处理，根据官方的描述，当 `ref` 接受的是一个对象时，我们需要将其转换成 `reactive` 对象。我们先来编写下对应的测试用例：

:::: code-group
::: code-group-item ref.spec.ts

```ts
// src/reactivity/__tests__/ref.spec.ts

 it('should make nested properties reactive', () => {
    const a = ref({ count: 1 })
    let dummy
    effect(() => {
      dummy = a.value.count
    })
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  })
```

:::
::::

因此，在 `get` 以及 `set` 阶段我们需要对传入的值进行判断， 当传入的值为对象时，我们需要处理成 `reactive` 对象，否则不作处理：

:::: code-group
::: code-group-item ref.ts

```ts{3-4,13,27}
// src/reactivity/ref.ts

import { isObject } from '../shared'
import { reactive } from './reactive'

class RefImpl {
  private _value: any
  deps: Set<any>
  private _rawValue: any // 保存原始值，用于 set 阶段对比值是否发生了变化

  constructor(value: any) {
    this._rawValue = value
    this._value = isObject(value) ? reactive(value) : value
    this.deps = new Set()
  }

  get value() {
    // 可以进行 track 时才进行依赖收集
    isTracking() && trackEffects(this.deps)
    return this._value
  }

  set value(newValue: any) {
    // 如果值没有发生变化，不会触发 trigger
    if (hasChanged(this._rawValue, newValue)) {
      this._rawValue = newValue
      this._value = isObject(newValue) ? reactive(newValue) : newValue
      triggerEffects(this.deps)
    }
  }
}
```

:::
::::

至此，我们的 `ref` 功能就已经实现完成啦~

## 代码优化

### 抽取 `Object.is`

上述代码中，我们通过 `Object.is` 来判断值是否发生了改变。与之前用到的 `Object.assign` 一样，它可能会被多次调用。并且为了代码的可读性更高，因此我们可以定义一个名为 `hasChanged` 的方法，并将它抽取到 `share` 中：

:::: code-group
::: code-group-item index.ts

```ts
// src/shared/index.ts

export const hasChanged = (val, newValue) => !(Object.is(val, newValue))
```

:::

::: code-group-item ref.ts

```ts{3,9}
// src/reactivity/ref.ts

import { hasChanged, isObject } from '../shared'

class RefImpl {
  // 省略一大波代码
  set value(newValue: any) {
    // 如果值没有发生变化，不会触发 trigger
    if (hasChanged(this._rawValue, newValue)) {
      this._rawValue = newValue
      this._value = convert(newValue)
      triggerEffects(this.deps)
    }
  }
}
```

:::
::::

### 抽取重复代码

在 `set` 以及 `get` 中，我们都判断了值是否是对象类型，这边重复的逻辑我们可以将之抽取到名为 `convert` 的方法中：

:::: code-group
::: code-group-item ref.ts

```ts{10,24,35-37}
// src/reactivity/ref.ts

class RefImpl {
  private _value: any
  deps: Set<any>
  private _rawValue: any // 保存原始值，用于 set 阶段对比值是否发生了变化

  constructor(value: any) {
    this._rawValue = value
    this._value = convert(value)
    this.deps = new Set()
  }

  get value() {
    // 可以进行 track 时才进行依赖收集
    isTracking() && trackEffects(this.deps)
    return this._value
  }

  set value(newValue: any) {
    // 如果值没有发生变化，不会触发 trigger
    if (hasChanged(this._rawValue, newValue)) {
      this._rawValue = newValue
      this._value = convert(newValue)
      triggerEffects(this.deps)
    }
  }
}

/**
 * 判断传入 ref 的值是否是对象类型，如果是对象类型，需要使用 reactive 进行包裹
 * @param value 
 * @returns 
 */
function convert(value) {
  return isObject(value) ? reactive(value) : value
}
```

:::
::::
