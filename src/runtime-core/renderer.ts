/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-10 09:44:49
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-10 10:28:54
 * @Description: 
 */
import { createComponentInstance, setupComponent } from "./component"
export function render(vnode, container) {
  patch(vnode, container)
}

function patch(vnode, container) {
  // 处理组件
  processComponent(vnode, container)
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  const subTree = instance.rener();
  patch(subTree, container)
}