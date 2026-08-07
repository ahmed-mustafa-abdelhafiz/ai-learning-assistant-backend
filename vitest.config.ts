import { defineConfig } from 'vitest/config';
import { env } from './src/config/env.js';

export default defineConfig({
  test: {
    setupFiles: ['tests/setup/db-setup.ts'],
    fileParallelism: false,
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    env: {
      NODE_ENV: 'test',
      MONGODB_URI: env.TEST_MONGODB_URI,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/server.ts'],
    },
  },
});
