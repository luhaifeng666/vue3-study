/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-09 10:23:38
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-17 16:37:22
 * @Description: 
 */
import App from './main'
import createApp from '../../lib/mini-vue.esm'

const rootContainer = document.querySelector('#app')
createApp(App).mount(rootContainer)
