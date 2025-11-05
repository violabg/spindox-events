# Feature Specification: Contest Questions Page

**Feature Branch**: `001-contest-questions-page`  
**Created**: 4 novembre 2025  
**Status**: Draft  
**Input**: User description: "create the [slug] page, it needs to retrive contest info and questions, and allow the user to anwser and submit questions, use radio buttons for single correct answer and checkboxes for multiple"

## Clarifications

### Session 2025-11-04

- Q: How should the system handle if a user attempts to submit answers multiple times for the same contest? → A: Prevent duplicate submissions (reject subsequent attempts with an error message)

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Access Contest and View Questions (Priority: P1)

As an authenticated user, I want to access a contest page by its slug so that I can view the contest information and its questions.

**Why this priority**: This is the core functionality that enables users to participate in contests, providing the foundation for all other interactions.

**Independent Test**: Can be fully tested by navigating to a contest URL and verifying that contest details and questions are displayed correctly.

**Acceptance Scenarios**:

1. **Given** the user is authenticated and a contest exists with slug "example-contest", **When** the user visits "/example-contest", **Then** the page displays the contest title, description, and a list of questions.
2. **Given** the user is authenticated and the contest has no questions, **When** the user visits the contest page, **Then** the page displays the contest info and a message indicating no questions are available.

---

### User Story 2 - Answer Questions (Priority: P1)

As an authenticated user, I want to answer contest questions using appropriate input controls so that I can participate in the contest.

**Why this priority**: This allows users to interact with the content, which is essential for contest participation.

**Independent Test**: Can be fully tested by selecting answers for questions and verifying the selections are recorded.

**Acceptance Scenarios**:

1. **Given** a question has a single correct answer, **When** the user selects one option using radio buttons, **Then** only one option can be selected at a time.
2. **Given** a question allows multiple correct answers, **When** the user selects multiple options using checkboxes, **Then** multiple options can be selected.
3. **Given** the user has selected answers for all questions, **When** they submit the form, **Then** their answers are saved and a confirmation is shown.

---

### User Story 3 - Submit Answers and View Results (Priority: P1)

As an authenticated user, I want to submit my answers and immediately see my score and the correct answers so that I can learn from the contest.

**Why this priority**: Providing immediate feedback enhances the learning experience and user engagement.

**Independent Test**: Can be fully tested by submitting answers and verifying score calculation and correct answer display.

**Acceptance Scenarios**:

1. **Given** the user has answered all questions, **When** they click submit, **Then** their answers are saved, score is calculated, and they see their score along with correct answers highlighted.
2. **Given** the user has not answered all questions, **When** they attempt to submit, **Then** they are prompted to answer remaining questions.
3. **Given** the user has already submitted answers for the contest, **When** they attempt to submit again, **Then** they receive an error message and the submission is rejected.

---

### Edge Cases

- What happens when the contest slug does not exist? (Should show 404 or error message)
- How does the system handle if a user tries to access a contest they're not authorized for? (Assuming all authenticated users can access)
- What if a question has no answers defined? (Should not display or show error)
- How to handle if user submits multiple times? Prevent duplicate submissions (reject subsequent attempts with an error message)

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST retrieve and display contest information (title, description) based on the slug in the URL.
- **FR-002**: System MUST retrieve and display all questions associated with the contest.
- **FR-003**: System MUST display single-correct-answer questions with radio button inputs, allowing only one selection.
- **FR-004**: System MUST display multiple-correct-answer questions with checkbox inputs, allowing multiple selections.
- **FR-005**: System MUST allow authenticated users to select answers for each question.
- **FR-006**: System MUST validate that at least one answer is selected for each question before submission.
- **FR-007**: System MUST save user answers upon submission and associate them with the user and contest.
- **FR-008**: System MUST provide feedback to the user after successful submission, including the calculated score and display of correct answers.
- **FR-009**: System MUST prevent multiple submissions from the same user for the same contest, rejecting subsequent attempts with an error message.
- **FR-010**: System MUST calculate the user's score based on the number of correct answers selected.

### Key Entities _(include if feature involves data)_

- **Contest**: Represents a contest with attributes like slug, title, description, and associated questions.
- **Question**: Represents a question within a contest, with text, type (single or multiple correct answers), and possible answers.
- **Answer**: Represents possible answer options for a question, with text and correctness indicator.
- **UserAnswer**: Represents a user's selected answers for a question, linking user, question, and selected answers.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can load a contest page and view all questions within 3 seconds.
- **SC-002**: 95% of users can successfully submit answers and view their score and correct answers.
- **SC-003**: The page correctly displays radio buttons for single-answer questions and checkboxes for multiple-answer questions in 100% of cases.
- **SC-004**: Users complete answering and submitting all questions in under 10 minutes for a typical contest with 10 questions.
- **SC-005**: 100% of submitted answers show accurate score calculation and correct answer highlighting.
