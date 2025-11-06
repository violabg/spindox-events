# Data Model: Contest Questions Page

**Date**: 4 novembre 2025
**Feature**: 001-contest-questions-page

## Overview

The data model supports contest participation with questions, answers, and user submissions. Score is calculated dynamically based on correct answers selected.

## Entities

### Contest

- **slug**: String (unique, URL-safe identifier)
- **title**: String (display name)
- **description**: String (optional contest details)
- **createdAt**: DateTime
- **updatedAt**: DateTime

**Relationships**:

- 1:N with Question (one contest has many questions)

**Validation Rules**:

- slug: required, unique, matches URL pattern
- title: required, max 255 chars
- description: optional, max 1000 chars

### Question

- **id**: String/UUID (primary key)
- **contestId**: Foreign Key to Contest
- **text**: String (question content)
- **type**: Enum (SINGLE_CORRECT, MULTIPLE_CORRECT)
- **createdAt**: DateTime
- **updatedAt**: DateTime

**Relationships**:

- N:1 with Contest
- 1:N with Answer
- 1:N with Submission

**Validation Rules**:

- text: required, max 1000 chars
- type: required, enum values only

### Answer

- **id**: String/UUID (primary key)
- **questionId**: Foreign Key to Question
- **text**: String (answer option)
- **isCorrect**: Boolean (true if this is a correct answer)
- **points**: Integer (points awarded if correct, default based on type)
- **createdAt**: DateTime
- **updatedAt**: DateTime

**Relationships**:

- N:1 with Question
- N:N with User via Submission

**Validation Rules**:

- text: required, max 500 chars
- isCorrect: required
- points: >= 0

### Submission

- **id**: String/UUID (primary key)
- **userId**: Foreign Key to User
- **questionId**: Foreign Key to Question
- **answerId**: Foreign Key to Answer (selected answer)
- **createdAt**: DateTime

**Relationships**:

- N:1 with User
- N:1 with Question
- N:1 with Answer

**Validation Rules**:

- Unique: userId + questionId + answerId (to prevent duplicates)

**Note**: For multiple selections, multiple Submission records per user per question.

## Business Rules

- Single correct questions: Exactly one Answer with isCorrect=true, points=100 (or as per AI generation)
- Multiple correct questions: Multiple Answers with isCorrect=true, points divided among correct ones
- Submission: Once per user per contest, enforced by checking existing Submissions for any question in contest
- Score calculation: Sum of points for correctly selected answers, minus penalties for wrong selections if any

## State Transitions

- Contest: Created → Active (default) → Inactive (if needed)
- Question: Created → Active
- Answer: Created → Active
- Submission: None (immutable after submission)
