
const fs = require('fs')
const BASE_URL = './docs/miniVue/'

let getFiles = function(type) {
	let baseUrl = type && `${type.split('/')[1]}/`
	let urls = fs.readdirSync(`${BASE_URL}${type}`).map(item => {
		return baseUrl + item
	})
	return urls
}
let sidebar = {}
const pageConfig = [
	{
		name: '/miniVue/notes/',
		baseUrl: 'notes/',
		paths: ['', {
			name: 'reactivity',
			url: 'reactivity'
		}]
	}
]
pageConfig.forEach(item => {
	sidebar[item.name] = []
	item.paths.forEach(path => {
		if(path) {
			let children = getFiles(`${item.baseUrl}${path.url}`)
			let conf = {
				title: path.name,
				// collapsable: false,
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
	themeConfig: {
		lastUpdated: 'Last Updated',
		sidebarDepth: 2,
		sidebar,
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Notes', link: '/miniVue/notes/'},
			{ text: 'GitHub', link: 'https://github.com/luhaifeng666/vue3-study' },
		],
		// sidebar
	}
}

module.exports = config
