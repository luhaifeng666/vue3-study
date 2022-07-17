/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-16 15:33:50
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-17 16:33:23
 * @Description: 
 */
import { createVNode } from "./vnode";

export function h(type, props?, children?) {
  return createVNode(type, props, children) 
}