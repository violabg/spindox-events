import prisma from '@/lib/prisma';

export async function getQuestionWithAnalytics(questionId: string) {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      answers: {
        orderBy: { order: 'asc' },
      },
      submissions: {
        include: {
          user: true,
          answer: true,
        },
      },
      contest: true,
    },
  });

  if (!question) return null;

  // Calculate analytics
  const totalSubmissions = question.submissions.length;
  const uniqueUsers = new Set(question.submissions.map(s => s.userId)).size;

  // Answer distribution
  const answerDistribution = new Map<string, { count: number; percentage: number; score: number }>();
  question.answers.forEach(answer => {
    const count = question.submissions.filter(s => s.answerId === answer.id).length;
    answerDistribution.set(answer.id, {
      count,
      percentage: totalSubmissions > 0 ? Math.round((count / totalSubmissions) * 100) : 0,
      score: answer.score,
    });
  });

  // Score statistics
  const scores = question.submissions.map(s => s.score);
  const averageScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : '0';
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const minScore = scores.length > 0 ? Math.min(...scores) : 0;
  const correctAnswers = scores.filter(s => s > 0).length;
  const correctPercentage = totalSubmissions > 0 ? Math.round((correctAnswers / totalSubmissions) * 100) : 0;

  return {
    question,
    analytics: {
      totalSubmissions,
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
