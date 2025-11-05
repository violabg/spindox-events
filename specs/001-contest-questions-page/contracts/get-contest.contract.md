# API Contract: Get Contest

**Endpoint**: GET /api/contests/{slug}  
**Purpose**: Retrieve contest information and questions for participation  
**Authentication**: Required (user session)

## Request

### Path Parameters

- `slug` (string): URL-safe contest identifier

### Headers

- `Authorization`: Bearer token

## Response

### Success (200)

```json
{
  "contest": {
    "id": "string",
    "slug": "string",
    "title": "string",
    "description": "string"
  },
  "questions": [
    {
      "id": "string",
      "text": "string",
      "type": "SINGLE_CORRECT" | "MULTIPLE_CORRECT",
      "answers": [
        {
          "id": "string",
          "text": "string"
        }
      ]
    }
  ],
  "hasSubmitted": false
}
```

### Error (404)

Contest not found

### Error (403)

User not authorized

### Error (500)

Server error
