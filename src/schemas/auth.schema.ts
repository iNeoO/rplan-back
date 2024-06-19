import { UserSchema } from 'prisma/zod';

export const LoginSchema = UserSchema.pick({
  email: true,
  password: true,
});
