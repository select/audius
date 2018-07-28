const webpack = require('webpack');

process.env.NODE_ENV = 'production';
process.env.singleFile = true;

const configDev = require('./webpack.production.app.js');

module.exports = Object.assign(configDev, {
	plugins: [
		...configDev.plugins,
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1,
		}),
	],
});
