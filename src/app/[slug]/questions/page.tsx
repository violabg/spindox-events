import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import QuestionForm from './question-form';

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
          <DynamicContent params={params} reqHeaders={headers()} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function DynamicContent({
  params,
  reqHeaders,
}: {
  params: Promise<{ slug: string }>;

  reqHeaders: Promise<ReadonlyHeaders>;
}) {
  'use cache';
  cacheLife('hours');
  const { slug } = await params;
  const headersInstance = await reqHeaders;

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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const checkResultPromise = await fetch(`${baseUrl}/api/contests/${contest.slug}/checkIfUserHasResults`, {
    headers: headersInstance,
  });
  const result = await checkResultPromise.json();
  if (result.hasSubmitted) {
    redirect(`/${slug}/results`);
  }
  cacheTag(`contest-${contest.id}`);
  return <QuestionForm contest={contest} />;
}
