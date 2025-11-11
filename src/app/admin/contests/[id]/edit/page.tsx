import { notFound } from 'next/navigation';

import { AdminLayout } from '@/components/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getContestById } from '@/queries/contests';
import { PageWithParams } from '@/types/pageWithParams';

import ContestForm from '../../contest.form';

export default async function EditContestPage({ params }: PageWithParams<{ id: string }>) {
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
