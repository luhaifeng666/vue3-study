<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-01 14:54:15
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-01 16:25:46
 * @Description: 
-->

# isRef & unRef

这是两个工具方法。

> - `isRef` 用于判断传入的值是否是 `ref` 对象;
> - `unRef` 用于返回传入 `ref` 对象的 `value` 值。如果传入的不是 `ref` 对象，则将值原样返回。

## isRef

老规矩，我们还是先来编写对应的测试用例：

:::: code-group
::: code-group-item ref.spec.ts

```ts
// src/reactivity/__tests__/ref.spec.ts

it('isRef', () => {
  const a = ref(1)
  const user = reactive({ age: 10 })
  expect(isRef(a)).toBe(true)
  expect(isRef(1)).toBe(false)
  expect(isRef(user)).toBe(false)
})
```

:::
::::

那我们要如何判断传入的对象是否是个 `ref` 对象呢？我们可以在 `RefImpl` 类中定义一个属性 `__v_isRef`，用于标识 `ref` 对象。之后我们对传入的值进行判断，如果有这个属性，那么它就是个 `ref` 对象：

:::: code-group
::: code-group-item ref.ts

```ts{7,36-38}
// src/reactivity/ref.ts

class RefImpl {
  private _value: any
  private _rawValue: any // 保存原始值，用于 set 阶段对比值是否发生了变化
  deps: Set<any>
  __v_isRef = true

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
 * 用于判断传入的值是否是 ref
 * @param ref 
 * @returns 
 */
export function isRef(ref) {
  return !!ref.__v_isRef
}
```

:::
::::

## unRef

话不多说，上测试用例：

:::: code-group
::: code-group-item ref.spec.ts

```ts
// src/reactivity/__tests__/ref.spec.ts

it('unRef', () => {
  const a = ref(1)
  expect(unRef(a)).toBe(1)
  expect(unRef(1)).toBe(1)
})
```

:::
::::

`unRef` 的实现其实很简单，只要判断传入的值是否是 `ref` 对象即可。上面我们已经实现了 `isRef`，现在要做的只是返回对应的值就好了：

:::: code-group
::: code-group-item ref.ts

```ts
// src/reactivity/ref.ts

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}
```

:::
::::
