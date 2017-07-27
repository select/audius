/* global __dirname */

const CopyWebpackPlugin = require('copy-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const configDev = require('./webpack.base.js');

module.exports = Object.assign(configDev, {
	entry: {
		content: './src/extension/content.js',
		background: './src/extension/background.js',
	},
	output: {
		path: `${__dirname}/../dist-extension/`,
		filename: '[name].js',
	},
	devtool: 'source-map',
	plugins: [
		new CopyWebpackPlugin([{ context: './src/extension/static/', from: '**/*', to: './' }]),
		new CircularDependencyPlugin({
			failOnError: true,
		}),
	],
});
