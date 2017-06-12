/* global __dirname */

const webpack = require('webpack');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const configDev = require('./webpack.dev.js');

console.log('path: ', `${__dirname}/../dist-website/`);

module.exports = Object.assign(configDev, {
	entry: './src/website/app.js',
	output: {
		path: `${__dirname}/../dist-website/`,
		filename: 'app.js',
	},
	resolve: {
		alias: {
			vue$: 'vue/dist/vue.runtime.esm.js', // reduce size by including the runtime only (requres precompiled templates)
		},
	},
	devtool: undefined,
	plugins: [
		...configDev.plugins,
		new webpack.optimize.OccurrenceOrderPlugin(),
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
		new CompressionPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: /\.(js|html|json)$/,
			threshold: 10240,
			minRatio: 0.8,
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
