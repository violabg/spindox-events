'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const createQuestionSchema = z.object({
  contestId: z.string().cuid(),
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

    // Check if contest exists
    const contest = await prisma.contest.findUnique({
      where: { id: validatedData.contestId },
      select: {
        id: true,
      },
    });

    if (!contest) {
      return {
        success: false,
        error: 'Contest not found',
      };
    }

    // Get the next order number for the question
    const lastQuestion = await prisma.question.findFirst({
      where: { contestId: validatedData.contestId },
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
        contestId: validatedData.contestId,
        answers: {
          create: validatedData.answers.map((answer, index) => ({
            content: answer.content,
            score: answer.score,
            order: index + 1,
          })),
        },
      },
    });

    // Revalidate the contest page
    revalidatePath(`/admin/contests/${validatedData.contestId}`);

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
