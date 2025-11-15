module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: [
    '<rootDir>/__tests__/**/*.(test|spec).(ts|tsx)',
    '<rootDir>/pages/**/*.(test|spec).(ts|tsx)',
  ],
  collectCoverageFrom: [
    'pages/**/*.{ts,tsx}',
    '!pages/_*.tsx',
  ],
};
