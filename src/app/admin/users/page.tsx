import { Card, CardContent } from '@/components/ui/card';
import { AdminLayout, EmptyTable } from '@/components/admin';
import UsersTable from '../users.table';
import { getUsers } from '@/queries/users';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';

export default async function UsersPage() {
  const users = await getUsers({
    include: { userAnswers: true, sessions: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AdminLayout title="Users" subtitle="Manage users and participants" backHref="/admin">
      <div className="mb-6 flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/admin">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          {users.length === 0 ? (
            <EmptyTable title="No users yet" description="Users will appear here when they register and participate in contests." />
          ) : (
            <UsersTable users={users} />
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
