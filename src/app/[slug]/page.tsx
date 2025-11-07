import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import prisma from '@/lib/prisma';
import { cacheLife } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type ContestPageParams = {
  params: Promise<{ slug: string }>;
};

export default async function ContestPage({ params }: ContestPageParams) {
  return (
    <>
      <h1 className="mb-8 font-bold text-3xl text-center">Contest Details</h1>
      <Suspense
        fallback={
          <Card>
            <CardHeader>
              <Skeleton className="w-3/4 h-6" />
              <Skeleton className="w-1/2 h-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 w-full h-4" />
              <Skeleton className="w-5/6 h-4" />
            </CardContent>
            <CardFooter>
              <Skeleton className="w-24 h-10" />
            </CardFooter>
          </Card>
        }
      >
        <DynamicContent params={params} />
      </Suspense>
    </>
  );
}

async function DynamicContent({ params }: ContestPageParams) {
  'use cache';
  cacheLife('hours');
  const { slug } = await params;

  const contest = await prisma.contest.findUnique({
    where: {
      slug,
      status: 'active',
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  if (!contest) return notFound();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{contest.name}</CardTitle>
        <CardDescription>ID: {contest.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{contest.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/${slug}/questions`}>Questions</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
