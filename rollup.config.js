/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-07-16 15:24:17
 * @LastEditors: haifeng.lu
 * @LastEditTime: 2022-07-22 08:48:27
 * @Description: 
 */
import typescript from "@rollup/plugin-typescript"
export default {
  input: "./src/index.ts",
  output: [
    {
      format: 'cjs',
      file: 'lib/mini-vue.cjs.js',
      exports: 'auto'
    },
    {
      format: 'es',
      file: 'lib/mini-vue.esm.js',
      exports: 'auto'
    }
  ],
  plugins: [
    typescript()
  ]
}