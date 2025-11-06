import { getContestById } from '@/queries/contests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout, EmptyTable, ContestInformationCard } from '@/components/admin';
import ScoresTable from './users.table';
import { notFound } from 'next/navigation';
import { getScoresByContest } from '@/queries/scores';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function UsersPage({ params }: PageProps) {
  const { id } = await params;

  const [contest, scores] = await Promise.all([getContestById(id), getScoresByContest(id)]);

  if (!contest) {
    notFound();
  }

  return (
    <AdminLayout title="Scores" subtitle="Participants & Results" backHref="/admin">
      <ContestInformationCard contest={contest} />

      <Card>
        <CardHeader>
          <CardTitle>Participants ({scores.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {scores.length === 0 ? (
            <EmptyTable title="No participants" description="Users will appear here once they start answering questions." />
          ) : (
            <ScoresTable scores={scores} />
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
