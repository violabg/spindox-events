import prisma from '@/lib/prisma';

export async function getScoresByContest(contestId: string) {
  const submissions = await prisma.submission.findMany({
    where: { contestId },
    include: { user: true },
  });

  if (!submissions.length) return [];

  // Calculate scores for each user
  const userScoresMap = new Map<string, { user: (typeof submissions)[number]['user']; totalScore: number }>();

  submissions.forEach(submission => {
    const userId = submission.userId;
    const score = submission.score;

    if (!userScoresMap.has(userId)) {
      userScoresMap.set(userId, { user: submission.user, totalScore: 0 });
    }

    const userScore = userScoresMap.get(userId)!;
    userScore.totalScore += score;
  });

  // Convert map to array and sort by total score descending
  const userScores = Array.from(userScoresMap.values()).sort((a, b) => b.totalScore - a.totalScore);

  return userScores;
}
