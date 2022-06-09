/*
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2021-11-14 14:41:24
 * @LastEditors: ext.luhaifeng1
 * @LastEditTime: 2022-06-09 08:27:40
 * @Description: 
 */

export const reactive = (raw) => {
  return new Proxy(raw, {
    // 取值
    get(target, key) {
      const res = Reflect.get(target, key)
      return res
    },
    // 赋值
    set(target, key, value) {
      const res = Reflect.set(target, key, value)
      return res
    }
  })
}