import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { AIResponseSchema, type AIResponse, type Difficulty, type Language } from './schemas/ai-question.schema';

/**
 * Generate a question and answers using Groq LLM
 * Returns structured data matching the AIResponse schema
 */
export async function generateQuestionWithAI(
  prompt: string,
  numAnswers: number,
  isMultipleCorrect: boolean,
  difficulty: Difficulty,
  language: Language
): Promise<AIResponse> {
  const languageInstructions = language === 'italian' ? 'Italian' : 'English';

  // Build structured prompt for the LLM
  const systemPrompt = `You are an educational content expert creating high-quality quiz questions in ${languageInstructions}.
Generate a ${isMultipleCorrect ? 'multiple choice question with multiple correct answers' : 'multiple choice question with one correct answer'}.
The question should be appropriate for difficulty level: ${difficulty}.
Generate exactly ${numAnswers} answer options.
${isMultipleCorrect ? 'Mark 2 or more answers as correct.' : 'Mark exactly 1 answer as correct.'}
For multiple correct answers, assign weight values (0-1) indicating relative importance of each correct answer.`;

  const userPrompt = `Create a quiz question based on: ${prompt}

Requirements:
- Question should be clear and well-formatted
- All answers should be plausible
- No typos or grammar errors
- Appropriate difficulty level: ${difficulty}
- All generated text MUST be in ${languageInstructions}.`;

  try {
    const result = await generateObject({
      model: groq('openai/gpt-oss-20b'),
      schema: AIResponseSchema,
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
    });

    return result.object;
  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error(`Failed to generate question: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
