# API Contract: Update Contest

## Endpoint

PUT /api/contests/{id}

## Request Body

```json
{
  "title": "string",
  "description": "string",
  "timeLimit": "number" // minutes, 0 = no limit
}
```

## Response

```json
{
  "id": "string",
  "title": "string",
  "timeLimit": "number"
}
```
