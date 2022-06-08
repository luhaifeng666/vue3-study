
const fs = require('fs')
const { searchPlugin } = require('@vuepress/plugin-search')
const { commentPlugin } = require('vuepress-plugin-comment2')
const { commentTheme } = require('./public/themes')
const BASE_URL = './docs/miniVue/'

let getFiles = function(type) {
	let baseUrl = type && `${type.split('/')[1]}/`
	let urls = fs.readdirSync(`${BASE_URL}${type}`).map(item => {
		return `/miniVue/notes/reactivity/${item}`
	})
	return urls
}
let sidebar = {}
const pageConfig = [
	{
		name: '/miniVue/notes/',
		baseUrl: 'notes/',
		paths: ['/miniVue/notes/', {
			name: 'reactivity',
			url: 'reactivity'
		}]
	}
]
pageConfig.forEach(item => {
	sidebar[item.name] = []
	item.paths.forEach(path => {
		if(typeof path !== 'string') {
			let children = getFiles(`${item.baseUrl}${path.url}`)
			let conf = {
				title: path.name,
				children
			}
			sidebar[item.name].push(conf)
		} else {
			sidebar[item.name].push(path)
		}
	})
})

console.log(JSON.stringify(sidebar))

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
		sidebar,
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
