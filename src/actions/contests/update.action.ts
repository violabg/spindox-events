'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import prisma from '@/lib/prisma';
import { type ContestData, contestSchema } from '@/schemas/contest.schema';

export async function updateContestAction(id: string, data: ContestData) {
  try {
    // Validate the ID and data separately
    const validatedId = z.cuid().parse(id);
    const validatedData = contestSchema.parse(data);

    // Check if contest exists
    const existingContest = await prisma.contest.findUnique({
      where: { id: validatedId },
    });

    if (!existingContest) {
      return {
        success: false,
        error: 'Contest not found',
      };
    }

    // Check if slug is already taken by another contest
    const existingSlug = await prisma.contest.findFirst({
      where: {
        slug: validatedData.slug,
        id: { not: validatedId }, // Exclude current contest
      },
    });

    if (existingSlug) {
      return {
        success: false,
        error: 'Slug already exists',
      };
    }

    // Update the contest
    const updatedContest = await prisma.contest.update({
      where: { id: validatedId },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        theme: validatedData.theme || null,
        description: validatedData.description || null,
        active: validatedData.active,
        allowMultipleAttempts: validatedData.allowMultipleAttempts,
        timeLimit: validatedData.timeLimit,
        requireCompletedProfile: validatedData.requireCompletedProfile,
        showFinalResults: validatedData.showFinalResults,
        showLeaderboard: validatedData.showLeaderboard,
      },
    });

    // Revalidate the admin page and contest details page
    revalidatePath('/admin/contests');
    revalidatePath(`/admin/contests/${validatedId}`);

    return {
      success: true,
      data: updatedContest,
    };
  } catch (error) {
    console.error('Error updating contest:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Validation failed',
      };
    }

    return {
      success: false,
      error: 'Failed to update contest',
    };
  }
}
