/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-10 09:42:52
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-10 09:43:24
 * @Description: 
 */
export function createVNode(type, props?, children?) {
  const vnode = {
    type, props, children
  }

  return vnode
}