# spindox-events Development Guidelines

<!-- Sync Impact Report

Version change: N/A → 1.0.0

List of modified principles: N/A

Added sections: Contest Timer

Removed sections: N/A

Templates requiring updates: .specify/templates/plan-template.md (⚠ pending), .specify/templates/spec-template.md (⚠ pending), .specify/templates/tasks-template.md (⚠ pending), .specify/templates/commands/*.md (⚠ pending), README.md (⚠ pending)

Follow-up TODOs: Ratification date

-->

Version: 1.0.0

Ratification Date: TODO(RATIFICATION_DATE): Original adoption date unknown.

Last Amended Date: 2025-11-08

Auto-generated from all feature plans. Last updated: 2025-11-08

## Active Technologies
- Prisma with PostgreSQL and Row Level Security (RLS) (001-contest-questions-page)

- TypeScript/JavaScript with Next.js 16 (App Router) + @ai-sdk/groq, zod, react-hook-form, shadcn/ui components (001-ai-question-generation)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript/JavaScript with Next.js 16 (App Router): Follow standard conventions

## Recent Changes
- 001-contest-questions-page: Added TypeScript/JavaScript with Next.js 16 (App Router) + @ai-sdk/groq, zod, react-hook-form, shadcn/ui components

- 001-ai-question-generation: Added TypeScript/JavaScript with Next.js 16 (App Router) + @ai-sdk/groq, zod, react-hook-form, shadcn/ui components

- 002-contest-timer: Added timer feature to contests, in minutes, if set to 0 no time limit, starts when user starts questions, allows submission when timer stops.

## ⚠️ NEVER Reset the Database

- **NEVER** run `prisma migrate reset` or `prisma db push --force-reset`
- **NEVER** run `prisma migrate dev` or create new migrations
- **ALWAYS** ask for explicit confirmation before any destructive database operations
- This database contains important contest and user data that cannot be recovered if lost

## Database Schema Changes

- **DO NOT** create migrations with `prisma migrate dev`
- **ONLY** edit the `prisma/schema.prisma` file directly
- **USE** `npm run db:push` to apply schema changes to the database
- This approach keeps the database schema in sync without creating migration files

## Contest Timer

A contest can have a timer, in minutes, if set to 0 it means there is no time limit. When a user starts the questions, a timer if > 0 must start and when it stops, the user should be able to submit the answered questions.

Rationale: To add time pressure and control to contests.
