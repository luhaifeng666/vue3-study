/*
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2021-11-14 18:34:45
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-10 08:28:14
 * @Description: 
 */

let activeEffect;
class ReactiveEffect {
  private _fn: any
  
  constructor(fn) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    this._fn()
  }
}

const targetMap = new Map() // 存放依赖映射关系

/**
 * 收集依赖
 * @param target 需要收集依赖的对象
 * @param key 收集该key所对应的依赖
 */
export function track(target, key) {
  // 查找该对象对应的依赖池
  let depsMap = targetMap.get(target)
  // 如果没有（首次初始化时），则创建新的依赖池
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, targetMap)
  }
  // 从获取到的依赖池中获取该key所对应的依赖列表
  let deps = depsMap.get(key)
  // 如果没有，则新建一个该key对应的列表
  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }
  // 将依赖对象保存到列表中
  deps.add(activeEffect)
}

/**
 * 触发依赖
 * @param target 触发依赖的对象
 * @param key 触发该key对应的依赖
 */
export function trigger(target, key) {
  // 根据对象与key获取到所有的依赖，并执行
  const depsMap = targetMap.get(target)
  const deps = depsMap.get(key)
  for(const dep of deps) {
    dep.run()
  }
}

export function effect (fn) {
  const _effect = new ReactiveEffect(fn)

  _effect.run()
}