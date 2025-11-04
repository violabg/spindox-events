# Contract: AI Question Generation

**Feature**: AI Question Generation  
**Date**: 2025-11-04

## Server Action Contract

### Function: generateQuestion

**Purpose**: Generate a question and answers using AI based on provided parameters.

**Input**:

```typescript
{
  prompt: string; // Description of the question topic
  numAnswers: number; // 2-6
  isMultipleCorrect: boolean; // true for multiple, false for single
  difficulty: 'easy' | 'medium' | 'difficult' | 'hard';
  contestId: string; // For context
}
```

**Output**:

```typescript
{
  success: boolean;
  data?: {
    question: {
      title: string;
      content: string;
    };
    answers: Array<{
      content: string;
      score: number;
    }>;
  };
  error?: string;
}
```

**Preconditions**:

- User must be authenticated as admin
- contestId must reference existing contest
- numAnswers between 2-6

**Postconditions**:

- If success, data contains valid question and answers matching Prisma schema
- Scores follow rules: single correct = all points to one, multiple = distributed
- No database changes (only returns data for form population)

**Error Cases**:

- Invalid input: "Invalid parameters"
- AI failure: "Generation failed"
- Schema validation error: "Generated content invalid"
