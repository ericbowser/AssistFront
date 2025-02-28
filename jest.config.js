// jest.config.js (or in package.json's "jest" section)
module.exports = {
  verbose: true,
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest', // Add tsx/tsx if needed
    
  },
};