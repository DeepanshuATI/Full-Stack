# Backend API Integration Guide

This document explains how to integrate your backend API with the frontend.

## API Endpoints Required

### Authentication

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "user" // or "admin" based on credentials in database
  },
  "token": "jwt_token_string"
}
```

#### POST `/api/auth/login`
Login with existing credentials (email or username).

**Request Body:**
```json
{
  "identifier": "string (email or username)",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "user" // or "admin" if credentials match admin account
  },
  "token": "jwt_token_string"
}
```

**Note:** The backend should check if the credentials match the admin account stored in your database and set `role: "admin"` accordingly.

#### POST `/api/auth/forgot-password`
Request password reset link.

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

---

### Problems

#### GET `/api/problems`
Get all problems with optional filters.

**Query Parameters:**
- `difficulty` (optional): "easy", "medium", or "hard"
- `search` (optional): Search term for problem title

**Response:**
```json
{
  "success": true,
  "problems": [
    {
      "id": "number",
      "title": "string",
      "difficulty": "Easy|Medium|Hard",
      "acceptance": "number (percentage)"
    }
  ]
}
```

#### GET `/api/problems/:id`
Get detailed information about a specific problem.

**Response:**
```json
{
  "success": true,
  "problem": {
    "id": "number",
    "title": "string",
    "difficulty": "Easy|Medium|Hard",
    "description": "string",
    "examples": [
      {
        "input": "string",
        "output": "string",
        "explanation": "string (optional)"
      }
    ],
    "constraints": ["string"],
    "starterCode": {
      "javascript": "string",
      "python": "string",
      "java": "string",
      "cpp": "string",
      "c": "string",
      "csharp": "string",
      "go": "string",
      "rust": "string",
      "typescript": "string",
      "php": "string",
      "ruby": "string",
      "swift": "string",
      "kotlin": "string"
    }
  }
}
```

#### POST `/api/problems` (Admin only)
Create a new problem.

**Request Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "string",
  "difficulty": "Easy|Medium|Hard",
  "description": "string",
  "examples": "string (JSON format)",
  "constraints": "string (newline separated)",
  "starterCode": "string",
  "testCases": "string"
}
```

**Response:**
```json
{
  "success": true,
  "problem": {
    "id": "number",
    "title": "string",
    ...
  }
}
```

#### PUT `/api/problems/:id` (Admin only)
Update an existing problem.

**Request Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:** Same as POST `/api/problems`

**Response:**
```json
{
  "success": true,
  "problem": { ... }
}
```

#### DELETE `/api/problems/:id` (Admin only)
Delete a problem.

**Request Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Problem deleted successfully"
}
```

---

### Code Compilation

#### POST `/api/compile`
Execute code and run test cases.

**Request Headers:**
```
Authorization: Bearer <user_token>
```

**Request Body:**
```json
{
  "code": "string (user's code)",
  "language": "javascript|python|java|cpp|c|csharp|go|rust|typescript|php|ruby|swift|kotlin",
  "problemId": "number"
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "passed": "number",
    "total": "number",
    "cases": [
      {
        "input": "string",
        "expected": "string",
        "actual": "string",
        "passed": "boolean"
      }
    ]
  }
}
```

---

## Supported Languages

The frontend supports the following programming languages:

1. JavaScript
2. Python
3. Java
4. C++
5. C
6. C#
7. Go
8. Rust
9. TypeScript
10. PHP
11. Ruby
12. Swift
13. Kotlin

Your backend compiler should handle all these languages. The language identifier is sent in the `language` field of the compile request.

---

## Authentication Flow

1. User registers or logs in
2. Backend validates credentials
3. If credentials match admin account in database, backend returns `role: "admin"`
4. Frontend stores user data and JWT token in localStorage
5. All subsequent API requests include the JWT token in Authorization header
6. Admin users can access `/admin` route and perform CRUD operations on problems

---

## Integration Steps

1. Update `frontend/vite.config.js` if your backend runs on a different port:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:YOUR_BACKEND_PORT',
      changeOrigin: true
    }
  }
}
```

2. Import and use the API utilities in components:
```javascript
import { authAPI, problemAPI, compilerAPI } from '../utils/api'

// Example: Login
const response = await authAPI.login({ username, password })
login(response.data.user)
localStorage.setItem('token', response.data.token)
```

3. Replace mock data calls in:
   - `AuthModal.jsx` - Authentication
   - `Dashboard.jsx` - Fetch problems
   - `ProblemPage.jsx` - Fetch problem details and compile code
   - `AdminDashboard.jsx` - CRUD operations

---

## Error Handling

All API responses should follow this format for errors:

```json
{
  "success": false,
  "error": "Error message string"
}
```

The frontend will handle these errors and display appropriate messages to users.
