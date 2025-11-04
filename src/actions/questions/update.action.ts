'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { updateQuestionSchema, type UpdateQuestionData } from '@/schemas/question.schema';

export async function updateQuestionAction(contestId: string, questionId: string, data: UpdateQuestionData) {
  try {
    // Validate input
    const validatedContestId = z.cuid().parse(contestId);
    const validatedQuestionId = z.cuid().parse(questionId);
    const validatedData = updateQuestionSchema.parse(data);

    // Update question and answers in a transaction
    await prisma.$transaction(async tx => {
      // Update the question
      await tx.question.update({
        where: { id: validatedQuestionId, contestId: validatedContestId },
        data: {
          title: validatedData.title,
          content: validatedData.content,
        },
      });

      // Upsert answers
      const keepIds: string[] = [];

      for (const [index, answer] of validatedData.answers.entries()) {
        const result = answer.id
          ? await tx.answer.update({
              where: { id: answer.id },
              data: { content: answer.content, score: answer.score, order: index + 1 },
            })
          : await tx.answer.create({
              data: {
                questionId: validatedQuestionId,
                content: answer.content,
                score: answer.score,
                order: index + 1,
              },
            });

        keepIds.push(result.id);
      }

      // Delete removed answers
      await tx.answer.deleteMany({
        where: { questionId: validatedQuestionId, id: { notIn: keepIds } },
      });
    });

    // Revalidate the contest page
    revalidatePath(`/admin/contests/${validatedContestId}`);

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
