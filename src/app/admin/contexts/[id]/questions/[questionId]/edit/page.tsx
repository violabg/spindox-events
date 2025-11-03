import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import EditQuestionForm from './edit-question.form';

type EditQuestionPageProps = {
  params: Promise<{ id: string; questionId: string }>;
};

export default async function EditQuestionPage({ params }: EditQuestionPageProps) {
  const { id, questionId } = await params;

  const [context, question] = await Promise.all([
    prisma.context.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    }),
    prisma.question.findFirst({
      where: {
        id: questionId,
        contextId: id,
      },
      include: {
        answers: {
          orderBy: { order: 'asc' },
        },
      },
    }),
  ]);

  if (!context || !question) {
    return notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/contexts/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Context
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold">Edit Question</h1>
        <p className="text-muted-foreground">Edit question in &quot;{context.name}&quot;</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditQuestionForm contextId={id} question={question} />
        </CardContent>
      </Card>
    </div>
  );
}
