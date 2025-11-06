import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from '@/components/ui/empty';
import AdminLayout from '@/components/admin-layout';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import ContestsTable from './contests.table';
import { getContests } from '@/queries/contests';

export default async function AdminPage() {
  // Get contests with user answer counts and questions in a single optimized query
  const contests = await getContests({ include: { userAnswers: true, questions: true }, orderBy: { createdAt: 'desc' } });

  const actions = (
    <Button asChild>
      <Link href="/admin/contests/new">
        <Plus className="mr-2 h-4 w-4" />
        New
      </Link>
    </Button>
  );

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Manage your contests and events" actions={actions}>
      <Card>
        <CardContent className="p-4 sm:p-6">
          {contests.length === 0 ? (
            <Empty>
              <EmptyContent>
                <EmptyTitle>No contests yet</EmptyTitle>
                <EmptyDescription>Create your first contest to get started.</EmptyDescription>
              </EmptyContent>
            </Empty>
          ) : (
            <ContestsTable contests={contests} />
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
