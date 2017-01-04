/* global __dirname */

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const configDev = require('./webpack.dev.js')

module.exports = Object.assign(configDev, {
	entry: './src/website/app.js',
	output: {
		path: './dist-website/',
		filename: 'app.js'
	},
	devtool: undefined,
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new CopyWebpackPlugin([
			{ context: './src/website/static/', from: '**/*', to: './' },
		]),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
			},
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
				extension: false,
			},
		}),
		new webpack.optimize.DedupePlugin(),
		new CircularDependencyPlugin({
			failOnError: true
		}),
		// new SWPrecacheWebpackPlugin(
		// 	{
		// 		cacheId: 'audius',
		// 		filename: 'service-worker.js',
		// 		maximumFileSizeToCacheInBytes: 4194304,
		// 		stripPrefix: 'dist-website/'
		// 		runtimeCaching: [{
		// 			handler: 'cacheFirst',
		// 			urlPattern: /i.ytimg.com\/vi\/.*\/default.jpg$/,
		// 		}],
		// 	}
		// ),
	],
});
