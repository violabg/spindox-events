'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const createQuestionSchema = z.object({
  contextId: z.string().cuid(),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required').max(1000, 'Content must be less than 1000 characters'),
  answers: z
    .array(
      z.object({
        content: z.string().min(1, 'Answer content is required').max(200, 'Answer must be less than 200 characters'),
        score: z.number().int().min(0, 'Score must be 0 or greater'),
      })
    )
    .min(1, 'At least 1 answer is required'),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;

export async function createQuestionAction(data: CreateQuestionInput) {
  try {
    // Validate the data
    const validatedData = createQuestionSchema.parse(data);

    // Check if context exists
    const context = await prisma.context.findUnique({
      where: { id: validatedData.contextId },
      select: {
        id: true,
      },
    });

    if (!context) {
      return {
        success: false,
        error: 'Context not found',
      };
    }

    // Get the next order number for the question
    const lastQuestion = await prisma.question.findFirst({
      where: { contextId: validatedData.contextId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const nextOrder = (lastQuestion?.order || 0) + 1;

    // Create the question with answers
    await prisma.question.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        order: nextOrder,
        contextId: validatedData.contextId,
        answers: {
          create: validatedData.answers.map((answer, index) => ({
            content: answer.content,
            score: answer.score,
            order: index + 1,
          })),
        },
      },
    });

    // Revalidate the context page
    revalidatePath(`/admin/contexts/${validatedData.contextId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to create question:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create question',
    };
  }
}
