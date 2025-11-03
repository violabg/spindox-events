'use server';

import prisma from '@/lib/prisma';

export async function getContextAction(contextId: string) {
  try {
    const context = await prisma.context.findUnique({
      where: { id: contextId },
    });

    return {
      success: true,
      data: context,
    };
  } catch (error) {
    console.error('Error fetching context:', error);
    return {
      success: false,
      error: 'Failed to fetch context',
      data: null,
    };
  }
}

export async function getContextWithQuestions(contextId: string) {
  try {
    const context = await prisma.context.findUnique({
      where: { id: contextId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            answers: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    return {
      success: true,
      data: context,
    };
  } catch (error) {
    console.error('Error fetching context:', error);
    return {
      success: false,
      error: 'Failed to fetch context',
      data: null,
    };
  }
}
