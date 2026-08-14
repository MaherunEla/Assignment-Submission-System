# Assignment Submission System

A role-based assignment submission and management system built with ASP.NET Core Web API and Next.js.

## Features

### Admin

- Dashboard
- Manage students
- Manage teachers
- Manage academic classes
- Manage subjects
- Manage teacher assignments
- Manage assignments
- Monitor submissions

### Teacher

- Dashboard
- View assigned classes and subjects
- Create and manage assignments
- View student submissions
- Grade submissions

### Student

- Dashboard
- View assignments
- Submit assignments
- Upload assignment files
- View submission status and grades

## Tech Stack

### Backend

- ASP.NET Core Web API
- C#
- Entity Framework Core
- PostgreSQL
- JWT Authentication

### Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod
- Axios

## Architecture

```text
Frontend
Next.js
   |
   | REST API
   ↓
ASP.NET Core Web API
   |
   ↓
Entity Framework Core
   |
   ↓
PostgreSQL
```
