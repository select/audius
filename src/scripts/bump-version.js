#!/usr/bin/env node
/* eslint-env node*/
const fs = require('fs');

// VERSION
const versionNumber = fs.readFileSync(`${__dirname}/../../VERSION`, 'utf-8').trim();
console.log('Setting version to:', versionNumber);

// package.json
const packageJsonPath = `${__dirname}/../../package.json`;
const packageJson = require(packageJsonPath);
fs.writeFileSync(
	packageJsonPath,
	JSON.stringify(Object.assign(packageJson, { version: versionNumber }), null, 2)
);

// extension manifest.json
const manifestJsonPath = `${__dirname}/../extension/static/manifest.json`;
const manifestJson = require(manifestJsonPath);
fs.writeFileSync(
	manifestJsonPath,
	JSON.stringify(Object.assign(manifestJson, { version: versionNumber }), null, "\t")
);

const headerPath = `${__dirname}/../components/web-header.vue`;
const headerVue = fs.readFileSync(headerPath, 'utf-8');
fs.writeFileSync(
	headerPath,
	headerVue.replace(/<i id="version">([\d\.]+)<\/i>/, `<i id="version">${versionNumber}</i>`)
);

const indexPath = `${__dirname}/../website/static/index.html`;
const indexHtml = fs.readFileSync(indexPath, 'utf-8');
fs.writeFileSync(
	indexPath,
	indexHtml.replace(/<i id="version">([\d\.]+)<\/i>/, `<i id="version">${versionNumber}</i>`)
);
