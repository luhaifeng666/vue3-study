import { mutableHandlers } from './baseHandlers'

export const reactiveMap = new WeakMap()

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive"
}

/**
 * 创建reactive对象
 * @param target
 */
export function reactive (target) {
  return createReactiveObject(target, reactiveMap, mutableHandlers)
}

/**
 * 判断传入的对象是否是响应式对象
 * @param value
 */
export function isReactive (value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

/**
 * 创建响应式对象
 * @param target
 * @param proxyMap
 * @param baseHandlers
 */
export function createReactiveObject (target, proxyMap, baseHandlers) {
  // 判断proxy是否已经保存过
  if (proxyMap.has(target)) {
    // 如果存在，则返回
    return proxyMap.get(target)
  }

  const proxy = new Proxy(target, baseHandlers)

  // 存储创建好的proxy
  proxyMap.set(target, proxy)
  return proxy
}
