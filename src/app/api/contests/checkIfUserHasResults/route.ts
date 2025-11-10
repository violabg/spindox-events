import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export type CheckUserHasResultsResponse = {
  hasSubmitted: boolean;
  allowMultipleAttempts: boolean;
  canRetake: boolean;
};

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const slug = request.nextUrl.searchParams.get('slug');
    const userId = request.nextUrl.searchParams.get('userId');

    if (!slug || !userId) {
      return NextResponse.json({ error: 'Missing required parameters: slug and userId' }, { status: 400 });
    }

    // Check authentication
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Retrieve contest by slug
    const contest = await prisma.contest.findUnique({
      where: { slug },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Check if user has already submitted answers for this contest
    const existingAttempt = await prisma.userAttempts.findFirst({
      where: {
        userId: userId,
        contestId: contest.id,
      },
    });

    const hasSubmitted = !!existingAttempt;

    // Format response - include allowMultipleAttempts so frontend can decide what to do
    const response: CheckUserHasResultsResponse = {
      hasSubmitted,
      allowMultipleAttempts: contest.allowMultipleAttempts,
      canRetake: contest.allowMultipleAttempts && hasSubmitted,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error checking if user has results:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
