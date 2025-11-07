import prisma from '@/lib/prisma';

export async function getAllUserAttempts(contestId: string, userId: string) {
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
}
