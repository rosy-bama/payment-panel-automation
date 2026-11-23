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
  /** Payments made by steps of the Ejara Automation Tool (Make payment: irreversible). Testbox only. */
  allowPayments: process.env.PP_ALLOW_PAYMENTS === 'true',
  /** New providers, policies, payment modes made by steps of the Ejara Automation Tool. Testbox only. */
  allowSettingsChanges: process.env.PP_ALLOW_SETTINGS_CHANGES === 'true',
};
