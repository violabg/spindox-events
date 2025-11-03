import { notFound } from 'next/navigation';
import ContextDetailsClient from './context-details.client';
import { getContextWithQuestions } from './get-context.action';

type ContextDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ContextDetailsPage({ params }: ContextDetailsPageProps) {
  const { id } = await params;

  const result = await getContextWithQuestions(id);

  if (!result.success || !result.data) {
    return notFound();
  }

  return <ContextDetailsClient contextId={id} initialContext={result.data} />;
}
