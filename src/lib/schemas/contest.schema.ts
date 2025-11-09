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

// Client-side schema used by the form. It includes a `hasTimeExpired` flag and
// conditionally requires at least one answer per question only when
// `hasTimeExpired` is false. This prevents client-side validation blocking
// submission when the timer expires and the user wants to submit partial answers.
export const submitAnswersClientSchema = z
  .object({
    answers: z.record(
      z.string(),
      z.object({
        answerIds: z.array(z.string()),
      })
    ),
    hasTimeExpired: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.hasTimeExpired) {
      // ensure every question has at least one answer selected
      for (const [questionId, { answerIds }] of Object.entries(data.answers || {})) {
        if (!Array.isArray(answerIds) || answerIds.length === 0) {
          ctx.addIssue({
            path: ['answers', questionId, 'answerIds'],
            code: 'custom',
            message: 'At least one answer must be selected',
          });
        }
      }
    }
  });

export type SubmitAnswersClient = z.infer<typeof submitAnswersClientSchema>;

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
      selectedAnswers: z.array(z.string()),
      correctAnswers: z.array(z.string()),
      isCorrect: z.boolean(),
    })
  ),
});

export type SubmitResult = z.infer<typeof submitResultSchema>;
