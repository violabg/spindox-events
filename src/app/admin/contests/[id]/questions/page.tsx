import { getContestById } from '@/queries/contests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout, EmptyTable } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import QuestionsTable from './questions.table';
import { notFound } from 'next/navigation';

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
    <AdminLayout
      title="Questions"
      subtitle="Manage Contest Questions"
      backHref="/admin"
      breadcrumbs={[{ label: 'Contests', href: '/admin/contests' }, { label: contest.name, href: `/admin/contests/${id}` }, { label: 'Questions' }]}
    >
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
            <EmptyTable title="No questions yet" description="Add your first question to get started." />
          ) : (
            <QuestionsTable contestId={id} questions={contest.questions} />
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
