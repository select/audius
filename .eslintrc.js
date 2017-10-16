module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module',
	},
	env: {
		browser: true,
		webextensions: true,
	},
	extends: 'airbnb-base',
	// required to lint *.vue files
	plugins: ['html'],
	// check if imports actually resolve
	settings: {
		'import/resolver': {
			webpack: {
				config: 'build/webpack.base.conf.js',
			},
		},
	},
	// add your custom rules here
	rules: {
		'arrow-parens': 'off', // FIXME jsPrettier must fix this and then we can remove the rule again
		indent: [2, 'tab', { SwitchCase: 1 }], // indent with tabs
		'no-tabs': 'off',
		'no-plusplus': 'off',
		'no-underscore-dangle': 'off',
		'function-paren-newline': 'off',
		'comma-dangle': [
			'error',
			{
				functions: 'never',
				arrays: 'always-multiline',
				objects: 'always-multiline',
			},
		],
		'import/prefer-default-export': 'off',
		// don't require .vue extension when importing
		'import/extensions': [
			'error',
			'always',
			{
				js: 'never',
				vue: 'never',
			},
		],
		// allow optionalDependencies
		'import/no-extraneous-dependencies': [
			'error',
			{
				optionalDependencies: ['test/unit/index.js'],
			},
		],
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
	},
};
