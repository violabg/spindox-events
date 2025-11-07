import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;

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
        userId: session.user.id,
        contestId: contest.id,
      },
    });

    const hasSubmitted = !!existingSubmission;

    // Format response
    const response = {
      hasSubmitted,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching contest:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
