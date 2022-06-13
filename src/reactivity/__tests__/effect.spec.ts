/*
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2021-11-14 18:35:25
 * @LastEditors: ext.luhaifeng1
 * @LastEditTime: 2022-06-13 08:05:49
 * @Description: 
 */
import { reactive } from '../reactive'
import { effect } from '../effect'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10
    })
    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(11)
    user.age++
    expect(nextAge).toBe(12)
  })

  it('renturn a runner when call effect', () => {
    // 1. 调用 effect 会立即执行传过去的函数 fn
    // 2. 调用完成后，effect 会返回一个 runner 函数
    // 3. 执行 runner 函数，会再次执行传入 effect 的函数 fn，并返回 fn 的 返回值
    let foo = 10
    const runner = effect(() => {
      foo++
      return 'foo'
    })
    expect(foo).toBe(11)
    const res = runner()
    expect(foo).toBe(12)
    expect(res).toBe('foo')
  })
})