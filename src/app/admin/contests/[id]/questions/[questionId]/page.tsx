import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { AdminLayout, EmptyTable } from '@/components/admin';
import { Edit } from 'lucide-react';
import { getQuestionWithAnswersAction } from '@/actions/questions/get.action';
import { getContestById } from '@/queries/contests';
import { getQuestionWithAnalytics } from '@/queries/questionWithAnalytics';
import AnswerAnalyticsTable from './answer-analytics.table';

type PageProps = {
  params: Promise<{ id: string; questionId: string }>;
};

export default async function QuestionDetailPage({ params }: PageProps) {
  const { id, questionId } = await params;

  const questionResult = await getQuestionWithAnswersAction(questionId);
  const [contest, analyticsData] = await Promise.all([getContestById(id), getQuestionWithAnalytics(questionId)]);

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
  const analytics = analyticsData?.analytics;

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
    >
      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Question Content</CardTitle>
            </div>
            <Button asChild size="sm">
              <Link href={`/admin/contests/${id}/questions/${questionId}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{question.content}</p>
          </CardContent>
        </Card>

        {/* Analytics Summary */}
        {analytics && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{analytics.totalSubmissions}</p>
                <p className="text-xs text-muted-foreground">{analytics.uniqueUsers} unique users</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{analytics.averageScore}</p>
                <p className="text-xs text-muted-foreground">out of {analytics.maxScore}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Correct Answers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{analytics.correctAnswers}</p>
                <p className="text-xs text-muted-foreground">{analytics.correctPercentage}% accuracy</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Min - Max Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {analytics.minScore} - {analytics.maxScore}
                </p>
                <p className="text-xs text-muted-foreground">score range</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Answer Options</CardTitle>
            <CardDescription>All answer options for this question with their scores.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {question.answers.map(answer => {
                const maxScore = Math.max(...question.answers.map(a => a.score));
                const isHighestScore = answer.score === maxScore && maxScore > 0;
                const distribution = analytics?.answerDistribution.get(answer.id);

                return (
                  <div key={answer.id} className="space-y-2">
                    <div className={`flex items-center gap-3 p-3 rounded-lg border`}>
                      <div className="flex-1">
                        <p>{answer.content}</p>
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
                    {distribution && (
                      <div className="flex items-center gap-2 px-3">
                        <span className="text-xs text-muted-foreground">{distribution.count} answers</span>
                        <Progress value={distribution.percentage} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground font-medium">{distribution.percentage}%</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* User Responses Table */}
        {analyticsData && (
          <Card>
            <CardHeader>
              <CardTitle>User Responses</CardTitle>
              <CardDescription>All users who answered this question</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.question.userAnswers.length === 0 ? (
                <EmptyTable title="No responses" description="No users have answered this question yet." />
              ) : (
                <AnswerAnalyticsTable userAnswers={analyticsData.question.userAnswers} />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
