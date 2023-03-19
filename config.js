const path = require('path');
const basePath = {
	src: 'src/',
	dest: './dist/',
	assets: '../',
	mvc: '../Mainz05/wwwroot/', // Change the basePath of new MVC project
	mvcStatic: '../EON/static/', // Change the basePath of new MVC project
};

const src = {
	fonts: `${basePath.src}fonts/`,
	icons: `${basePath.src}img/bg/icons/`,
	iconsSVG: `${basePath.src}img/bg/icons-svg/`,
	images: `${basePath.src}img/`,
	scripts: `${basePath.src}js/`,
	styles: `${basePath.src}css/`,
	templates: `${basePath.src}tpl/`,
	components: `${path.resolve(__dirname, basePath.src)}/tpl/components/`,
	layout: `${path.resolve(__dirname, basePath.src)}/tpl/layout/`,
};

const twigNamespaces = {
	components: src.components,
	layout: src.layout,
	images: src.images,
	templates: src.templates,
};

const dest = {
	fonts: `${basePath.dest}fonts/`,
	images: `${basePath.dest}img/`,
	scripts: `${basePath.dest}js/`,
	styles: `${basePath.dest}css/`,
	templates: `${basePath.dest}tpl/`,
};

const assets = {
	fonts: `${basePath.assets}fonts/`,
	images: `${basePath.assets}img/`,
	scripts: `${basePath.assets}js/`,
	styles: `${basePath.assets}css/`,
};

const webpack = {
	stats: {
		colors: true,
		hash: false,
		timings: true,
		assets: true,
		chunks: false,
		chunkModules: false,
		modules: false,
		children: true,
		version: false,
	},
};

const browserSync = {
	open: false,
	notify: false,
	reloadThrottle: 1000,
	watch: true,
	startPath: '/tpl',
	server: {
		baseDir: basePath.dest,
	},
};

const mediaQueries = {
	breakpoints: {
		sm: '480px',
		md: '750px',
		lg: '1000px',
		xl: '1200px',
	},
	rules: {
		webkit: '(-webkit-min-device-pixel-ratio: 0)',
		retina: '(-webkit-min-device-pixel-ratio: 2), (min--moz-device-pixel-ratio: 2), (-o-min-device-pixel-ratio: 2/1), (min-device-pixel-ratio: 2), (min-resolution: 192dpi), (min-resolution: 2dppx)',
	},
};

module.exports = {
	basePath,
	src,
	dest,
	assets,
	twigNamespaces,
	webpack,
	browserSync,
	mediaQueries,
};
