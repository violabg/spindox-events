import prisma from '@/lib/prisma';

export async function getSubmissionsByContest(contestId: string) {
  const attempts = await prisma.userAttempts.findMany({
    where: { contestId },
    include: { user: true },
    orderBy: { score: 'desc' },
  });

  return attempts;
}
