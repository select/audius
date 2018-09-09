/* global __dirname */

const webpack = require('webpack');

const configDev = require('./webpack.dev.extension.js');

module.exports = Object.assign(configDev, {
	mode: 'production',
	devtool: undefined,
	plugins: [
		...configDev.plugins,
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
				extension: false,
			},
		}),
	],
});
