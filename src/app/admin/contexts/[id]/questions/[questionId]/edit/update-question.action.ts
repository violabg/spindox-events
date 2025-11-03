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
        id: z.string().cuid(),
        content: z.string().min(1, 'Answer content is required').max(200, 'Answer must be less than 200 characters'),
        isCorrect: z.boolean(),
      })
    )
    .length(4, 'Exactly 4 answers are required'),
});

type UpdateQuestionData = z.infer<typeof updateQuestionSchema>;

export async function updateQuestionAction(data: UpdateQuestionData) {
  try {
    // Validate input
    const validatedData = updateQuestionSchema.parse(data);

    // Validate that exactly one answer is correct
    const correctAnswers = validatedData.answers.filter(answer => answer.isCorrect);
    if (correctAnswers.length !== 1) {
      return {
        success: false,
        error: 'Exactly one answer must be marked as correct',
      };
    }

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

      // Update each answer
      for (const answer of validatedData.answers) {
        await tx.answer.update({
          where: { id: answer.id },
          data: {
            content: answer.content,
            isCorrect: answer.isCorrect,
          },
        });
      }
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
