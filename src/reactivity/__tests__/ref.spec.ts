/*
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2022-06-30 15:00:53
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-03 10:26:12
 * @Description: 
 */

import { effect } from '../effect'
import { reactive } from '../reactive'
import { ref, isRef, unRef, proxyRefs } from '../ref'

describe('ref', () => {
  it('happy path', () => {
    const a = ref(1)
    expect(a.value).toBe(1)
  })

  it('should be reactive', () => {
    const a = ref(1)
    let dummy
    let calls = 0
    effect(() => {
      calls++
      dummy = a.value
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
    // same value should not trigger
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
  })

  it('should make nested properties reactive', () => {
    const a = ref({ count: 1 })
    let dummy
    effect(() => {
      dummy = a.value.count
    })
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  })

  it('isRef', () => {
    const a = ref(1)
    const user = reactive({ age: 10 })
    expect(isRef(a)).toBe(true)
    expect(isRef(1)).toBe(false)
    expect(isRef(user)).toBe(false)
  })

  it('unRef', () => {
    const a = ref(1)
    expect(unRef(a)).toBe(1)
    expect(unRef(1)).toBe(1)
  })
  
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
})