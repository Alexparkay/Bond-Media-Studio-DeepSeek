# Component Documentation

## Core Components

### AppEditor (`components/editor/index.tsx`)

The main editor component that orchestrates the entire coding experience.

**Key Features:**
- Split-pane layout with resizable panels
- Monaco code editor integration
- Live HTML preview
- AI chat interface
- Device-responsive preview modes
- HTML history management

**Props:**
```typescript
interface AppEditorProps {
  project?: Project | null; // Optional project data for editing existing projects
}
```

**State Management:**
- `html`: Current HTML content
- `htmlHistory`: Array of previous HTML versions
- `prompts`: Array of user prompts
- `currentTab`: Active tab (chat/preview)
- `device`: Preview device type (desktop/mobile)
- `isAiWorking`: AI generation status
- `selectedElement`: Currently selected HTML element

**Layout System:**
- Responsive design with Tailwind breakpoints
- Desktop: 1/3 editor, 2/3 preview split
- Mobile: Stacked layout with tab switching
- Draggable resizer for desktop

**File Reference:** `components/editor/index.tsx:30-342`

### AskAI (`components/editor/ask-ai/index.tsx`)

The natural language interface for AI code generation and modification.

**Key Features:**
- Text input for natural language prompts
- Streaming AI responses with real-time updates
- Provider and model selection
- Element-specific editing mode
- Diff-patch update system
- Thinking process visualization (for reasoning models)

**Props:**
```typescript
interface AskAIProps {
  html: string;
  setHtml: (html: string) => void;
  isAiWorking: boolean;
  setisAiWorking: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: (html: string, prompt: string, updatedLines?: number[][]) => void;
  onNewPrompt: (prompt: string) => void;
  selectedElement?: HTMLElement | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  isEditableModeEnabled: boolean;
  setIsEditableModeEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}
```

**AI Integration Methods:**
1. **Initial Generation** (`POST /api/ask-ai`): Complete HTML creation
2. **Follow-up Edits** (`PUT /api/ask-ai`): Targeted modifications

**File Reference:** `components/editor/ask-ai/index.tsx:26-471`

### Preview (`components/editor/preview/index.tsx`)

Live HTML preview component with interactive element selection.

**Key Features:**
- Real-time HTML rendering in iframe
- Device simulation (desktop/mobile)
- Element selection for targeted editing
- Click-to-edit functionality
- Loading states during AI generation

**State Synchronization:**
- Renders HTML from editor state
- Updates iframe content on HTML changes
- Handles element selection events

### Settings (`components/editor/ask-ai/settings.tsx`)

AI provider and model configuration interface.

**Features:**
- Provider selection dropdown
- Model compatibility validation
- Error handling and user feedback
- Local storage persistence

**Provider Validation:**
```typescript
// Validates model-provider compatibility
if (!selectedModel.providers.includes(provider)) {
  // Show error and prompt provider change
}
```

## UI Components (`components/ui/`)

### Button (`components/ui/button.tsx`)
Base button component with multiple variants and sizes.

**Variants:**
- `default`: Primary button style
- `outline`: Outlined button
- `ghost`: Transparent button
- `destructive`: Error/danger actions

**Sizes:**
- `default`: Standard size
- `sm`: Small button
- `lg`: Large button
- `xs`: Extra small
- `iconXs`: Icon-only extra small

### Dialog (`components/ui/dialog.tsx`)
Modal dialog component for overlays and popups.

**Usage Examples:**
- Login modal
- Pro upgrade modal
- Provider selection modal

### Tabs (`components/ui/tabs.tsx`)
Tab navigation component for switching between views.

**Implementation:**
- Chat/Preview tab switching in mobile layout
- History navigation

## Context Components

### AppContext (`components/contexts/app-context.tsx`)

Global application state management.

**Provides:**
- User authentication state
- Global configuration
- Shared application data

**Usage:**
```typescript
const { user, isAuthenticated } = useContext(AppContext);
```

### UserContext (`components/contexts/user-context.tsx`)

User-specific state and preferences.

**Manages:**
- User profile data
- Preferences and settings
- Authentication status

## Specialized Components

### LoadProject (`components/my-projects/load-project.tsx`)

Project loading interface for existing projects.

**Features:**
- Project selection from user's projects
- Project metadata display
- Loading state management

### DeployButton (`components/editor/deploy-button/index.tsx`)

Handles project deployment to Hugging Face Spaces.

**Functionality:**
- Creates new Hugging Face Space
- Uploads HTML content
- Manages deployment status

### SaveButton (`components/editor/save-button/index.tsx`)

Saves project changes to database.

**Features:**
- Auto-save functionality
- Change detection
- Save status indicators

## Hook Components

### useEditor (`hooks/useEditor.ts`)

Custom hook for editor state management.

**Returns:**
```typescript
{
  html: string;
  setHtml: (html: string) => void;
  htmlHistory: HtmlHistory[];
  setHtmlHistory: (history: HtmlHistory[]) => void;
  prompts: string[];
  setPrompts: (prompts: string[]) => void;
}
```

**File Reference:** `hooks/useEditor.ts:4-30`

### useUser (`hooks/useUser.ts`)

User authentication and data management hook.

**Features:**
- User data fetching
- Authentication state
- User preferences

## Component Interaction Patterns

### Parent-Child Communication
```typescript
// Parent passes callbacks to child components
<AskAI
  onSuccess={(html, prompt) => {
    // Update history and navigate
    setHtmlHistory([...history, { html, prompt, createdAt: new Date() }]);
  }}
  onNewPrompt={(prompt) => {
    // Track user prompts
    setPrompts(prev => [...prev, prompt]);
  }}
/>
```

### State Lifting
- HTML content managed at AppEditor level
- Passed down to child components as props
- Modified through callback functions

### Event Handling
- Element selection in Preview component
- Propagated to AskAI component for targeted editing
- Cross-component state synchronization

## Styling Patterns

### Tailwind CSS Classes
```typescript
// Conditional styling with classNames utility
className={classNames(
  "base-classes",
  {
    "conditional-class": condition,
    "!important-override": importantCondition
  }
)}
```

### Responsive Design
- Mobile-first approach
- Breakpoint-specific layouts
- Device-aware component behavior

## Performance Optimizations

### Memoization
- useMemo for expensive calculations
- useCallback for stable function references
- React.memo for component optimization

### Lazy Loading
- Dynamic imports for large components
- Code splitting at route level
- Conditional component rendering

### Debouncing
- Input field updates
- API call throttling
- UI update batching