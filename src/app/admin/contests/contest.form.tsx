'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContestStatus } from '@/prisma/enums';
import { ContestModel } from '@/prisma/models/Contest';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldBase, FieldInput, FieldSelect, FieldTextarea } from '@/components/form/form-input';
import Link from 'next/link';
import { createContestAction } from '@/actions/contests/create.action';
import { updateContestAction } from '@/actions/contests/update.action';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { contestSchema, type ContestData } from '@/schemas/contest.schema';

type ContestFormData = ContestData;

interface ContestFormProps {
  contestId?: string;
  initialData?: ContestModel | null;
}

export default function ContestForm({ contestId, initialData }: ContestFormProps) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isEditMode = !!contestId;

  const form = useForm<ContestFormData>({
    resolver: zodResolver(contestSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      theme: initialData?.theme || '',
      description: initialData?.description || '',
      status: initialData?.status || ContestStatus.active,
    },
  });

  // Auto-generate slug from name
  const watchedName = useWatch({ control: form.control, name: 'name' });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Update slug when name changes (only in create mode or if slug field hasn't been manually edited)
  useEffect(() => {
    if (watchedName && !form.formState.dirtyFields.slug && (!isEditMode || !initialData)) {
      form.setValue('slug', generateSlug(watchedName));
    }
  }, [watchedName, form, isEditMode, initialData]);

  async function onSubmit(data: ContestFormData) {
    setError(null);

    try {
      let result;

      if (isEditMode && contestId) {
        // Edit mode - update existing contest
        result = await updateContestAction(contestId, data);
      } else {
        // Create mode - create new contest
        result = await createContestAction(data);
      }

      if (result.success) {
        // Success! Navigate to appropriate page
        if (isEditMode && contestId) {
          router.push(`/admin/contests/${contestId}`);
        } else {
          router.push('/admin');
        }
      } else {
        // Show error from server
        setError(result.error || `Failed to ${isEditMode ? 'update' : 'create'} contest`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} contest`);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FieldInput
          name="name"
          control={form.control}
          label="Name"
          description="The display name for this contest"
          placeholder="Enter contest name..."
          maxLength={100}
        />

        <FieldInput
          name="slug"
          control={form.control}
          label="Slug"
          description="URL-friendly identifier (automatically generated from name, but you can customize it)"
          placeholder="contest-slug"
          maxLength={50}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FieldInput
          name="theme"
          control={form.control}
          label="Theme (Optional)"
          description="Optional theme or category for this contest"
          placeholder="Enter theme..."
          maxLength={50}
        />

        <FieldSelect
          name="status"
          control={form.control}
          label="Status"
          description="Current status of this contest"
          placeholder="Select status"
          options={Object.values(ContestStatus).map(status => ({ value: status, label: status }))}
        />
      </div>

      <FieldTextarea
        name="description"
        control={form.control}
        label="Description (Optional)"
        description="Optional description of this contest"
        placeholder="Enter description..."
        className="min-h-[100px]"
        maxLength={500}
      />

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

      <div className="flex gap-4">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? `${isEditMode ? 'Updating' : 'Creating'}...` : `${isEditMode ? 'Update' : 'Create'} Contest`}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href={isEditMode && contestId ? `/admin/contests/${contestId}` : '/admin'}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
