<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-06-25 17:49:52
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-26 11:16:47
 * @Description: 
-->
# readonly

::: tip
本篇笔记对应的分支号为: `main分支：4162b7d`
:::

顾名思义，`readonly` 返回的对象是 `只读` 的，意味着其中的属性不可被修改。如果尝试对其属性进行修改，需要给出相应的提示。

它与 `reactive` 方法的异同之处如下：

> 1. **同**： 它们都返回了一个 `Proxy` 对象;
> 2. **异**： 由于 `readonly` 返回的对象属性不可更改，因此在 `readonly` 中无需进行 `依赖收集` 以及 `依赖触发`。

## 实现 readonly

根据上文的描述，我们来编写下 `readonly` 的测试用例：

:::: code-group
::: code-group-item readonly.spec.ts

```ts
// src/reactivity/__tests__/readonly.spec.ts

import { readonly } from '../reactive'

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1, bar: { bar: 2 }}
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
  })

  it('warn when call set', () => {
    console.warn = jest.fn()
    const user = readonly({ age: 10 })
    user.age = 11
    // 当设置 readonly 对象的值时，需要发出告警
    expect(console.warn).toBeCalled()
  })
})
```

:::
::::

由于 `readonly` 无需进行 `依赖收集` 以及 `依赖触发`，所以它的实现其实非常简单：

:::: code-group
::: code-group-item reactive.ts

```ts
// src/reactivity/reactive.ts

export function readonly(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key)
    }

    set(target, key, value) {
      // 当尝试设置 readonly 的属性值时，需要给出告警提示
      console.warn(`${key} can't be setted!`, target)
      return true
    }
  })
}
```

:::
::::

## 代码优化

当当~又到了我们熟悉的代码优化环节~ 🥳

我们先将 `reactive` 以及 `readonly` 的逻辑放到一起来看下：

:::: code-group
::: code-group-item reactive.ts

``` ts
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

export function readonly(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key)
      return res
    }

    set(target, key, value) {
      // 当尝试设置 readonly 的属性值时，需要给出告警提示
      console.warn(`${key} can't be setted!`, target)
      return true
    }
  })
}
```

:::
::::

不难发现的是，两者的代码结构非常相似，此时，我们可以将类似的逻辑抽取出来。

### 抽取 get

两者 `get` 的区别在于是否需要进行依赖收集，我们可以定义一个函数 `createGetter` 用于返回 `get`，并通过传入 `isReadonly` 来决定返回的 `get` 是否需要进行依赖收集：

:::: code-group
::: code-group-item reactive.ts

```ts
// src/reactivity/reactive.ts

function createGetter(isReadonly = false) {
  return function(target, key) {
    const res = Reflect.get(target, key)
    // 收集依赖
    !isReadonly && track(target, key)
    return res
  }
}
```

:::
::::

抽取之后，原先的代码就可以改写成这样：

:::: code-group
::: code-group-item reactive.ts

``` ts
// src/reactivity/reactive.ts

import { track, trigger } from './effect'

function createGetter(isReadonly = false) {
  return function(target, key) {
    const res = Reflect.get(target, key)
    // 收集依赖
    !isReadonly && track(target, key)
    return res
  }
}

export const reactive = (raw) => {
  return new Proxy(raw, {
    // 取值
    get: createGetter(),
    // 赋值
    set(target, key, value) {
      const res = Reflect.set(target, key, value)
      // 触发依赖
      trigger(target, key)
      return res
    }
  })
}

export function readonly(raw) {
  return new Proxy(raw, {
    get: createGetter(true),

    set(target, key, value) {
      // 当尝试设置 readonly 的属性值时，需要给出告警提示
      console.warn(`${key} can't be setted!`, target)
      return true
    }
  })
}
```

:::
::::

相较之前，代码就简洁了许多。

### 抽取 set

依葫芦画瓢，我们可以将 `set` 也抽取出来。由于 `readonly` 的 `set` 实现与 `reactive` 的相似之处不多，因此，我们暂时只对 `reactive` 的进行改造：

:::: code-group
::: code-group-item reactive.ts

``` ts
// src/reactivity/reactive.ts

import { track, trigger } from './effect'

function createGetter(isReadonly = false) {
  return function(target, key) {
    const res = Reflect.get(target, key)
    // 收集依赖
    !isReadonly && track(target, key)
    return res
  }
}

function createSetter() {
  return function(target, key, value) {
    const res = Reflect.set(target, key, value)
    // 触发依赖
    trigger(target, key)
    return res
  }
}

export const reactive = (raw) => {
  return new Proxy(raw, {
    // 取值
    get: createGetter(),
    // 赋值
    set: createSetter()
}

export function readonly(raw) {
  return new Proxy(raw, {
    get: createGetter(true),

    set(target, key, value) {
      // 当尝试设置 readonly 的属性值时，需要给出告警提示
      console.warn(`${key} can't be setted!`, target)
      return true
    }
  })
}
```

:::
::::

### 抽取 baseHandlers

代码优化到这里，我们来看看还有哪些可以被优化的部分。

> 1. `reactive` 与 `readonly` 返回的都是 `Proxy` 代理对象，且都做了 `get` 与 `set` 操作的劫持处理。因此，我们可以创建一个 `baseHandlers` 对象，用于定义 `Proxy` 的 `get` 与 `set`，并将其抽取到单独的 `baseHandlers` 模块中;
> 2. 在每次执行 `reactive` 或者 `readonly` 方法时，`createGetter` 与 `createSetter` 方法总是会被执行。此时，我们可以在首次执行时将执行结果缓存下来，以提升性能；
> 3. 两者都返回了 `new Proxy`, 我们可以定义一个更加见名知意的方法 `createActiveObject` 用于返回 `Proxy` 对象。

:::: code-group
::: code-group-item baseHandlers.ts

``` ts
// src/reactivity/baseHandlers.ts

import { track, trigger } from './effect'

function createGetter(isReadonly = false) {
  return function(target, key) {
    const res = Reflect.get(target, key)
    // 收集依赖
    !isReadonly && track(target, key)
    return res
  }
}

function createSetter() {
  return function(target, key, value) {
    const res = Reflect.set(target, key, value)
    // 触发依赖
    trigger(target, key)
    return res
  }
}

// 缓存，避免重复调用
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    // 当尝试设置 readonly 的属性值时，需要给出告警提示
    console.warn(`${key} can't be setted!`, target)
    return true
  }
}
```

::: code-group-item reactive.ts

``` ts
// src/reactivity/reactive.ts

import { mutableHandlers, readonlyHandlers } from './baseHandlers'

/**
 * 创建proxy对象
 * @param raw 需要被代理的对象
 * @param baseHandlers 代理拦截
 * @returns 
 */
function createActiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}

/**
 * 创建 reactive 对象
 * @param raw 需要被代理的对象
 * @returns 
 */
export const reactive = (raw) => {
  return createActiveObject(raw, mutableHandlers)
}

/**
 * 创建 readonly 对象
 * @param raw 需要被代理的对象
 * @returns 
 */
export const readonly = (raw) => {
  return createActiveObject(raw, readonlyHandlers)
}
```

:::

:::
::::

至此，我们的优化告一段落~此时的代码就会显得更加简洁，可读性也会更强。
