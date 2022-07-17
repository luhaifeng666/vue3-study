/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-16 15:24:17
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-07-16 15:27:04
 * @Description: 
 */
import typescript from "@rollup/plugin-typescript"
export default {
  input: "./src/index.ts",
  output: [
    {
      format: 'cjs',
      file: 'lib/mini-vue.cjs.js'
    },
    {
      format: 'es',
      file: 'lib/mini-vue.esm.js'
    }
  ],
  plugins: [
    typescript()
  ]
}