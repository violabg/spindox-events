# Implementation Plan: AI Question Generation

**Branch**: `001-ai-question-generation` | **Date**: 2025-11-04 | **Spec**: specs/001-ai-question-generation/spec.md
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement AI-powered question generation feature for admins to quickly create quiz questions using a modal interface with parameters for prompt, answer count, correctness type, and difficulty level. Technical approach uses @ai-sdk/groq for LLM, Zod for response validation against Prisma schema, and shadcn/ui components with react-hook-form.

## Technical Context

**Language/Version**: TypeScript/JavaScript with Next.js 16 (App Router)  
**Primary Dependencies**: @ai-sdk/groq, zod, react-hook-form, shadcn/ui components  
**Storage**: PostgreSQL via Prisma ORM  
**Testing**: ESLint and Prettier for code quality  
**Target Platform**: Web browsers  
**Project Type**: Web application (Next.js)  
**Performance Goals**: Question generation completes in under 30 seconds  
**Constraints**: AI responses must validate against Prisma Question/Answer schema, spinner shown during generation  
**Scale/Scope**: Admin-only feature for contest question creation, supports 2-6 answers per question

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

AI Feature Integration: Uses AI SDK (@ai-sdk/groq) with Zod validation matching Prisma schema.  
Secure Authentication: Feature restricted to admin role.  
Role-Based Access Control: Admin access to question creation.  
Data Integrity and Security: Prisma with RLS.  
Technology Stack Requirements: Next.js 16, TailwindCSS v4, shadcn-ui, React Hook Form v7.

All gates pass - no violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-ai-question-generation/
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
│   └── admin/
│       └── contests/
│           └── [id]/
│               └── questions/
│                   └── new/
│                       └── page.tsx  # Existing page to modify
├── components/
│   ├── ui/  # Existing shadcn components
│   └── modals/  # New AI generation modal
├── actions/  # New server action for AI generation
└── lib/  # Existing utilities, add AI helpers
```

**Structure Decision**: Single Next.js project with App Router. Feature adds modal component, server action for AI generation, and integrates into existing admin question creation page.

## Complexity Tracking

No constitution violations - feature aligns with existing architecture.
