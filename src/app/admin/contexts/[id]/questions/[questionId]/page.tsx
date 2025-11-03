import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { getQuestionWithAnswersAction } from '@/actions/questions/get.action';

type PageProps = {
  params: Promise<{ id: string; questionId: string }>;
};

export default async function QuestionDetailPage({ params }: PageProps) {
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
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/admin/contexts/${id}/questions`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{question.title}</h1>
            <p className="text-muted-foreground">Question details and answer options</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/contexts/${id}/questions/${questionId}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Question
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Question Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{question.content}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Answer Options</CardTitle>
            <CardDescription>All answer options for this question. The correct answer is highlighted.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {question.answers.map((answer, index) => (
                <div
                  key={answer.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${answer.isCorrect ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}
                >
                  <div className="shrink-0 w-8 h-8 bg-white border rounded-full flex items-center justify-center font-medium">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="flex-1">
                    <p className={answer.isCorrect ? 'font-medium text-green-800' : ''}>{answer.content}</p>
                  </div>
                  {answer.isCorrect && (
                    <Badge variant="default" className="bg-green-600">
                      Correct Answer
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
