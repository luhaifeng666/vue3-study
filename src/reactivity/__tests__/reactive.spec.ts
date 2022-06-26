/*
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2021-11-14 14:42:52
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-26 14:50:54
 * @Description: 
 */
import { reactive, isReactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const origin = { num: 0 }
    // 通过 reactive 创建响应式对象
    const reactiveData = reactive(origin)
    // 判断响应式对象与原对象不是同一个对象
    expect(reactiveData).not.toBe(origin)
    // 代理对象中的 num 值应与原对象中的相同
    expect(reactiveData.num).toBe(0)
    // 判断是否是 reactive 对象
    expect(isReactive(origin)).toBe(false)
    expect(isReactive(reactiveData)).toBe(true)
  })
})