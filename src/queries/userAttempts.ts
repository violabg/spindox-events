import prisma from '@/lib/prisma';

export async function getAttemptsByContest(contestId: string) {
  const attempts = await prisma.userAttempts.findMany({
    where: { contestId },
    include: { user: true },
    orderBy: { score: 'desc' },
  });

  return attempts;
}

/**
 * Get unique users and their latest/best attempt for a contest
 * Useful for admin leaderboard view where multiple attempts per user are possible
 */
export async function getUniqueUserAttemptsByContest(contestId: string) {
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
}
