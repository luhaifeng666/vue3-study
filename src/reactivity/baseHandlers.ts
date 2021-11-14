import { track, trigger } from './effect'

const get = createGetter()
const set = createSetter()

export const mutableHandlers = {
  get,
  set
}

export function createGetter () {
  return function (target, key, receiver) {
    const res =  Reflect.get(target, key, receiver)

    // 触发依赖收集
    track(target, 'get', key)

    return res
  }
}

export function createSetter () {
  return function (target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver)
    trigger(target, key)
    return res
  }
}


