module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  // Workspace package ships ESM dist; map to TS source so ts-jest can compile it.
  moduleNameMapper: {
    '^@dfx.swiss/core$': '<rootDir>/../core/src/index.ts',
  },
};
