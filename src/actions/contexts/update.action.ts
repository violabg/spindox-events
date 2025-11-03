'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { ContextStatus } from '@/prisma/enums';
import { revalidatePath } from 'next/cache';

const updateContextSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  theme: z.string().max(50, 'Theme must be less than 50 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  status: z.enum(ContextStatus),
});

type UpdateContextData = z.infer<typeof updateContextSchema>;

export async function updateContextAction(data: UpdateContextData) {
  try {
    // Validate the data
    const validatedData = updateContextSchema.parse(data);

    // Check if context exists
    const existingContext = await prisma.context.findUnique({
      where: { id: validatedData.id },
    });

    if (!existingContext) {
      return {
        success: false,
        error: 'Context not found',
      };
    }

    // Check if slug is already taken by another context
    const existingSlug = await prisma.context.findFirst({
      where: {
        slug: validatedData.slug,
        id: { not: validatedData.id }, // Exclude current context
      },
    });

    if (existingSlug) {
      return {
        success: false,
        error: 'Slug already exists',
      };
    }

    // Update the context
    const updatedContext = await prisma.context.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        theme: validatedData.theme || null,
        description: validatedData.description || null,
        status: validatedData.status,
      },
    });

    // Revalidate the admin page and context details page
    revalidatePath('/admin');
    revalidatePath(`/admin/contexts/${validatedData.id}`);

    return {
      success: true,
      data: updatedContext,
    };
  } catch (error) {
    console.error('Error updating context:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Validation failed',
      };
    }

    return {
      success: false,
      error: 'Failed to update context',
    };
  }
}
