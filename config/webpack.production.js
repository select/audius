/* global __dirname */

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const configDev = require('./webpack.dev.js')

module.exports = Object.assign(configDev, {
	entry: './src/website/app.prod.js',
	output: {
	  path: './dist-website/',
	  filename: 'app.js'
	},
	plugins: [
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
        // NODE_ENV: JSON.stringify('production'),
        APP_ENV: JSON.stringify('production'),
      },
    }),
	],
});
