import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { JwtUser } from '../types/app.js';

export function signToken(payload: JwtUser) {
  const options: jwt.SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as JwtUser;
}
