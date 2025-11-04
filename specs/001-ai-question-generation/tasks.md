---
description: 'Task list template for feature implementation'
---

# Tasks: AI Question Generation

**Input**: Design documents from `/specs/001-ai-question-generation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification or if user requests TDD approach.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install required dependencies (@ai-sdk/groq, zod) if not present in package.json
- [x] T002 [P] Create AI generation utilities in src/lib/ai.ts
- [x] T003 [P] Create Zod schemas for AI response validation in src/lib/schemas/ai-question.schema.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create AI question generation modal component in src/components/modals/ai-question-modal.tsx
- [x] T005 Create server action for question generation in src/actions/questions/generate.action.ts
- [x] T006 Add Generate Question button to existing question form in src/app/admin/contests/[id]/question.form.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Generate Single Correct Answer Question (Priority: P1) 🎯 MVP

**Goal**: Enable admins to generate questions with one correct answer using AI

**Independent Test**: Generate a single-correct question and verify it populates the form correctly with proper scoring

### Implementation for User Story 1

- [ ] T007 [US1] Implement single correct answer generation logic in src/actions/questions/generate.action.ts
- [ ] T008 [US1] Update modal form to handle single correct parameters in src/components/modals/ai-question-modal.tsx
- [ ] T009 [US1] Integrate modal with question form for single correct in src/app/admin/contests/[id]/questions/new/page.tsx
- [ ] T010 [US1] Add loading spinner display during generation in src/components/modals/ai-question-modal.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Generate Multiple Correct Answers Question (Priority: P2)

**Goal**: Enable admins to generate questions with multiple correct answers using AI

**Independent Test**: Generate a multiple-correct question and verify proportional scoring

### Implementation for User Story 2

- [ ] T011 [US2] Implement multiple correct answer generation logic in src/actions/questions/generate.action.ts
- [ ] T012 [US2] Update modal form to handle multiple correct parameters in src/components/modals/ai-question-modal.tsx
- [ ] T013 [US2] Integrate modal with question form for multiple correct in src/app/admin/contests/[id]/questions/new/page.tsx
- [ ] T014 [US2] Implement weighted scoring for multiple correct answers in src/actions/questions/generate.action.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T015 [P] Add error handling for AI generation failures in src/actions/questions/generate.action.ts
- [ ] T016 [P] Add form validation for generation parameters in src/components/modals/ai-question-modal.tsx
- [ ] T017 Update quickstart documentation if needed in specs/001-ai-question-generation/quickstart.md
- [ ] T018 Run linting and formatting on new files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on US1

### Within Each User Story

- Implementation tasks can run in parallel where marked [P]
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks can run in parallel (within Phase 2)
- Once Foundational is done, both user stories can start in parallel
- Within each story, some tasks marked [P] can run in parallel

### Parallel Example: User Story 1

```bash
# Launch implementation tasks together:
Task: "Implement single correct answer generation logic in src/actions/questions/generate.action.ts"
Task: "Update modal form to handle single correct parameters in src/components/modals/ai-question-modal.tsx"
Task: "Integrate modal with question form for single correct in src/app/admin/contests/[id]/questions/new/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
