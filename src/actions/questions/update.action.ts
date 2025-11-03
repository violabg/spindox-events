'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const updateQuestionSchema = z.object({
  questionId: z.string().cuid(),
  contextId: z.string().cuid(),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required').max(1000, 'Content must be less than 1000 characters'),
  answers: z
    .array(
      z.object({
        id: z.string().cuid().optional(),
        content: z.string().min(1, 'Answer content is required').max(200, 'Answer must be less than 200 characters'),
        score: z.number().int().min(0, 'Score must be 0 or greater'),
      })
    )
    .min(1, 'At least 1 answer is required'),
});

type UpdateQuestionData = z.infer<typeof updateQuestionSchema>;

export async function updateQuestionAction(data: UpdateQuestionData) {
  try {
    // Validate input
    const validatedData = updateQuestionSchema.parse(data);

    // Check if question exists and belongs to the context
    const existingQuestion = await prisma.question.findFirst({
      where: {
        id: validatedData.questionId,
        contextId: validatedData.contextId,
      },
    });

    if (!existingQuestion) {
      return {
        success: false,
        error: 'Question not found or does not belong to this context',
      };
    }

    // Update question and answers in a transaction
    await prisma.$transaction(async tx => {
      // Update the question
      await tx.question.update({
        where: { id: validatedData.questionId },
        data: {
          title: validatedData.title,
          content: validatedData.content,
        },
      });

      // Delete all existing answers first
      await tx.answer.deleteMany({
        where: { questionId: validatedData.questionId },
      });

      // Create new answers
      await tx.answer.createMany({
        data: validatedData.answers.map((answer, index) => ({
          questionId: validatedData.questionId,
          content: answer.content,
          score: answer.score,
          order: index + 1,
        })),
      });
    });

    // Revalidate the context page
    revalidatePath(`/admin/contexts/${validatedData.contextId}`);

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
