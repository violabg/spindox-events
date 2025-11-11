import { notFound } from 'next/navigation';

import { getContestBySlug } from '@/queries/contests';
import { PageWithParams } from '@/types/pageWithParams';

import QuestionPreForm from './question-pre-form';

export default async function ContestPage({ params }: PageWithParams<{ slug: string }>) {
  const { slug } = await params;

  const contest = await getContestBySlug(slug);

  if (!contest || !contest.active) return notFound();

  // Check if user already submitted
  // const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  // const checkResultPromise = await fetch(`${baseUrl}/api/contests/${contest.slug}/checkIfUserHasResults`, {
  //   headers: headersInstance,
  // });
  // const result = await checkResultPromise.json();
  // if (result.hasSubmitted) {
  //   redirect(`/${slug}/results`);
  // }
  return <QuestionPreForm contest={contest} />;
}
