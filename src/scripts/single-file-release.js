#!/usr/bin/env node
/* eslint-env node*/
const fs = require('fs');

const baseDir = `${__dirname}/../../dist-website`;

const scripts = {};
fs.readdirSync(baseDir).forEach(file => {
	if (/.(js)$/.test(file)) {
		scripts[file] = fs.readFileSync(`${baseDir}/${file}`, 'utf-8');
	}
});
let scriptText = '';
scriptText += scripts['service-worker.js'];
scriptText += scripts['app.js'];

const indexHtml = fs.readFileSync(`${__dirname}/../website/static/index.html`, 'utf-8');
const idxarr = indexHtml.split(
	'<script src="app.js" type="text/javascript" charset="utf-8" async></script>'
);
fs.writeFileSync(
	`${baseDir}/audius.app.html`,
	` ${idxarr[0]} <script> ${scriptText} </script> ${idxarr[1]}`
);
console.log('done!');
