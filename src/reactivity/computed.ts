/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-05 14:25:24
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-05 18:08:38
 * @Description: 
 */
import { ReactiveEffect } from './effect'

class ComputedRefImpl {
  private _getter: any
  private _dirty: boolean = true // 标记是否需要触发 getter
  private _value: any // 缓存值
  private _effect: ReactiveEffect
  
  constructor(getter) {
    this._getter = getter
    this._effect = new ReactiveEffect(this._getter, () => {
      if (!this._dirty) this._dirty = true
    })
  }

  get value() {
    // 值没有发生变化时，再次获取不会触发 getter
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}

export const computed = getter => new ComputedRefImpl(getter)