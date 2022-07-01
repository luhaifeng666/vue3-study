/*
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2022-06-30 15:06:08
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-01 11:10:25
 * @Description: 
 */

import { trackEffects, triggerEffects, isTracking } from './effect'
import { hasChanged, isObject } from '../shared'
import { reactive } from './reactive'

class RefImpl {
  private _value: any
  deps: Set<any>
  private _rawValue: any // 保存原始值，用于 set 阶段对比值是否发生了变化

  constructor(value: any) {
    this._rawValue = value
    this._value = convert(value)
    this.deps = new Set()
  }

  get value() {
    // 可以进行 track 时才进行依赖收集
    isTracking() && trackEffects(this.deps)
    return this._value
  }

  set value(newValue: any) {
    // 如果值没有发生变化，不会触发 trigger
    if (hasChanged(this._rawValue, newValue)) {
      this._rawValue = newValue
      this._value = convert(newValue)
      triggerEffects(this.deps)
    }
  }
}

/**
 * 判断传入 ref 的值是否是对象类型，如果是对象类型，需要使用 reactive 进行包裹
 * @param value 
 * @returns 
 */
function convert(value) {
  return isObject(value) ? reactive(value) : value
}

export function ref(value) {
  return new RefImpl(value)
}