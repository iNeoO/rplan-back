import {
  CreateInvitationPayload,
} from '../schemas/permissionInvitation.schema';
import prisma from '../libs/prisma';

export const createInvitation = async (
  invitationPayload: CreateInvitationPayload,
) => prisma.permissionInvitation.create({
  data: {
    ...invitationPayload,
  },
});
