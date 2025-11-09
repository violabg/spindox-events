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
  language: Language,
  generateCode: boolean = false
): Promise<AIResponse> {
  const languageInstructions = language === 'italian' ? 'Italian' : 'English';

  // Build structured prompt for the LLM
  const systemPrompt = `You are an educational content expert creating high-quality quiz questions in ${languageInstructions}.

QUESTION REQUIREMENTS:
- Generate a ${isMultipleCorrect ? 'multiple choice question with multiple correct answers' : 'multiple choice question with one correct answer'}
- Difficulty level: ${difficulty}
- Generate exactly ${numAnswers} answer options
- ${isMultipleCorrect ? 'Mark 2 or more answers as correct with weight values (0-1) indicating relative importance' : 'Mark exactly 1 answer as correct'}

${
  generateCode
    ? `CODE REQUIREMENTS:
- Include a relevant code snippet in the question content
- Format code blocks with proper markdown: \`\`\`language\\ncode\\n\`\`\`
- If answers contain code, wrap each code snippet with language annotation
- Infer programming language from context if not specified (e.g., React → typescript, Node.js → javascript)
- Always include newline after language annotation in code fences`
    : ''
}

QUALITY STANDARDS:
- Clear, unambiguous question wording
- Plausible but distinct answer options
- No typos or grammatical errors
- Appropriate difficulty for target audience`;

  const userPrompt = `Create a quiz question based on: ${prompt}

Requirements:
- Question should be clear and well-formatted
- All answers should be plausible
- No typos or grammar errors
- Appropriate difficulty level: ${difficulty}
- All generated text MUST be in ${languageInstructions}.${generateCode ? ' Include a code snippet related to the question.' : ''}`;

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
