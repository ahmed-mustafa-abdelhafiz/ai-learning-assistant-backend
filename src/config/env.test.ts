import { describe, it, expect } from 'vitest';
import { envSchema } from './env.js';

const validEnv = {
  NODE_ENV: 'development',
  PORT: '3000',
  MONGODB_URI: 'mongodb://localhost:27017/ai-learning-assistant-dev',
  JWT_SECRET: 'a'.repeat(64),
  GEMINI_API_KEY: 'some-key',
};

describe('envSchema', () => {
  it('accepts valid environment variables', () => {
    const result = envSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
  });

  it('defaults NODE_ENV to development when not provided', () => {
    const { NODE_ENV: _NODE_ENV, ...rest } = validEnv;
    const result = envSchema.safeParse(rest);

    expect(result.success).toBe(true);
    expect(result.success && result.data.NODE_ENV).toBe('development');
  });

  it('defaults PORT to 3000 when not provided', () => {
    const { PORT: _PORT, ...rest } = validEnv;
    const result = envSchema.safeParse(rest);

    expect(result.success).toBe(true);
    expect(result.success && result.data.PORT).toBe(3000);
  });

  it('rejects a PORT outside the valid range', () => {
    const result = envSchema.safeParse({ ...validEnv, PORT: '99999' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid MONGODB_URI', () => {
    const result = envSchema.safeParse({ ...validEnv, MONGODB_URI: 'not-a-valid-uri' });
    expect(result.success).toBe(false);
  });

  it('rejects a JWT_SECRET shorter than 64 characters', () => {
    const result = envSchema.safeParse({ ...validEnv, JWT_SECRET: 'too-short' });
    expect(result.success).toBe(false);
  });

  it('defaults JWT_EXPIRES_IN to 7d when not provided', () => {
    const result = envSchema.safeParse(validEnv);

    expect(result.success).toBe(true);
    expect(result.success && result.data.JWT_EXPIRES_IN).toBe('7d');
  });

  it('rejects an invalid JWT_EXPIRES_IN format', () => {
    const result = envSchema.safeParse({ ...validEnv, JWT_EXPIRES_IN: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('rejects a missing GEMINI_API_KEY', () => {
    const { GEMINI_API_KEY: _GEMINI_API_KEY, ...rest } = validEnv;
    const result = envSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('rejects when NODE_ENV is "test" but TEST_MONGODB_URI is missing', () => {
    const result = envSchema.safeParse({ ...validEnv, NODE_ENV: 'test' });

    expect(result.success).toBe(false);
    const paths = !result.success && result.error.issues.map((issue) => issue.path.join('.'));
    expect(paths && paths.includes('TEST_MONGODB_URI')).toBe(true);
  });

  it('accepts when NODE_ENV is "test" and TEST_MONGODB_URI is provided', () => {
    const result = envSchema.safeParse({
      ...validEnv,
      NODE_ENV: 'test',
      TEST_MONGODB_URI: 'mongodb://localhost:27017/ai-learning-assistant-test',
    });

    expect(result.success).toBe(true);
  });
});
