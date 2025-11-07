import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import QuestionForm from './questio-form';

type ContestPageParams = {
  params: Promise<{ slug: string }>;
};

export default async function ContestPage({ params }: ContestPageParams) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Answer Questions</CardTitle>
        <CardDescription>Please select your answers below and submit when ready.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>Loading...</div>}>
          <DynamicContent params={params} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function DynamicContent({ params }: ContestPageParams) {
  const { slug } = await params;
  // Check authentication
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

  if (!contest) return notFound();
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

  return <QuestionForm contest={contest} />;
}
