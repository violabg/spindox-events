import { cache } from 'react';

import prisma from '@/lib/prisma';

export const getContests = cache(async () => {
  return prisma.contest.findMany({
    include: {
      questions: {
        include: { answers: { orderBy: { order: 'asc' } } },
        orderBy: { order: 'asc' },
      },
      attempts: {
        include: { userAnswers: { orderBy: { createdAt: 'desc' } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
});

export const getContestById = cache(async (id: string) => {
  return prisma.contest.findUnique({
    where: { id: id },
    include: {
      questions: {
        include: { answers: { orderBy: { order: 'asc' } }, userAnswers: { orderBy: { createdAt: 'desc' } } },
        orderBy: { order: 'asc' },
      },
      attempts: {
        include: { userAnswers: { orderBy: { createdAt: 'desc' } } },
      },
    },
  });
});
