'use server';

import prisma from '@/lib/prisma';
import type { Prisma } from '@/prisma/client';

export async function getContests<T extends Prisma.ContestInclude | undefined>(
  args: Omit<Prisma.ContestFindManyArgs, 'include'> & { include?: T } = {}
) {
  return prisma.contest.findMany({
    ...args,
  }) as Promise<Array<Prisma.ContestGetPayload<{ include: T }>>>;
}

export async function getContestById<T extends Prisma.ContestInclude | undefined>(contestId: string, args: { include?: T } = {}) {
  return prisma.contest.findUnique({
    where: { id: contestId },
    include: args.include,
  }) as Promise<Prisma.ContestGetPayload<{ include: T }> | null>;
}
