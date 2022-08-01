/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-10 09:44:49
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-08-01 08:57:37
 * @Description: 
 */
import { createComponentInstance, setupComponent } from "./component"
import { isObject } from '../shared/index';
export function render(vnode, container) {
  patch(vnode, container)
}

function patch(vnode, container) {
  const { type } = vnode
  if (typeof type === 'string') {
    // 处理Element
    processElement(vnode, container)
  } else {
    // 处理组件
    processComponent(vnode, container)
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}

function mountElement(vnode: any, container: any) {
  const { type, children, props } = vnode
  const el = (vnode.el = document.createElement(type))

  if (typeof children === 'string') {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el)
  }

  for(const key in props) {
    const val = props[key]
    el.setAttribute(key, val)
  }

  container.append(el)
}

function mountChildren(vnode: any, container: any) {
  vnode.children.forEach(child => {
    patch(child, container)
  })
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance)
  setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance, vnode, container) {
  const { proxy } = instance
  const subTree = instance.type.render.call(proxy);
  patch(subTree, container)
  vnode.el = subTree.el
}