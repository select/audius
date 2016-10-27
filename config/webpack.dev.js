/* global __dirname */

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

module.exports = {
	entry: './src/app.js',
	output: {
		path: './dist/',
		filename: 'content-script.js',
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
      { test: /\.ttf$/, loader: 'url-loader' },
			{ test: /\.sass$/, loaders: ['style', 'css', 'postcss-loader', 'sass'] },
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
		new webpack.DefinePlugin({
			'process.env': {
				// NODE_ENV: JSON.stringify('production'),
				APP_ENV: JSON.stringify('browser'),
			},
		}),
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: false,
		// 	},
		// }),
	],
};
