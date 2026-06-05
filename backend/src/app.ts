import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { env } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { authRoutes } from './routes/auth.routes.js';
import { noteRoutes } from './routes/note.routes.js';
import { shareRoutes } from './routes/share.routes.js';
import { failure } from './utils/response.js';

export const app = new Hono();

app.use('*', secureHeaders());
app.use('*', cors({ origin: env.CLIENT_URL, allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization'] }));
app.use('*', requestLogger);

app.get('/health', (c) => c.json({ success: true, data: { status: 'ok' } }));
app.route('/api/auth', authRoutes);
app.route('/api/notes', noteRoutes);
app.route('/api/share', shareRoutes);

app.notFound((c) => failure(c, 'Route not found', 404));
app.onError((error, c) => {
  console.error(error);
  return failure(c, 'Internal server error', 500);
});
