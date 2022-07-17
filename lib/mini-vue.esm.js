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
 * @LastEditTime: 2022-07-10 10:07:07
 * @Description:
 */
function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type
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
 * @LastEditTime: 2022-07-10 10:28:54
 * @Description:
 */
function render(vnode, container) {
    patch(vnode);
}
function patch(vnode, container) {
    // 处理组件
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    var subTree = instance.rener();
    patch(subTree);
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
            render(vnode);
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

export { createApp, h };
