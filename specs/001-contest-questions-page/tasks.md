# Implementation Tasks: Contest Questions Page

**Feature**: 001-contest-questions-page  
**Branch**: `001-contest-questions-page`  
**Date**: 4 novembre 2025  
**Execution Model**: Phase-based with sequential dependencies

## Task Summary

Total Tasks: 18 | Phases: 5 (Setup, Tests, Core, Integration, Polish)

## Phase 1: Setup & Project Structure

### Task 001: Verify Database Schema [SETUP]

- **Description**: Ensure Prisma schema includes Contest, Question, Answer, UserAnswer, User models with proper relationships and RLS policies
- **Acceptance**:
  - [x] Contest model exists with slug, title, description fields
  - [x] Question model linked to Contest with text, type enum
  - [x] Answer model linked to Question with score field for correctness
  - [x] UserAnswer model with userId, questionId, answerId, unique constraint
  - [x] RLS policies applied to all tables
- **Files**: `prisma/schema.prisma`
- **Dependencies**: None
- **Status**: [x]

### Task 002: Create API Route Directory Structure [SETUP]

- **Description**: Create directory structure for API routes and client components
- **Acceptance**:
  - [x] Directory `src/app/[slug]/` created
  - [x] Directory `src/app/api/contests/[slug]/` created
  - [x] Directory `src/app/api/contests/[slug]/submit/` created
  - [x] Directory structure verified
- **Files**: Multiple directories
- **Dependencies**: None
- **Status**: [x]

### Task 003: Create Zod Validation Schemas [SETUP]

- **Description**: Define Zod schemas for form validation and API request/response validation
- **Acceptance**:
  - [x] Schema for answer submission (answers array with questionId, answerIds)
  - [x] Schema for contest data retrieval
  - [x] Schema for result response
- **Files**: `src/lib/schemas/contest.schema.ts`
- **Dependencies**: Task 001
- **Status**: [x]

## Phase 2: Tests & Contracts

### Task 004: Write Unit Tests - Contest API GET [TEST] [P]

- **Description**: Test contest retrieval endpoint GET /api/contests/[slug]
- **Acceptance**:
  - [ ] Test authenticated user retrieves contest successfully
  - [ ] Test 404 when contest not found
  - [ ] Test 403 when user not authenticated
  - [ ] Test response includes all questions with correct structure
  - [ ] Test hasSubmitted flag is correct
- **Files**: `src/app/api/contests/[slug]/__tests__/route.test.ts`
- **Dependencies**: Task 003
- **Status**: [ ]

### Task 005: Write Unit Tests - Submit Answers API POST [TEST] [P]

- **Description**: Test answer submission endpoint POST /api/contests/[slug]/submit
- **Acceptance**:
  - [ ] Test successful submission stores UserAnswers
  - [ ] Test score calculation is correct
  - [ ] Test correct answers returned in response
  - [ ] Test 409 error on duplicate submission
  - [ ] Test 400 error on validation failure
  - [ ] Test prevents unauthenticated access
- **Files**: `src/app/api/contests/[slug]/submit/__tests__/route.test.ts`
- **Dependencies**: Task 003
- **Status**: [ ]

### Task 006: Write Component Tests - Question Rendering [TEST] [P]

- **Description**: Test that questions render with correct input types (radio/checkbox)
- **Acceptance**:
  - [ ] Test single-correct questions render with radio buttons
  - [ ] Test multiple-correct questions render with checkboxes
  - [ ] Test all answers display correctly
  - [ ] Test disabled state after submission
- **Files**: `src/app/[slug]/__tests__/questions.test.tsx`
- **Dependencies**: Task 002
- **Status**: [ ]

## Phase 3: Core Implementation

### Task 007: Implement Contest GET API Route [CORE]

- **Description**: Create GET /api/contests/[slug] endpoint
- **Acceptance**:
  - [ ] Retrieves contest by slug from database
  - [ ] Retrieves all questions for contest
  - [ ] Retrieves all answers for each question
  - [ ] Checks if user already submitted (hasSubmitted flag)
  - [ ] Returns proper error codes and messages
  - [ ] Uses RLS for security
- **Files**: `src/app/api/contests/[slug]/route.ts`
- **Dependencies**: Task 004
- **Status**: [ ]

### Task 008: Implement Answer Submission POST API Route [CORE]

- **Description**: Create POST /api/contests/[slug]/submit endpoint
- **Acceptance**:
  - [ ] Validates request using Zod schema
  - [ ] Checks for duplicate submission (409 error)
  - [ ] Saves UserAnswer records to database
  - [ ] Calculates score based on correct answers
  - [ ] Returns score, results, and correct answers
  - [ ] Uses RLS for security
- **Files**: `src/app/api/contests/[slug]/submit/route.ts`
- **Dependencies**: Task 005
- **Status**: [ ]

### Task 009: Create Question Component (Radio/Checkbox) [CORE]

- **Description**: Implement reusable Question component that renders radio buttons or checkboxes
- **Acceptance**:
  - [ ] Component renders radio buttons for SINGLE_CORRECT type
  - [ ] Component renders checkboxes for MULTIPLE_CORRECT type
  - [ ] Component accepts disabled prop
  - [ ] Component integrates with react-hook-form
  - [ ] Component displays correct answers when in results mode
- **Files**: `src/components/question-input.tsx`
- **Dependencies**: Task 002
- **Status**: [ ]

### Task 010: Create Results Display Component [CORE]

- **Description**: Implement component to display score and correct answers after submission
- **Acceptance**:
  - [ ] Displays overall score and question count
  - [ ] Shows each question with user answer vs correct answer
  - [ ] Highlights correct answers in green
  - [ ] Highlights incorrect user answers in red
  - [ ] Uses shadcn/ui Alert component for visual feedback
- **Files**: `src/components/contest-results.tsx`
- **Dependencies**: Task 002
- **Status**: [ ]

### Task 011: Implement Main Contest Page (Server) [CORE]

- **Description**: Create server component for /[slug] page
- **Acceptance**:
  - [ ] Verifies user is authenticated (redirects if not)
  - [ ] Fetches contest data from database
  - [ ] Handles 404 when contest not found
  - [ ] Passes data to client component
  - [ ] Uses proper error boundary
- **Files**: `src/app/[slug]/page.tsx`
- **Dependencies**: Task 007
- **Status**: [ ]

### Task 012: Implement Contest Page Client Component [CORE]

- **Description**: Create client component for form interaction and submission
- **Acceptance**:
  - [ ] Uses react-hook-form for form state management
  - [ ] Renders all questions with Question component
  - [ ] Handles form submission
  - [ ] Shows loading state during submission
  - [ ] Handles error states with user-friendly messages
  - [ ] Conditionally renders results or form based on hasSubmitted
  - [ ] Prevents submission if not all questions answered
- **Files**: `src/app/[slug]/page.client.tsx`
- **Dependencies**: Task 009, Task 010, Task 008
- **Status**: [ ]

## Phase 4: Integration & Polish

### Task 013: Add Navigation and Breadcrumbs [INTEGRATION]

- **Description**: Add navigation context and breadcrumbs to contest page
- **Acceptance**:
  - [ ] Breadcrumbs show: Home > Contests > [contest-title]
  - [ ] Links are functional and navigate correctly
  - [ ] Uses shadcn/ui Breadcrumb component
- **Files**: `src/app/[slug]/page.tsx`
- **Dependencies**: Task 011
- **Status**: [ ]

### Task 014: Implement Error Handling & Edge Cases [INTEGRATION]

- **Description**: Handle edge cases and error scenarios
- **Acceptance**:
  - [ ] Contest not found shows 404
  - [ ] Unauthenticated user redirected to login
  - [ ] Questions with no answers don't render
  - [ ] Network errors show retry option
  - [ ] Double submission blocked with clear message
- **Files**: `src/app/[slug]/page.tsx`, `src/app/api/contests/[slug]/*`
- **Dependencies**: Task 007, Task 008, Task 011, Task 012
- **Status**: [ ]

### Task 015: Style with Tailwind & shadcn/ui [INTEGRATION]

- **Description**: Apply consistent styling using TailwindCSS v4 and shadcn/ui components
- **Acceptance**:
  - [ ] Uses shadcn/ui Button, Card, Alert components
  - [ ] Responsive design (mobile, tablet, desktop)
  - [ ] Form inputs styled consistently
  - [ ] Results display visually clear with color coding
  - [ ] Loading states visible (spinners, disabled buttons)
- **Files**: `src/app/[slug]/page.tsx`, `src/components/*.tsx`
- **Dependencies**: Task 012
- **Status**: [ ]

### Task 016: Add Loading Skeleton [INTEGRATION]

- **Description**: Create loading skeleton for contest page
- **Acceptance**:
  - [ ] Skeleton shows during initial data fetch
  - [ ] Skeleton includes contest title area and question placeholders
  - [ ] Uses shadcn/ui Skeleton component or custom implementation
- **Files**: `src/components/contest-skeleton.tsx`, `src/app/[slug]/page.tsx`
- **Dependencies**: Task 012
- **Status**: [ ]

## Phase 5: Testing & Documentation

### Task 017: Integration Tests - Full User Flow [POLISH]

- **Description**: Test complete user journey from page load to submission and results
- **Acceptance**:
  - [ ] Test user loads page, sees contest and questions
  - [ ] Test user selects answers correctly
  - [ ] Test user submits and sees score
  - [ ] Test correct answers are highlighted
  - [ ] Test prevents resubmission
- **Files**: `src/app/[slug]/__tests__/flow.integration.test.ts`
- **Dependencies**: Task 007, Task 008, Task 011, Task 012
- **Status**: [ ]

### Task 018: Documentation & Quickstart [POLISH]

- **Description**: Update documentation with implementation details and running instructions
- **Acceptance**:
  - [ ] Quickstart.md updated with actual setup steps
  - [ ] API documentation in contracts/ verified and complete
  - [ ] Data model documented with actual schema
  - [ ] Example usage provided
- **Files**: `specs/001-contest-questions-page/quickstart.md`, contracts
- **Dependencies**: All core tasks
- **Status**: [ ]

## Execution Notes

- **Parallel Tasks [P]**: Tasks 004, 005, 006 can run in parallel (they don't share file dependencies)
- **Sequential Dependencies**: Follow dependency chains strictly
- **Testing First**: Tests (Phase 2) must be written/reviewed before implementation (Phase 3)
- **Database**: Ensure schema migrations are applied before running API tests
- **RLS Policies**: All database queries must respect Row Level Security

## Success Criteria

- [ ] All tasks marked [X] in Status column
- [ ] npm test passes with >80% coverage
- [ ] npm run lint passes with no errors
- [ ] Manual testing confirms all user scenarios work
- [ ] No console errors or warnings
