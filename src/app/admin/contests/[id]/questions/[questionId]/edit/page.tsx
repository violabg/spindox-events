import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import AdminLayout from '@/components/admin-layout';
import { getQuestionWithAnswersAction } from '@/actions/questions/get.action';
import QuestionForm from '../../../question.form';

type PageProps = {
  params: Promise<{ id: string; questionId: string }>;
};

export default async function EditQuestionPage({ params }: PageProps) {
  const { id, questionId } = await params;

  const questionResult = await getQuestionWithAnswersAction(questionId);

  if (!questionResult.success || !questionResult.data) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-destructive">Question Not Found</h1>
        <p className="text-muted-foreground mt-2">The requested question could not be found.</p>
        <Button asChild className="mt-4">
          <Link href={`/admin/contests/${id}/questions`}>Back to Questions</Link>
        </Button>
      </div>
    );
  }

  const question = questionResult.data;

  return (
    <AdminLayout title="Edit Question" subtitle={`Update "${question.title}"`} backHref={`/admin/contests/${id}/questions`}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle>Question Details</CardTitle>
          <CardDescription>Update the question information and answer options with scores.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <QuestionForm contestId={id} question={question} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
