# DeepSite Architecture Overview

## System Overview

DeepSite is an AI-powered web development platform that enables users to create and edit websites through natural language prompts. The application leverages multiple AI providers (primarily DeepSeek models) to generate and modify HTML/CSS/JavaScript code in real-time.

## Core Architecture

### Technology Stack
- **Frontend**: Next.js 15.3.3 with React 19
- **UI Framework**: Tailwind CSS 4 with Radix UI components
- **Database**: MongoDB with Mongoose ODM
- **Code Editor**: Monaco Editor
- **AI Integration**: Hugging Face Inference API
- **State Management**: React hooks with local storage persistence
- **Authentication**: Cookie-based sessions

### Application Structure

```
deepsite/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes (unauthenticated)
│   ├── api/                      # API routes
│   ├── auth/                     # Authentication pages
│   └── projects/                 # Project management pages
├── components/                   # Reusable UI components
│   ├── editor/                   # Main editor components
│   ├── ui/                       # Base UI components (shadcn/ui)
│   └── contexts/                 # React contexts
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions and configurations
├── models/                       # Database models
└── types/                        # TypeScript type definitions
```

## Key Components

### 1. Editor System (`components/editor/`)
- **AppEditor**: Main editor container with split-pane layout
- **Monaco Editor**: Code editing with syntax highlighting
- **Preview**: Live HTML preview with device switching
- **AskAI**: Natural language interface for code generation

### 2. AI Integration (`app/api/ask-ai/`)
- **Streaming Generation**: Real-time HTML generation
- **Provider Management**: Multiple AI provider support
- **Diff-Patch System**: Incremental code updates
- **Rate Limiting**: IP-based request throttling

### 3. Project Management
- **Project Model**: MongoDB schema for project persistence
- **Space Integration**: Hugging Face Spaces deployment
- **Version History**: HTML change tracking

## Data Flow

1. **User Input** → Natural language prompt
2. **AI Processing** → Multiple provider routing
3. **Code Generation** → HTML/CSS/JS output
4. **Live Preview** → Real-time rendering
5. **Project Persistence** → MongoDB storage
6. **Deployment** → Hugging Face Spaces

## Authentication & Authorization

- Cookie-based session management
- Optional authentication (guest usage with rate limits)
- Hugging Face token integration
- IP-based rate limiting for unauthenticated users

## Performance Optimizations

- **Streaming Responses**: Real-time AI output
- **Throttled Re-renders**: Reduced preview flickering
- **Local Storage**: Persistent editor state
- **Code Splitting**: Optimized bundle loading
- **Monaco Editor**: Efficient code editing

## Scalability Considerations

- **Multiple AI Providers**: Failover and load distribution
- **Rate Limiting**: Resource protection
- **Streaming Architecture**: Memory-efficient processing
- **Database Indexing**: Optimized queries
- **CDN Integration**: Static asset delivery