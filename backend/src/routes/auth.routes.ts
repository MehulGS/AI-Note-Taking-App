import { Hono } from 'hono';
import { loginController, registerController } from '../controllers/auth.controller.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

export const authRoutes = new Hono();

authRoutes.post('/register', rateLimit({ windowMs: 15 * 60 * 1000, max: 20, keyPrefix: 'register' }), validateBody(registerSchema), registerController);
authRoutes.post('/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 20, keyPrefix: 'login' }), validateBody(loginSchema), loginController);
