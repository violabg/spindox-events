import prisma from '@/lib/prisma';

export async function getSubmissionsByUserAndContest(contestId: string, userId: string) {
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
