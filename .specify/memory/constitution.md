<!-- Sync Impact Report
Version change: 1.1.0 → 1.2.0
List of modified principles: AI Feature Integration (expanded with question generation details)
Added sections: None
Removed sections: None
Templates requiring updates: ⚠ pending (templates are generic placeholders)
Follow-up TODOs: None
-->

# spindox-events Constitution

## Core Principles

### Secure Authentication

All authentication must use better-auth with GitHub and Google OAuth providers and the admin plugin for role management. No alternative authentication methods are permitted.

### Role-Based Access Control

Enforce admin and user roles. Admins manage events and Q&A; users access event pages. Protect /admin for admins, /[slug] for users.

### Data Integrity and Security

Use Prisma with PostgreSQL and Row Level Security (RLS) for all database operations. Ensure RLS policies are applied to all tables.

### AI Feature Integration

AI functionalities must utilize the AI SDK (ai-sdk.dev) with requests routed through Vercel AI Gateway (vercel.com/ai-gateway). For question generation in the admin interface (page.tsx), use @ai-sdk/groq as the LLM provider, with Zod validation ensuring the AI response matches the Prisma schema for questions and answers. Question generation includes specifying a prompt, number of possible answers, correctness mode (single correct answer or multiple correct answers), and difficulty level (easy:100, medium:200, difficult:300, hard:400 points). If single correct answer, all points go to the correct one; if multiple, points are divided among correct answers weighted by correctness, with wrong answers scoring 0.

### QR Code Event Access

Event access via QR codes generating URLs in the format /[slug]?qr=.... Ensure secure and easy participant entry.

## Technology Stack Requirements

The application must be built with Next.js 16 (App Router), TailwindCSS v4, shadcn-ui components, and React Hook Form v7 for form validation.

## Development Workflow

Follow standard Next.js development practices, use ESLint and Prettier for code quality, and ensure all changes are tested before merging.

## Governance

Amendments require a pull request with rationale, approved by maintainers. Versioning: semantic (major for breaking, minor for additions, patch for fixes). Quarterly compliance reviews.

**Version**: 1.2.0 | **Ratified**: 2025-11-03 | **Last Amended**: 2025-11-04
