/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-09 10:23:38
 * @LastEditors: haifeng.lu
 * @LastEditTime: 2022-07-22 08:49:47
 * @Description: 
 */
import { App } from './main.js'
import { createApp } from '../../lib/mini-vue.esm.js'

const rootContainer = document.querySelector('#app')
createApp(App).mount(rootContainer)
