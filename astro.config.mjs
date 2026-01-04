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
		inlineStylesheets: 'never', // 禁止内联 CSS，减少 HTML 体积
		assets: '_astro', // 统一资源目录
	},
	// 压缩配置
	compressHTML: true,
	// 图片优化
	image: {
		remotePatterns: [{ protocol: 'https' }],
		service: {
			entrypoint: 'astro/assets/services/sharp',
		},
	},
	// 预取配置 - 提升页面切换速度
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'viewport',
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
				// DNS 预解析和预连接 - 性能优化
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://www.googletagmanager.com',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://pagead2.googlesyndication.com',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'dns-prefetch',
						href: 'https://www.google-analytics.com',
					},
				},
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
						content: '智析单词书 - 基于 GPT 生成 ',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:description',
						content: '基于 GPT 生成的深度解析，涵盖超过 8000+ 核心英语词汇。不仅提供精准的词义与例句，更深入挖掘词根词缀、文化背景、记忆技巧及趣味小故事。旨在通过 AI 帮助英语学习者构建逻辑化的词汇体系，让单词记忆不再是死记硬背。',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:image',
						content: 'https://word.lovejade.cn/mockup.png',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:image:alt',
						content: '智析单词书 - 基于 GPT 生成 预览图',
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
						content: '智析单词书 - 基于 GPT 生成 ',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:description',
						content: '基于 GPT 生成的深度解析，涵盖超过 8000+ 核心英语词汇。不仅提供精准的词义与例句，更深入挖掘词根词缀、文化背景、记忆技巧及趣味小故事。旨在通过 AI 帮助英语学习者构建逻辑化的词汇体系，让单词记忆不再是死记硬背。',
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
						content: '智析单词书 - 基于 GPT 生成 预览图',
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
						content: '#f59e0b',
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
						content: '#f59e0b',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'google-adsense-account',
						content: 'ca-pub-8586652723015758',
					},
				},
				// Google Analytics - 优化加载策略
				{
          tag: 'script',
          attrs: {
            src: 'https://www.googletagmanager.com/gtag/js?id=G-D3DYLSSL3T',
						'id': 'G-D3DYLSSL3T',
            async: true,
					},
				},
				{
          tag: 'script',
					content: "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-D3DYLSSL3T', {'anonymize_ip': true, 'cookie_flags': 'SameSite=None;Secure'});"
				},
				// Google AdSense
				{
					tag: 'script',
					attrs: {
            src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8586652723015758',
            async: true,
						crossorigin: 'anonymous',
					},
				},
		],
		sidebar: sidebarConfig,
		}),
	],
	vite: { 
		plugins: [tailwindcss()],
		ssr: {
			noExternal: ['@zumer/snapdom'],
		},
		optimizeDeps: {
			include: ['@zumer/snapdom'],
		},
	},
})