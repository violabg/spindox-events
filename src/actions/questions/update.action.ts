'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { questionSchema, type QuestionData } from '@/schemas/question.schema';

export async function updateQuestionAction(questionId: string, data: QuestionData) {
  try {
    // Validate input
    const validatedQuestionId = z.cuid().parse(questionId);
    const validatedData = questionSchema.parse(data);

    // Check if question exists and belongs to the contest
    const existingQuestion = await prisma.question.findFirst({
      where: {
        id: validatedQuestionId,
        contestId: validatedData.contestId,
      },
    });

    if (!existingQuestion) {
      return {
        success: false,
        error: 'Question not found or does not belong to this contest',
      };
    }

    // Update question and answers in a transaction
    await prisma.$transaction(async tx => {
      // Update the question
      await tx.question.update({
        where: { id: validatedQuestionId },
        data: {
          title: validatedData.title,
          content: validatedData.content,
        },
      });

      // Delete all existing answers first
      await tx.answer.deleteMany({
        where: { questionId: validatedQuestionId },
      });

      // Create new answers
      await tx.answer.createMany({
        data: validatedData.answers.map((answer, index) => ({
          questionId: validatedQuestionId,
          content: answer.content,
          score: answer.score,
          order: index + 1,
        })),
      });
    });

    // Revalidate the contest page
    revalidatePath(`/admin/contests/${validatedData.contestId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error updating question:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Validation failed',
      };
    }

    return {
      success: false,
      error: 'Failed to update question',
    };
  }
}
