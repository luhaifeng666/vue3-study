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
		// sidebar: 'auto',
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'GitHub', link: 'https://github.com/luhaifeng666/vue3-study' },
		],
		// sidebar
	}
}

module.exports = config
