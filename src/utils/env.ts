import * as dotenv from 'dotenv';

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required env var ${name}. Copy .env.example to .env and fill it in.`
    );
  }
  return value;
}

export const env = {
  baseUrl: required('PP_BASE_URL'),
  username: required('PP_USERNAME'),
  password: required('PP_PASSWORD'),
  otp: process.env.PP_OTP ?? '123456',
  targetEnv: (process.env.PP_ENV ?? 'testbox') as 'testbox' | 'staging' | 'production',
};
