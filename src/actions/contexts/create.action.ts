'use server';

import { z } from 'zod';
import { ContextStatus } from '@/prisma/enums';
import prisma from '@/lib/prisma';

const createContextSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  theme: z.string().max(50, 'Theme must be less than 50 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  status: z.enum(ContextStatus).default(ContextStatus.active),
});

export type CreateContextInput = z.infer<typeof createContextSchema>;

export async function createContextAction(data: CreateContextInput) {
  try {
    // Validate the data (extra safety even though client already validates)
    const validatedData = createContextSchema.parse(data);

    // Check if slug already exists
    const existingContext = await prisma.context.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingContext) {
      return {
        success: false,
        error: 'A context with this slug already exists',
      };
    }

    // Create the context
    await prisma.context.create({
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
    console.error('Failed to create context:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create context',
    };
  }
}
