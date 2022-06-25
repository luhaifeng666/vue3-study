/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2021-11-14 15:06:13
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-25 17:45:26
 * @Description: 
 */
import { track, trigger } from './effect'

function createGetter(isReadonly = false) {
  return function(target, key) {
    const res = Reflect.get(target, key)
    // 收集依赖
    !isReadonly && track(target, key)
    return res
  }
}

function createSetter() {
  return function(target, key, value) {
    const res = Reflect.set(target, key, value)
    // 触发依赖
    trigger(target, key)
    return res
  }
}

// 缓存，避免重复调用
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    // 当尝试设置 readonly 的属性值时，需要给出告警提示
    console.warn(`${key} can't be setted!`, target)
    return true
  }
}
