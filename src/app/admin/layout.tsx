import LogoutButton from '@/components/logout-button';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <>
      <header>
        <LogoutButton />
      </header>
      <main>{children}</main>
    </>
  );
}
