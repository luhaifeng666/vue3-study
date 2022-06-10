/*
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2021-11-14 18:35:25
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-10 08:03:31
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
})