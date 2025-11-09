import { z } from 'zod';

// Answer schema for nested use in questions
export const answerSchema = z.object({
  id: z.cuid().optional(),
  content: z.string().min(1, 'Answer content is required').max(300, 'Answer must be less than 300 characters'),
  score: z.number().int().min(0, 'Score must be 0 or greater'),
});

// Question type enum
export const questionTypeSchema = z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICES']);

// Base question schema (without ID) for creation and updates
export const questionSchema = z.object({
  contestId: z.cuid(),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required').max(1000, 'Content must be less than 1000 characters'),
  type: questionTypeSchema,
  answers: z.array(answerSchema).min(1, 'At least 1 answer is required'),
});

// Schema for creation
export const createQuestionSchema = questionSchema;

// Schema for updates (without contestId since question already belongs to a contest)
export const updateQuestionSchema = questionSchema.omit({ contestId: true });

// Type exports
export type QuestionData = z.infer<typeof questionSchema>;
export type CreateQuestionData = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionData = z.infer<typeof updateQuestionSchema>;
