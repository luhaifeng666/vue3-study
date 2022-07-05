/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-05 14:21:37
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-05 15:24:21
 * @Description: 
 */
import { reactive } from '../reactive'
import { computed } from '../computed'

describe("computed", () => {
  it("happy path", () => {
    const user = reactive({
      age: 1
    })

    const age = computed(() => user.age)
    
    expect(age.value).toBe(1)
  })

  it("should compute lazily", () => {
    const value = reactive({
      foo: 1
    })

    const getter = jest.fn(() => value.foo)
    const cValue = computed(getter)
    
    // lazy
    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)
    
    // should not compute until needed
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    // now it should computed
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })
})
