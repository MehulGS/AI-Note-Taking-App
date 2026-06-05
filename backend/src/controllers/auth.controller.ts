import type { Context } from 'hono';
import { DuplicateEmailError, loginUser, registerUser } from '../services/auth.service.js';
import { failure, success } from '../utils/response.js';

export async function registerController(c: Context) {
  try {
    const body = c.get('validatedBody');
    return success(c, await registerUser(body), 201);
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      return failure(c, 'Unable to register account', 409);
    }

    return failure(c, 'Unable to register account', 400);
  }
}

export async function loginController(c: Context) {
  try {
    const body = c.get('validatedBody');
    return success(c, await loginUser(body));
  } catch {
    return failure(c, 'Unable to login', 401);
  }
}
