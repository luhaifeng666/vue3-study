/*
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2021-11-14 14:41:24
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-25 17:46:08
 * @Description: 
 */
import { mutableHandlers, readonlyHandlers } from './baseHandlers'

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