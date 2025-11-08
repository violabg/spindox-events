import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { ContestMode } from '@/prisma/enums';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = params;

    // Retrieve contest by slug
    const contest = await prisma.contest.findUnique({
      where: { slug },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            answers: {
              select: {
                id: true,
                content: true,
                order: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Check if user has already submitted answers for this contest
    const existingAttempt = await prisma.userAttempts.findFirst({
      where: {
        userId: session.user.id,
        contestId: contest.id,
      },
    });

    // For SINGLE mode contests, user can't submit again if they have an attempt
    // For MULTIPLE mode contests, user can submit multiple times
    const hasSubmitted = contest.mode === ContestMode.SINGLE ? !!existingAttempt : false;

    // Format response
    const response = {
      contest: {
        id: contest.id,
        slug: contest.slug,
        name: contest.name,
        description: contest.description,
        mode: contest.mode,
      },
      questions: contest.questions.map((question: (typeof contest.questions)[number]) => ({
        id: question.id,
        title: question.title,
        content: question.content,
        type: question.type as string,
        answers: question.answers,
      })),
      hasSubmitted,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching contest:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
