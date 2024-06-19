import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { logger } from 'hono/logger';

// import MailService from './services/mailService';

import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import planRoutes from './routes/plan.route';

const app = new OpenAPIHono();

app.use(logger());

app.route('auth', authRoutes);
app.route('user', userRoutes);
app.route('plan', planRoutes);

app.get(
  '/ui',
  swaggerUI({
    url: '/doc',
  }),
);

app.doc('/doc', {
  info: {
    title: 'An API',
    version: 'v1',
  },
  openapi: '3.1.0',
});

export default app;
