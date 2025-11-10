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
  active: z.boolean().default(true),
  allowMultipleAttempts: z.boolean().default(true),
  timeLimit: z.coerce.number().int().min(0, 'Time limit must be 0 or greater'),
  requireCompletedProfile: z.boolean().default(false),
  showFinalResults: z.boolean().default(false),
  showLeaderboard: z.boolean().default(true),
});

// Schema for creation (same as base, but can be extended later if needed)
export const createContestSchema = contestSchema;

// Type exports
export type ContestData = z.infer<typeof contestSchema>;
export type CreateContestData = z.infer<typeof createContestSchema>;
