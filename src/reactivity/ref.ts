/*
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2022-06-30 15:06:08
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-03 10:26:01
 * @Description: 
 */

import { trackEffects, triggerEffects, isTracking } from './effect'
import { hasChanged, isObject } from '../shared'
import { reactive } from './reactive'

class RefImpl {
  private _value: any
  private _rawValue: any // 保存原始值，用于 set 阶段对比值是否发生了变化
  deps: Set<any>
  __v_isRef = true

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

/**
 * 用于判断传入的值是否是 ref
 * @param ref 
 * @returns 
 */
export function isRef(ref) {
  return !!ref.__v_isRef
}

/**
 * 用于返回 ref 的value值
 * 如果传入的不是 ref，则原样返回
 * @param ref 
 */
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}

/**
 * template 中调用此方法，目的是在页面中无需通过 .value 的方式获取 ref 的值
 * @param objectWithRefs 
 * @returns 
 */
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },

    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return target[key].value = value
      } else {
        return Reflect.set(target, key, value)
      }
    }
  })
}