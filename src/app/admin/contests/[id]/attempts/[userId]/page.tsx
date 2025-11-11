import { notFound } from 'next/navigation';

import { AdminLayout, EmptyTable } from '@/components/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getContestById } from '@/queries/contests';
import { getAllUserAttempts } from '@/queries/userAttempts';
import { PageWithParamsAndSearchParams } from '@/types/pageWithParams';

import AttemptSelector from './attempt-selector';
import UserAnswerDetailTable from './user-answer-detail.table';

export default async function AttemptDetailPage({
  params,
  searchParams,
}: PageWithParamsAndSearchParams<{ id: string; userId: string }, { attemptId?: string }>) {
  const { id, userId } = await params;
  const { attemptId } = await searchParams;

  const [contest, allAttempts] = await Promise.all([getContestById(id), getAllUserAttempts(id, userId)]);

  if (!contest || allAttempts.length === 0) {
    notFound();
  }

  // Get the selected attempt or the first one
  const attempt = attemptId ? allAttempts.find(a => a.id === attemptId) || allAttempts[0] : allAttempts[0];

  if (!attempt) {
    notFound();
  }

  const totalScore = attempt.score;

  return (
    <AdminLayout
      title="Attempt Detail"
      subtitle={`Attempt responses`}
      backHref={`/admin/contests/${id}/attempts`}
      breadcrumbs={[
        { label: 'Contests', href: '/admin/contests' },
        { label: contest.name, href: `/admin/contests/${id}` },
        { label: 'Attempts', href: `/admin/contests/${id}/attempts` },
        { label: 'Details' },
      ]}
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">User ID</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-bold font-mono">{userId}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalScore}</p>
              <p className="text-sm text-muted-foreground">{attempt.userAnswers.length} questions</p>
            </CardContent>
          </Card>
        </div>

        {allAttempts.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Select Attempt</CardTitle>
            </CardHeader>
            <CardContent>
              <AttemptSelector attempts={allAttempts} selectedAttemptId={attempt.id} contestId={id} userId={userId} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Answers</CardTitle>
          </CardHeader>
          <CardContent>
            {attempt.userAnswers.length === 0 ? (
              <EmptyTable title="No answers" description="No answers found for this attempt." />
            ) : (
              <UserAnswerDetailTable userAnswers={attempt.userAnswers} />
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
