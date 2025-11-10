import { Skeleton } from '@/components/ui/skeleton';
import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import QuestionPreForm from './question-pre-form';

type ContestPageParams = {
  params: Promise<{ slug: string }>;
};

export default async function ContestPage({ params }: ContestPageParams) {
  return (
    <Suspense fallback={<QuestionFormSkeleton />}>
      <DynamicContent params={params} />
    </Suspense>
  );
}

function QuestionFormSkeleton() {
  return (
    <div className="space-y-8">
      {/* Contest info card skeleton - hidden on mobile */}
      <div className="hidden sm:block bg-slate-100/70 dark:bg-slate-900/70 p-6 border border-slate-300/10 dark:border-white/10 rounded-lg text-slate-900 dark:text-slate-200">
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3 mb-6">
          <div className="flex-1">
            <Skeleton className="mb-2 w-64 h-8" />
            <Skeleton className="w-96 h-4" />
          </div>
          <Skeleton className="rounded-full w-40 h-8" />
        </div>
        <div className="gap-6 grid sm:grid-cols-3 text-slate-700 dark:text-slate-300 text-sm">
          <div className="bg-slate-100/60 dark:bg-slate-900/60 p-4 border border-slate-300/10 dark:border-white/10 rounded-2xl">
            <Skeleton className="mb-2 w-20 h-3" />
            <Skeleton className="w-16 h-5" />
          </div>
          <div className="bg-slate-100/60 dark:bg-slate-900/60 p-4 border border-slate-300/10 dark:border-white/10 rounded-2xl">
            <Skeleton className="mb-2 w-16 h-3" />
            <Skeleton className="w-24 h-5" />
          </div>
          <div className="bg-slate-100/60 dark:bg-slate-900/60 p-4 border border-slate-300/10 dark:border-white/10 rounded-2xl">
            <Skeleton className="mb-2 w-16 h-3" />
            <Skeleton className="w-8 h-5" />
          </div>
        </div>
      </div>

      <div className="gap-4 md:gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr] grid-rows-[auto_1fr_auto] md:grid-rows-1 grid-template-areas-['timer'_'questions'_'info'] md:grid-template-areas-['questions side']">
        {/* Timer skeleton for mobile */}
        <div className="md:hidden top-4 z-20 sticky grid-area-[timer] backdrop-blur-sm">
          <Skeleton className="rounded-3xl w-full h-16" />
        </div>

        {/* Questions skeleton */}
        <section className="space-y-6 grid-area-[questions]">
          <div className="bg-slate-100/80 dark:bg-slate-900/80 shadow-black/20 shadow-xl dark:shadow-black/20 p-4 md:p-6 border border-slate-300/10 dark:border-white/10 rounded-3xl text-left">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <Skeleton className="mb-2 w-24 h-3" />
                <Skeleton className="w-64 h-6" />
              </div>
              <Skeleton className="rounded-full w-32 h-8" />
            </div>

            <div className="mt-4 md:mt-6">
              <div className="hidden sm:flex gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="flex-1 rounded-full h-2" />
                ))}
              </div>
              <Skeleton className="w-20 h-4" />
            </div>

            <div className="space-y-6 md:space-y-8 mt-6 md:mt-8">
              {/* Question input skeleton */}
              <div className="space-y-4">
                <Skeleton className="w-3/4 h-6" />
                <div className="space-y-2">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-2/3 h-4" />
                </div>
                <div className="space-y-3 mt-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="rounded-md w-full h-10" />
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-4 pt-4 md:pt-6 border-slate-300/10 dark:border-white/10 border-t">
                <Skeleton className="w-48 h-4" />
                <div className="flex flex-wrap gap-3">
                  <Skeleton className="rounded-md w-32 h-10" />
                  <Skeleton className="rounded-md w-36 h-10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info skeleton for mobile */}
        <div className="md:hidden space-y-4 grid-area-[info]">
          <ContestInfoSkeleton />
        </div>

        {/* Side skeleton for desktop */}
        <div className="hidden gap-4 md:gap-8 md:grid grid-cols-1 grid-rows-[auto_1fr] grid-area-[side] grid-template-areas-['timer'_'info']">
          <div className="top-4 z-20 sticky grid-area-[timer] backdrop-blur-sm">
            <Skeleton className="rounded-3xl w-full h-16" />
          </div>
          <div className="space-y-4 grid-area-[info]">
            <ContestInfoSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContestInfoSkeleton() {
  return (
    <div className="space-y-4 bg-slate-100/60 dark:bg-slate-900/60 p-4 md:p-6 border border-slate-300/10 dark:border-white/10 rounded-3xl text-slate-900 dark:text-slate-200">
      <div className="flex items-center gap-3">
        <Skeleton className="rounded w-5 h-5" />
        <div className="flex-1">
          <Skeleton className="mb-1 w-24 h-4" />
          <Skeleton className="w-20 h-3" />
        </div>
      </div>
      <div className="gap-4 grid text-sm">
        <div className="bg-slate-50/60 dark:bg-slate-950/60 p-4 border border-slate-300/10 dark:border-white/10 rounded-2xl">
          <Skeleton className="mb-2 w-32 h-3" />
          <Skeleton className="w-8 h-6" />
        </div>
        <div className="bg-slate-50/60 dark:bg-slate-950/60 p-4 border border-slate-300/10 dark:border-white/10 rounded-2xl">
          <Skeleton className="mb-2 w-20 h-3" />
          <Skeleton className="w-12 h-6" />
        </div>
      </div>
    </div>
  );
}

async function DynamicContent({ params }: { params: Promise<{ slug: string }> }) {
  'use cache';
  cacheLife('hours');
  const { slug } = await params;

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
  // const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  // const checkResultPromise = await fetch(`${baseUrl}/api/contests/${contest.slug}/checkIfUserHasResults`, {
  //   headers: headersInstance,
  // });
  // const result = await checkResultPromise.json();
  // if (result.hasSubmitted) {
  //   redirect(`/${slug}/results`);
  // }
  cacheTag(`contest-${contest.id}`);
  return <QuestionPreForm contest={contest} />;
}
