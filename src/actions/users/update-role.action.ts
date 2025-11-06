'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function updateUserRoleAction(userId: string, role: string | null) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.user.update({ where: { id: userId }, data: { role } });

    revalidatePath(`/admin/users/${userId}`);
    revalidatePath('/admin/users');

    return {
      success: true,
      message: role === 'admin' ? 'User promoted to admin' : 'Admin role removed',
    };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: 'Failed to update user role' };
  }
}
