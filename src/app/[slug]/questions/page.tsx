import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
        <Suspense fallback={<QuestionFormSkeleton />}>
          <DynamicContent params={params} reqHeaders={headers()} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

function QuestionFormSkeleton() {
  return (
    <div className="space-y-8 mx-auto text-center">
      {/* Stepper skeleton */}
      <div className="space-y-3">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="flex-1 rounded-none h-2" />
          ))}
        </div>
        <Skeleton className="mx-auto w-32 h-4" />
      </div>

      {/* Question content skeleton */}
      <div className="space-y-6">
        {/* Question title */}
        <Skeleton className="mx-auto w-3/4 h-6" />

        {/* Question description */}
        <div className="space-y-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-2/3 h-4" />
        </div>

        {/* Answer options */}
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="rounded-md w-full h-10" />
          ))}
        </div>
      </div>

      {/* Navigation buttons skeleton */}
      <div className="flex justify-center space-x-4">
        <Skeleton className="rounded-md w-32 h-10" />
      </div>
    </div>
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
