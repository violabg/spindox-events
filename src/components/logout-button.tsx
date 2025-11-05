import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const logout = async () => {
  'use server';
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect('/');
};

export default async function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" className="w-full">
        Sign Out
      </Button>
    </form>
  );
}
