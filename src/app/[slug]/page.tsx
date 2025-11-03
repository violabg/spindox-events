import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ContestPageClient from './page.client';

type ContestPageParams = {
  params: Promise<{ slug: string }>;
};

export default async function ContestPage({ params }: ContestPageParams) {
  const { slug } = await params;

  const contest = await prisma.contest.findUnique({
    where: {
      slug,
      status: 'active', // Only show active contests
    },
  });
  if (!contest) return notFound();

  return <ContestPageClient contest={contest} />;
}
