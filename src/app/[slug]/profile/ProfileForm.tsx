'use client';

import { FieldInput, FieldSelect } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  ageRange: z.enum(['UNDER_18', 'BETWEEN_18_30', 'BETWEEN_31_50', 'OVER_50'], 'Age range is required'),
  companyName: z.string().min(1, 'Company is required'),
  jobTitle: z.enum(['Developer', 'Designer', 'Tester', 'Manager', 'Director', 'Analyst', 'ProductManager', 'Other'], 'Job title is required'),
});

type ProfileData = z.infer<typeof profileSchema>;

type Props = {
  name?: string;
  firstName?: string | null;
  lastName?: string | null;
  ageRange?: ProfileData['ageRange'];
  companyName?: string | null;
  jobTitle?: ProfileData['jobTitle'];
  redirectUrl?: string | null;
  missingProfile?: boolean;
};

export default function ProfileForm({ name, firstName, lastName, ageRange, companyName, jobTitle, redirectUrl, missingProfile }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: name ?? '',
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      ageRange: ageRange ?? undefined,
      companyName: companyName ?? '',
      jobTitle: jobTitle ?? undefined,
    },
  });

  const onSubmit = async (data: ProfileData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          firstName: data.firstName ?? null,
          lastName: data.lastName ?? null,
          ageRange: data.ageRange ?? null,
          companyName: data.companyName ?? null,
          jobTitle: data.jobTitle ?? null,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success('Profile updated');
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.refresh();
        }
      } else {
        toast.error(json?.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {missingProfile || isEditing ? (
        <div>
          <p className="mb-4 text-muted-foreground text-sm">Please complete the missing fields below to continue.</p>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Profile details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">Fields marked with * are required</p>
                <div className="gap-4 grid grid-cols-3">
                  <FieldInput name="name" control={form.control} label="Username *" placeholder="Username" />
                  <FieldInput name="firstName" control={form.control} label="First name *" placeholder="First name" />

                  <FieldInput name="lastName" control={form.control} label="Last name *" placeholder="Last name" />

                  <FieldSelect
                    name="ageRange"
                    control={form.control}
                    label="Age Range *"
                    placeholder="Select age range"
                    options={[
                      { value: 'UNDER_18', label: 'Under 18' },
                      { value: 'BETWEEN_18_30', label: '18 - 30' },
                      { value: 'BETWEEN_31_50', label: '31 - 50' },
                      { value: 'OVER_50', label: 'Over 50' },
                    ]}
                  />

                  <FieldInput name="companyName" control={form.control} label="Company *" placeholder="Company name" />

                  <FieldSelect
                    name="jobTitle"
                    control={form.control}
                    label="Job Title *"
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

            <div className="flex justify-between items-center">
              {!missingProfile && (
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="gap-4 grid grid-cols-3">
            <div>
              <p className="text-muted-foreground text-sm">First Name</p>
              <p className="font-medium">{firstName}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Last Name</p>
              <p className="font-medium">{lastName}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Age Range</p>
              <p className="font-medium">{ageRange}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Company</p>
              <p className="font-medium">{companyName}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Job Title</p>
              <p className="font-medium">{jobTitle}</p>
            </div>
          </div>
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        </>
      )}
    </>
  );
}
