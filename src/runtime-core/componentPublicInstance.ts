/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-08-01 09:01:09
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-08-01 09:06:20
 * @Description: 
 */
const publicPropertiesMap = {
  $el: i => i.vnode.el
}

export const PublicInstanceProxyHandlers = {
  get ({_: instance}, key) {
    const { setupState } = instance
      // 通过 this.xxxx 获取值
      if (key in setupState) {
        return setupState[key]
      }
      // 通过 this.$el 获取值
      const publicGetter = publicPropertiesMap[key]
      if (publicGetter) {
        return publicGetter(instance)
      }
  }
}