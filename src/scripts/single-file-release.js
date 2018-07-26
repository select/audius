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
delete scripts['service-worker.js'];
delete scripts['app.js'];
const restScripts = Object.entries(scripts);
restScripts.sort((a, b) => (a[0] < b[0] ? -1 : 1));

const stylesText = fs.readFileSync(`${baseDir}/style.css`, 'utf-8');
const styles = {};
fs.readdirSync(baseDir).forEach(file => {
	if (/.(css)$/.test(file)) {
		styles[file] = fs.readFileSync(`${baseDir}/${file}`, 'utf-8');
	}
});
delete styles['style.css'];
const restStyles = Object.entries(styles);
restStyles.sort((a, b) => (a[0] < b[0] ? -1 : 1));


const indexHtml = fs.readFileSync(`${__dirname}/../website/static/index.html`, 'utf-8');
const idxarr = indexHtml.split(
	'<script src="app.js" type="text/javascript" charset="utf-8" async></script>'
);
fs.writeFileSync(
	`${baseDir}/audius.app.html`,
	` ${idxarr[0]} <script> ${scriptText} ${restScripts
		.map(([, c]) => c)
		.join('\n\n//-------\n\n')} </script> <style>${stylesText} ${restStyles.map(
		([, c]) => c
	)}</style>${idxarr[1]}`
);
console.log('done!');
