/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-06-21 22:40:20
 * @LastEditors: ext.luhaifeng1
 * @LastEditTime: 2022-06-30 15:50:19
 * @Description: 全局通用方法
 */
export const extend = Object.assign

/**
 * 判断传入的值是否是个对象
 * @param val 
 * @returns 
 */
export const isObject = val => {
  return val !== null && typeof(val) === 'object'
}

/**
 * 判断值是否发生变化
 * @param val 原值
 * @param newValue 新值 
 * @returns 
 */
export const hasChanged = (val, newValue) => !(Object.is(val, newValue))
