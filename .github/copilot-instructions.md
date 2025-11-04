# spindox-events Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-04

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
