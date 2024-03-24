import { createFactory } from 'hono/factory';
import { getCookie } from 'hono/cookie';

import {
  AccessErrorSchema,
} from '../schema/auth.schema';

export type AuthVariables = { id: string };

export const authFactory = createFactory<{ Variables: AuthVariables }>();

export const authMiddleware = authFactory.createMiddleware(async (c, next) => {
  const cookie = getCookie(c, 'rplane');
  if (cookie) {
    c.set('id', cookie);
  } else {
    return c.json({
      error: 'Unauthorized',
    }, 401);
  }
  return next();
});

export const error401UnauthorizedResponse = {
  content: {
    'application/json': {
      schema: AccessErrorSchema,
    },
  },
  description: 'Unauthorized Response',
};
