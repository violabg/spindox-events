import { ContestMode, ContestStatus } from '@/prisma/enums';
import { z } from 'zod';

// Base contest schema (without ID) for creation and updates
export const contestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  theme: z.string().max(50, 'Theme must be less than 50 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  status: z.enum(ContestStatus),
  mode: z.enum(ContestMode),
  timeLimit: z.coerce.number().int().min(0, 'Time limit must be 0 or greater'),
});

// Schema for creation (same as base, but can be extended later if needed)
export const createContestSchema = contestSchema;

// Type exports
export type ContestData = z.infer<typeof contestSchema>;
export type CreateContestData = z.infer<typeof createContestSchema>;
