import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/components/admin';
import { notFound } from 'next/navigation';
import { getContestById } from '@/queries/contests';
import ContestForm from '../../contest.form';

interface EditContestPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditContestPage({ params }: EditContestPageProps) {
  const { id } = await params;

  const contest = await getContestById(id);

  if (!contest) {
    notFound();
  }

  return (
    <AdminLayout
      title="Edit Contest"
      subtitle="Update the contest information"
      backHref={`/admin/contests/${id}`}
      breadcrumbs={[
        { label: 'Contests', href: '/admin/contests' },
        { label: contest.name, href: `/admin/contests/${id}` },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Contest Details</CardTitle>
          <CardDescription>Update the information for &ldquo;{contest.name}&rdquo;</CardDescription>
        </CardHeader>
        <CardContent>
          <ContestForm contestId={id} initialData={contest} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
