import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ContextPageClient from './page.client';

type ContextPageParams = {
  params: Promise<{ slug: string }>;
};

export default async function ContextPage({ params }: ContextPageParams) {
  const { slug } = await params;

  const context = await prisma.context.findUnique({
    where: {
      slug,
      status: 'active', // Only show active contexts
    },
  });
  if (!context) return notFound();

  return <ContextPageClient context={context} />;
}
