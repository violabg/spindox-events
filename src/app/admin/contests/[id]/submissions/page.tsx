import { getContestById } from '@/queries/contests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout, EmptyTable, ContestInformationCard } from '@/components/admin';
import SubmissionsTable from './submissions.table';
import { notFound } from 'next/navigation';
import { getSubmissionsByContest } from '@/queries/submissions';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SubmissionsPage({ params }: PageProps) {
  const { id } = await params;

  const [contest, submissions] = await Promise.all([getContestById(id), getSubmissionsByContest(id)]);

  if (!contest) {
    notFound();
  }

  return (
    <AdminLayout title="Submissions" subtitle="Participants & Results" backHref="/admin">
      <ContestInformationCard contest={contest} />

      <Card>
        <CardHeader>
          <CardTitle>Participants ({submissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <EmptyTable title="No participants" description="Users will appear here once they start answering questions." />
          ) : (
            <SubmissionsTable submissions={submissions} />
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
