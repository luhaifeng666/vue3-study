/**
 * 存储effects对象
 * @param effects
 */
export function createDep(effects) {
  return new Set(effects)
}
