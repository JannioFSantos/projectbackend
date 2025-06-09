module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js'],
  transformIgnorePatterns: [
    '/node_modules/(?!sequelize)'
  ]
}
