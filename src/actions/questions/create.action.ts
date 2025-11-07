'use server';

import prisma from '@/lib/prisma';
import { createQuestionSchema, type CreateQuestionData } from '@/schemas/question.schema';
import { revalidatePath, updateTag } from 'next/cache';

export async function createQuestionAction(data: CreateQuestionData) {
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
        type: validatedData.type,
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

    // update cache tag to revalidate the cache
    updateTag(`contest-${validatedData.contestId}`);
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
