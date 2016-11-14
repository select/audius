/* global __dirname */

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const configDev = require('./webpack.dev.js')

module.exports = Object.assign(configDev, {
	entry: './src/extension/app.js',
	output: {
		path: './dist-extension/',
		filename: 'content-script.js'
	},
	devtool: undefined,
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new CopyWebpackPlugin([
			{ context: './src/extension/static/', from: '**/*', to: './' },
		]),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
			},
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
				extension: true,
			},
		}),
		new webpack.optimize.DedupePlugin(),
		new CircularDependencyPlugin({
			failOnError: true
		}),
	],
});
