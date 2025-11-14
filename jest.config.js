/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  // Добавляем mapping для алиасов
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@utils-types$': '<rootDir>/src/utils/types.ts',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  
  // Настройки трансформации TypeScript
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  
  // Директории для поиска модулей
  moduleDirectories: ['node_modules', 'src'],
  
  // Расширения файлов
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Где искать тесты
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  
  // Игнорируемые пути
  testPathIgnorePatterns: [
    '/node_modules/',
    '/cypress/'
  ],

  coverageProvider: "v8",
};

module.exports = config;