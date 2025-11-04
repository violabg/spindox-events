# API Contract: Submit Answers

**Endpoint**: POST /api/contests/{slug}/submit  
**Purpose**: Submit user answers for a contest and receive score and correct answers  
**Authentication**: Required (user session)

## Request

### Path Parameters

- `slug` (string): URL-safe contest identifier

### Headers

- `Authorization`: Bearer token
- `Content-Type`: application/json

### Body

```json
{
  "answers": [
    {
      "questionId": "string",
      "answerIds": ["string"] // array for multiple, single element for single
    }
  ]
}
```

## Response

### Success (200)

```json
{
  "score": 85,
  "totalQuestions": 10,
  "correctCount": 8,
  "results": [
    {
      "questionId": "string",
      "questionText": "string",
      "userAnswers": ["string"],
      "correctAnswers": ["string"],
      "isCorrect": true
    }
  ]
}
```

### Error (400)

Validation error (e.g., missing answers)

### Error (409)

Already submitted

### Error (404)

Contest not found

### Error (500)

Server error
