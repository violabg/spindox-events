# Feature Specification: AI Question Generation

**Feature Branch**: `001-ai-question-generation`  
**Created**: 2025-11-04  
**Status**: Draft  
**Input**: User description: "that in #file:page.tsx we can generate the question using the ai sdk, if we press the generate questioin a modal (use shadcn component for the modal and form, and react-hook-form with zod) will open and we will provide a prompt for generating the question, the number of possible answers, if only one answer is correct or more than one can be, a max score for the question, if only one is correct all the point will be given to the correct anwser, other wise the score will be divided to the possible correct ones, weighted based on the correcness of the answers, all wrong answers will get 0. the max score will be an enum easy -> 100 medium -> 200 difficult -> 300 hard -> 400 use a select from shadcnh we will you @ai-sdk/groq for llm choise, and zod to validate the schema of the AI reply that needs to match the prisma schema for questions and answers"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Generate Single Correct Answer Question (Priority: P1)

As an admin creating a contest question, I want to generate a question with one correct answer using AI so that I can quickly populate the question form with high-quality content.

**Why this priority**: This is the primary use case for AI question generation, enabling faster content creation.

**Independent Test**: The feature can be tested by generating a single-correct question and verifying it appears correctly in the form, ready for saving.

**Acceptance Scenarios**:

1. **Given** I am an admin on the new question page for a contest, **When** I click the "Generate Question" button, **Then** a modal dialog opens with input fields for generation parameters.
2. **Given** the generation modal is open, **When** I enter a prompt, select number of answers (e.g., 4), choose "single correct answer", select difficulty level (e.g., easy), and submit, **Then** a loading spinner is displayed while the AI generates the question, and upon completion, the question with the specified number of answers is populated in the main form.
3. **Given** a single-correct question is generated, **When** the question is saved, **Then** the correct answer receives the full max score (100 for easy), and incorrect answers receive 0 points.

---

### User Story 2 - Generate Multiple Correct Answers Question (Priority: P2)

As an admin creating a contest question, I want to generate a question with multiple correct answers using AI so that I can create more complex quiz questions.

**Why this priority**: Supports advanced question types for better contest variety.

**Independent Test**: The feature can be tested by generating a multiple-correct question and verifying correct answers are assigned proportional scores.

**Acceptance Scenarios**:

1. **Given** the generation modal is open, **When** I enter a prompt, select number of answers, choose "multiple correct answers", select difficulty, and submit, **Then** the AI generates a question with multiple correct answers.
2. **Given** a multiple-correct question is generated, **When** the question is saved, **Then** the max score is divided among correct answers based on their relative correctness weights, and incorrect answers receive 0 points.

---

### Edge Cases

- What happens if the AI prompt is too vague or inappropriate? (System should generate a valid question or show an error)
- How does the system handle AI generation failures? (Show error message and allow retry)
- What if the requested number of answers is invalid? (Validate input and show appropriate error)

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a "Generate Question" button on the new question page for admins.
- **FR-002**: System MUST open a modal dialog when the generate button is clicked, containing form fields for prompt, number of answers, answer type (single/multiple), and difficulty level.
- **FR-003**: System MUST accept a text prompt describing the desired question topic and content.
- **FR-004**: System MUST allow selection of number of possible answers (reasonable range, e.g., 2-6).
- **FR-005**: System MUST allow selection between single correct answer or multiple correct answers.
- **FR-006**: System MUST provide difficulty level selection with predefined max scores: easy (100), medium (200), difficult (300), hard (400).
- **FR-007**: System MUST use AI to generate questions and answers based on the provided parameters.
- **FR-008**: System MUST display a loading spinner during AI question generation.
- **FR-009**: For single correct questions, System MUST assign full max score to the correct answer and 0 to incorrect answers.
- **FR-010**: For multiple correct questions, System MUST divide the max score among correct answers weighted by their correctness, assigning 0 to incorrect answers.
- **FR-011**: System MUST populate the main question form with the generated content for review and editing before saving.
- **FR-012**: System MUST validate that generated content matches the Prisma schema for Question and Answer models (title, content, score, order fields).

### Key Entities _(include if feature involves data)_

- **Question**: Contains id, title, content, order, contestId, answers relation
- **Answer**: Contains id, content, score, order, questionId relation

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Admins can generate and populate a question form in under 30 seconds from clicking the generate button.
- **SC-002**: Generated questions have at least 90% accuracy in factual correctness and grammar.
- **SC-003**: 95% of generated questions are usable without major edits by admins.
- **SC-004**: System successfully generates questions for 99% of valid prompts.
- **SC-005**: Question generation reduces average question creation time by 70% compared to manual creation.
