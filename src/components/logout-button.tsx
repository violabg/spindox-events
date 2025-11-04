'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export default function LogoutButton() {
  const handleLogout = async () => {
    await authClient.signOut();
    window.location.replace('/');
  };

  return (
    <Button onClick={handleLogout} className="w-full">
      Sign Out
    </Button>
  );
}
