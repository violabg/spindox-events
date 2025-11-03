import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getContextAction } from '@/actions/contexts/get.action';
import QuestionForm from '../../question.form';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewQuestionPage({ params }: PageProps) {
  const { id } = await params;

  const contextResult = await getContextAction(id);

  if (!contextResult.success || !contextResult.data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-destructive">Context Not Found</h1>
          <p className="text-muted-foreground mt-2">The requested context could not be found.</p>
          <Button asChild className="mt-4">
            <Link href="/admin">Back to Admin</Link>
          </Button>
        </div>
      </div>
    );
  }

  const context = contextResult.data;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/contexts/${id}/questions`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Question</h1>
          <p className="text-muted-foreground">Add a new question to &quot;{context.name}&quot;</p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
          <CardDescription>Fill in the question information and provide 4 answer options. Mark exactly one answer as correct.</CardDescription>
        </CardHeader>
        <CardContent>
          <QuestionForm contextId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
