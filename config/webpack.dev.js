/* global __dirname */

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
	entry: {
		'dist-extension/content-script': './src/extension/dev.js',
	},
	output: {
		path: './',
		filename: '[name].js',
	},
	stats: {
		// Configure the console output
		colors: false,
		modules: true,
		reasons: true,
	},
	module: {
		loaders: [
			{ test: /\.vue$/, loader: 'vue-loader' },
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
	// resolve: {
	// 	alias: {
	// 		vue: 'vue/dist/vue.js',
	// 	},
	// },
	plugins: [
		new CopyWebpackPlugin([
			{ context: './src/extension/static/', from: '**/*', to: './dist-extension/' },
			{ context: './src/website/static/', from: '**/*', to: './dist-website/' },
		]),
		new webpack.DefinePlugin({
			'process.env': {
				extension: true,
			},
		}),
		new CircularDependencyPlugin({
			failOnError: true,
		}),
		new webpack.LoaderOptionsPlugin({
			options: {
				context: __dirname,
				postcss: [
					autoprefixer,
				],
				babel: {
					presets: ['es2015', 'stage-2'],
					comments: false,
					plugins: ['transform-es2015-destructuring', 'transform-object-rest-spread'],
				},
			},
		}),
	],
};
