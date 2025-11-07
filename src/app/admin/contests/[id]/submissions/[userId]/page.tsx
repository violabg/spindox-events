import { getContestById } from '@/queries/contests';
import { getSubmissionsByUserAndContest } from '@/queries/submissionsByUserAndContest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout, EmptyTable } from '@/components/admin';
import SubmissionDetailTable from './submission-detail.table';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ id: string; userId: string }>;
};

export default async function SubmissionDetailPage({ params }: PageProps) {
  const { id, userId } = await params;

  const [contest, submissions] = await Promise.all([getContestById(id), getSubmissionsByUserAndContest(id, userId)]);

  if (!contest || submissions.length === 0) {
    notFound();
  }

  const user = submissions[0].user;
  const totalScore = submissions.reduce((sum, submission) => sum + submission.score, 0);

  return (
    <AdminLayout
      title="Submission Detail"
      subtitle={`${user.name}'s responses`}
      backHref={`/admin/contests/${id}/submissions`}
      breadcrumbs={[
        { label: 'Contests', href: '/admin/contests' },
        { label: contest.name, href: `/admin/contests/${id}` },
        { label: 'Submissions', href: `/admin/contests/${id}/submissions` },
        { label: user.name },
      ]}
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">User</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalScore}</p>
              <p className="text-sm text-muted-foreground">{submissions.length} questions</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Answers</CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <EmptyTable title="No submissions" description="No answers found for this user." />
            ) : (
              <SubmissionDetailTable submissions={submissions} />
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
