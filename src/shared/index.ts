/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-06-21 22:40:20
 * @LastEditors: ext.luhaifeng1
 * @LastEditTime: 2022-06-29 10:10:09
 * @Description: 全局通用方法
 */
export const extend = Object.assign

export function isObject(val) {
  return val !== null && typeof(val) === 'object'
}