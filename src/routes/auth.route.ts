import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

import { ParamsSchema, returnSchema } from '../schema/auth.schema';

const app = new OpenAPIHono()

export const loginRoute = createRoute({
  method: 'post',
  path: '/login',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ParamsSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Respond a message',
      content: {
        'application/json': {
          schema: returnSchema,
        }
      }
    }
  }
});
app.openapi(
  loginRoute,
  (c) => {
    const { login, password } = c.req.valid('json');
    console.log(login);
    console.log(password);
    return c.json({
      status: 'Ok',
    })
  }
)

export default app;