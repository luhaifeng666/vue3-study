/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-10 09:39:37
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-10 10:37:59
 * @Description: 
 */
import { createVNode } from "./vnode"
import { render } from './renderer'
export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const vnode = createVNode(rootComponent)

      render(vnode, rootContainer)
    }
  }
}
