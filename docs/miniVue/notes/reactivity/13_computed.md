<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-05 15:01:08
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-05 18:32:48
 * @Description: 
-->
# computed

:::tip
本篇笔记对应的分支号为: `main分支： 139cae9`
:::

`computed` 接受一个 getter 函数，并根据 getter 的返回值返回一个 **不可变** 的响应式 `ref` 对象。

::: tip
其实 `computed` 还可以接受一个具有 `get` 和 `set` 函数的对象(参照 [computed](https://v3.cn.vuejs.org/api/computed-watch-api.html#computed) 这篇文档)，用来创建可写的 `ref` 对象，这个后期可以考虑实现下，这个章节只考虑第一种情况
:::

## happy path

我们还是先从简单的 `happy path` 入手：

:::: code-group
::: code-group-item computed.spec.ts

```ts
// src/reactivity/__tests__/computed.spec.ts

it("happy path", () => {
  const user = reactive({
    age: 1
  })

  const age = computed(() => user.age)
  
  expect(age.value).toBe(1)
})
```

:::
::::

根据测试用例我们可以得出：

> 1. `computed` 接受一个函数（按照官方的说法，我们叫它 `getter`）;
> 2. 返回一个 `ref` 对象，可以通过 `.value` 的方式去获取值

根据以上描述，我们新建 `computed.ts` 文件用于定义 `computed` 方法，并定义 `ComputedRefImpl` 类用于做后续处理：

:::: code-group
::: code-group-item computed.ts

```ts
// src/reactivity/computed.ts
class ComputedRefImpl {
  private _getter: any
  
  constructor(getter) {
    this._getter = getter
  }

  get value() {
    return this._getter()
  }
}

export const computed = getter => new ComputedRefImpl(getter)
```

:::
::::

这样一来，我们就已经初步实现了我们的功能。

## 实现 computed 的缓存功能

熟悉 `Vue` 的小伙伴们应该知道，无论是 `Vue2` 还是 `Vue3`，`computed` 都具有一个特性，那就是 **缓存**。

> 1. 当 `computed` 中响应式的值没有发生变化的时候，`computed` 不会重复计算，也就是说 `getter` 不会重复执行，而是将上一次的计算结果直接返回。
> 2. 只有当其中响应式的值发生变化时，`getter` 方法才会再次触发，并返回最新的值。

我们先来实现第一个特性。首先还是先通过测试用例来捋一捋逻辑：

:::: code-group
::: code-group-item computed.spec.ts

```ts
// src/reactivity/__tests__/computed.spec.ts

 it("should compute lazily", () => {
  const value = reactive({
    foo: 1
  })

  const getter = jest.fn(() => value.foo)
  const cValue = computed(getter)
  
  // lazy 不触发 get 时不会执行 getter 方法
  expect(getter).not.toHaveBeenCalled()
  // 触发 get 时执行 getter
  expect(cValue.value).toBe(1)
  expect(getter).toHaveBeenCalledTimes(1)

  // should not compute again
  cValue.value
  expect(getter).toHaveBeenCalledTimes(1)
})
```

:::
::::

那么这个缓存的功能应该怎么去实现呢？

这里我们可以定义一个开关 `_dirty`，用于控制是否需要触发 `getter` 方法，如果 `_dirty === true`, 那么就触发，否则不触发。之后定义 `_value` 用于缓存 `getter` 的执行结果：

:::: code-group
::: code-group-item computed.ts

```ts{5-6,14-18}
// src/reactivity/computed.ts

class ComputedRefImpl {
  private _getter: any
  private _dirty: boolean = true // 标记是否需要触发 getter
  private _value: any // 缓存值
  
  constructor(getter) {
    this._getter = getter
  }

  get value() {
    // 值没有发生变化时，再次获取不会触发 getter
    if (this._dirty) {
      this._dirty = false
      this._value = this.getter()
    }
    return this._value
  }
}
```

:::
::::

现在，我们的 `computed` 就具有了缓存的能力，接下来我们需要实现第二个功能点。别急，开始之前，我们先来补充下测试用例：

:::: code-group
::: code-group-item computed.spec.ts

```ts{21-31}
// src/reactivity/__tests__/computed.spec.ts

it("should compute lazily", () => {
  const value = reactive({
    foo: 1
  })

  const getter = jest.fn(() => value.foo)
  const cValue = computed(getter)
  
  // lazy
  expect(getter).not.toHaveBeenCalled()

  expect(cValue.value).toBe(1)
  expect(getter).toHaveBeenCalledTimes(1)

  // should not compute again
  cValue.value
  expect(getter).toHaveBeenCalledTimes(1)
  
  // should not compute until needed
  value.foo = 2
  expect(getter).toHaveBeenCalledTimes(1)

  // now it should computed
  expect(cValue.value).toBe(2)
  expect(getter).toHaveBeenCalledTimes(2)

  // should not compute again
  cValue.value
  expect(getter).toHaveBeenCalledTimes(2)
})
```

:::
::::

补充完测试用例，我们执行下测试命令，发现 `22-23行` 是通过的。因为我们目前只是设置了 `value.foo` 的值，并没有获取 `cValue.value` ，因此 `getter` 仍然只执行了一次，没毛病。

但是接下来当我们尝试获取 `cValue.value` 时，发现测试用例无法通过了：

![computed](https://user-images.githubusercontent.com/9375823/177301131-f838dd96-e682-48d2-a277-c5fd2f419fa4.png)

通过报错信息我们可以得知，`cValue.value` 的值并没有如我们所愿的变成2。原因也很简单，因为当我们再次获取 `cValue.value` 时，此时的 `_dirty === false`，因此不会重新执行 `getter` 方法，自然也就无法返回最新的值。

那么我们应该在什么时候将 `_dirty` 的值重新设置为 `true` 呢？其实在描述 **第二点** 的时候就已经透露了：**在响应式的值发生变化的时候**。在这里，我们的响应式的值其实指的就是 `value.foo`。

我们知道，当我们在设置 `value.foo` 的值时，会触发 `set` 方法，`set` 方法中会调用 `trigger` 方法触发依赖，所以我们只需要在触发依赖的过程中将 `_dirty` 设置为 `true` 即可。那我们要怎么才能做到这一点呢？

### 第一步：收集依赖

要想触发依赖，那得先收集依赖，不然谈何触发？

现在我们一起来回忆一下，**依赖收集** 的过程发生在 `get` 阶段，其中的 `track` 方法会收集 `activeEffect` 对象，也就是 `ReactiveEffect` 的实例对象。在上述测试用例中，什么时候会调用 `value.foo` 呢？答案是在首次获取 `cValue.value` 的时候。既然如此，我们就要想办法在此之前将 `this._dirty = true` 的操作存到 `activeEffect` 对象中，这样才能让 `track` 收集到。

既如此，我们就需要将 `ReactiveEffect` 抛出来，并在 `computed.ts` 中引入。并在初始化 `ComputedRefImpl` 时实例化它：

:::: code-group
::: code-group-item effect.ts

```ts
// src/reactivity/effect.ts

export class ReactiveEffect {
  // 省略一大波代码
}
```

:::

::: code-group-item computed.ts

```ts
// src/reactivity/computed.ts
import { ReactiveEffect } from './effect'

class ComputedRefImpl {
  private _getter: any
  private _dirty: boolean = true // 标记是否需要触发 getter
  private _value: any // 缓存值
  private _effect: ReactiveEffect
  
  constructor(getter) {
    this._getter = getter
    this._effect = new ReactiveEffect(this._getter, () => {
      if (!this._dirty) this._dirty = true
    })
  }

  get value() {
    // 值没有发生变化时，再次获取不会触发 getter
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}
```

:::
::::

::: warning 注意
这里我们将设置 `_dirty` 的操作放到了 `scheduler` 中。为什么这么做呢？因为在 `trigger` 的逻辑中，如果没有 `scheduler`, 则会执行 `run` 方法，这样一来就会多触发一次 `getter`。
:::

这样一来，在设置 `value.foo` 时，便会执行到 `scheduler` 方法，进而执行 `if (!this._dirty) this._dirty = true` 。当我们再次获取 `cValue.value` 时，此时的 `_dirty === true`，之后便能返回最新的值了。而且重复访问 `cValue.value` 时也就不会再次触发 `getter` 方法了。

至此，我们的功能就已实现完毕~
