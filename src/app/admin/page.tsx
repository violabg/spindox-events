import { Card, CardContent } from '@/components/ui/card';
import { AdminLayout, EmptyTable } from '@/components/admin';
import ContestsTable from './contests.table';
import { getContests } from '@/queries/contests';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users } from 'lucide-react';

export default async function AdminPage() {
  // Get contests with user answer counts and questions in a single optimized query
  const contests = await getContests({ include: { userAnswers: true, questions: true }, orderBy: { createdAt: 'desc' } });

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Manage your contests and events">
      <div className="mb-6 flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/admin/users">
            <Users className="h-4 w-4 mr-2" />
            View Users
          </Link>
        </Button>
      </div>

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
