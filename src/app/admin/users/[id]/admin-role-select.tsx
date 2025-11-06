'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { updateUserRoleAction } from '@/actions/users/update-role.action';

interface AdminRoleSelectProps {
  userId: string;
  isAdmin: boolean;
}

export default function AdminRoleSelect({ userId, isAdmin }: AdminRoleSelectProps) {
  const [isLoading, setIsLoading] = useState(false);
  const currentRole = isAdmin ? 'admin' : 'user';

  const handleRoleChange = async (value: string) => {
    setIsLoading(true);
    try {
      const result = await updateUserRoleAction(userId, value === 'admin' ? 'admin' : 'user');
      if (result.success) {
        toast.success(result.message || 'User role updated');
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
    <Select value={currentRole} onValueChange={handleRoleChange} disabled={isLoading}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user">User</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}
