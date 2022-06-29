/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-06-25 16:53:52
 * @LastEditors: ext.luhaifeng1
 * @LastEditTime: 2022-06-29 10:22:53
 * @Description: 
 */

import { readonly, isReadonly } from '../reactive'

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1, bar: { baz: 2 }}
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
    // 判断是否是 readonly 对象
    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(original.bar)).toBe(false)
    expect(isReadonly(wrapped.bar)).toBe(true)
    expect(isReadonly(wrapped)).toBe(true)
  })

  it('warn when call set', () => {
    console.warn = jest.fn()
    const user = readonly({ age: 10 })
    user.age = 11
    // 当设置 readonly 对象的值时，需要发出告警
    expect(console.warn).toBeCalled()
  })
})