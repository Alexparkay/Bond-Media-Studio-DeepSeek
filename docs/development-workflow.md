# Development Workflow

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Hugging Face account with API token
- Git for version control

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd deepsite

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

**Required Environment Variables:**
```bash
MONGODB_URI=mongodb://localhost:27017/deepsite
HF_TOKEN=hf_your_token_here
DEFAULT_HF_TOKEN=hf_default_token_here
```

### Development Server

```bash
# Start development server with Turbopack
npm run dev

# Alternative: Standard Next.js dev server
npx next dev

# Server runs on http://localhost:3000
```

## Project Structure

### Directory Organization
```
deepsite/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes (no auth required)
│   ├── api/               # API endpoints
│   ├── auth/              # Authentication pages
│   ├── projects/          # Project management pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── editor/           # Editor-specific components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── contexts/         # React contexts
│   └── providers/        # Provider components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── models/               # Database models
├── types/                # TypeScript type definitions
├── assets/               # Static assets (CSS, images)
└── public/               # Public static files
```

### Key Files
- `app/layout.tsx`: Root application layout
- `components/editor/index.tsx`: Main editor component
- `app/api/ask-ai/route.ts`: AI integration endpoint
- `lib/providers.ts`: AI provider configurations
- `models/Project.ts`: MongoDB project schema

## Development Guidelines

### Code Style and Standards

**ESLint Configuration** (`.eslintrc.json`):
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error",
    "no-console": "warn"
  }
}
```

**TypeScript Configuration** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Component Development

**Component Structure:**
```typescript
// components/example/index.tsx
"use client"; // If client component

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ExampleProps {
  title: string;
  onAction?: () => void;
}

export function Example({ title, onAction }: ExampleProps) {
  const [state, setState] = useState(false);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </div>
  );
}
```

**Styling Guidelines:**
- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use CSS variables for theme colors
- Prefer utility classes over custom CSS

### API Development

**API Route Structure:**
```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Implementation
    const data = { message: "Success" };
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.required_field) {
      return NextResponse.json(
        { error: "Missing required field" },
        { status: 400 }
      );
    }
    
    // Implementation
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## Testing Strategy

### Unit Testing Setup

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Create test configuration
touch jest.config.js
```

**Jest Configuration** (`jest.config.js`):
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
```

### Component Testing

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### API Testing

```typescript
// __tests__/api/health.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/health/route';

describe('/api/health', () => {
  it('returns healthy status', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        status: 'healthy',
      })
    );
  });
});
```

## Database Development

### Model Development

```typescript
// models/NewModel.ts
import mongoose from "mongoose";

const NewModelSchema = new mongoose.Schema({
  field1: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => v.length > 0,
      message: 'Field1 is required'
    }
  },
  field2: {
    type: Number,
    default: 0,
    min: [0, 'Field2 must be positive']
  },
  timestamps: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
});

// Indexes
NewModelSchema.index({ field1: 1 });
NewModelSchema.index({ field1: 1, field2: -1 });

// Middleware
NewModelSchema.pre('save', function() {
  this.timestamps.updatedAt = new Date();
});

export default mongoose.models.NewModel || 
  mongoose.model("NewModel", NewModelSchema);
```

### Database Migrations

```typescript
// scripts/migrate.ts
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

async function migrate() {
  await dbConnect();
  
  // Add new field to existing documents
  await Project.updateMany(
    { newField: { $exists: false } },
    { $set: { newField: "default_value" } }
  );
  
  console.log("Migration completed");
  process.exit(0);
}

migrate().catch(console.error);
```

## Git Workflow

### Branch Strategy

**Main Branches:**
- `main`: Production-ready code
- `develop`: Integration branch for features

**Feature Branches:**
- `feature/feature-name`: New features
- `fix/bug-description`: Bug fixes
- `refactor/component-name`: Code refactoring

### Commit Guidelines

**Commit Message Format:**
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(editor): add element selection for targeted editing"
git commit -m "fix(api): handle rate limiting for anonymous users"
git commit -m "docs: update API documentation with new endpoints"
```

### Pull Request Process

1. **Create Feature Branch:**
```bash
git checkout -b feature/new-feature
```

2. **Develop and Test:**
```bash
# Make changes
git add .
git commit -m "feat: implement new feature"

# Run tests
npm test
npm run lint
```

3. **Push and Create PR:**
```bash
git push origin feature/new-feature
# Create pull request on GitHub
```

4. **PR Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots
Include screenshots if UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## Performance Monitoring

### Development Tools

**Next.js Bundle Analyzer:**
```bash
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build
```

**Performance Monitoring:**
```typescript
// lib/performance.ts
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
}
```

### Debugging

**Development Debugging:**
```typescript
// Enable debug mode
localStorage.setItem('debug', 'true');

// Console logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

**Error Boundary:**
```typescript
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

## Deployment Workflow

### Pre-deployment Checklist

```bash
# Run all checks
npm run lint          # ESLint
npm run type-check    # TypeScript
npm test             # Unit tests
npm run build        # Production build
```

### Environment-specific Deployments

**Development:**
```bash
# Auto-deploy on push to develop branch
git push origin develop
```

**Staging:**
```bash
# Deploy to staging environment
git push origin staging
```

**Production:**
```bash
# Create release branch
git checkout -b release/v1.0.0
git push origin release/v1.0.0

# Merge to main after review
git checkout main
git merge release/v1.0.0
git tag v1.0.0
git push origin main --tags
```

## Documentation Standards

### Code Documentation

```typescript
/**
 * Generates HTML content using AI based on user prompt
 * @param prompt - User's natural language description
 * @param model - AI model to use for generation
 * @param provider - AI provider selection
 * @returns Promise resolving to generated HTML content
 * @throws {Error} When AI generation fails or rate limit exceeded
 */
export async function generateHTML(
  prompt: string,
  model: string,
  provider: string
): Promise<string> {
  // Implementation
}
```

### README Updates

Keep README.md current with:
- Setup instructions
- Environment variables
- Available scripts
- Deployment procedures
- Contributing guidelines

### API Documentation

Maintain OpenAPI/Swagger specification:
```yaml
# api-docs.yaml
openapi: 3.0.0
info:
  title: DeepSite API
  version: 1.0.0
paths:
  /api/ask-ai:
    post:
      summary: Generate HTML from prompt
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                prompt:
                  type: string
                model:
                  type: string
```

This development workflow ensures consistent, maintainable, and scalable development practices for the DeepSite project.