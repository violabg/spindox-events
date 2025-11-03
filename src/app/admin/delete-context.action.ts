'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteContextAction(contextId: string) {
  try {
    // Check if context exists
    const context = await prisma.context.findUnique({
      where: { id: contextId },
      include: {
        _count: {
          select: {
            questions: true,
            userAnswers: true,
          },
        },
      },
    });

    if (!context) {
      return {
        success: false,
        error: 'Context not found',
      };
    }

    // Check if context has associated data
    if (context._count.questions > 0 || context._count.userAnswers > 0) {
      return {
        success: false,
        error: 'Cannot delete context with existing questions or user answers',
      };
    }

    // Delete the context
    await prisma.context.delete({
      where: { id: contextId },
    });

    // Revalidate the admin page to refresh the data
    revalidatePath('/admin');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to delete context:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete context',
    };
  }
}
