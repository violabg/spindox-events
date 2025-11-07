import { AdminLayout, EmptyTable } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getContests } from '@/queries/contests';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import ContestsTable from './contests.table';

export default async function ContestsPage() {
  // Get contests with user answer counts and questions in a single optimized query
  const contests = await getContests({ include: { submissions: true, questions: true }, orderBy: { createdAt: 'desc' } });

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Manage your contests and events" breadcrumbs={[{ label: 'Contests' }]}>
      <Card className="gap-0">
        <CardHeader>
          <Button className="ml-auto" asChild>
            <Link href="/admin/contests/new">
              <Plus className="mr-2 w-4 h-4" />
              Create New Contest
            </Link>
          </Button>
        </CardHeader>
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
