'use server';

import { generateQuestionWithAI } from '@/lib/ai';
import {
  DIFFICULTY_SCORES,
  GenerateQuestionInputSchema,
  GenerateQuestionResultSchema,
  calculateScores,
  type GenerateQuestionResult,
} from '@/lib/schemas/ai-question.schema';

/**
 * Server action to generate a question using AI
 * Validates input, calls AI, calculates scores, and returns form data
 */
export async function generateQuestion(input: unknown): Promise<GenerateQuestionResult> {
  try {
    // Validate input
    const validated = GenerateQuestionInputSchema.parse(input);

    // Call AI to generate content
    const aiResponse = await generateQuestionWithAI(validated.prompt, validated.numAnswers, validated.isMultipleCorrect, validated.difficulty);

    // Calculate scores based on type and difficulty
    const maxScore = DIFFICULTY_SCORES[validated.difficulty];
    const scores = calculateScores(aiResponse.answers, maxScore, validated.isMultipleCorrect);

    // Format response for form population
    const result: GenerateQuestionResult = {
      success: true,
      data: {
        title: aiResponse.question.title,
        content: aiResponse.question.content,
        answers: aiResponse.answers.map((answer, index) => ({
          content: answer.content,
          score: scores[index],
        })),
      },
    };

    // Validate the final result
    return GenerateQuestionResultSchema.parse(result);
  } catch (error) {
    console.error('Question generation error:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred during question generation',
    };
  }
}
