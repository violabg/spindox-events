'use client';

import { createContestAction } from '@/actions/contests/create.action';
import { updateContestAction } from '@/actions/contests/update.action';
import { FieldInput, FieldTextarea, FieldCheckbox } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { ContestModel } from '@/prisma/models/Contest';
import { contestSchema, type ContestData } from '@/schemas/contest.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Resolver } from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';

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
    resolver: zodResolver(contestSchema) as Resolver<ContestFormData>,
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      theme: initialData?.theme || '',
      description: initialData?.description || '',
      active: initialData?.active ?? true,
      allowMultipleAttempts: initialData?.allowMultipleAttempts ?? false,
      timeLimit: initialData?.timeLimit || 0,
      requireCompletedProfile: initialData?.requireCompletedProfile || false,
      showFinalResults: initialData?.showFinalResults || false,
      showLeaderboard: initialData?.showLeaderboard ?? true,
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
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2">
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
          disabled={isEditMode}
        />
      </div>

      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2">
        <FieldInput
          name="theme"
          control={form.control}
          label="Theme (Optional)"
          description="Optional theme or category for this contest"
          placeholder="Enter theme..."
          maxLength={50}
        />

        <FieldInput
          name="timeLimit"
          control={form.control}
          label="Time Limit (minutes)"
          description="Time limit for the contest in minutes. 0 means no time limit"
          placeholder="0"
          type="number"
          min={0}
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

      <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
        <h3 className="font-semibold text-sm">Contest Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FieldCheckbox control={form.control} name="active" label="Active" />
          <FieldCheckbox control={form.control} name="allowMultipleAttempts" label="Allow Multiple Attempts" />
          <FieldCheckbox control={form.control} name="requireCompletedProfile" label="Require Completed Profile" />
          <FieldCheckbox control={form.control} name="showFinalResults" label="Show Final Results" />
          <FieldCheckbox control={form.control} name="showLeaderboard" label="Show Leaderboard" />
        </div>
      </div>

      {error && <div className="bg-destructive/10 p-3 rounded-md text-destructive text-sm">{error}</div>}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link href={isEditMode && contestId ? `/admin/contests/${contestId}` : '/admin'}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? `${isEditMode ? 'Updating' : 'Creating'}...` : `${isEditMode ? 'Update' : 'Create'} Contest`}
        </Button>
      </div>
    </form>
  );
}
