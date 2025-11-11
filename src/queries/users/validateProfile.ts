'use server';

import type { User } from '@/prisma/client';

/**
 * Validates if a user profile is complete
 * A complete profile requires:
 * - firstName
 * - lastName
 * - ageRange
 * - companyName
 * - jobTitle
 */
export function isUserProfileComplete(user: User): boolean {
  return !!(user.firstName && user.lastName && user.ageRange && user.companyName && user.jobTitle);
}

/**
 * Returns an array of missing fields in a user profile
 */
export function getMissingProfileFields(user: User): string[] {
  const missing: string[] = [];

  if (!user.firstName) missing.push('firstName');
  if (!user.lastName) missing.push('lastName');
  if (!user.ageRange) missing.push('ageRange');
  if (!user.companyName) missing.push('companyName');
  if (!user.jobTitle) missing.push('jobTitle');

  return missing;
}

/**
 * Returns a human-readable message of missing fields
 */
export function getMissingProfileFieldsMessage(user: User): string {
  const missing = getMissingProfileFields(user);

  if (missing.length === 0) {
    return 'Profile is complete';
  }

  const fieldLabels: Record<string, string> = {
    firstName: 'First Name',
    lastName: 'Last Name',
    ageRange: 'Age Range',
    companyName: 'Company Name',
    jobTitle: 'Job Title',
  };

  const labels = missing.map(field => fieldLabels[field]);
  return `Please complete: ${labels.join(', ')}`;
}
