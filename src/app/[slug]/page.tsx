import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import ContestPageClient from './page.client';

type ContestPageParams = {
  params: Promise<{ slug: string }>;
};

export default async function ContestPage({ params }: ContestPageParams) {
  const { slug } = await params;

  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect(`/${slug}/login`);
  }

  const contest = await prisma.contest.findUnique({
    where: {
      slug,
      status: 'active',
    },
    include: {
      questions: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          content: true,
          type: true,
          order: true,
          answers: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              content: true,
              score: true,
            },
          },
        },
      },
    },
  });

  if (!contest) return notFound();

  // Check if user already submitted
  const existingSubmission = await prisma.submission.findFirst({
    where: {
      userId: session.user.id,
      contestId: contest.id,
    },
  });

  if (existingSubmission) {
    redirect(`/${slug}/results`);
  }

  return <ContestPageClient contest={contest} />;
}
