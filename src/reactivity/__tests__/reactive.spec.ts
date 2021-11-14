import { reactive, isReactive } from '../reactive'

describe('reactive', () => {
  it ('happy path', () => {
    const original = { foo: 1 }
    // 创建响应式对象
    const observeOriginal = reactive(original)
    // 响应式对象与原对象应该不相等，因为observeOriginal被Proxy包裹
    expect(original).not.toBe(observeOriginal)
    // observeOriginal 是响应式对象
    // expect(isReactive(observeOriginal)).toBe(true)
    // // original 不是响应式对象
    // expect(isReactive(original)).toBe(false)
    // 取值
    expect(observeOriginal.foo).toBe(1)
  })
})
