import { getContestWithQuestions } from '@/actions/contests/get.action';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, ExternalLink, Plus } from 'lucide-react';
import Link from 'next/link';
import QuestionsTable from './questions.table';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuestionsPage({ params }: PageProps) {
  const { id } = await params;

  const contestResult = await getContestWithQuestions(id);

  if (!contestResult.success || !contestResult.data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-destructive">Contest Not Found</h1>
          <p className="text-muted-foreground mt-2">The requested contest could not be found.</p>
          <Button asChild className="mt-4">
            <Link href="/admin">Back to Admin</Link>
          </Button>
        </div>
      </div>
    );
  }

  const contest = contestResult.data;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{contest.name}</h1>
            <p className="text-muted-foreground">Contest Management</p>
          </div>
        </div>

        {/* Contest Information Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle>Contest Information</CardTitle>
                <Badge variant={contest.status === 'active' ? 'default' : 'secondary'}>{contest.status === 'active' ? 'Active' : 'Inactive'}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" asChild aria-label="Open link">
                  <Link href={`/${contest.slug}`}>
                    <ExternalLink size={'sm'} />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/contests/${id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Contest
                  </Link>
                </Button>
              </div>
            </div>
            {contest.theme && <CardDescription>Theme: {contest.theme}</CardDescription>}
          </CardHeader>
          {contest.description && (
            <CardContent>
              <p className="text-sm text-muted-foreground">{contest.description}</p>
            </CardContent>
          )}
        </Card>

        {/* Questions Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Questions ({contest.questions.length})</h2>
            <p className="text-muted-foreground">Manage questions for this contest</p>
          </div>
          <Button asChild>
            <Link href={`/admin/contests/${id}/questions/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <QuestionsTable contestId={id} questions={contest.questions} />
        </CardContent>
      </Card>
    </div>
  );
}
