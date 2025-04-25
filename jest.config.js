module.exports = {
	verbose: true,
	env: "jsdom",
	transform: {
		"\\.[jt]sx?$": "babel-jest",
	},
	transformIgnorePatterns: ["/node_modules/"],
};
