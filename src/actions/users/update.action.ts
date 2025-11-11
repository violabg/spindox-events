'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { AgeRange, JobTitle } from '@/prisma/enums';

type UpdateProfileData = {
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  ageRange?: AgeRange | null;
  companyName?: string | null;
  jobTitle?: JobTitle | null;
};

export async function updateUserProfileAction(userId: string, data: UpdateProfileData) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        role: data.role,
        ageRange: data.ageRange || null,
        companyName: data.companyName || null,
        jobTitle: data.jobTitle || null,
      },
    });

    revalidatePath(`/admin/users/${userId}`);
    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User profile updated successfully',
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: 'Failed to update user profile' };
  }
}
