import prisma from '@/lib/prisma';

export async function getSubmissionsByUserAndContest(contestId: string, userId: string) {
  const submissions = await prisma.submission.findMany({
    where: { contestId, userId },
    include: {
      user: true,
      question: true,
      answer: true,
    },
    orderBy: {
      question: { order: 'asc' },
    },
  });

  return submissions;
}
