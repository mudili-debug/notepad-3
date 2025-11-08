import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from the server package root explicitly.
// This helps when tools (ts-node-dev, tests) change the working directory.
const envPath = path.resolve(__dirname, '../../.env');

// Diagnostic: log where we're loading the env from and whether it exists.
// Keep this lightweight and safe for local dev; it won't print secret values.
if (process.env.NODE_ENV !== 'production') {
  try {
    const exists = fs.existsSync(envPath);
    // Use console.debug to avoid cluttering production logs; ts-node-dev will still show it.
    // eslint-disable-next-line no-console
    console.debug(
      `[validateEnv] Loading .env from: ${envPath} (exists: ${exists})`
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.debug(`[validateEnv] Error checking .env path: ${String(err)}`);
  }
}

dotenv.config({ path: envPath, encoding: 'utf16le' });

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
];

export const validateEnv = () => {
  // Diagnostic: log presence (boolean) of required vars to avoid printing secrets.
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug(
      `[validateEnv] MONGO_URI present: ${Boolean(process.env.MONGO_URI)}`
    );
    // eslint-disable-next-line no-console
    console.debug(
      `[validateEnv] JWT_ACCESS_SECRET present: ${Boolean(
        process.env.JWT_ACCESS_SECRET
      )}`
    );
    // eslint-disable-next-line no-console
    console.debug(
      `[validateEnv] JWT_REFRESH_SECRET present: ${Boolean(
        process.env.JWT_REFRESH_SECRET
      )}`
    );
  }

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};
