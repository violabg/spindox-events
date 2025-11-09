'use server';

import prisma from '@/lib/prisma';
import { revalidatePath, updateTag } from 'next/cache';
import { z } from 'zod';

const reorderQuestionsSchema = z.object({
  contestId: z.cuid(),
  orderedIds: z.array(z.cuid()),
});

export async function reorderQuestionsAction(contestId: string, orderedIds: string[]) {
  try {
    const validated = reorderQuestionsSchema.parse({ contestId, orderedIds });

    // Update each question's order in a transaction
    await prisma.$transaction(async tx => {
      for (const [index, id] of validated.orderedIds.entries()) {
        await tx.question.update({
          where: { id },
          data: { order: index + 1 },
        });
      }
    });

    updateTag(`contest-${validated.contestId}`);
    revalidatePath(`/admin/contests/${validated.contestId}`);
    revalidatePath(`/admin/contests/${validated.contestId}/questions`);

    return { success: true };
  } catch (error) {
    console.error('Failed to reorder questions', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Invalid input' };
    }
    return { success: false, error: (error as Error)?.message || 'Failed to reorder questions' };
  }
}
