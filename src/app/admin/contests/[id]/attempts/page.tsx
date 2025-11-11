import { notFound } from 'next/navigation';

import { AdminLayout, EmptyTable } from '@/components/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getContestById } from '@/queries/contests';
import { getUniqueUserAttemptsByContest } from '@/queries/userAttempts';

import AttemptTable from './attempts.table';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AttemptsPage({ params }: PageProps) {
  const { id } = await params;

  const [contest, attempts] = await Promise.all([getContestById(id), getUniqueUserAttemptsByContest(id)]);

  if (!contest) {
    notFound();
  }

  return (
    <AdminLayout
      title="Contest Attempts"
      subtitle="Participants & Results"
      backHref="/admin"
      breadcrumbs={[{ label: 'Contests', href: '/admin/contests' }, { label: contest.name, href: `/admin/contests/${id}` }, { label: 'Attempts' }]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Participants ({attempts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {attempts.length === 0 ? (
            <EmptyTable title="No participants" description="Users will appear here once they start answering questions." />
          ) : (
            <AttemptTable attempts={attempts} contestId={id} />
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
