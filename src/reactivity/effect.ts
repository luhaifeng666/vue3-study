import { createDep } from './dep'

let activeEffect = void 0
const targetMap = new WeakMap()

export class ReactiveEffect {
  // 存放所有依赖
  public deps: any = new Set()

  // 初始化依赖列表
  constructor(fn) {
    if (fn) this.deps.add(fn)
  }

  // 执行收集到的所有依赖
  run () {
    activeEffect = this as any
    this.deps.forEach(dep => dep())
  }
}

/**
 * 依赖收集
 * @param target
 * @param type
 * @param key
 */
export function track(target, type, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = createDep()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}

/**
 * 触发依赖
 * @param target
 * @param key
 */
export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)

  // 遍历执行依赖
  for(const effect of dep) {
    effect.run()
  }
}

/**
 *
 * @param fn
 */
export function effect(fn) {
  const reactiveEffect = new ReactiveEffect(fn)
  reactiveEffect.run()
}
