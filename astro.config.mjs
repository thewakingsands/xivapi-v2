// @ts-check
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import preact from '@astrojs/preact';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { remarkDefinitionList, defListHastHandlers } from 'remark-definition-list';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeWidont from 'rehype-widont';
import starlightLinksValidator from 'starlight-links-validator';

// https://astro.build/config
export default defineConfig({
	integrations: [
		preact(),
		starlight({
			title: 'xivapi',
			defaultLocale: 'en',
			locales: {
				en: {
					label: 'English',
					lang: 'en',
				},
				'zh-cn': {
					label: '简体中文',
					lang: 'zh-CN',
				},
			},
			favicon: '/favicon.ico',
			logo: {
				light: './src/assets/logo-light.png',
				dark: './src/assets/logo-dark.png',
				replacesTitle: true,
			},
			social: {
				discord: 'https://discord.gg/MFFVHWC',
				github: 'https://github.com/xivapi',
			},
			sidebar: [
				'docs/welcome',
				{
					label: 'Guides',
					autogenerate: { directory: 'docs/guides' },
				},
				'docs/software',
				'docs/migrate',
				{
					label: 'Search Playground',
					link: '/play/',
				},
				{
					label: 'API Reference',
					link: '/api/docs',
					attrs: { target: '_blank' },
				}
			],
			components: {
				ContentPanel: './src/components/overrides/ContentPanel.astro',
				Hero: './src/components/overrides/Hero.astro',
				MarkdownContent: './src/components/overrides/MarkdownContent.astro',
			},
			customCss: [
				'./src/styles/headings.css',
				'./src/styles/icons.css',
				'./src/styles/theme.css',
			],
			plugins: [starlightLinksValidator({
				exclude: ['/api/**', '/docs/guides/']
			})],
		}),
	],
	redirects: {
		'/docs/guides/': {
			status: 302,
			destination: '/docs/guides/concepts/'
		}
	},
	markdown: {
		remarkPlugins: [remarkDefinitionList],
		rehypePlugins: [
			rehypeHeadingIds,
			[rehypeAutolinkHeadings, { behavior: 'wrap' }],
			rehypeWidont
		],
		remarkRehype: {
			handlers: { ...defListHastHandlers },
		},
	},
});
