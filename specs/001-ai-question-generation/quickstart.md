# Quickstart: AI Question Generation

**Feature**: AI Question Generation  
**Date**: 2025-11-04

## Overview

The AI Question Generation feature allows admins to quickly create quiz questions using artificial intelligence. Generate questions with multiple choice answers, specify difficulty levels, and get properly scored questions ready for contests.

## Prerequisites

- Admin access to the application
- Existing contest to add questions to
- Internet connection for AI generation

## How to Use

1. **Navigate to Question Creation**
   - Go to Admin → Contests → [Select Contest] → Questions → New Question

2. **Click Generate Question**
   - On the new question page, click the "Generate Question" button
   - A modal dialog will open with generation options

3. **Configure Generation Parameters**
   - **Prompt**: Describe the question topic (e.g., "Geography questions about European capitals")
   - **Number of Answers**: Select 2-6 answer options
   - **Answer Type**: Choose "Single Correct" or "Multiple Correct"
   - **Difficulty**: Select Easy (100pts), Medium (200pts), Difficult (300pts), or Hard (400pts)

4. **Generate and Review**
   - Click "Generate" to start AI processing
   - Wait for the loading spinner to complete
   - Review the generated question and answers in the form
   - Edit if needed, then save the question

## Scoring Rules

- **Single Correct**: All points go to the one correct answer
- **Multiple Correct**: Points are distributed among correct answers based on their relative importance
- **Wrong Answers**: Always receive 0 points

## Tips for Better Results

- Use specific, detailed prompts
- For multiple correct questions, the AI determines answer weights
- Review and edit generated content before saving
- Generation typically takes 10-20 seconds

## Troubleshooting

- **Generation fails**: Check your internet connection and try again
- **Invalid content**: The AI may occasionally produce unusable content - edit or regenerate
- **Access denied**: Ensure you are logged in as an admin

## Example

**Prompt**: "Create a question about photosynthesis for biology students"

**Result**: Question about the process of photosynthesis with 4 answer options, one correct answer worth 200 points (medium difficulty).
