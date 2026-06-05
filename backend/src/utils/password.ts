import bcrypt from 'bcryptjs';
import { customAlphabet } from 'nanoid';

const passwordAlphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const segment = customAlphabet(passwordAlphabet, 4);
const saltRounds = 12;

export async function hashSecret(value: string) {
  return bcrypt.hash(value, saltRounds);
}

export async function verifySecret(value: string, hash: string) {
  return bcrypt.compare(value, hash);
}

export function generateAccessPassword() {
  return `${segment()}-${segment()}-${segment()}`;
}
