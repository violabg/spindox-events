import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin';
import { Edit } from 'lucide-react';
import { getQuestionWithAnswersAction } from '@/actions/questions/get.action';
import { getContestById } from '@/queries/contests';

type PageProps = {
  params: Promise<{ id: string; questionId: string }>;
};

export default async function QuestionDetailPage({ params }: PageProps) {
  const { id, questionId } = await params;

  const questionResult = await getQuestionWithAnswersAction(questionId);
  const contest = await getContestById(id);

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

  const actions = (
    <Button asChild>
      <Link href={`/admin/contests/${id}/questions/${questionId}/edit`}>
        <Edit className="mr-2 h-4 w-4" />
        Edit Question
      </Link>
    </Button>
  );

  return (
    <AdminLayout
      title={question.title}
      subtitle="Question details and answer options"
      backHref={`/admin/contests/${id}/questions`}
      breadcrumbs={[
        { label: 'Contests', href: '/admin/contests' },
        { label: contest?.name || 'Contest', href: `/admin/contests/${id}` },
        { label: 'Questions', href: `/admin/contests/${id}/questions` },
        { label: question.title },
      ]}
      actions={actions}
    >
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
            <CardDescription>All answer options for this question with their scores.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {question.answers.map((answer, index) => {
                const maxScore = Math.max(...question.answers.map(a => a.score));
                const isHighestScore = answer.score === maxScore && maxScore > 0;

                return (
                  <div
                    key={answer.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${isHighestScore ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}
                  >
                    <div className="shrink-0 w-8 h-8 bg-white border rounded-full flex items-center justify-center font-medium">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="flex-1">
                      <p className={isHighestScore ? 'font-medium text-green-800' : ''}>{answer.content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        Score: {answer.score}
                      </Badge>
                      {isHighestScore && (
                        <Badge variant="default" className="bg-green-600">
                          Highest Score
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
