import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function SubmitButton({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicContent params={params} />
    </Suspense>
  );
}

async function DynamicContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
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

  if (!contest) return;
  // Check if user already submitted
  const existingSubmission = await prisma.submission.findFirst({
    where: {
      userId: session?.user.id,
      contestId: contest.id,
    },
  });

  if (existingSubmission) {
    redirect(`/${slug}/results`);
  }
  return (
    <Button type="submit" className="w-full">
      Submit Answers
    </Button>
  );
}
