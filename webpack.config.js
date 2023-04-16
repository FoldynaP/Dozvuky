const webpack = require('webpack');
const path = require('path');
const config = require('./helpers/getConfig.js');
//const { VueLoaderPlugin } = require('vue-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const {
	createSassVars,
	resolveTwigEntry,
	CopyToMVCPlugin,
	iconSvgCssGeneratePlugin,
	iconSvgCssGeneratePluginBeforeRun,
} = require('./helpers/webpackConstruct.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: {
		app: [`./${config.src.scripts}app.js`],
		//'vue-app': [`./${config.src.scripts}vue-app.js`],
		// TODO: remove js files for css
		styles: `./${config.src.styles}style.scss`,
		print: `./${config.src.styles}print.scss`,
	},

	resolve: {
		fallback: { path: require.resolve('path-browserify') },
		extensions: ['.js', '.json', '.jsx', '.vue', '.ts'],
		alias: {
			'@': path.resolve(__dirname, './src/js/vue/'),
		},
	},

	output: {
		path: path.join(__dirname, `/dist`),
		filename: './js/[name].js',
		chunkFilename: './js/[name].chunk.js',
		assetModuleFilename: (pathData) => {
			const stripped = pathData.filename.replace('src', '');
			return stripped ? stripped : '[path][name][ext]';
		},
	},

	devtool: 'inline-source-map',
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		watchFiles: ['src/**/*.twig', 'src/**/*.scss'],

		hot: true,
		devMiddleware: {
			writeToDisk: true,
		},
	},
	watchOptions: {
		ignored: new RegExp('icons-svg.scss'),
	},
	optimization: {
		runtimeChunk: 'single',
	},

	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							additionalData: createSassVars(config),
						},
					},
					'webpack-import-glob-loader',
				],
			},
			{
				test: /\.js(x)?$/,
				use: 'babel-loader',
			},
			{
				test: /\.vue$/,
				use: 'vue-loader',
			},
			{
				test: /.ts$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							appendTsSuffixTo: [/.vue$/],
						},
					},
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]',
				},
			},
			{
				test: /\.twig$/,
				use: [
					'raw-loader',
					{
						loader: 'twig-html-loader',
						options: {
							namespaces: config.twigNamespaces,
							data: { ...config, NODE_ENV: process.env.NODE_ENV },
							filters: {
								join(value) {
									return value.join(' ');
								},
								filterSafe(value) {
									return value.filter((i) => i);
								},
							},
						},
					},
				],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: [path.join(__dirname, config.basePath.dest)],
		}),
		new SVGSpritemapPlugin('src/img/**/*.svg', {
			output: { filename: 'img/bg/icons-svg.svg' },
			sprite: { prefix: 'icon-' },
		}),
		new iconSvgCssGeneratePluginBeforeRun(),
		new iconSvgCssGeneratePlugin(),

		new webpack.DefinePlugin({
			NODE_ENV: process.env.NODE_ENV,
			...config,
		}),

		...resolveTwigEntry(),
		new MiniCssExtractPlugin({
			filename: 'css/[name].css',
			chunkFilename: 'css/[id].css',
		}),

		//new VueLoaderPlugin(),
		new CopyPlugin({
			patterns: [{ from: './src/img', to: 'img' }],
		}),

		new CopyToMVCPlugin(),
	],
};
