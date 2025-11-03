'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { ContestStatus } from '@/prisma/enums';

const createContestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50, 'Slug must be 50 characters or less')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .refine(slug => !slug.startsWith('-') && !slug.endsWith('-'), 'Slug cannot start or end with a hyphen'),
  theme: z.string().max(100, 'Theme must be 100 characters or less').optional(),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  status: z.enum(ContestStatus).default(ContestStatus.active),
});

export type CreateContestInput = z.infer<typeof createContestSchema>;

export async function createContestAction(data: CreateContestInput) {
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
        status: validatedData.status,
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
