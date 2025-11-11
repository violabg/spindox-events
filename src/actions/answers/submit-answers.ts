'use server';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { submitAnswersSchema } from '@/lib/schemas/contest.schema';
import { QuestionType } from '@/prisma/enums';
import { getContestBySlug } from '@/queries/contests';

export async function submitAnswersAction(data: { answers: { questionId: string; answerIds: string[] }[]; startedAt: string }, slug: string) {
  // Authenticate
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Validate
  const parsed = submitAnswersSchema.safeParse({
    answers: Object.fromEntries(data.answers.map(a => [a.questionId, { answerIds: a.answerIds }])),
  });
  if (!parsed.success) {
    throw new Error('Invalid request');
  }

  const { answers } = parsed.data;

  // Get contest
  const contest = await getContestBySlug(slug);

  if (!contest) throw new Error('Contest not found');

  // Check for existing attempt (for contests that don't allow multiple attempts)
  if (!contest.allowMultipleAttempts) {
    const existingAttempt = await prisma.userAttempts.findFirst({
      where: {
        userId: session.user.id,
        contestId: contest.id,
      },
    });

    // If contest doesn't allow multiple attempts and user already attempted, reject
    if (existingAttempt) {
      throw new Error('You can only submit once for this contest');
    }
  }

  // Calculate results
  let totalScore = 0;
  let correctCount = 0;
  const results: {
    questionId: string;
    questionContent: string;
    selectedAnswers: string[];
    correctAnswers: string[];
    isCorrect: boolean;
  }[] = [];

  const answerEntries = Object.entries(answers).map(([questionId, { answerIds }]) => ({ questionId, answerIds }));

  for (const answer of answerEntries) {
    const question = contest.questions.find(q => q.id === answer.questionId);
    if (!question) continue;

    const selectedAnswers = question.answers.filter(a => answer.answerIds.includes(a.id));
    const correctAnswers = question.answers.filter(a => a.score > 0);

    let isCorrect = false;
    if (question.type === QuestionType.SINGLE_CHOICE) {
      isCorrect = selectedAnswers.length === 1 && selectedAnswers[0].score > 0;
    } else if (question.type === QuestionType.MULTIPLE_CHOICES) {
      const selSet = new Set(selectedAnswers.map(a => a.id));
      const corSet = new Set(correctAnswers.map(a => a.id));
      isCorrect = selSet.size === corSet.size && [...selSet].every(id => corSet.has(id));
    }

    if (isCorrect) {
      correctCount++;
      totalScore += selectedAnswers.reduce((sum, a) => sum + a.score, 0);
    }

    results.push({
      questionId: question.id,
      questionContent: question.content,
      selectedAnswers: selectedAnswers.map(a => a.id),
      correctAnswers: correctAnswers.map(a => a.id),
      isCorrect,
    });
  }

  // Create UserAttempt and UserAnswers
  // Always create new attempt (SINGLE mode already threw error if one exists)
  const startDate = new Date(data.startedAt);
  const finishDate = new Date(); // Server time when submission is received

  await prisma.userAttempts.create({
    data: {
      userId: session.user.id,
      contestId: contest.id,
      startedAt: startDate,
      finishedAt: finishDate,
      score: totalScore,
      userAnswers: {
        create: answerEntries.flatMap(answer => {
          const question = contest.questions.find(q => q.id === answer.questionId);
          if (!question) return [];
          const selectedAnswers = question.answers.filter(a => answer.answerIds.includes(a.id));
          return selectedAnswers.map(selectedAnswer => ({
            questionId: question.id,
            answerId: selectedAnswer.id,
            score: selectedAnswer.score,
          }));
        }),
      },
    },
  });

  return {
    score: totalScore,
    totalQuestions: contest.questions.length,
    correctCount,
    results,
  };
}
