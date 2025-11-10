import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminLayout } from '@/components/admin';
import { notFound } from 'next/navigation';
import { getContestById } from '@/queries/contests';
import { formatDate } from '@/lib/date';
import Link from 'next/link';
import { ExternalLink, Edit } from 'lucide-react';
import { getAttemptsByContest } from '@/queries/userAttempts';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ContestDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [contest, attempts] = await Promise.all([getContestById(id), getAttemptsByContest(id)]);

  if (!contest) {
    notFound();
  }

  // Calculate metrics
  const uniqueParticipants = attempts.length; // Already unique by user from query
  const averageScore = attempts.length > 0 ? (attempts.reduce((sum: number, a) => sum + a.score, 0) / attempts.length).toFixed(2) : 0;
  const highestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : 0;
  const lowestScore = attempts.length > 0 ? Math.min(...attempts.map(a => a.score)) : 0;

  return (
    <AdminLayout
      title={contest.name}
      subtitle="Contest details and statistics"
      backHref="/admin/contests"
      breadcrumbs={[{ label: 'Contests', href: '/admin/contests' }, { label: contest.name }]}
    >
      <div className="grid gap-6">
        {/* Header with Status and Actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{contest.name}</h1>
            {contest.description && <p className="text-muted-foreground mt-2 max-w-2xl">{contest.description}</p>}
            <div className="flex gap-2 mt-4 text-xs text-muted-foreground">
              <span>ID: {contest.id}</span>
              <span>•</span>
              <span>Slug: {contest.slug}</span>
              {contest.theme && (
                <>
                  <span>•</span>
                  <span>Theme: {contest.theme}</span>
                </>
              )}
              <span>•</span>
              <span>Created: {formatDate(contest.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Badge variant={contest.active ? 'default' : 'secondary'} className="whitespace-nowrap">
              {contest.active ? 'Active' : 'Inactive'}
            </Badge>
            <Button asChild size="sm" variant="outline">
              <Link href={`/${contest.slug}`} target="_blank" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Preview
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href={`/admin/contests/${id}/edit`} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{contest.questions.length}</p>
              <p className="text-xs text-muted-foreground mt-1">total questions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{uniqueParticipants}</p>
              <p className="text-xs text-muted-foreground mt-1">unique users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{averageScore}</p>
              <p className="text-xs text-muted-foreground mt-1">across all users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{highestScore}</p>
              <p className="text-xs text-muted-foreground mt-1">best result</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Lowest Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{lowestScore}</p>
              <p className="text-xs text-muted-foreground mt-1">minimum result</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="grid gap-4 md:grid-cols-2">
          <Button asChild size="lg" variant="outline" className="h-auto flex-col items-start gap-2 p-4">
            <Link href={`/admin/contests/${id}/questions`}>
              <span className="font-semibold">Manage Questions</span>
              <span className="text-xs text-muted-foreground">View {contest.questions.length} questions and analytics</span>
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-auto flex-col items-start gap-2 p-4">
            <Link href={`/admin/contests/${id}/attempts`}>
              <span className="font-semibold">View Attempts</span>
              <span className="text-xs text-muted-foreground">Review {uniqueParticipants} participant responses</span>
            </Link>
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
