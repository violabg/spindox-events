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
      <div className="container mx-auto p-4 sm:p-6">
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
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/admin/contexts/${id}/questions`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">Edit Question</h1>
            <p className="text-muted-foreground text-sm sm:text-base truncate">Update &quot;{question.title}&quot;</p>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle>Question Details</CardTitle>
          <CardDescription>Update the question information and answer options with scores.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <QuestionForm contextId={id} question={question} />
        </CardContent>
      </Card>
    </div>
  );
}
