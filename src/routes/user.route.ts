import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { Prisma, User } from '@prisma/client';

import { authMiddleware } from '../middlewares/auth.middleware';

import {
  createUser,
  getUser,
  updateUserPassword,
  updateUserValidEmail,
} from '../services/user.service';
import {
  createPasswordForgotten,
  getPasswordForgotten,
  updateIsUsedPasswordForgotten,
} from '../services/passwordForgotten.service';
import {
  verify,
  signEmailValidation,
} from '../services/jsonwebtoken.service';
import MailService from '../services/mail.service';

import type { AuthVariables } from '../interfaces/auth.d';

import { ErrorSchema } from '../schemas/error.schema';
import {
  PostUserDtoSchema,
  PostUserSchema,
  GetUserSchema,
  RequestResetPasswordDtoSchema,
  RequestResetPasswordSchema,
  ValidEmailDtoSchema,
  ValidEmailSchema,
} from '../schemas/user.schema';
import {
  ResetPasswordDtoSchema,
  ResetPasswordSchema,
} from '../schemas/passwordForgotten.schema';

const app = new OpenAPIHono<{ Variables: AuthVariables }>();

const postUserRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['user'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostUserDtoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Respond after creating an user',
      content: {
        'application/json': {
          schema: PostUserSchema,
        },
      },
    },
    400: {
      description: 'Invalid format',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
  },
});

app.openapi(postUserRoute, async (c) => {
  const { username, password, email } = c.req.valid('json');
  let newUser: User;
  try {
    newUser = await createUser({ username, password, email });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return c.json({
          error: 'Email already exists',
        }, 400);
      }
    }
    throw error;
  }
  const token = signEmailValidation(newUser.id);
  const mailer = new MailService();
  mailer.sendMail({
    to: newUser.email,
    subject: 'Registration on rplan',
    text: 'a text',
    html: `<b>${token}</b>`,
  });
  return c.json({
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
    createdAt: newUser.createdAt,
  });
});

const validEmail = createRoute({
  method: 'post',
  path: '/valid-email',
  tags: ['user'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ValidEmailDtoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Respond after validating an email for an user',
      content: {
        'application/json': {
          schema: ValidEmailSchema,
        },
      },
    },
    400: {
      description: 'Invalid token or email already verified',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
  },
});

app.openapi(validEmail, async (c) => {
  const { token } = c.req.valid('json');
  const [err, decoded] = verify(token, process.env.EMAIL_VALIDATION_SECRET_KEY);
  if (err) {
    return c.json({
      error: 'Invalid token',
    }, 400);
  }
  const user = await getUser({ id: decoded.id });
  if (!user) {
    return c.json({
      error: 'Invalid token',
    }, 400);
  }
  if (user.isEmailValid) {
    return c.json({
      error: 'Email is already verified',
    }, 400);
  }
  await updateUserValidEmail(decoded.id, true);
  return c.json({
    message: 'Email is now valid',
  });
});

const requestResetPassword = createRoute({
  method: 'post',
  path: '/forgotten-password',
  tags: ['user'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: RequestResetPasswordDtoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Respond always email sent',
      content: {
        'application/json': {
          schema: RequestResetPasswordSchema,
        },
      },
    },
  },
});

app.openapi(requestResetPassword, async (c) => {
  const { email } = c.req.valid('json');
  const user = await getUser({ email });
  if (user) {
    const passwordForgotten = await createPasswordForgotten(user.id);
    const mailer = new MailService();
    mailer.sendMail({
      to: user.email,
      subject: 'Password forgotten on rplan',
      html: `<b>${passwordForgotten.token}</b>`,
    });
  }
  return c.json({
    message: 'Email sent !',
  });
});

const resetPassword = createRoute({
  method: 'post',
  path: '/reset-password',
  tags: ['user'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ResetPasswordDtoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Message with password reset success',
      content: {
        'application/json': {
          schema: ResetPasswordSchema,
        },
      },
    },
    400: {
      description: 'Invalid token | token expired | token already used',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
  },
});

app.openapi(resetPassword, async (c) => {
  const { token, password } = c.req.valid('json');
  const passwordForgotten = await getPasswordForgotten(token);
  if (!passwordForgotten) {
    return c.json({
      error: 'Invalid token',
    }, 400);
  }
  if (passwordForgotten.isUsed) {
    return c.json({
      error: 'Token for reset password has already been used',
    }, 400);
  }
  const [err, decoded] = verify(token, process.env.PASSWORD_FORGOTTEN_SECRET_KEY);
  if (err?.name === 'TokenExpiredError'
    || passwordForgotten.createdAt.getTime()
      + parseInt(process.env.TOKEN_PASSWORD_FORGOTTEN_EXPIRATION, 10) * 1000
      >= new Date().getTime()) {
    return c.json({
      error: 'Token for reset password has expired',
    }, 400);
  }
  if (err || decoded.id !== passwordForgotten.userId) {
    return c.json({
      error: 'Invalid token',
    }, 400);
  }
  await updateUserPassword(passwordForgotten.userId, password);
  updateIsUsedPasswordForgotten(token, true);
  return c.json({
    message: 'Password updated',
  });
});

app.use(authMiddleware);

const getUserRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['user'],
  responses: {
    200: {
      description: 'Respond after getting his user',
      content: {
        'application/json': {
          schema: GetUserSchema,
        },
      },
    },
    404: {
      description: 'User not found',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
  },
});

app.openapi(getUserRoute, async (c) => {
  const id = c.get('userId');
  const user = await getUser({ id });
  if (user) {
    return c.json({
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      lastLoginOn: user.lastLoginOn,
    });
  }
  return c.json({
    error: 'User not found',
  }, 404);
});

export default app;
