import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { authMiddleware, error401UnauthorizedResponse } from '../middleware/auth.middleware';
import type { AuthVariables } from '../middleware/auth.middleware';

const app = new OpenAPIHono<{ Variables: AuthVariables }>();

export const UserParamsSchema = z.object({
  login: z.string(),
});

export const userRoute = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      description: 'Respond a message',
      content: {
        'application/json': {
          schema: UserParamsSchema,
        },
      },
    },
    401: error401UnauthorizedResponse,
  },
});

app.use(authMiddleware);

app.openapi(userRoute, (c) => {
  const id = c.get('id');
  return c.json({
    login: id,
  });
});

export default app;
