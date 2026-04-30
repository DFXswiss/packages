module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@noble/curves|@noble/hashes)/)',
  ],
  moduleNameMapper: {
    '^@noble/curves/secp256k1$': '@noble/curves/secp256k1.js',
  },
};
