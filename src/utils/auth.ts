import crypto from 'crypto';

export function generateOneTimePassword(length: number = 6): string {
  const bytes = crypto.randomBytes(length);
  return bytes.toString('hex').slice(0, length).toUpperCase();
} 