<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-06-29 17:52:33
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-29 20:51:14
 * @Description: 
-->
# shallowReadonly

::: tip
本篇笔记对应的分支号为: `main分支： 4c145d8`
:::

这里引用官方文档中关于 [shallowReadonly](https://v3.cn.vuejs.org/api/basic-reactivity.html#shallowreadonly) 的描述：

::: tip 概念
创建一个 proxy，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换 (暴露原始值)。
:::

`shallow` 本身有 `浅层，表层` 的意思。那这句话是什么意思呢？拆开来理解的话，`shallowReadonly` 主要包含以下两个特征：

> 1. `shallowReadonly` 返回的是一个 `readonly` 对象;
> 2. `shallowReadonly` 返回的对象内嵌套的对象 **不是** `readonly` 对象;

我们通过测试用例来加深下理解：

:::: code-group
::: code-group-item shallowReadonly.spec.ts

```ts
// src/reactivity/__tests/shallowReadonly.spec.ts

import { shallowReadonly, isReadonly } from '../reactive'

describe('shallowReadonly', () => {
  test('should not make non-reactive properties reactive', () => {
    const props = shallowReadonly({ n: { foo:1 }})
    // 最外层的对象是 readonly 对象
    expect(isReadonly(props)).toBe(true)
    // 内部嵌套的对象不是 readonly 对象
    expect(isReadonly(props.n)).toBe(false)
  })
})
```

:::
::::

现在我们已经知道了 `shallowReadonly` 的功能，那我们该如何实现它呢？

还记得我们是怎么实现 `readonly` 的么？`createGetter` 是否返回 `readonly` 对象取决于传入的第一个参数 `isReadonly` 是否为 `true`。我们可以如法炮制，给 `createGetter` 传入第二个参数： `isShallow` 用于标记是否需要返回 `shallow` 对象，之后根据该值进行判断: **如果 `isShallow === true`， 直接返回 `res` , 否则保持原有逻辑。**：

:::: code-group
::: code-group-item baseHandlers.ts

```ts{20}
// src/reactivity/baseHandlers.ts

/**
 * 用于生成 get 方法
 * @param isReadonly 是否是 readonly 对象
 * @returns 
 */
function createGetter(isReadonly = false, isShallow = false) {
  return function(target, key) {
    // 判断是否是 reactive 对象
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      // 判断是否是 readonly 对象
      return isReadonly
    }
    const res = Reflect.get(target, key)

    // 如果是 shallow，直接返回结果
    if (isShallow) return res

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    // 收集依赖
    !isReadonly && track(target, key)
    return res
  }
}
```

:::
::::

在此之后，我们需要为 `shallowReadonly` 定义 `shallowReadonlyHandlers`。由于 `shallowReadonly` 返回的也是 `readonly` 对象，它与 `readonly` 的唯一区别在于 `createGetter` 的第二个参数是否是 `true`。因此，我们可以复用之前定义的 `readonlyHandlers`。

还记得我们之前抽取的 `extend` 公共方法么? 这里它又派上用场啦：

:::: code-group
::: code-group-item baseHandlers.ts

```ts
// src/reactivity/baseHandlers.ts

import { isObject, extend } from '../shared'

const shallowReadonlyGet = createGetter(true, true)

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
})
```

:::
::::

最后，我们只需要在 `reactive.ts` 中定义 `shallowReadonly` 方法即可：

:::: code-group
::: code-group-item reactive.ts

```ts
// src/reactivity/reactive.ts

import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers'

/**
 * 创建 shallowReadonly 对象
 * @param raw 
 * @returns 
 */
export const shallowReadonly = raw => {
  return createActiveObject(raw, shallowReadonlyHandlers)
}
```

:::
::::
