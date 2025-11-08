# Quickstart: Contest Timer Implementation

## Prerequisites

- Node.js, pnpm
- PostgreSQL running

## Steps

1. **Update Prisma Schema**
   - Edit `prisma/schema.prisma`
   - Add `timeLimit Int @default(0)` to Contest model

2. **Apply Schema Changes**
   - Run `npm run db:push`

3. **Update Contest Forms**
   - Add timeLimit input to create/update forms
   - Use number input with min=0
   - Add note: "0 means no time limit"

4. **Implement Timer Component**
   - Create timer component using useState, useEffect
   - Display on [slug]/questions page if timeLimit > 0
   - Start timer when questions start
   - Allow submission when timer expires

5. **Test**
   - Create contest with timer
   - Start questions, verify timer
   - Submit after timer expires
