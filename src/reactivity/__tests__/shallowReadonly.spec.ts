/*
 * @Author: ext.luhaifeng1 ext.luhaifeng1@jd.com
 * @Date: 2022-06-29 17:43:14
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-29 20:11:28
 * @Description: 
 */
import { shallowReadonly, isReadonly } from '../reactive'

describe('shallowReadonly', () => {
  test('should not make non-reactive properties reactive', () => {
    const props = shallowReadonly({ n: { foo:1 }})
    // 最外层的对象是 readonly 对象
    expect(isReadonly(props)).toBe(true)
    // 内部嵌套的对象不是 readonly 对象
    expect(isReadonly(props.n)).toBe(false)
  })
})