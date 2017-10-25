#!/usr/bin/env node

const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const config = require('./webpack.base.js');

config.entry = [
	'webpack-dev-server/client?http://localhost:8080/',
	'webpack/hot/dev-server',
	'./src/website/app.js',
];

config.output = {
	path: `${__dirname}/dist`,
	publicPath: '/',
	filename: 'app.js',
};

config.plugins = [
	...config.plugins,
	new webpack.DefinePlugin({
		'process.env': {
			website: true,
		},
	}),
	new webpack.NamedModulesPlugin(),
	new CircularDependencyPlugin(),
	new webpack.HotModuleReplacementPlugin(),
	new webpack.LoaderOptionsPlugin({
		options: {
			context: __dirname,
			babel: {
				presets: ['es2015', 'stage-2'],
				comments: false,
				plugins: ['transform-es2015-destructuring', 'transform-object-rest-spread'],
			},
		},
	}),
];

new WebpackDevServer(webpack(config), {
	contentBase: './src/website/static/',
	publicPath: config.output.publicPath,
	historyApiFallback: false,
	stats: {
		colors: true,
		chunks: false,
		modules: false,
	},
	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000,
	},
	hot: true,
	inline: true,
}).listen(8080,  'localhost', function(err, res) {
	if (err) console.warn(err);
	console.log('Listening on localhost:8080');
});
