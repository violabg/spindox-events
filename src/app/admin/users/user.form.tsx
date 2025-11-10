'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FieldSelect, FieldInput } from '@/components/admin';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateUserProfileAction } from '@/actions/users/update.action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { Prisma } from '@/prisma/client';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const userEditSchema = z.object({
  isAdmin: z.boolean(),
  ageRange: z.enum(['UNDER_18', 'BETWEEN_18_30', 'BETWEEN_31_50', 'OVER_50']).optional().nullable(),
  companyName: z.string().optional().nullable(),
  jobTitle: z.enum(['Developer', 'Designer', 'Tester', 'Manager', 'Director', 'Analyst', 'ProductManager', 'Other']).optional().nullable(),
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
      isAdmin: user.role === 'admin',
      ageRange: user.ageRange || undefined,
      companyName: user.companyName || undefined,
      jobTitle: user.jobTitle || undefined,
    },
  });

  const onSubmit = async (data: UserEditData) => {
    setIsSubmitting(true);
    try {
      const result = await updateUserProfileAction(user.id, {
        role: data.isAdmin ? 'admin' : 'user',
        ageRange: data.ageRange,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
      });
      if (result.success) {
        toast.success(result.message || 'User profile updated successfully');
        router.push(`/admin/users/${user.id}`);
      } else {
        toast.error(result.error || 'Failed to update user profile');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update user profile');
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div className="flex items-end pb-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="admin-checkbox"
                  checked={form.watch('isAdmin')}
                  onCheckedChange={checked => {
                    form.setValue('isAdmin', Boolean(checked));
                  }}
                />
                <Label htmlFor="admin-checkbox" className="cursor-pointer text-sm font-medium">
                  Admin
                </Label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FieldInput
              name="companyName"
              control={form.control}
              label="Company Name"
              description="User's company or organization"
              placeholder="Enter company name"
            />
            <FieldSelect
              name="ageRange"
              control={form.control}
              label="Age Range"
              description="Select user's age range"
              placeholder="Select age range"
              options={[
                { value: 'UNDER_18', label: 'Under 18' },
                { value: 'BETWEEN_18_30', label: '18 - 30' },
                { value: 'BETWEEN_31_50', label: '31 - 50' },
                { value: 'OVER_50', label: 'Over 50' },
              ]}
            />
            <FieldSelect
              name="jobTitle"
              control={form.control}
              label="Job Title"
              description="User's job title"
              placeholder="Select job title"
              options={[
                { value: 'Developer', label: 'Developer' },
                { value: 'Designer', label: 'Designer' },
                { value: 'Tester', label: 'Tester' },
                { value: 'Manager', label: 'Manager' },
                { value: 'Director', label: 'Director' },
                { value: 'Analyst', label: 'Analyst' },
                { value: 'ProductManager', label: 'Product Manager' },
                { value: 'Other', label: 'Other' },
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
