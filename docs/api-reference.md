# API Reference

## Overview

DeepSite's API provides endpoints for AI-powered code generation, user authentication, project management, and deployment functionality.

## Authentication

### Headers
```typescript
Authorization: Bearer <token>  // User token from cookies
x-forwarded-for: <ip>         // Client IP for rate limiting
```

### Cookie Management
- Cookie name: `MY_TOKEN_KEY()` (dynamic based on environment)
- Automatic token extraction from cookies
- Fallback to environment tokens for development

## AI Generation Endpoints

### POST `/api/ask-ai` - Generate HTML

Generates complete HTML documents from natural language descriptions.

**Request:**
```typescript
POST /api/ask-ai
Content-Type: application/json

{
  "prompt": "Create a modern portfolio website",
  "provider": "novita",
  "model": "deepseek-ai/DeepSeek-V3-0324",
  "html": "", // Optional: existing HTML for context
  "redesignMarkdown": "" // Optional: markdown description for redesign
}
```

**Response:**
- **Content-Type**: `text/plain; charset=utf-8`
- **Streaming**: Real-time HTML generation
- **Format**: Raw HTML content

**Example Response Stream:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <!-- Generated content streams here -->
</body>
</html>
```

**Error Responses:**
```typescript
// Rate limit exceeded
{
  "ok": false,
  "openLogin": true,
  "message": "Log In to continue using the service"
}

// Provider error
{
  "ok": false,
  "openSelectProvider": true,
  "message": "Provider-specific error message"
}

// Credit limit
{
  "ok": false,
  "openProModal": true,
  "message": "Exceeded monthly credits"
}
```

### PUT `/api/ask-ai` - Modify HTML

Applies targeted changes to existing HTML using diff-patch system.

**Request:**
```typescript
PUT /api/ask-ai
Content-Type: application/json

{
  "prompt": "Make the header blue",
  "html": "<html>...</html>",
  "previousPrompt": "Create a portfolio website",
  "provider": "novita",
  "model": "deepseek-ai/DeepSeek-V3-0324",
  "selectedElementHtml": "<header>...</header>" // Optional: specific element
}
```

**Response:**
```typescript
{
  "ok": true,
  "html": "<html>...</html>", // Updated HTML
  "updatedLines": [[5, 10], [15, 20]] // Modified line ranges
}
```

**Diff-Patch Format:**
The AI returns modifications using structured blocks:
```
<<<<<<< SEARCH
<header class="bg-white">
  <h1>Portfolio</h1>
</header>
=======
<header class="bg-blue-500">
  <h1>Portfolio</h1>
</header>
>>>>>>> REPLACE
```

## User Management

### GET `/api/me` - Get Current User

Retrieves authenticated user information.

**Response:**
```typescript
{
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    // Additional user fields
  }
}
```

### POST `/api/auth` - Authentication

Handles user authentication flow.

## Project Management

### GET `/api/me/projects` - List User Projects

Retrieves all projects for the authenticated user.

**Response:**
```typescript
{
  "projects": [
    {
      "_id": "project_id",
      "space_id": "username/project-name",
      "user_id": "user_id",
      "prompts": ["Create a portfolio", "Add contact form"],
      "_createdAt": "2024-01-01T00:00:00.000Z",
      "_updatedAt": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

### GET `/api/me/projects/[namespace]/[repoId]` - Get Project

Retrieves a specific project by namespace and repository ID.

**Parameters:**
- `namespace`: User or organization name
- `repoId`: Project repository identifier

**Response:**
```typescript
{
  "project": {
    "_id": "project_id",
    "space_id": "namespace/repoId",
    "html": "<html>...</html>", // Project HTML content
    "user_id": "user_id",
    "prompts": ["array", "of", "prompts"],
    "_createdAt": "2024-01-01T00:00:00.000Z",
    "_updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

### POST `/api/me/projects` - Create Project

Creates a new project with HTML content.

**Request:**
```typescript
POST /api/me/projects
Content-Type: application/json

{
  "html": "<html>...</html>",
  "prompts": ["Create a landing page"]
}
```

**Response:**
```typescript
{
  "ok": true,
  "project": {
    "_id": "new_project_id",
    "space_id": "username/generated-name",
    "user_id": "user_id",
    "html": "<html>...</html>",
    "prompts": ["Create a landing page"],
    "_createdAt": "2024-01-01T00:00:00.000Z",
    "_updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT `/api/me/projects/[namespace]/[repoId]` - Update Project

Updates an existing project's HTML content and prompts.

**Request:**
```typescript
PUT /api/me/projects/namespace/repoId
Content-Type: application/json

{
  "html": "<html>...</html>",
  "prompts": ["Create a landing page", "Add navigation"]
}
```

## Redesign Endpoint

### POST `/api/re-design` - Redesign from Markdown

Generates new HTML based on markdown description of existing design.

**Request:**
```typescript
POST /api/re-design
Content-Type: application/json

{
  "markdown": "# Portfolio Site\n- Hero section\n- About me\n- Projects grid",
  "provider": "novita",
  "model": "deepseek-ai/DeepSeek-V3-0324"
}
```

## Rate Limiting

### Anonymous Users
- **Limit**: 2 requests per IP address
- **Storage**: In-memory Map (resets on server restart)
- **Response**: 429 status with login prompt

### Authenticated Users
- **Limit**: Based on plan/subscription
- **Enforcement**: Provider-level credit limits
- **Response**: 402 status with upgrade prompt

## Error Handling

### Standard Error Format
```typescript
{
  "ok": false,
  "error": "Error description",
  "message": "User-friendly message"
}
```

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (missing fields, invalid model)
- `401`: Unauthorized
- `402`: Payment Required (credit limit)
- `429`: Too Many Requests (rate limit)
- `500`: Internal Server Error

### Special Error Flags
```typescript
{
  "ok": false,
  "openLogin": true,        // Show login modal
  "openSelectProvider": true, // Show provider selection
  "openProModal": true,     // Show upgrade modal
  "message": "Error message"
}
```

## Request/Response Examples

### Complete Project Creation Flow

1. **Generate HTML:**
```bash
curl -X POST /api/ask-ai \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a portfolio", "provider": "novita", "model": "deepseek-ai/DeepSeek-V3-0324"}'
```

2. **Save as Project:**
```bash
curl -X POST /api/me/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"html": "<generated-html>", "prompts": ["Create a portfolio"]}'
```

3. **Modify HTML:**
```bash
curl -X PUT /api/ask-ai \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Add contact form", "html": "<current-html>", "provider": "novita", "model": "deepseek-ai/DeepSeek-V3-0324"}'
```

4. **Update Project:**
```bash
curl -X PUT /api/me/projects/username/project-name \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"html": "<updated-html>", "prompts": ["Create a portfolio", "Add contact form"]}'
```

## Provider-Specific Considerations

### Model Compatibility
```typescript
// Check if provider supports model
const selectedModel = MODELS.find(m => m.value === model);
if (!selectedModel.providers.includes(provider)) {
  return error("Provider not supported for this model");
}
```

### Token Limits
- **Fireworks AI**: 131,000 tokens
- **Nebius**: 131,000 tokens
- **SambaNova**: 32,000 tokens
- **NovitaAI**: 16,000 tokens
- **Hyperbolic**: 131,000 tokens
- **Together AI**: 128,000 tokens
- **Groq**: 16,384 tokens

### Provider-Specific Handling
- **SambaNova**: Special HTML truncation after `</html>`
- **Others**: Standard streaming until `</html>` detected