/* global __dirname */

const webpack = require('webpack');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

process.env.NODE_ENV = 'production';

const configDev = require('./webpack.base.js');

console.log('path: ', `${__dirname}/../dist-website/`);


module.exports = Object.assign(configDev, {
	mode: 'production',
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
		new webpack.DefinePlugin({
			PRODUCTION: JSON.stringify(true),
		}),
		new CompressionPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: /\.(js|html|json)$/,
			threshold: 10,
			minRatio: 0.8,
		}),
		// service worker caching
		new SWPrecacheWebpackPlugin({
			cacheId: 'audius-sw',
			filename: 'service-worker.js',
			minify: true,
			navigateFallback: '/index.html',
			staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
			stripPrefix: configDev.output.path,
		}),
	],
});
