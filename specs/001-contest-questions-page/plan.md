# Implementation Plan: Contest Questions Page

**Branch**: `001-contest-questions-page` | **Date**: 4 novembre 2025 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-contest-questions-page/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a contest participation page at /[slug] that retrieves contest information and questions, allows authenticated users to answer using radio buttons (single correct) or checkboxes (multiple correct), submits answers once per contest, calculates score, and displays correct answers and score after submission.

## Technical Context

**Language/Version**: TypeScript/JavaScript with Next.js 16 (App Router)  
**Primary Dependencies**: @ai-sdk/groq, zod, react-hook-form, shadcn/ui components  
**Storage**: Prisma with PostgreSQL and Row Level Security (RLS)  
**Testing**: npm test && npm run lint  
**Target Platform**: Web application  
**Project Type**: Web application  
**Performance Goals**: Page load within 3 seconds, submission and result display within 2 seconds  
**Constraints**: Authenticated users only, prevent multiple submissions per contest, score calculation based on correct answers  
**Scale/Scope**: Support contests with up to 50 questions, 1000 concurrent users

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Secure Authentication: Uses better-auth with GitHub and Google OAuth - PASS
- Role-Based Access Control: Enforces user role for /[slug] access - PASS
- Data Integrity and Security: Uses Prisma with PostgreSQL and RLS - PASS
- AI Feature Integration: Not applicable for this feature - PASS
- QR Code Event Access: Not applicable - PASS
- Technology Stack Requirements: Next.js 16, TailwindCSS v4, shadcn-ui, React Hook Form - PASS
- Development Workflow: Follows Next.js practices, ESLint, Prettier - PASS

All gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-contest-questions-page/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── [slug]/
│   │   ├── page.tsx          # Main contest page component
│   │   └── page.client.tsx   # Client-side logic for answers and submission
│   └── api/
│       └── contests/
│           └── [slug]/
│               ├── route.ts      # GET contest and questions
│               └── submit/
│                   └── route.ts  # POST submit answers
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── modals/                 # If needed for results display
├── lib/
│   ├── prisma.ts               # Database client
│   └── schemas/                # Zod schemas for validation
└── actions/
    └── contests/               # Server actions if needed
```

**Structure Decision**: Web application structure following Next.js App Router conventions, with API routes for data fetching and submission, client components for interactivity.

## Complexity Tracking

No violations - all constitution requirements are met without additional complexity.
