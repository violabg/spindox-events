import { z } from 'zod';

export const submitAnswersSchema = z.object({
  answers: z.record(
    z.string(),
    z.object({
      answerIds: z.array(z.string()).min(1, 'At least one answer must be selected'),
    })
  ),
});

export type SubmitAnswersRequest = z.infer<typeof submitAnswersSchema>;

export const contestResponseSchema = z.object({
  contest: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    description: z.string().optional(),
  }),
  questions: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      type: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICES']),
      answers: z.array(
        z.object({
          id: z.string(),
          content: z.string(),
        })
      ),
    })
  ),
  hasSubmitted: z.boolean(),
});

export type ContestResponse = z.infer<typeof contestResponseSchema>;

export const submitResultSchema = z.object({
  score: z.number().int().min(0),
  totalQuestions: z.number().int().min(0),
  correctCount: z.number().int().min(0),
  results: z.array(
    z.object({
      questionId: z.string(),
      questionContent: z.string(),
      submissionIds: z.array(z.string()),
      correctAnswerIds: z.array(z.string()),
      isCorrect: z.boolean(),
    })
  ),
});

export type SubmitResult = z.infer<typeof submitResultSchema>;
