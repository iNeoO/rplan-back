import { UserSchema, User } from 'prisma/zod';
import { z } from '@hono/zod-openapi';
import type { z as Z } from '@hono/zod-openapi';

export const PostUserDtoSchema = UserSchema.pick({
  email: true,
  username: true,
  password: true,
});

export type PostUserDto = Z.infer<typeof PostUserDtoSchema>;

export const PostUserSchema = UserSchema.pick({
  id: true,
  email: true,
  username: true,
  createdAt: true,
}).merge(z.object({
  createdAt: z.string().datetime(),
}));

export type UserIdentifications = Partial<Pick<User, 'id' | 'email' | 'username'>>;

export const GetUserSchema = UserSchema.pick({
  id: true,
  email: true,
  username: true,
  createdAt: true,
  lastLoginOn: true,
}).merge(z.object({
  createdAt: z.string().datetime(),
  lastLoginOn: z.string().datetime().nullable(),
}));

export const UserLoginDtoSchema = UserSchema.pick({
  email: true,
  password: true,
});

export type UserLoginDto = Z.infer<typeof UserLoginDtoSchema>;

export const RequestResetPasswordDtoSchema = UserSchema.pick({
  email: true,
});

export const RequestResetPasswordSchema = z.object({
  message: z.string(),
});

export const ValidEmailDtoSchema = z.object({
  token: z.string(),
});

export const ValidEmailSchema = z.object({
  message: z.string(),
});
