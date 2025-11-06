'use server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { submitAnswersSchema } from '@/lib/schemas/contest.schema';
import { headers } from 'next/headers';

export async function submitAnswersAction(data: { answers: { questionId: string; answerIds: string[] }[] }, slug: string) {
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
  const contest = await prisma.contest.findUnique({
    where: { slug },
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });

  if (!contest) throw new Error('Contest not found');

  // Check duplicate submission
  const existingSubmission = await prisma.userAnswer.findFirst({
    where: { userId: session.user.id, contestId: contest.id },
  });
  if (existingSubmission) throw new Error('Already submitted');

  // Calculate results and persist
  let totalScore = 0;
  let correctCount = 0;
  const results: {
    questionId: string;
    questionContent: string;
    userAnswerIds: string[];
    correctAnswerIds: string[];
    isCorrect: boolean;
  }[] = [];

  const answerEntries = Object.entries(answers).map(([questionId, { answerIds }]) => ({ questionId, answerIds }));

  for (const answer of answerEntries) {
    const question = contest.questions.find(q => q.id === answer.questionId);
    if (!question) continue;

    const selectedAnswers = question.answers.filter(a => answer.answerIds.includes(a.id));
    const correctAnswers = question.answers.filter(a => a.score > 0);

    let isCorrect = false;
    if (question.type === 'SINGLE_CHOICE') {
      isCorrect = selectedAnswers.length === 1 && selectedAnswers[0].score > 0;
    } else if (question.type === 'MULTIPLE_CHOICES') {
      const selectedIds = new Set(selectedAnswers.map(a => a.id));
      const correctIds = new Set(correctAnswers.map(a => a.id));
      isCorrect = selectedIds.size === correctIds.size && [...selectedIds].every(id => correctIds.has(id));
    }

    if (isCorrect) {
      correctCount++;
      totalScore += selectedAnswers.reduce((sum, a) => sum + a.score, 0);
    }

    for (const selectedAnswer of selectedAnswers) {
      await prisma.userAnswer.create({
        data: {
          userId: session.user.id,
          contestId: contest.id,
          questionId: question.id,
          answerId: selectedAnswer.id,
        },
      });
    }

    results.push({
      questionId: question.id,
      questionContent: question.content,
      userAnswerIds: selectedAnswers.map(a => a.id),
      correctAnswerIds: correctAnswers.map(a => a.id),
      isCorrect,
    });
  }

  return {
    score: totalScore,
    totalQuestions: contest.questions.length,
    correctCount,
    results,
  };
}
