'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const deleteQuestionSchema = z.cuid();

export async function deleteQuestionAction(questionId: string) {
  try {
    // Validate input
    const validatedQuestionId = deleteQuestionSchema.parse(questionId);

    // Check if question exists
    const existingQuestion = await prisma.question.findUnique({
      where: { id: validatedQuestionId },
      include: {
        contest: true,
      },
    });

    if (!existingQuestion) {
      return {
        success: false,
        error: 'Question not found',
      };
    }

    // Delete question (this will cascade delete answers and user answers due to foreign key constraints)
    await prisma.question.delete({
      where: { id: validatedQuestionId },
    });

    // Revalidate the contest page and questions page
    revalidatePath(`/admin/contests/${existingQuestion.contestId}`);
    revalidatePath(`/admin/contests/${existingQuestion.contestId}/questions`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting question:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Invalid question ID',
      };
    }

    return {
      success: false,
      error: 'Failed to delete question',
    };
  }
}
