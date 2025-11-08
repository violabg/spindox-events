'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FieldSelect } from '@/components/admin';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateUserRoleAction } from '@/actions/users/update-role.action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { Prisma } from '@/prisma/client';

const userEditSchema = z.object({
  role: z.enum(['user', 'admin']),
});

type UserEditData = z.infer<typeof userEditSchema>;

type UserFormProps = {
  user: Prisma.UserGetPayload<{
    include: {};
  }>;
};

export default function UserForm({ user }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<UserEditData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      role: user.role === 'admin' ? 'admin' : 'user',
    },
  });

  const onSubmit = async (data: UserEditData) => {
    setIsSubmitting(true);
    try {
      const result = await updateUserRoleAction(user.id, data.role);
      if (result.success) {
        toast.success(result.message || 'User role updated successfully');
        router.push(`/admin/users/${user.id}`);
      } else {
        toast.error(result.error || 'Failed to update user role');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update user role');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <FieldSelect
              name="role"
              control={form.control}
              label="Role"
              description="Select the user role"
              placeholder="Select role"
              options={[
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
