'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut, Plus } from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
}

export default function AdminHeader({ title, subtitle, backHref }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
  };

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {backHref && (
            <Button variant="outline" size="icon" asChild>
              <Link href={backHref}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">{title}</h1>
            {subtitle && <p className="text-muted-foreground text-sm sm:text-base truncate">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/admin/contests/new">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">New Contest</span>
            </Link>
          </Button>
          <Button type="button" variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
