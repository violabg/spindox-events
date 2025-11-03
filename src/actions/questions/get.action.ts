'use server';

import prisma from '@/lib/prisma';

export async function getQuestionWithAnswersAction(questionId: string) {
  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        answers: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return {
      success: true,
      data: question,
    };
  } catch (error) {
    console.error('Error fetching question:', error);
    return {
      success: false,
      error: 'Failed to fetch question',
      data: null,
    };
  }
}
