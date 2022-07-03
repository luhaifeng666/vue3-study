<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-03 10:27:06
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-03 10:59:00
 * @Description: 
-->
# proxyRefs

:::tip
本篇笔记对应的分支号为: `main分支： c6f5fd5`
:::

写过 Vue3 代码的小伙伴们应该知道，当我们在 `template` 中使用 `setup` 返回的 `ref` 对象的值时，是不需要通过 `.value` 的方式来获取的。之所以可以这么做，是因为 `proxyRefs` 对 `ref` 对象进行了处理。

我们先通过测试用例来看看 `proxyRefs` 都实现了哪些功能：

:::: code-group
::: code-group-item ref.spec.ts

```ts
// src/reactivity/__tests__/ref.spec.ts

it('proxyRefss', () => {
  const user = {
    age: ref(10),
    name: 'xiaohong'
  }
  // 调用 proxyUser 后，无需通过 .value 的方式获取 ref 的值
  const proxyUser  = proxyRefs(user)
  expect(user.age.value).toBe(10)
  expect(proxyUser.age).toBe(10)
  expect(proxyUser.name).toBe('xiaohong')
  
  proxyUser.age = 20
  expect(proxyUser.age).toBe(20)
  expect(user.age.value).toBe(20)
  
  proxyUser.age = ref(10)
  expect(proxyUser.age).toBe(10)
  expect(user.age.value).toBe(10) 
})
```

:::
::::

通过测试用例我们可以得知：

> 1. 当调用了 `proxyRefs` 方法后，可以不通过 `.value` 的方式获取 `ref` 对象上的值；
> 2. 当给 `proxyRefs` 方法返回值中的 `ref` 对象赋值时，如果是个基本类型， 则修改 `ref` 对象上的 value 值，而如果所赋的值是个 `ref` 对象，则直接覆盖。

我们先来实现第一个功能。通过方法名称我们可以知道，`proxyRefs` 返回的是 `proxy` 对象。第一个功能比较简单，既然调用它之后不用使用 `.value` 的方式来获取 `ref` 上的值，那么我们直接将 `.value` 的值返回即可。而针对非 `ref` 对象，只需要将其原样返回。这个功能看着是不是有点眼熟？其实就是上一节我们实现的 `unRef`，这里我们直接使用就行：

:::: code-group
::: code-group-item ref.ts

```ts
// src/reactivity/ref.ts

/**
 * template 中调用此方法，目的是在页面中无需通过 .value 的方式获取 ref 的值
 * @param objectWithRefs 
 * @returns 
 */
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    }
  })
}
```

:::
::::

接下来我们一起实现下第二个功能。第二个功能拆分下来其实就是以下几种情况：

> 1. 当给原先是 `ref` 对象的属性设置 **非 `ref` 对象** 的值时，需要修改其 `.value` 的值；
> 2. 当给原先是 `ref` 对象的属性设置 **`ref` 对象** 的值时，直接覆盖；
> 3. 当给原先不是 `ref` 对象的属性设置 **非 `ref` 对象** 的值时，直接覆盖；
> 4. 当给原先不是 `ref` 对象的属性设置 **`ref` 对象** 的值时，直接覆盖；

因此，我们只需要对当前修改的属性值类型以及传入的值类型进行判断即可，**当给原先是 `ref` 对象的属性设置非 `ref` 对象的值时，需要修改其 `.value` 的值， 否则直接进行覆盖。** 由此我们可以对 `set` 的逻辑进行补充，这里对 `ref` 对象的判断可以使用我们上一节实现的 `isRef` 方法：

:::: code-group
::: code-group-item ref.ts

```ts
// src/reactivity/ref.ts

/**
 * template 中调用此方法，目的是在页面中无需通过 .value 的方式获取 ref 的值
 * @param objectWithRefs 
 * @returns 
 */
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    }

    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return target[key].value = value
      } else {
        return Reflect.set(target, key, value)
      }
    }
  })
}
```

:::
::::

至此，`proxyRefs` 功能就实现完成啦~
