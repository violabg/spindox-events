'use server';

import prisma from '@/lib/prisma';
import type { Prisma } from '@/prisma/client';

export async function getUsers<T extends Prisma.UserInclude | undefined>(args: Omit<Prisma.UserFindManyArgs, 'include'> & { include?: T } = {}) {
  return prisma.user.findMany({
    ...args,
  }) as Promise<Array<Prisma.UserGetPayload<{ include: T }>>>;
}

export async function getUserById<T extends Prisma.UserInclude | undefined>(userId: string, args: { include?: T } = {}) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: args.include,
  }) as Promise<Prisma.UserGetPayload<{ include: T }> | null>;
}
