import prisma from '@/lib/prisma';

export async function getQuestionWithAnalytics(questionId: string) {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      answers: {
        orderBy: { order: 'asc' },
      },
      userAnswers: {
        include: {
          userAttempt: {
            include: { user: true },
          },
          answer: true,
        },
      },
    },
  });

  if (!question) return null;

  // Calculate analytics
  const totalResponses = question.userAnswers.length;
  const uniqueUsers = new Set(question.userAnswers.map(ua => ua.userAttempt.userId)).size;

  // Answer distribution
  const answerDistribution = new Map<string, { count: number; percentage: number; score: number }>();
  question.answers.forEach(answer => {
    const count = question.userAnswers.filter(ua => ua.answerId === answer.id).length;
    answerDistribution.set(answer.id, {
      count,
      percentage: totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0,
      score: answer.score,
    });
  });

  // Score statistics
  const scores = question.userAnswers.map(ua => ua.score);
  const averageScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : '0';
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const minScore = scores.length > 0 ? Math.min(...scores) : 0;
  const correctAnswers = scores.filter(s => s > 0).length;
  const correctPercentage = totalResponses > 0 ? Math.round((correctAnswers / totalResponses) * 100) : 0;

  return {
    question,
    analytics: {
      totalSubmissions: totalResponses,
      uniqueUsers,
      averageScore,
      maxScore,
      minScore,
      correctAnswers,
      correctPercentage,
      answerDistribution,
    },
  };
}
