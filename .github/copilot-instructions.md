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
