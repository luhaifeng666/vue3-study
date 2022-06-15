/*
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2021-11-14 14:42:52
 * @LastEditors: ext.luhaifeng1
 * @LastEditTime: 2022-06-15 16:20:01
 * @Description: 
 */
import { reactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const origin = { num: 0 }
    // 通过 reactive 创建响应式对象
    const reactiveData = reactive(origin)
    // 判断响应式对象与原对象不是同一个对象
    expect(reactiveData).not.toBe(origin)
    // 代理对象中的 num 值应与原对象中的相同
    expect(reactiveData.num).toBe(0)
  })
})