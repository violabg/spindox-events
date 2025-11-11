import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { submitAnswersSchema } from '@/lib/schemas/contest.schema';
import { QuestionType } from '@/prisma/enums';

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;

    // Parse and validate request body
    const body = await request.json();
    const validationResult = submitAnswersSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid request', details: validationResult.error.issues }, { status: 400 });
    }

    const { answers } = validationResult.data;
    const startedAt = body.startedAt ? new Date(body.startedAt) : new Date();

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

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Check for existing attempt based on contest's allowMultipleAttempts setting
    let existingAttempt = null;
    if (!contest.allowMultipleAttempts) {
      existingAttempt = await prisma.userAttempts.findFirst({
        where: {
          userId: session.user.id,
          contestId: contest.id,
        },
      });
    }

    // If contest doesn't allow multiple attempts and user already attempted, reject
    if (!contest.allowMultipleAttempts && existingAttempt) {
      return NextResponse.json({ error: 'You can only submit once for this contest' }, { status: 409 });
    }

    // Calculate score and prepare results
    let totalScore = 0;
    let correctCount = 0;
    const results = [];

    // Convert answers object to array of entries
    const answerEntries = Object.entries(answers).map(([questionId, { answerIds }]) => ({
      questionId,
      answerIds,
    }));

    for (const answer of answerEntries) {
      const question = contest.questions.find(q => q.id === answer.questionId);
      if (!question) continue;

      const selectedAnswers = question.answers.filter(a => answer.answerIds.includes(a.id));
      const correctAnswers = question.answers.filter(a => a.score > 0);

      // Check if user selected correct answers
      let isCorrect = false;
      if (question.type === QuestionType.SINGLE_CHOICE) {
        isCorrect = selectedAnswers.length === 1 && selectedAnswers[0].score > 0;
      } else if (question.type === QuestionType.MULTIPLE_CHOICES) {
        // For multiple choice, user must select all correct answers and no wrong ones
        const selectedIds = new Set(selectedAnswers.map(a => a.id));
        const correctIds = new Set(correctAnswers.map(a => a.id));
        isCorrect = selectedIds.size === correctIds.size && [...selectedIds].every(id => correctIds.has(id));
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

    // Create or update UserAttempt with UserAnswers
    // For contests that don't allow multiple attempts, we should never update. For contests that allow multiple attempts, create new attempt.
    const finishedAt = new Date(); // Server time when submission is received

    if (!contest.allowMultipleAttempts && existingAttempt) {
      // This shouldn't happen as we rejected earlier, but just in case
      return NextResponse.json({ error: 'You can only submit once for this contest' }, { status: 409 });
    } else {
      // Create new attempt
      await prisma.userAttempts.create({
        data: {
          userId: session.user.id,
          contestId: contest.id,
          startedAt: startedAt,
          finishedAt: finishedAt,
          score: totalScore,
          userAnswers: {
            create: answerEntries.flatMap(answer => {
              const question = contest.questions.find(q => q.id === answer.questionId);
              if (!question) return [];
              const selectedAnswers = question.answers.filter(a => answer.answerIds.includes(a.id));
              return selectedAnswers.map(selectedAnswer => ({
                questionId: question.id,
                answerId: selectedAnswer.id,
                score: selectedAnswer.score > 0 ? selectedAnswer.score : 0,
              }));
            }),
          },
        },
      });
    }

    const response = {
      score: totalScore,
      totalQuestions: contest.questions.length,
      correctCount,
      results,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error submitting answers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
