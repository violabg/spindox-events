'use server';

import prisma from '@/lib/prisma';

export async function getContestAction(contestId: string) {
  try {
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    return {
      success: true,
      data: contest,
    };
  } catch (error) {
    console.error('Error fetching contest:', error);
    return {
      success: false,
      error: 'Failed to fetch contest',
      data: null,
    };
  }
}

export async function getContestWithQuestions(contestId: string) {
  try {
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
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
      data: contest,
    };
  } catch (error) {
    console.error('Error fetching contest:', error);
    return {
      success: false,
      error: 'Failed to fetch contest',
      data: null,
    };
  }
}
