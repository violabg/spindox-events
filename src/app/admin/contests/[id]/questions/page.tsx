import { getContestById } from '@/queries/contests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin-layout';
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import QuestionsTable from './questions.table';
import { notFound } from 'next/navigation';
import ContestInformationCard from '@/components/contest-information-card';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuestionsPage({ params }: PageProps) {
  const { id } = await params;

  const contest = await getContestById(id, {
    include: {
      questions: {
        orderBy: { order: 'asc' },
        include: {
          answers: { orderBy: { order: 'asc' } },
        },
      },
    },
  });

  if (!contest) {
    notFound();
  }

  return (
    <AdminLayout title="Questions" subtitle="Manage Contest Questions" backHref="/admin">
      <ContestInformationCard contest={contest} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Questions ({contest.questions.length})</CardTitle>
            </div>
            <Button asChild>
              <Link href={`/admin/contests/${id}/questions/new`}>
                <Plus className="mr-2 h-4 w-4" />
                New Question
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {contest.questions.length === 0 ? (
            <Empty>
              <EmptyContent>
                <EmptyTitle>No questions yet</EmptyTitle>
                <EmptyDescription>Add your first question to get started.</EmptyDescription>
              </EmptyContent>
            </Empty>
          ) : (
            <QuestionsTable contestId={id} questions={contest.questions} />
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
