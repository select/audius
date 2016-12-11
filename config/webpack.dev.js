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
		filename: '[name].js'
	},
	stats: {
		// Configure the console output
		colors: false,
		modules: true,
		reasons: true,
	},
	devtool: 'source-map',
	module: {
		loaders: [
			// { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/, loader: 'file' },
			{ test: /\.vue$/, loader: 'vue' },
			{ test: /\.ttf$/, loader: 'url-loader' },
			{
				test: /\.sass$/,
				// loader: 'style!css?sourceMap!postcss?sourceMap!sass?sourceMap',
				loaders: ['style', 'css', 'postcss-loader', 'sass'],
			},
			{ test: /\.css$/, loader: 'raw-loader' },
			{ test: /\.html$/, loader: 'raw-loader' },
			{ test: /\.svg$/, loader: 'raw-loader' },
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					cacheDirectory: true,
					presets: ['es2015'],
				},
			},
		],
	},
	postcss: () => [autoprefixer],
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
			failOnError: true
		}),
	],
};
