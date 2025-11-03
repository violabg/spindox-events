'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteContestAction(contestId: string) {
  try {
    // Check if contest exists
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
      include: {
        _count: {
          select: {
            questions: true,
            userAnswers: true,
          },
        },
      },
    });

    if (!contest) {
      return {
        success: false,
        error: 'Contest not found',
      };
    }

    // Check if contest has associated data
    if (contest._count.questions > 0 || contest._count.userAnswers > 0) {
      return {
        success: false,
        error: 'Cannot delete contest with existing questions or user answers',
      };
    }

    // Delete the contest
    await prisma.contest.delete({
      where: { id: contestId },
    });

    // Revalidate the admin page to refresh the data
    revalidatePath('/admin');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to delete contest:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete contest',
    };
  }
}
