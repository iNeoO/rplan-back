import { PermissionInvitationSchema } from 'prisma/zod';
import { z } from '@hono/zod-openapi';
import type { z as Z } from '@hono/zod-openapi';

export const PostInvitationDtoSchema = PermissionInvitationSchema.pick({
  email: true,
  hasWritePermission: true,
}).merge(z.object({
  message: z.string(),
}));

const CreateInvitationPayloadSchema = PermissionInvitationSchema.pick({
  token: true,
  email: true,
  invitedBy: true,
  hasWritePermission: true,
  planId: true,
});

export type CreateInvitationPayload = Z.infer<typeof CreateInvitationPayloadSchema>;
