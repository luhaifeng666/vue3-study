'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-10 09:42:52
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-10 09:43:24
 * @Description:
 */
function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children
    };
    return vnode;
}

/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-10 09:53:01
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-08-01 08:31:42
 * @Description:
 */
function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {}
    };
    return component;
}
function setupComponent(instance) {
    // initProps()
    // initSlots()
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    instance.proxy = new Proxy({}, {
        get: function (target, key) {
            var setupState = instance.setupState;
            if (key in setupState) {
                return setupState[key];
            }
        }
    });
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-10 09:44:49
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-08-01 08:38:21
 * @Description:
 */
function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    var type = vnode.type;
    if (typeof type === 'string') {
        // 处理Element
        processElement(vnode, container);
    }
    else {
        // 处理组件
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    var type = vnode.type, children = vnode.children, props = vnode.props;
    var el = document.createElement(type);
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    for (var key in props) {
        var val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (child) {
        patch(child, container);
    });
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    var proxy = instance.proxy;
    console.log(instance);
    var subTree = instance.type.render.call(proxy);
    patch(subTree, container);
}

/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-10 09:39:37
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-10 10:37:59
 * @Description:
 */
function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            var vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-16 15:33:50
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-17 16:33:23
 * @Description:
 */
function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
