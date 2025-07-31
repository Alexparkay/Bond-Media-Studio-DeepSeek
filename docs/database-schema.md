# Database Schema Documentation

## Overview

DeepSite uses MongoDB as its primary database with Mongoose ODM for schema definition and data modeling. The database stores user projects, HTML content, and associated metadata.

## Connection Configuration

### Database Connection (`lib/mongodb.ts`)
```typescript
import mongoose from "mongoose";

// MongoDB connection with caching for serverless environments
const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
```

## Models

### Project Model (`models/Project.ts`)

The primary data model for storing user projects and their HTML content.

```typescript
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  space_id: {
    type: String,
    required: true,
    description: "Unique identifier for the project space (e.g., 'username/project-name')"
  },
  user_id: {
    type: String,
    required: true,
    description: "ID of the user who owns this project"
  },
  prompts: {
    type: [String],
    default: [],
    description: "Array of prompts used to generate/modify the HTML content"
  },
  _createdAt: {
    type: Date,
    default: Date.now,
    description: "Timestamp when the project was created"
  },
  _updatedAt: {
    type: Date,
    default: Date.now,
    description: "Timestamp when the project was last updated"
  }
});

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
```

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `space_id` | String | Yes | Unique project identifier, typically `username/project-name` format |
| `user_id` | String | Yes | References the user who owns this project |
| `prompts` | Array<String> | No | Sequential list of user prompts used to create/modify the project |
| `_createdAt` | Date | No | Auto-generated creation timestamp |
| `_updatedAt` | Date | No | Auto-generated last modification timestamp |

#### Indexes

**Recommended Indexes:**
```javascript
// Compound index for efficient user project queries
db.projects.createIndex({ "user_id": 1, "_createdAt": -1 })

// Unique index for space_id to prevent duplicates
db.projects.createIndex({ "space_id": 1 }, { unique: true })

// Index for efficient space_id lookups
db.projects.createIndex({ "space_id": 1 })
```

### HTML Content Storage

**Note:** The HTML content is not stored directly in the Project model. Instead, it's managed through the Hugging Face Spaces integration:

1. **Development/Editing**: HTML is stored in browser localStorage and component state
2. **Persistence**: HTML is saved to Hugging Face Spaces repository
3. **Retrieval**: HTML is fetched from Hugging Face Spaces API

## Data Access Patterns

### Project Creation
```typescript
// Create new project
const project = new Project({
  space_id: `${username}/${projectName}`,
  user_id: userId,
  prompts: [initialPrompt]
});

await project.save();
```

### Project Retrieval
```typescript
// Get user's projects
const projects = await Project.find({ user_id: userId })
  .sort({ _createdAt: -1 })
  .limit(50);

// Get specific project
const project = await Project.findOne({ space_id: spaceId });
```

### Project Updates
```typescript
// Update project with new prompt
await Project.findOneAndUpdate(
  { space_id: spaceId },
  { 
    $push: { prompts: newPrompt },
    _updatedAt: new Date()
  }
);
```

## TypeScript Types

### Project Interface (`types/index.ts`)
```typescript
export interface Project {
  _id: string;
  space_id: string;
  user_id: string;
  prompts: string[];
  html?: string; // Retrieved from Hugging Face Spaces
  _createdAt: Date;
  _updatedAt: Date;
}

export interface HtmlHistory {
  html: string;
  createdAt: Date;
  prompt: string;
}
```

## API Integration

### Database Operations in API Routes

#### GET `/api/me/projects`
```typescript
export async function GET(request: NextRequest) {
  await dbConnect();
  
  const projects = await Project.find({ user_id: userId })
    .sort({ _createdAt: -1 })
    .select('space_id prompts _createdAt _updatedAt');
    
  return NextResponse.json({ projects });
}
```

#### POST `/api/me/projects`
```typescript
export async function POST(request: NextRequest) {
  await dbConnect();
  
  const project = new Project({
    space_id: generateSpaceId(),
    user_id: userId,
    prompts: [prompt]
  });
  
  await project.save();
  return NextResponse.json({ project });
}
```

## Data Migration Scripts

### Project Schema Updates
```javascript
// Add new field to existing documents
db.projects.updateMany(
  { version: { $exists: false } },
  { $set: { version: "1.0" } }
);

// Rename field
db.projects.updateMany(
  {},
  { $rename: { "old_field": "new_field" } }
);
```

### Data Cleanup
```javascript
// Remove projects without user_id
db.projects.deleteMany({ user_id: { $exists: false } });

// Update timestamp format
db.projects.updateMany(
  { _createdAt: { $type: "string" } },
  [{ $set: { _createdAt: { $dateFromString: { dateString: "$_createdAt" } } } }]
);
```

## Performance Considerations

### Query Optimization
- Use projection to limit returned fields
- Implement pagination for large result sets
- Create appropriate indexes for common queries

### Connection Management
- Connection pooling for high-traffic scenarios
- Proper connection cleanup in serverless environments
- Cached connections to reduce overhead

### Data Volume Management
- Archive old projects to separate collection
- Implement soft deletion for user data
- Regular cleanup of orphaned records

## Backup and Recovery

### Backup Strategy
```bash
# MongoDB dump for entire database
mongodump --uri="mongodb://connection-string" --out=backup/

# Specific collection backup
mongodump --uri="mongodb://connection-string" --collection=projects --out=backup/
```

### Restore Procedures
```bash
# Restore entire database
mongorestore --uri="mongodb://connection-string" backup/

# Restore specific collection
mongorestore --uri="mongodb://connection-string" --collection=projects backup/database/projects.bson
```

## Security Considerations

### Data Protection
- User data isolation through user_id filtering
- Input validation and sanitization
- Rate limiting to prevent abuse

### Access Control
- Authentication required for all project operations
- User can only access their own projects
- API-level authorization checks

### Data Retention
- Implement data retention policies
- Provide user data export functionality
- Support for user account deletion

## Future Schema Enhancements

### Potential Additions
```typescript
// Enhanced Project schema
const ProjectSchemaV2 = new mongoose.Schema({
  // Existing fields...
  
  // New fields
  title: { type: String, default: "Untitled Project" },
  description: { type: String },
  tags: [String],
  is_public: { type: Boolean, default: false },
  fork_count: { type: Number, default: 0 },
  star_count: { type: Number, default: 0 },
  template_category: { type: String },
  last_accessed: { type: Date },
  deployment_status: {
    type: String,
    enum: ['draft', 'deploying', 'deployed', 'failed'],
    default: 'draft'
  }
});
```

### Collections to Consider
- **Users**: User profiles and preferences
- **Templates**: Reusable project templates
- **Analytics**: Usage statistics and metrics
- **Collaborations**: Shared project access
- **Comments**: Project feedback and discussions