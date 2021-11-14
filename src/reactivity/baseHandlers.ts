const get = createGetter()
const set = createSetter()

export const mutableHandlers = {
  get,
  set
}

export function createGetter () {
  return function (target, key, receiver) {
    return Reflect.get(target, key, receiver)
  }
}

export function createSetter () {
  return function (target, key, value, receiver) {
    Reflect.set(target, key, value, receiver)
  }
}


