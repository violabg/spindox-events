import { notFound } from 'next/navigation';

import { AdminLayout } from '@/components/admin';
import { getUserById } from '@/queries/users';
import { PageWithParams } from '@/types/pageWithParams';

import UserForm from '../../user.form';

export default async function UserEditPage({ params }: PageWithParams<{ id: string }>) {
  const { id: userId } = await params;

  const user = await getUserById(userId);

  if (!user) {
    notFound();
  }

  return (
    <AdminLayout
      title="Edit User"
      subtitle={user.name}
      backHref={`/admin/users/${userId}`}
      breadcrumbs={[{ label: 'Users', href: '/admin/users' }, { label: user.name, href: `/admin/users/${userId}` }, { label: 'Edit' }]}
    >
      <UserForm user={user} />
    </AdminLayout>
  );
}
