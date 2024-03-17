import { z } from '@hono/zod-openapi';

export const ParamsSchema = z.object({
  login: z.string(),
  password: z.string(),
}).openapi({
  required: ['login', 'password'],
});

export const returnSchema = z.object({
  status: z.string(),
});
