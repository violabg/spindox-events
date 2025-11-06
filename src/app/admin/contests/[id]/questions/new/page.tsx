import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin-layout';
import Link from 'next/link';
import { getContestById } from '@/queries/contests';
import QuestionForm from '../../question.form';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewQuestionPage({ params }: PageProps) {
  const { id } = await params;

  const contest = await getContestById(id);

  if (!contest) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-destructive">Contest Not Found</h1>
        <p className="text-muted-foreground mt-2">The requested contest could not be found.</p>
        <Button asChild className="mt-4">
          <Link href="/admin">Back to Admin</Link>
        </Button>
      </div>
    );
  }

  return (
    <AdminLayout title="Create New Question" subtitle={`Add a new question to "${contest.name}"`} backHref={`/admin/contests/${id}/questions`}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle>Question Details</CardTitle>
          <CardDescription>Fill in the question information and provide answer options with scores.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <QuestionForm contestId={id} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
