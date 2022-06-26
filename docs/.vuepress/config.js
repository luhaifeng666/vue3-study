/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-06-26 10:05:23
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2022-06-26 10:10:05
 * @Description: 
 */

const fs = require('fs')
const { searchPlugin } = require('@vuepress/plugin-search')
const { commentPlugin } = require('vuepress-plugin-comment2')
const { commentTheme } = require('./public/themes')
const BASE_URL = './docs/miniVue/notes'

let getMenus = function() {
	const urls = fs.readdirSync(BASE_URL)

  return urls.filter(
    url => ['.md', '.DS_Store'].every(
      item => !url.includes(item)
    )
  ).map(url => ({
    text: url.split('')
      .map((chart, index) => !index ? chart.toUpperCase() : chart)
      .join(''),
    collapsible: true,
    children: fs.readdirSync(`${BASE_URL}/${url}`).map(name => `/miniVue/notes/${url}/${name}`)
  }))
}

let config = {
	title: 'vue3-study',
	description: ' ',
	base: '/vue3-study/',
	head: [
		['link', { rel: 'icon', href: '/images/logo.svg' }]
	],
	markdown: {
		lineNumbers: true
	},
	theme: commentTheme({
		lastUpdated: 'Last Updated',
		sidebarDepth: 2,
		sidebar: {
      '/miniVue/notes/': [
        {
          text: '开始之前',
          link: '/miniVue/notes/prerequisites.md',
        },
        ...getMenus()
      ],
    },
		navbar: [
			{ text: 'Home', link: '/' },
			{ text: 'Notes', link: '/miniVue/notes/'},
			{ text: '酱豆腐精的小站', link: 'https://luhaifeng666.github.io' },
			{ text: 'GitHub', link: 'https://github.com/luhaifeng666/vue3-study' },
		],
	}),
	plugins: [
		commentPlugin({
      // 插件选项
      provider: 'Giscus',
      repo: 'luhaifeng666/vue3-study',
      repoId: 'R_kgDOGMPtbQ',
      category: 'General',
      categoryId: 'DIC_kwDOGMPtbc4CPh3Q',
      mapping: 'title'
    }),
    searchPlugin({
      locales: {
        '/': {
          placeholder: 'Search',
        },
        '/zh/': {
          placeholder: '搜索',
        },
      },
    })
	]
}

module.exports = config
