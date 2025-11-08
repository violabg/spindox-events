import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export type CheckUserHasResultsResponse = {
  hasSubmitted: boolean;
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
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        userId: userId,
        contestId: contest.id,
      },
    });

    const hasSubmitted = !!existingSubmission;

    // Format response
    const response: CheckUserHasResultsResponse = {
      hasSubmitted,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching contest:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
