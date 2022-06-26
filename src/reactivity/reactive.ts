/*
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2021-11-14 14:41:24
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-26 15:41:55
 * @Description: 
 */
import { mutableHandlers, readonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

/**
 * 创建proxy对象
 * @param raw 需要被代理的对象
 * @param baseHandlers 代理拦截
 * @returns 
 */
function createActiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}


/**
 * 创建 reactive 对象
 * @param raw 需要被代理的对象
 * @returns 
 */
export const reactive = (raw) => {
  return createActiveObject(raw, mutableHandlers)
}

/**
 * 创建 readonly 对象
 * @param raw 需要被代理的对象
 * @returns 
 */
export const readonly = (raw) => {
  return createActiveObject(raw, readonlyHandlers)
}

// 判断是否是 reactive 对象
export const isReactive = value => !!value[ReactiveFlags.IS_REACTIVE]

// 判断是否是 readonly 对象
export const isReadonly = value => !!value[ReactiveFlags.IS_READONLY]
