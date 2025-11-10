'use server';

import prisma from '@/lib/prisma';
import { createContestSchema, type CreateContestData } from '@/schemas/contest.schema';

export async function createContestAction(data: CreateContestData) {
  try {
    // Validate the data (extra safety even though client already validates)
    const validatedData = createContestSchema.parse(data);

    // Check if slug already exists
    const existingContest = await prisma.contest.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingContest) {
      return {
        success: false,
        error: 'A contest with this slug already exists',
      };
    }

    // Create the contest
    await prisma.contest.create({
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

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to create contest:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create contest',
    };
  }
}
