import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { setCookie } from 'hono/cookie';

import {
  LoginParamsSchema,
  LoginReturnSchema,
  LoginErrorSchema,
  ResetParamsSchema,
} from '../schema/auth.schema';

const app = new OpenAPIHono();

export const loginRoute = createRoute({
  method: 'post',
  path: '/login',
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginParamsSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Respond a message',
      content: {
        'application/json': {
          schema: LoginReturnSchema,
        },
      },
    },
    401: {
      content: {
        'application/json': {
          schema: LoginErrorSchema,
        },
      },
      description: 'Unauthorized Response',
    },
  },
});

app.openapi(
  loginRoute,
  (c) => {
    const { login, password } = c.req.valid('json');
    // TODO Check auth
    if (login !== 'test' && password !== 'test') {
      return c.json({
        error: 'Wrong credentials',
      }, 401);
    }
    // TODO Create JWT
    setCookie(c, 'rplane', 'aCookieSet', {
      path: '/',
      secure: true,
      httpOnly: true,
      expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      sameSite: 'Strict',
    });
    return c.json({
      status: 'Succeed',
    });
  },
);

export const resetRoute = createRoute({
  method: 'post',
  path: '/reset',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ResetParamsSchema,
        },
      },
    },
  },
  responses: {
    204: {
      description: 'If Email exists, an email has been send to reset password',
    },
  },
});

app.openapi(
  resetRoute,
  (c) => {
    const { email } = c.req.valid('json');
    console.log(email);
    // TODO Does email exists ?
    // TODO Send email
    return c.text('No Content', 204);
  },
);

export default app;
