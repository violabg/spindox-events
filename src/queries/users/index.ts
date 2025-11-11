'use server';

import { cache } from 'react';

import prisma from '@/lib/prisma';
import type { Prisma } from '@/prisma/client';

export const getUsers = cache(
  async <T extends Prisma.UserInclude | undefined>(args: Omit<Prisma.UserFindManyArgs, 'include'> & { include?: T } = {}) => {
    return prisma.user.findMany({
      ...args,
    }) as Promise<Array<Prisma.UserGetPayload<{ include: T }>>>;
  }
);

export const getUserById = cache(async <T extends Prisma.UserInclude | undefined>(userId: string, args: { include?: T } = {}) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: args.include,
  }) as Promise<Prisma.UserGetPayload<{ include: T }> | null>;
});
