# Data Model: Contest Timer

## Entities

### Contest

**Fields:**

- id: String @id
- title: String
- description: String?
- timeLimit: Int @default(0) // Time limit in minutes, 0 means no limit
- ... other fields

**Relationships:**

- questions: Question[]
- attempts: Attempt[]

**Validation Rules:**

- timeLimit >= 0

**State Transitions:**

- Created with timeLimit
- No state changes for timer
