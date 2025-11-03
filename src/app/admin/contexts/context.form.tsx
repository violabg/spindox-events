'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ContextStatus } from '@/prisma/enums';
import { ContextModel } from '@/prisma/models/Context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormInput } from '@/components/form/form-input';
import Link from 'next/link';
import { createContextAction } from '@/actions/contexts/create.action';
import { updateContextAction } from '@/actions/contexts/update.action';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const contextSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  theme: z.string().max(50, 'Theme must be less than 50 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  status: z.enum(ContextStatus),
});

type ContextFormData = z.infer<typeof contextSchema>;

interface ContextFormProps {
  contextId?: string;
  initialData?: ContextModel | null;
}

export default function ContextForm({ contextId, initialData }: ContextFormProps) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isEditMode = !!contextId;

  const form = useForm<ContextFormData>({
    resolver: zodResolver(contextSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      theme: initialData?.theme || '',
      description: initialData?.description || '',
      status: initialData?.status || ContextStatus.active,
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

  async function onSubmit(data: ContextFormData) {
    setError(null);

    try {
      let result;

      if (isEditMode && contextId) {
        // Edit mode - update existing context
        result = await updateContextAction({
          id: contextId,
          ...data,
        });
      } else {
        // Create mode - create new context
        result = await createContextAction(data);
      }

      if (result.success) {
        // Success! Navigate to appropriate page
        if (isEditMode && contextId) {
          router.push(`/admin/contexts/${contextId}`);
        } else {
          router.push('/admin');
        }
      } else {
        // Show error from server
        setError(result.error || `Failed to ${isEditMode ? 'update' : 'create'} context`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} context`);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormInput name="name" control={form.control} label="Name" description="The display name for this context" maxLength={100}>
        {({ field }) => <Input id="name" placeholder="Enter context name..." {...field} />}
      </FormInput>

      <FormInput
        name="slug"
        control={form.control}
        label="Slug"
        description="URL-friendly identifier (automatically generated from name, but you can customize it)"
        maxLength={50}
      >
        {({ field }) => <Input id={field.name} placeholder="context-slug" {...field} />}
      </FormInput>

      <FormInput
        name="theme"
        control={form.control}
        label="Theme (Optional)"
        description="Optional theme or category for this context"
        maxLength={50}
      >
        {({ field }) => <Input id={field.name} placeholder="Enter theme..." {...field} />}
      </FormInput>

      <FormInput
        name="description"
        control={form.control}
        label="Description (Optional)"
        description="Optional description of this context"
        maxLength={500}
      >
        {({ field }) => <Textarea id={field.name} placeholder="Enter description..." className="min-h-[100px]" {...field} />}
      </FormInput>

      <FormInput name="status" control={form.control} label="Status" description="Current status of this context">
        {({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ContextStatus).map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </FormInput>

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

      <div className="flex gap-4">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? `${isEditMode ? 'Updating' : 'Creating'}...` : `${isEditMode ? 'Update' : 'Create'} Context`}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href={isEditMode && contextId ? `/admin/contexts/${contextId}` : '/admin'}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
