/*
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2021-11-14 18:34:45
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-21 22:53:42
 * @Description: 
 */

import { extend } from '../shared'

let activeEffect;
class ReactiveEffect {
  private _fn: any
  public scheduler: Function | undefined
  active = true // 是否需要清空 deps
  onStop?: () => void
  deps = []
  
  constructor(fn, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    activeEffect = this
    return this._fn()
  }

  stop() {
    if (this.active) {
      cleanEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

/**
 * 清空 deps
 * @param effect effct 对象
 */
function cleanEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
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
    targetMap.set(target, depsMap)
  }
  // 从获取到的依赖池中获取该key所对应的依赖列表
  let deps = depsMap.get(key)
  // 如果没有，则新建一个该key对应的列表
  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }

  if (activeEffect) {
    // 将依赖对象保存到列表中
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
  }
}

/**
 * 触发依赖
 * @param target 触发依赖的对象
 * @param key 触发该key对应的依赖
 */
export function trigger(target, key) {
  // 根据对象与key获取到所有的依赖，并执行
  const depsMap = targetMap.get(target)
  // 如果没有找到 depsMap, 直接 return
  if (!depsMap) {
    return
  }
  const deps = depsMap.get(key)
  for(const dep of deps) {
    // 判断是否存在 scheduler 方法，存在的的话执行 scheduler，否则执行run
    if(dep.scheduler) {
      dep.scheduler()
    } else {
      dep.run()
    }
  }
}

/**
 * 
 * @param fn 
 * @param options 
 * @returns runner
 */
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  extend(_effect, options)

  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}

/**
 * 停止 effect
 * @param runner 
 */
export function stop(runner) {
  runner.effect.stop()
}
