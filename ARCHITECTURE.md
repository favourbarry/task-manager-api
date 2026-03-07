# Architecture Documentation

## Overview
This document outlines the architectural design of the Task Manager API, focusing on the layered architecture pattern and database migration strategy.

## Layered Architecture

### Architecture Pattern
The application follows a three-tier layered architecture:

```
Client Request
     ↓
Controller Layer (HTTP handling)
     ↓
Service Layer (Business logic)
     ↓
Model Layer (Data access)
     ↓
Database (PostgreSQL)
```

### Layer Responsibilities

#### 1. Controller Layer
**Location:** `src/controllers/`

**Responsibilities:**
- Handle HTTP requests and responses
- Validate request parameters and body
- Call appropriate service methods
- Format responses and handle HTTP status codes
- Error handling for HTTP context

**Example:**
```javascript
// taskController.js
const taskService = require('../services/taskService');

exports.createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

**Key Principles:**
- Controllers should NOT contain business logic
- Controllers should NOT directly access models or database
- Keep controllers thin - delegate to services

#### 2. Service Layer
**Location:** `src/services/`

**Responsibilities:**
- Implement business logic and rules
- Orchestrate operations across multiple models
- Handle transactions and complex operations
- Validate business rules
- Transform data between layers

**Example:**
```javascript
// taskService.js
const Task = require('../models/Task');

exports.createTask = async (taskData) => {
  // Business logic validation
  if (!taskData.title || taskData.title.trim().length === 0) {
    throw new Error('Task title is required');
  }
  
  // Data transformation
  const task = await Task.query().insert({
    title: taskData.title.trim(),
    completed: false,
    created_at: new Date()
  });
  
  return task;
};
```

**Key Principles:**
- Services contain all business logic
- Services are reusable across different controllers
- Services handle data validation and transformation
- Services manage database transactions

#### 3. Model Layer
**Location:** `src/models/`

**Responsibilities:**
- Define database schema mapping
- Provide query interface (using Objection.js)
- Define relationships between entities
- Basic data validation at database level

**Example:**
```javascript
// Task.js
const { Model } = require('objection');

class Task extends Model {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['title'],
      properties: {
        id: { type: 'integer' },
        title: { type: 'string', minLength: 1 },
        completed: { type: 'boolean' }
      }
    };
  }
}
```

**Key Principles:**
- Models represent database tables
- Models should not contain business logic
- Use ORM features for relationships and queries

## Database Migration Design

### Migration Strategy
The application uses **Knex.js** for database migrations, providing version control for database schema changes.

### Migration Structure

#### Configuration
**File:** `knexfile.js`

```javascript
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    migrations: {
      directory: './src/migrations'
    }
  }
};
```

#### Migration Files
**Location:** `src/migrations/`

**Naming Convention:** `YYYYMMDDHHMMSS_description.js`

**Example Migration:**
```javascript
// 20240115120000_create_tasks_table.js
exports.up = function(knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.boolean('completed').defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('tasks');
};
```

### Migration Best Practices

1. **Always provide rollback (down) functions**
   - Ensures migrations can be reversed
   - Critical for production deployments

2. **One logical change per migration**
   - Create table
   - Add column
   - Modify constraint

3. **Never modify existing migrations**
   - Once deployed, create new migration instead
   - Maintains migration history integrity

4. **Use transactions for complex migrations**
   ```javascript
   exports.up = async function(knex) {
     await knex.transaction(async (trx) => {
       await trx.schema.createTable('tasks', ...);
       await trx('tasks').insert(...);
     });
   };
   ```

### Migration Commands

```bash
# Run all pending migrations
npm run migrate

# Rollback last batch
npm run migrate:rollback

# Rollback all migrations
npm run migrate:rollback --all

# Create new migration
npm run migrate:make migration_name
```

## Data Flow Example

### Creating a Task

1. **Client Request**
   ```
   POST /api/tasks
   Body: { "title": "New Task" }
   ```

2. **Controller** (`taskController.js`)
   - Receives HTTP request
   - Extracts request body
   - Calls `taskService.createTask(req.body)`
   - Returns HTTP response

3. **Service** (`taskService.js`)
   - Validates business rules (title not empty)
   - Transforms data (trim whitespace)
   - Calls `Task.query().insert()`
   - Returns task object

4. **Model** (`Task.js`)
   - Maps to `tasks` table
   - Executes SQL INSERT
   - Returns created record

5. **Response Flow**
   ```
   Database → Model → Service → Controller → Client
   ```

## Benefits of This Architecture

### Separation of Concerns
- Each layer has a single, well-defined responsibility
- Changes in one layer don't affect others

### Testability
- Controllers can be tested with mocked services
- Services can be tested with mocked models
- Each layer tested independently

### Maintainability
- Business logic centralized in services
- Easy to locate and modify functionality
- Clear code organization

### Reusability
- Services can be used by multiple controllers
- Business logic not duplicated across endpoints

### Scalability
- Easy to add new features following established patterns
- Clear structure for team collaboration

## Directory Structure

```
src/
├── config/
│   └── knex.js           # Database configuration
├── controllers/
│   └── taskController.js # HTTP request handlers
├── services/
│   └── taskService.js    # Business logic
├── models/
│   ├── BaseModel.js      # Base model configuration
│   └── Task.js           # Task model
├── migrations/
│   └── YYYYMMDDHHMMSS_*.js # Database migrations
└── routes/
    └── taskRoutes.js     # Route definitions
```

## Future Enhancements

### Authentication Layer
- Add middleware between routes and controllers
- JWT token validation
- User context injection

### Validation Layer
- Request validation middleware (e.g., Joi, express-validator)
- Separate validation schemas from controllers 

### Repository Pattern
- Abstract data access further
- Add caching layer between service and model

### Event-Driven Architecture
- Emit events from services
- Decouple side effects from main business logic
