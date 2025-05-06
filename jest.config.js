module.exports = {
	verbose: true,
	env: "jsdom",
	transform: {
		"\\.[jt]sx?$": "babel-jest",
	},
	transformIgnorePatterns: ["/node_modules/"],
	moduleNameMapper: {
		// Mock the OpenAI API
		"^../api/openAiApi$": "<rootDir>/src/mocks/openAiApiMock.js",
		// Handle CSS imports
		"\\.(css|less|scss)$": "identity-obj-proxy",
		// Handle image imports
		"\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/src/mocks/fileMock.js"
	}
};
