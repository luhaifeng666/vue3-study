/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-10 09:35:23
 * @LastEditors: haifeng.lu
 * @LastEditTime: 2022-07-22 09:01:36
 * @Description: 
 */
import { h } from '../../lib/mini-vue.esm.js'
export const App = {
  render() {
    return h('div', {}, 'hello ' + this.msg)
  },

  setUp() {
    return {
      msg: 'world'
    }
  }
}
