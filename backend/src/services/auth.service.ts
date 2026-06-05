import { User } from '../models/user.model.js';
import { hashSecret, verifySecret } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';

export class DuplicateEmailError extends Error {
  constructor() {
    super('DUPLICATE_EMAIL');
  }
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  const existing = await User.findOne({ email: input.email });

  if (existing) {
    throw new DuplicateEmailError();
  }

  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash: await hashSecret(input.password),
  });

  const token = signToken({ userId: user._id.toString(), email: user.email });

  return {
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email },
  };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await User.findOne({ email: input.email });

  if (!user || !(await verifySecret(input.password, user.passwordHash))) {
    throw new Error('Invalid email or password');
  }

  const token = signToken({ userId: user._id.toString(), email: user.email });

  return {
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email },
  };
}
