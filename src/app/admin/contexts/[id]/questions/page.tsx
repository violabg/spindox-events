import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit } from 'lucide-react';
import { getContextWithQuestions } from '@/actions/contexts/get.action';
import QuestionsTable from './questions.table';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuestionsPage({ params }: PageProps) {
  const { id } = await params;

  const contextResult = await getContextWithQuestions(id);

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
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{context.name}</h1>
            <p className="text-muted-foreground">Context Management</p>
          </div>
        </div>

        {/* Context Information Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle>Context Information</CardTitle>
                <Badge variant={context.status === 'active' ? 'default' : 'secondary'}>{context.status === 'active' ? 'Active' : 'Inactive'}</Badge>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/contexts/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Context
                </Link>
              </Button>
            </div>
            {context.theme && <CardDescription>Theme: {context.theme}</CardDescription>}
          </CardHeader>
          {context.description && (
            <CardContent>
              <p className="text-sm text-muted-foreground">{context.description}</p>
            </CardContent>
          )}
        </Card>

        {/* Questions Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Questions ({context.questions.length})</h2>
            <p className="text-muted-foreground">Manage questions for this context</p>
          </div>
          <Button asChild>
            <Link href={`/admin/contexts/${id}/questions/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <QuestionsTable contextId={id} questions={context.questions} />
        </CardContent>
      </Card>
    </div>
  );
}
