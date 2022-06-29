/*
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2022-06-29 17:43:14
 * @LastEditors: ext.luhaifeng1
 * @LastEditTime: 2022-06-29 17:46:39
 * @Description: 
 */
import { shallowReadonly, isReadonly } from '../reactive'

describe('shallowReadonly', () => {
  test('should not make non-reactive properties reactive', () => {
    const props = shallowReadonly({ n: { foo:1 }})
    expect(isReadonly(props)).toBe(true)
    expect(isReadonly(props.n)).toBe(false)
  })
})