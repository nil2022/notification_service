export default {
	testEnvironment: 'node',
	transform: {
		'^.+\\.jsx?$': 'babel-jest',
	},
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	collectCoverageFrom: [
		'src/**/*.js',
		'!src/crons/**',
		'!src/app.js'
	],
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'/test/',
		'.mock.'
	],
	testMatch: ['**/__tests__/**/*.test.js'],
	testTimeout: 10000,
	verbose: true
};
