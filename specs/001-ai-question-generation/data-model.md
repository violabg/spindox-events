# Data Model: AI Question Generation

**Feature**: AI Question Generation  
**Date**: 2025-11-04

## Entities

### Question

- **id**: String (CUID, primary key)
- **title**: String (question title)
- **content**: String (question text)
- **order**: Int (display order, default 0)
- **contestId**: String (foreign key to Contest)
- **answers**: Relation to Answer[]

**Validation Rules**:

- title: required, non-empty
- content: required, non-empty
- contestId: must reference existing Contest

### Answer

- **id**: String (CUID, primary key)
- **content**: String (answer text)
- **score**: Int (points for this answer, default 0)
- **order**: Int (display order, default 0)
- **questionId**: String (foreign key to Question)

**Validation Rules**:

- content: required, non-empty
- score: >= 0
- For single correct: exactly one answer has score = max_score, others = 0
- For multiple correct: correct answers have score > 0 summing to max_score, others = 0

## Relationships

- Question belongs to Contest (many-to-one)
- Answer belongs to Question (many-to-one)
- Question has many Answers (one-to-many)

## State Transitions

- Question: Created → (optional: Edited) → Saved
- Answer: Created as part of Question → (optional: Edited) → Saved

## AI Generation Schema

Generated content must match this structure for validation:

```typescript
{
  question: {
    title: string;
    content: string;
  }
  answers: Array<{
    content: string;
    isCorrect: boolean;
    weight?: number; // for multiple correct, 0-1 scale
  }>;
}
```

Scoring logic applied post-validation based on type and difficulty.
