import { z } from '@hono/zod-openapi';

export const LoginParamsSchema = z.object({
  login: z.string(),
  password: z.string(),
}).openapi({
  required: ['login', 'password'],
});

export const ResetParamsSchema = z.object({
  email: z.string().email(),
}).openapi({
  required: ['email'],
});

export const LoginReturnSchema = z.object({
  status: z.string(),
});

export const LoginErrorSchema = z.object({
  error: z.string(),
});

export const AccessErrorSchema = z.object({
  error: z.string(),
});
