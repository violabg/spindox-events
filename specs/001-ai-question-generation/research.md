# Research: AI Question Generation

**Feature**: AI Question Generation  
**Date**: 2025-11-04  
**Researcher**: GitHub Copilot

## Research Tasks Completed

### Task 1: Best practices for AI-powered question generation in educational apps

**Decision**: Use structured prompting with clear instructions for question format, answer options, and scoring rules.  
**Rationale**: Structured prompts ensure consistent output format that matches the Prisma schema. Educational apps benefit from varied question types (single/multiple choice) with appropriate difficulty scaling.  
**Alternatives considered**: Free-form generation (rejected due to inconsistent schema compliance), template-based generation (considered but less flexible for diverse prompts).

### Task 2: Integration patterns for @ai-sdk/groq in Next.js

**Decision**: Use server actions for AI calls to keep API keys secure, with Zod validation on the response.  
**Rationale**: Server actions provide secure environment for API keys, while Zod ensures type-safe validation against Prisma schema. Next.js App Router supports async server components.  
**Alternatives considered**: Client-side calls (rejected for security), API routes (considered but server actions are simpler for form submissions).

### Task 3: Zod schema validation for AI responses

**Decision**: Define Zod schema matching Prisma Question/Answer models, with additional validation for scoring logic.  
**Rationale**: Ensures generated content is directly compatible with database schema, validates scoring rules (single vs multiple correct).  
**Alternatives considered**: Manual validation (error-prone), loose typing (risks runtime errors).

### Task 4: UI patterns for AI generation modals with loading states

**Decision**: Use shadcn Dialog with Spinner component, disable form during generation.  
**Rationale**: Provides clear feedback, prevents multiple submissions, aligns with existing UI library.  
**Alternatives considered**: Inline loading (less modal focus), skeleton loaders (overkill for text generation).

### Task 5: Scoring algorithms for multiple correct answers

**Decision**: For multiple correct, distribute max score proportionally based on AI-assigned weights.  
**Rationale**: Allows AI to determine relative importance of correct answers, ensures total score equals max score.  
**Alternatives considered**: Equal distribution (ignores answer quality), fixed weights (less flexible).

## Key Findings

- @ai-sdk/groq provides fast inference suitable for real-time generation
- Structured JSON prompts work best for schema compliance
- Loading states improve UX for AI operations
- Zod + Prisma integration ensures data integrity
- Difficulty levels should map to concrete score ranges for consistency

## Resolved Clarifications

All technical unknowns from initial plan have been researched and decisions documented.
