# Feature Specification: Contest Timer

## Overview

Add a timeLimit property to contests, allowing contests to have a timer in minutes. If set to 0, no time limit. When a user starts answering questions, if timeLimit > 0, a timer starts. When the timer stops, the user can submit answers.

## User Scenarios

### Primary Scenario: Timed Contest

1. Admin creates a contest with timeLimit = 30 minutes
2. User starts the contest questions
3. Timer starts counting down from 30 minutes
4. User answers questions
5. When timer reaches 0, user can submit answers

### Scenario: No Time Limit

1. Admin creates contest with timeLimit = 0
2. User starts questions
3. No timer shown
4. User submits when ready

### Edge Case: Timer Expires During Answering

1. User is answering, timer expires
2. User can continue and submit

## Functional Requirements

1. Contest model has timeLimit field (integer, minutes, default 0)
2. Create/Update contest form includes timeLimit input with note "0 means no limit"
3. On [slug]/questions page, if contest.timeLimit > 0, display timer starting from timeLimit minutes
4. Timer counts down
5. When timer reaches 0, allow submission
6. Submission possible even if timer expired

## Success Criteria

- Users can set timeLimit when creating contests
- Timer displays correctly on questions page for timed contests
- Users can submit answers after timer expires
- No timer for contests with timeLimit = 0
- Timer accuracy within 1 second

## Key Entities

- Contest: add timeLimit field

## Assumptions

- Timer is client-side, but server validates submission time if needed
- No auto-submit on timer expiry

## Dependencies

- Prisma schema update
- Contest form updates
- Questions page update
