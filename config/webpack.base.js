/* global __dirname */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: 'development',
	entry: './src/website/app.js',
	output: {
		path: path.resolve(`${__dirname}/../dist-website/`),
		filename: 'app.js',
	},
	resolve: {
		alias: {
			vue: 'vue/dist/vue.js',
		},
	},
	devtool: 'source-map',
	stats: {
		// Configure the console output
		colors: true,
		modules: false,
		reasons: true,
		assets: true,
	},
	module: {
		noParse: [/olm[\\\/](javascript[\\\/])?olm\.js$/],
		rules: [
			{ test: /\.vue$/, loader: 'vue-loader' },
			{
				test: /\.sass$/,
				use: [
					process.env.NODE_ENV !== 'production' || process.env.singleFile
						? 'vue-style-loader'
						: MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
					{
						loader: 'sass-loader',
						options: {
							indentedSyntax: true,
						},
					},
				],
			},
			{ test: /\.ttf$/, loader: 'url-loader' },
			{ test: /\.html$/, loader: 'raw-loader' },
			{ test: /\.svg$/, loader: 'raw-loader' },
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
		],
	},
	plugins: [
		new VueLoaderPlugin(),
		new CopyWebpackPlugin([{ context: './src/website/static/', from: '**/*', to: './' }]),
		new CircularDependencyPlugin({
			failOnError: true,
			exclude: /asn1|readable-stream|elliptic|des\.js/,
		}),
		new MiniCssExtractPlugin({
			filename: 'style.css',
		}),
	],
};
