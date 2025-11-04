import { z } from 'zod';

// Difficulty level enum
export const DifficultyEnum = z.enum(['easy', 'medium', 'difficult', 'hard']);
export type Difficulty = z.infer<typeof DifficultyEnum>;

// Score mapping for difficulty levels
export const DIFFICULTY_SCORES: Record<Difficulty, number> = {
  easy: 100,
  medium: 200,
  difficult: 300,
  hard: 400,
};

// Input schema for question generation
export const GenerateQuestionInputSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(1000, 'Prompt must not exceed 1000 characters'),
  numAnswers: z.number().int().min(2, 'Must have at least 2 answers').max(6, 'Cannot exceed 6 answers'),
  isMultipleCorrect: z.boolean(),
  difficulty: DifficultyEnum,
  contestId: z.string().cuid('Invalid contest ID'),
});

export type GenerateQuestionInput = z.infer<typeof GenerateQuestionInputSchema>;

// AI response schema (raw from LLM)
export const AIAnswerSchema = z.object({
  content: z.string().min(1, 'Answer content required').max(500, 'Answer too long'),
  isCorrect: z.boolean(),
  weight: z.number().min(0).max(1).optional().default(1),
});

export const AIResponseSchema = z.object({
  question: z.object({
    title: z.string().min(5, 'Title too short').max(200, 'Title too long'),
    content: z.string().min(10, 'Content too short').max(2000, 'Content too long'),
  }),
  answers: z.array(AIAnswerSchema).min(2, 'Must have at least 2 answers').max(6, 'Cannot exceed 6 answers'),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

// Generated question/answer data for form population
export const GeneratedQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
  answers: z.array(
    z.object({
      content: z.string(),
      score: z.number().int().min(0),
    })
  ),
});

export type GeneratedQuestion = z.infer<typeof GeneratedQuestionSchema>;

// Server action result
export const GenerateQuestionResultSchema = z.object({
  success: z.boolean(),
  data: GeneratedQuestionSchema.optional(),
  error: z.string().optional(),
});

export type GenerateQuestionResult = z.infer<typeof GenerateQuestionResultSchema>;

/**
 * Calculate scores for answers based on generation mode and difficulty
 */
export function calculateScores(answers: z.infer<typeof AIAnswerSchema>[], maxScore: number, isMultipleCorrect: boolean): number[] {
  const correctAnswers = answers.filter(a => a.isCorrect);

  if (!isMultipleCorrect) {
    // Single correct: all points to one answer
    return answers.map(a => (a.isCorrect ? maxScore : 0));
  }

  // Multiple correct: distribute points based on weights
  if (correctAnswers.length === 0) {
    throw new Error('At least one answer must be correct');
  }

  const totalWeight = correctAnswers.reduce((sum, a) => sum + (a.weight || 1), 0);
  return answers.map(a => {
    if (!a.isCorrect) return 0;
    const proportion = (a.weight || 1) / totalWeight;
    return Math.round(proportion * maxScore);
  });
}
