# Implementation Plan: Contest Timer

## Technical Context

**Existing Architecture:**

- Next.js 16 App Router with TypeScript
- Prisma with PostgreSQL and Row Level Security
- React Hook Form with Zod validation
- Shadcn/ui components

**Feature Requirements:**

- Add timeLimit field to Contest model
- Update contest creation/update forms
- Implement countdown timer on questions page

**Dependencies:**

- React for timer component
- Prisma for schema changes
- Form libraries for input

**Integration Points:**

- Contest creation form
- Contest update form
- Questions page component

**Assumptions:**

- Timer is client-side only
- No server-side timer validation needed initially

## Constitution Check

**Relevant Principles:**

- Database Integrity: Schema changes follow the process (edit schema.prisma, run db:push)
- Contest Timer: Feature aligns with the principle

**Compliance Assessment:**

- [x] Follows database schema change process
- [x] Implements timer as specified
- [x] No violations of existing principles

**Gate Evaluation:**

- No constitution violations detected

## Phase 0: Outline & Research

**Research Tasks:**

1. Best practices for countdown timers in React
2. Prisma schema migration best practices
3. Form validation for time inputs

**Findings:**

- Use useState and useEffect with setInterval for timer
- Add field to schema, run db:push
- Use number input with min=0

## Phase 1: Design & Contracts

**Data Model:**

- Contest entity: add timeLimit Int @default(0)

**API Contracts:**

- Update contest endpoint: add timeLimit parameter

**Quickstart:**

1. Update Prisma schema
2. Run db:push
3. Update forms
4. Add timer component

## Phase 2: Implementation Planning

**Implementation Tasks:**

1. Schema update
2. Form updates
3. Timer component
4. Integration

**Testing Strategy:**

- Unit tests for timer
- Integration tests for forms
- E2E for full flow

## Risks & Mitigations

**Risks:**

- Timer accuracy issues
- Form validation edge cases

**Mitigations:**

- Use Date.now() for accuracy
- Comprehensive validation
