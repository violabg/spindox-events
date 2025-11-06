'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteAccountAction(accountId: string) {
  try {
    // Delete the account
    await prisma.account.delete({
      where: { id: accountId },
    });

    // Revalidate the user detail page
    revalidatePath('/admin/users/[userId]');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to delete account:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete account',
    };
  }
}
