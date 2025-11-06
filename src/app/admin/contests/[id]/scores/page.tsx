import { getContestById } from '@/queries/contests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin-layout';
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from '@/components/ui/empty';
import ScoresTable from './users.table';
import { notFound } from 'next/navigation';
import { getScoresByContest } from '@/queries/scores';
import ContestInformationCard from '@/components/contest-information-card';

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
            <Empty>
              <EmptyContent>
                <EmptyTitle>No participants</EmptyTitle>
                <EmptyDescription>Users will appear here once they start answering questions.</EmptyDescription>
              </EmptyContent>
            </Empty>
          ) : (
            <ScoresTable scores={scores} />
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
