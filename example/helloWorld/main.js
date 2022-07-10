/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-10 09:35:23
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-10 09:36:51
 * @Description: 
 */
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
