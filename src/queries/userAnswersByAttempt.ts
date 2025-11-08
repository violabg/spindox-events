import prisma from '@/lib/prisma';

export async function getUserAnswersByAttempt(contestId: string, userId: string, attemptId?: string) {
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
}
