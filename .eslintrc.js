module.exports = {
	rules: {
		indent: ['error', 'tab'], // indent with tabs
		quotes: ['error', 'single'], // always use single quotes
		'linebreak-style': ['error', 'unix'], // fuck windows
		semi: ['error', 'always'], // always use semicolons at end of command
		'no-multiple-empty-lines': ['error', { max: 2 }], // only allow one free line
		eqeqeq: ['error', 'smart'], // always use === only if null or something not ... I forgot
		strict: ['error', 'function'],
		'no-var': ['error'],
		'max-len': ['error', 200, 4],
		'no-tabs': ['off'],
		'no-confusing-arrow': ['off'],
		'no-plusplus': ['off'],
		'import/prefer-default-export': 'off',
		"comma-dangle": ["error", {
			functions: "never",
			arrays: "always-multiline",
			objects: "always-multiline"
		}],
	},
	ecmaFeatures: {
		modules: true,
	},
	globals: {
		module: true,
		chrome: true,
	},
	env: {
		es6: true,
		browser: true,
		jasmine: true,
		commonjs: true,
	},
	extends: 'airbnb',
	parser: 'babel-eslint', // we need to use this since ESLint does not support ES6 Decorators
};
