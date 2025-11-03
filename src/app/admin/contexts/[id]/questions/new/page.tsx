import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CreateQuestionForm from './create-question.form';

type NewQuestionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewQuestionPage({ params }: NewQuestionPageProps) {
  const { id } = await params;

  const context = await prisma.context.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
    },
  });

  if (!context) {
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
        <h1 className="text-3xl font-bold">Add Question</h1>
        <p className="text-muted-foreground">Add a new question to &quot;{context.name}&quot;</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateQuestionForm contextId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
