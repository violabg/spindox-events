import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { submitAnswersSchema } from '@/lib/schemas/contest.schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = params;

    // Parse and validate request body
    const body = await request.json();
    const validationResult = submitAnswersSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid request', details: validationResult.error.issues }, { status: 400 });
    }

    const { answers } = validationResult.data;

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

    // Check for duplicate submission
    const existingSubmission = await prisma.userAnswer.findFirst({
      where: {
        userId: session.user.id,
        contestId: contest.id,
      },
    });

    if (existingSubmission) {
      return NextResponse.json({ error: 'Already submitted' }, { status: 409 });
    }

    // Create user answers and calculate score
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
      if (question.type === 'SINGLE_CHOICE') {
        isCorrect = selectedAnswers.length === 1 && selectedAnswers[0].score > 0;
      } else if (question.type === 'MULTIPLE_CHOICES') {
        // For multiple choice, user must select all correct answers and no wrong ones
        const selectedIds = new Set(selectedAnswers.map(a => a.id));
        const correctIds = new Set(correctAnswers.map(a => a.id));
        isCorrect = selectedIds.size === correctIds.size && [...selectedIds].every(id => correctIds.has(id));
      }

      if (isCorrect) {
        correctCount++;
        totalScore += selectedAnswers.reduce((sum, a) => sum + a.score, 0);
      }

      // Save user answers
      for (const selectedAnswer of selectedAnswers) {
        await prisma.userAnswer.create({
          data: {
            userId: session.user.id,
            contestId: contest.id,
            questionId: question.id,
            answerId: selectedAnswer.id,
            score: selectedAnswer.score > 0 ? selectedAnswer.score : 0,
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
