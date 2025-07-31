# AI Integration Guide

## Overview

DeepSite integrates with multiple AI providers to generate and modify HTML/CSS/JavaScript code through natural language prompts. The system supports both initial code generation and iterative modifications using a sophisticated diff-patch mechanism.

## AI Providers

### Supported Providers
```typescript
const PROVIDERS = {
  "fireworks-ai": { max_tokens: 131_000 },
  "nebius": { max_tokens: 131_000 },
  "sambanova": { max_tokens: 32_000 },
  "novita": { max_tokens: 16_000 },
  "hyperbolic": { max_tokens: 131_000 },
  "together": { max_tokens: 128_000 },
  "groq": { max_tokens: 16_384 }
}
```

### AI Models
1. **DeepSeek V3 O324** - Primary coding model
2. **DeepSeek R1 0528** - Reasoning model with thinking capabilities
3. **Qwen3 Coder 480B** - Specialized coding model
4. **Kimi K2 Instruct** - General purpose model

## API Endpoints

### POST `/api/ask-ai` - Initial Code Generation
Generates complete HTML documents from natural language prompts.

**Request Body:**
```typescript
{
  prompt: string;           // User's natural language request
  provider: string;         // AI provider selection
  model: string;           // Model selection
  html?: string;           // Existing HTML context
  redesignMarkdown?: string; // Markdown for redesign
}
```

**Response:** 
- Streaming text response with HTML content
- Real-time generation with partial updates

### PUT `/api/ask-ai` - Code Modification
Applies targeted changes to existing HTML using diff-patch system.

**Request Body:**
```typescript
{
  prompt: string;              // Modification request
  html: string;               // Current HTML content
  previousPrompt?: string;    // Context from previous interaction
  selectedElementHtml?: string; // Specific element to modify
  provider: string;
  model: string;
}
```

**Response:**
```typescript
{
  ok: boolean;
  html: string;        // Updated HTML content
  updatedLines: number[][]; // Line ranges that were modified
}
```

## Prompt Engineering

### System Prompts

#### Initial Generation Prompt
```
ONLY USE HTML, CSS AND JAVASCRIPT. If you want to use ICON make sure to import the library first. Try to create the best UI possible by using only HTML, CSS and JAVASCRIPT. MAKE IT RESPONSIVE USING TAILWINDCSS. Use as much as you can TailwindCSS for the CSS, if you can't do something with TailwindCSS, then use custom CSS (make sure to import <script src="https://cdn.tailwindcss.com"></script> in the head). Also, try to ellaborate as much as you can, to create something unique. ALWAYS GIVE THE RESPONSE INTO A SINGLE HTML FILE. AVOID CHINESE CHARACTERS IN THE CODE IF NOT ASKED BY THE USER.
```

#### Follow-up Modification Prompt
```
You are an expert web developer modifying an existing HTML file.
The user wants to apply changes based on their request.
You MUST output ONLY the changes required using the following SEARCH/REPLACE block format.
```

### Diff-Patch System

The follow-up system uses a structured format for code modifications:

```
<<<<<<< SEARCH
    <h1>Old Title</h1>
=======
    <h1>New Title</h1>
>>>>>>> REPLACE
```

**Format Rules:**
1. `<<<<<<< SEARCH` - Start of search block
2. Exact code to be replaced
3. `=======` - Separator
4. New code to replace with
5. `>>>>>>> REPLACE` - End of replace block

## Streaming Implementation

### Client-Side Streaming
```typescript
const reader = request.body.getReader();
const decoder = new TextDecoder("utf-8");

const read = async () => {
  const { done, value } = await reader.read();
  if (done) return;
  
  const chunk = decoder.decode(value, { stream: true });
  // Process chunk and update UI
  contentResponse += chunk;
  
  // Continue reading
  read();
};
```

### Server-Side Streaming
```typescript
const stream = new TransformStream();
const writer = stream.writable.getWriter();
const encoder = new TextEncoder();

// Stream AI response
while (true) {
  const { done, value } = await chatCompletion.next();
  if (done) break;
  
  const chunk = value.choices[0]?.delta?.content;
  if (chunk) {
    await writer.write(encoder.encode(chunk));
  }
}
```

## Authentication & Rate Limiting

### Token Management
- User tokens from cookies
- Environment HF_TOKEN for local development
- DEFAULT_HF_TOKEN fallback for anonymous users

### Rate Limiting
- IP-based tracking: `Map<string, number>`
- Max requests per IP: 2 for unauthenticated users
- Automatic login prompt on limit exceeded

## Error Handling

### Client-Side Error Types
```typescript
interface AIError {
  ok: false;
  openLogin?: boolean;        // Trigger login modal
  openSelectProvider?: boolean; // Show provider selection
  openProModal?: boolean;     // Show upgrade modal
  message: string;
}
```

### Common Error Scenarios
1. **Rate Limit Exceeded** → Login prompt
2. **Provider Unavailable** → Provider selection
3. **Credits Exhausted** → Upgrade modal
4. **Invalid Model** → Error message

## Model-Specific Features

### Thinking Models (DeepSeek R1)
- Special `<think>` tag processing
- Reasoning display in UI
- Automatic model switching after use

### Provider-Specific Handling
- **SambaNova**: Special HTML truncation logic
- **Others**: Standard streaming with HTML detection

## Integration Best Practices

1. **Provider Fallbacks**: Always have backup providers
2. **Streaming Optimization**: Throttle UI updates (300ms intervals)
3. **Error Recovery**: Graceful degradation with meaningful messages
4. **Token Management**: Secure token handling with environment variables
5. **Rate Limiting**: Implement fair usage policies

## Performance Considerations

- **Partial Rendering**: Update HTML as it streams
- **HTML Validation**: Auto-close tags for partial content
- **Memory Management**: Stream processing to avoid large buffers
- **Request Throttling**: Prevent excessive API calls