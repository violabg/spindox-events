# Research Findings: Contest Timer

## Countdown Timer in React

**Decision:** Use useState and useEffect with setInterval for client-side countdown timer.

**Rationale:** Simple, built-in React hooks, no external dependencies needed. Suitable for client-side timer.

**Alternatives considered:** react-countdown library (adds dependency), custom hook (overkill for simple use).

## Prisma Schema Updates

**Decision:** Edit schema.prisma directly, run npm run db:push.

**Rationale:** Follows project process for schema changes without migrations.

**Alternatives considered:** Using migrations (not allowed per constitution).

## Form Validation for Time Inputs

**Decision:** Use number input with min=0, validate with Zod.

**Rationale:** Consistent with existing form validation, ensures non-negative integers.

**Alternatives considered:** Custom validation function (unnecessary).
