import { AdminLayout, EmptyTable } from '@/components/admin';
import { Card, CardContent } from '@/components/ui/card';
import { getUsers } from '@/queries/users';

import UsersTable from './users.table';

export default async function UsersPage() {
  const users = await getUsers({
    include: { attempts: true, sessions: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AdminLayout title="Users" subtitle="Manage users and participants" breadcrumbs={[{ label: 'Users' }]}>
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
