'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updateUserRoleAction } from '@/actions/users/update-role.action';

interface ToggleAdminButtonProps {
  userId: string;
  isAdmin: boolean;
}

export default function ToggleAdminButton({ userId, isAdmin }: ToggleAdminButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleRole = async () => {
    setIsLoading(true);
    try {
      const result = await updateUserRoleAction(userId, isAdmin ? 'user' : 'admin');
      if (result.success) {
        toast.success(result.message || `User role updated`);
      } else {
        toast.error(result.error || 'Failed to update user role');
      }
    } catch {
      toast.error('Failed to update user role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant={isAdmin ? 'destructive' : 'default'} onClick={handleToggleRole} disabled={isLoading}>
      {isLoading ? 'Updating...' : isAdmin ? 'Remove Admin Role' : 'Make Admin'}
    </Button>
  );
}
