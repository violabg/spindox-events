import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-destructive">Question Not Found</h1>
          <p className="text-muted-foreground mt-2">The requested question could not be found.</p>
          <Button asChild className="mt-4">
            <Link href={`/admin/contexts/${id}/questions`}>Back to Questions</Link>
          </Button>
        </div>
      </div>
    );
  }

  const question = questionResult.data;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/contexts/${id}/questions`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Question</h1>
          <p className="text-muted-foreground">Update &quot;{question.title}&quot;</p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
          <CardDescription>Update the question information and answer options. Mark exactly one answer as correct.</CardDescription>
        </CardHeader>
        <CardContent>
          <QuestionForm contextId={id} question={question} />
        </CardContent>
      </Card>
    </div>
  );
}
