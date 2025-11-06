import prisma from '@/lib/prisma';

export async function getScoresByContest(contestId: string) {
  const contest = await prisma.contest.findUnique({
    where: { id: contestId },
    include: { userAnswers: { include: { user: true, answer: true } } },
  });

  if (!contest) return [];

  // Calculate scores for each user
  const userScoresMap = new Map<string, { user: (typeof contest.userAnswers)[number]['user']; totalScore: number }>();

  contest.userAnswers.forEach(ua => {
    const userId = ua.user.id;
    const answerScore = ua.answer.score;

    if (!userScoresMap.has(userId)) {
      userScoresMap.set(userId, { user: ua.user, totalScore: 0 });
    }

    const userScore = userScoresMap.get(userId)!;
    userScore.totalScore += answerScore;
  });

  // Convert map to array and sort by total score descending
  const userScores = Array.from(userScoresMap.values()).sort((a, b) => b.totalScore - a.totalScore);

  return userScores;
}
