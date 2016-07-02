module.exports = {
	'extends': 'airbnb',
	'parser': 'babel-eslint',
	'plugins': [
		'react'
	],
	'rules': {
		'indent': [2, 'tab'],
		'max-len': 0,
		'no-console': [2, { allow: ['info', 'error']}],
		'react/jsx-indent': [2, 'tab'],
		'react/jsx-indent-props': [2, 'tab'],
	},
};
