'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { ContestStatus } from '@/prisma/enums';
import { revalidatePath } from 'next/cache';

const updateContestSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  theme: z.string().max(50, 'Theme must be less than 50 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  status: z.enum(ContestStatus),
});

type UpdateContestData = z.infer<typeof updateContestSchema>;

export async function updateContestAction(data: UpdateContestData) {
  try {
    // Validate the data
    const validatedData = updateContestSchema.parse(data);

    // Check if contest exists
    const existingContest = await prisma.contest.findUnique({
      where: { id: validatedData.id },
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
        id: { not: validatedData.id }, // Exclude current contest
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
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        theme: validatedData.theme || null,
        description: validatedData.description || null,
        status: validatedData.status,
      },
    });

    // Revalidate the admin page and contest details page
    revalidatePath('/admin');
    revalidatePath(`/admin/contests/${validatedData.id}`);

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
