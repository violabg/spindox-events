import { redirect } from 'next/navigation';

type ContextDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ContextDetailsPage({ params }: ContextDetailsPageProps) {
  const { id } = await params;

  // Redirect directly to the questions management page
  redirect(`/admin/contests/${id}/questions`);
}
