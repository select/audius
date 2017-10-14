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
