import { cache } from 'react';

import prisma from '@/lib/prisma';

export const getAllUserAttempts = cache(async (contestId: string, userId: string) => {
  const attempts = await prisma.userAttempts.findMany({
    where: {
      userId,
      contestId,
    },
    include: {
      userAnswers: {
        include: {
          question: true,
          answer: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return attempts;
});

export const getAttemptsByContest = cache(async (contestId: string) => {
  const attempts = await prisma.userAttempts.findMany({
    where: { contestId },
    include: { user: true },
    orderBy: { score: 'desc' },
  });

  return attempts;
});

/**
 * Get unique users and their latest/best attempt for a contest
 * Useful for admin leaderboard view where multiple attempts per user are possible
 */
export const getUniqueUserAttemptsByContest = cache(async (contestId: string) => {
  const attempts = await prisma.userAttempts.findMany({
    where: { contestId },
    include: { user: true },
    orderBy: [{ score: 'desc' }, { finishedAt: 'asc' }],
  });

  // Group by user and take the best attempt (already sorted by score desc)
  const uniqueAttempts = new Map<string, (typeof attempts)[0]>();
  for (const attempt of attempts) {
    if (!uniqueAttempts.has(attempt.userId)) {
      uniqueAttempts.set(attempt.userId, attempt);
    }
  }

  return Array.from(uniqueAttempts.values());
});

export const getUserAnswersByAttempt = cache(async (contestId: string, userId: string, attemptId?: string) => {
  if (attemptId) {
    // Get specific attempt by ID
    const attempt = await prisma.userAttempts.findUnique({
      where: {
        id: attemptId,
      },
      include: {
        user: true,
        userAnswers: {
          include: {
            question: true,
            answer: true,
          },
          orderBy: {
            question: { order: 'asc' },
          },
        },
      },
    });
    return attempt;
  }

  // Get latest attempt for user and contest
  const attempt = await prisma.userAttempts.findFirst({
    where: {
      userId,
      contestId,
    },
    include: {
      user: true,
      userAnswers: {
        include: {
          question: true,
          answer: true,
        },
        orderBy: {
          question: { order: 'asc' },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return attempt;
});
