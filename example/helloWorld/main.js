/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-10 09:35:23
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-17 17:25:51
 * @Description: 
 */
import { h } from '../../lib/mini-vue.esm.js'
export const App = {
  render() {
    return h('div', 'hello ' + this.msg)
  },

  setUp() {
    return {
      msg: 'world'
    }
  }
}
