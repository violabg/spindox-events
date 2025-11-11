'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';

export async function deleteContestAction(contestId: string) {
  try {
    // Check if contest exists
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
      select: { id: true, name: true },
    });

    if (!contest) {
      return {
        success: false,
        error: 'Contest not found',
      };
    }

    // Delete the contest (cascade delete will handle all related data)
    await prisma.contest.delete({
      where: { id: contestId },
    });

    // Revalidate the admin page to refresh the data
    revalidatePath('/admin/contests');

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
