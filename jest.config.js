const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    // Exclude files that require E2E/integration testing (browser rendering)
    '!src/**/pages/**',             // Module page wrappers (just render module)
    '!src/**/components/**',        // Complex UI components (Drawer, Table, etc.)
    '!src/app/dashboard/**',        // Large legacy dashboard UI
    '!src/app/language/**',         // Old language page (legacy)
    '!src/app/login/**',            // Auth UI page
    '!src/app/settings/**',         // Settings UI page
    '!src/app/layout.tsx',          // Root layout wrapper
    '!src/app/page.tsx',            // Root page redirect
    '!src/core/api/**',             // API client (needs network mocking via MSW)
    '!src/i18n/**',
    '!src/middleware.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text', 'html'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 50,
      functions: 75,
      lines: 80,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
