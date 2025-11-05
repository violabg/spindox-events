# Quickstart: Contest Questions Page

**Date**: 4 novembre 2025  
**Feature**: 001-contest-questions-page

## Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database
- GitHub OAuth configured for better-auth

## Setup

1. **Clone and install**:

   ```bash
   git checkout 001-contest-questions-page
   pnpm install
   ```

2. **Database**:

   ```bash
   # Ensure PostgreSQL is running
   pnpm prisma migrate dev
   pnpm prisma db seed  # if seed data available
   ```

3. **Environment**:
   - Copy `.env.example` to `.env.local`
   - Configure database URL, GitHub OAuth credentials

## Running the Feature

1. **Start development server**:

   ```bash
   pnpm dev
   ```

2. **Access the feature**:
   - Navigate to `http://localhost:3000/{contest-slug}`
   - Ensure you are logged in via GitHub OAuth
   - Select answers using radio buttons (single) or checkboxes (multiple)
   - Submit to view score and correct answers

## Testing

- Run tests: `pnpm test`
- Lint: `pnpm run lint`

## Key Files

- `src/app/[slug]/page.tsx` - Main page component
- `src/app/[slug]/page.client.tsx` - Client-side logic
- `src/app/api/contests/[slug]/route.ts` - Get contest API
- `src/app/api/contests/[slug]/submit/route.ts` - Submit API
- `prisma/schema.prisma` - Database schema updates
