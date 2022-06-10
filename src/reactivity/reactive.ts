/*
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2021-11-14 14:41:24
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-10 08:12:16
 * @Description: 
 */
import { track, trigger } from './effect'

export const reactive = (raw) => {
  return new Proxy(raw, {
    // 取值
    get(target, key) {
      const res = Reflect.get(target, key)
      // 收集依赖
      track(target, key)
      return res
    },
    // 赋值
    set(target, key, value) {
      const res = Reflect.set(target, key, value)
      // 触发依赖
      trigger(target, key)
      return res
    }
  })
}