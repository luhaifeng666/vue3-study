/*
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2021-11-14 18:35:25
 * @LastEditors: ext.luhaifeng1
 * @LastEditTime: 2022-06-27 22:21:59
 * @Description: 
 */
import { reactive } from '../reactive'
import { effect, stop } from '../effect'

describe('effect', () => {
  it('happy path', () => {
    // 创建响应式对象
    const user = reactive({
      age: 10
    })
    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })
    // 传入 effect 的方法会被立即执行一次
    expect(nextAge).toBe(11)
    // 修改响应式对象的属性值
    user.age++
    // 传入 effect 的方法会再次被执行
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

  it('scheduler', () => {
    let dummy
    let run: any
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(() => {
      dummy = obj.foo
    }, { scheduler })
    // 首次执行 effect 时不会调用 scheduler 方法
    expect(scheduler).not.toHaveBeenCalled()
    // 首次执行 effect 时会调用传入的第一个方法，此时给 dummy 赋值
    expect(dummy).toBe(1)
    // 触发响应式对象值改变
    obj.foo++
    // 会执行 scheduler 方法，但是不会执行第一个参数
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)
    // 执行 runner 方法时，会执行传入的第一个方法
    run()
    expect(dummy).toBe(2)
  })

  it('stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    // 调用 stop 后，响应式对象属性变化时不再触发 fn
    stop(runner)
    // obj.prop = 3
    // obj.prop = obj.prop + 1
    // get  =>  set
    obj.prop++
    expect(dummy).toBe(2)
    // 被停用的 effect 仍可以被调用
    runner()
    expect(dummy).toBe(3)
  })
  
  it('onStop', () => {
    const obj = reactive({ prop: 1 })
    const onStop = jest.fn()
    let dummy
    const runner = effect(() => {
      dummy = obj.prop
    }, {
      onStop
    })
    expect(dummy).toBe(1)
    // 当调用stop时，onStop 会被调用一次
    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  })
})