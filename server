#!/usr/bin/env node

var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");

var config = require("./config/webpack.dev.js");
config.entry = [
	'webpack-dev-server/client?http://localhost:8080/',
	// 'webpack/hot/dev-server',
	'./src/website/app.js'
];
config.output = {
	path: '/build',
	publicPath: '/',
	filename: 'app.js',
}
new WebpackDevServer(webpack(config), {
	contentBase: "./src/website/static/",
	publicPath: config.output.publicPath,
	// hot: true,
	historyApiFallback: false,
	stats: { colors: true }
}).listen(8080, "localhost", function(err, res) {
	if (err) console.log(err)
	console.log('Listening on localhost:8080')
});
