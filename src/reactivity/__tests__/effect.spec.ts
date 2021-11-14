import { reactive } from '../reactive'
import { effect } from  '../effect'

describe('effect', () => {
  it ('should observe basic properties', () => {
    let dummy = 0
    const data = reactive({ num: 0 })
    effect(() => {
      dummy = data.num
    })
    expect(dummy).toBe(0)
    data.num = 1
    expect(dummy).toBe(1)
  })
})
