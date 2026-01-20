import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import svelte from '@astrojs/svelte'
import starlightLinksValidator from 'starlight-links-validator'
import starlightThemeRapide from 'starlight-theme-rapide'
import tailwindcss from '@tailwindcss/vite'
import sidebarConfig from './generate-sidebar.js'

// https://astro.build/config
export default defineConfig({
	server: {
		port: 6969,
		host: true,
	},
	site: 'https://word.lovejade.cn/',
	// 构建优化配置
	build: {
		inlineStylesheets: 'auto',
		assets: '_astro',
	},
	compressHTML: true,
	scopedStyleStrategy: 'class',
	// 图片优化
	image: {
		remotePatterns: [{ protocol: 'https' }],
		service: {
			entrypoint: 'astro/assets/services/sharp',
		},
	},
	// 预取配置 - 按需预取，避免过度请求
	prefetch: {
		prefetchAll: false,
		defaultStrategy: 'hover',
	},
	integrations: [
		svelte(),
		starlight({
			plugins: [starlightLinksValidator(), starlightThemeRapide()],
			title: '智析单词书',
			social: [
				{ icon: 'mastodon', label: 'Mastodon', href: 'https://mastodon.social/@nicejade' },
				{ icon: 'telegram', label: 'Telegram', href: 'https://t.me/nicejade' },
				{ icon: 'external', label: '逍遥自在轩', href: 'https://fine.niceshare.site/' },
				{ icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@MarshalXuan' },
				{ icon: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/nice.jade.yang' },
				{ icon: 'x.com', label: 'X', href: 'https://x.com/MarshalXuan' },
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/nicejade/gpt-wordbook' },
			],
			customCss: [
				'./src/assets/styles/tailwind.css',
				'./src/assets/styles/custom.css',
			],
			components: {
        // Override the default `MarkdownContent` component.
				MarkdownContent: './src/components/MarkdownContent.astro',
				Head: './src/components/CustomHead.astro',
				Footer: './src/components/Footer.astro',
      },
			logo: {
				src: './src/assets/images/logo.svg',
			},
			pagefind: true,
			lastUpdated: false,
			pagination: true,
			defaultLocale: 'root',
			locales: {
				root: {
					label: '简体中文',
					lang: 'zh-CN',
				},
			},
			head: [
				// Canonical URL
				{
					tag: 'link',
					attrs: {
						rel: 'canonical',
						href: 'https://word.lovejade.cn/',
					},
				},
				// Humans.txt
				{
					tag: 'link',
					attrs: {
						rel: 'author',
						type: 'text/plain',
						href: '/humans.txt',
					},
				},
				// 语言标签
				{
					tag: 'link',
					attrs: {
						rel: 'alternate',
						hreflang: 'zh-CN',
						href: 'https://word.lovejade.cn/',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'alternate',
						hreflang: 'x-default',
						href: 'https://word.lovejade.cn/',
					},
				},
				// 基础 SEO Meta 标签
				{
					tag: 'meta',
					attrs: {
						name: 'robots',
						content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'googlebot',
						content: 'index, follow',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'keywords',
						content: 'GPT Wordbook,英语单词书,GPT-4,单词学习,词根词缀,英语词汇,AI学习,词汇记忆,英语学习,单词记忆技巧',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'author',
						content: 'MarshalXuan',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'language',
						content: 'zh-CN',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'revisit-after',
						content: '7 days',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'format-detection',
						content: 'telephone=no',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'apple-touch-icon',
						sizes: '180x180',
						href: '/apple-touch-icon.png',
					},
				},
				{
					tag: 'link',
					attrs: {
						href: '/manifest.json',
						rel: 'manifest',
					},
				},
				// Twitter Card Meta 标签
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:card',
						content: 'summary_large_image',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:site',
						content: '@MarshalXuan',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:creator',
						content: '@MarshalXuan',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:title',
						content: '智析单词书 | GPT Wordbook - AI 赋能的深度词汇学习平台',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:description',
						content: '智析单词书（GPT Wordbook）是 AI 驱动的深度英语词汇学习平台，精选 11000+ 核心词汇，利用 GPT 模型深度解析每个单词的词义、发音、例句、词根、词缀、同义词、反义词、文化内涵与使用场景，从理解本质出发构建长期记忆。',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:image',
						content: 'https://word.lovejade.cn/summary.png',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:image:alt',
						content: '智析单词书 | GPT Wordbook - AI 赋能的深度词汇学习平台 预览图',
					},
				},
				// Open Graph Meta 标签 (使用 property 而非 name)
				{
					tag: 'meta',
					attrs: {
						property: 'og:type',
						content: 'website',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:url',
						content: 'https://word.lovejade.cn/',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:site_name',
						content: '智析单词书',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:title',
						content: '智析单词书 | GPT Wordbook - AI 赋能的深度词汇学习平台',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:description',
						content: '智析单词书（GPT Wordbook）是 AI 驱动的深度英语词汇学习平台，精选 11000+ 核心词汇，利用 GPT 模型深度解析每个单词的词义、发音、例句、词根、词缀、同义词、反义词、文化内涵与使用场景，从理解本质出发构建长期记忆。',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: 'https://word.lovejade.cn/hero.png',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image:width',
						content: '1200',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image:height',
						content: '676',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image:alt',
						content: '智析单词书 | GPT Wordbook - AI 赋能的深度词汇学习平台 预览图',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:locale',
						content: 'zh_CN',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'theme-color',
						content: '#fefefe',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'theme-color',
						media: '(prefers-color-scheme: dark)',
						content: '#1e293b',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'apple-mobile-web-app-capable',
						content: 'yes',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'apple-mobile-web-app-status-bar-style',
						content: 'black-translucent',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'apple-mobile-web-app-title',
						content: '智析单词书',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'mobile-web-app-capable',
						content: 'yes',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'application-name',
						content: '智析单词书',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'msapplication-TileColor',
						content: '#fefefe',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'google-adsense-account',
						content: 'ca-pub-8586652723015758',
					},
				},
				// Google Analytics - 延迟加载
				{
          tag: 'script',
					content: "window.addEventListener('load',function(){var s=document.createElement('script');s.src='https://www.googletagmanager.com/gtag/js?id=G-D3DYLSSL3T';s.async=true;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-D3DYLSSL3T',{'anonymize_ip':true,'cookie_flags':'SameSite=None;Secure'})});"
				},
				// Google AdSense - 延迟加载
				{
					tag: 'script',
					content: "window.addEventListener('load',function(){var s=document.createElement('script');s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8586652723015758';s.async=true;s.crossOrigin='anonymous';document.head.appendChild(s)});"
				},
		],
		sidebar: sidebarConfig,
		}),
	],
	vite: { 
		plugins: [tailwindcss()],
		build: {
			cssCodeSplit: true,
			minify: 'esbuild',
			rollupOptions: {
				output: {
					manualChunks: {
						'vendor': ['svelte'],
					},
				},
			},
		},
		ssr: {
			noExternal: ['@zumer/snapdom'],
		},
		optimizeDeps: {
			include: ['@zumer/snapdom'],
		},
	},
})