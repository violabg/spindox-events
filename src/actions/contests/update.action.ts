'use server';

import prisma from '@/lib/prisma';
import { contestSchema, type ContestData } from '@/schemas/contest.schema';
import { revalidatePath, updateTag } from 'next/cache';
import { z } from 'zod';

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
        status: validatedData.status,
      },
    });

    // update cache tag to revalidate the cache
    updateTag(`contest-${validatedId}`);
    // Revalidate the admin page and contest details page
    revalidatePath('/admin');
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
