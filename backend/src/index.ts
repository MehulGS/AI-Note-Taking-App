import { serve } from '@hono/node-server';
import { app } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

await connectDatabase();

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`API running on http://localhost:${info.port}`);
});
