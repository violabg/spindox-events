import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/components/admin-layout';
import EmptyTable from '@/components/empty-table';
import ContestsTable from './contests.table';
import { getContests } from '@/queries/contests';

export default async function AdminPage() {
  // Get contests with user answer counts and questions in a single optimized query
  const contests = await getContests({ include: { userAnswers: true, questions: true }, orderBy: { createdAt: 'desc' } });

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Manage your contests and events">
      <Card>
        <CardContent className="p-4 sm:p-6">
          {contests.length === 0 ? (
            <EmptyTable title="No contests yet" description="Create your first contest to get started." />
          ) : (
            <ContestsTable contests={contests} />
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
