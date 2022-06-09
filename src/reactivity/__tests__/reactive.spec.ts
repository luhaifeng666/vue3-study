/*
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2021-11-14 14:42:52
 * @LastEditors: ext.luhaifeng1
 * @LastEditTime: 2022-06-09 08:22:52
 * @Description: 
 */
import { reactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const origin = { num: 0 }

    const reactiveData = reactive(origin)

    expect(reactiveData).not.toBe(origin)

    expect(reactiveData.num).toBe(0)
  })
})