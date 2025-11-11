import { notFound } from 'next/navigation';

import { AdminLayout } from '@/components/admin';
import { getUserById } from '@/queries/users';

import UserForm from '../../user.form';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserEditPage({ params }: PageProps) {
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
