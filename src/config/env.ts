import 'dotenv/config';
import * as z from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  MONGODB_URI: z
    .string()
    .regex(/^mongodb(\+srv)?:\/\//, 'Must be a valid MongoDB connection string'),
  JWT_SECRET: z.string().min(64),
  JWT_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhdy]$/, "Must be a duration like '7d', '1h'")
    .default('7d'),
  MAX_FILE_SIZE: z.coerce.number().int().positive().max(52428800).default(10485760),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:');
  for (const issue of parsedEnv.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

export type Env = z.infer<typeof envSchema>;
export const env = Object.freeze(parsedEnv.data);
