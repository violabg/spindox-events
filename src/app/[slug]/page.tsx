import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type ContestPageParams = {
  params: Promise<{ slug: string }>;
};

export default async function ContestPage({ params }: ContestPageParams) {
  return (
    <section>
      <h1>This will be pre-rendered</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicContent params={params} />
      </Suspense>
    </section>
  );
}

async function DynamicContent({ params }: ContestPageParams) {
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
