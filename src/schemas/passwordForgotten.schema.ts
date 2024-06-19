import { PasswordForgottenSchema, UserSchema } from 'prisma/zod';
import { z } from '@hono/zod-openapi';

export const ResetPasswordDtoSchema = UserSchema.pick(
  { password: true },
).merge(PasswordForgottenSchema.pick({ token: true }));

export const ResetPasswordSchema = {
  message: z.string(),
};
