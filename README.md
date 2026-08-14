# Assignment Submission System

A role-based web application for managing assignments, students, teachers, classes, subjects, and assignment submissions.

The system provides separate functionality for **Admin, Teacher, and Student** users.

---

## Features

### Admin

- Manage Students
- Manage Teachers
- Manage Academic Classes
- Manage Subjects
- Manage Teacher Assignments
- Manage Assignments
- View Student Submissions

### Teacher

- View Teacher Dashboard
- Create and manage assignments
- View student submissions
- Grade submissions with marks and feedback

### Student

- View student dashboard
- View assigned assignments
- Submit assignments
- Upload assignment files
- View submission status and grades

---

## Technology Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Query
- React Hook Form
- Zod
- Axios

### Backend

- ASP.NET Core Web API
- C#
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- Role-Based Authorization

---

## Project Structure

```text
Assignment-Submission-System/
│
├── backend/
│   └── AssignmentSubmissionSystem.API/
│       ├── Controllers/
│       ├── DTOs/
│       ├── Data/
│       ├── Models/
│       ├── Services/
│       ├── Interfaces/
│       ├── Migrations/
│       └── Program.cs
│
├── frontend/
│   └── assignmentsubmissionsystem.web/
│       ├── app/
│       ├── components/
│       ├── lib/
│       ├── types/
│       └── public/
│
└── README.md
```

Requirements

## Make sure the following are installed:

.NET 10 SDK
Node.js
npm
PostgreSQL
Database Setup

Create a PostgreSQL database, for example:

assignment_submission_db

Configure the database connection in the backend environment/configuration.

Run the EF Core migrations:

dotnet ef database update

The repository contains the migration files required to create the database schema.

Environment Configuration

Create the required environment files from the provided .env.example files.

Do not commit real passwords, API keys, JWT secrets, or other sensitive information.

Example frontend configuration:

NEXT_PUBLIC_API_URL=http://localhost:5000/api

Configure the backend PostgreSQL connection string and JWT settings according to the .env.example file.

Running the Backend

Navigate to the backend project:

cd backend/AssignmentSubmissionSystem.API

Restore dependencies:

dotnet restore

Run the API:

dotnet run

Swagger is available when running the application in the configured development environment.

Running the Frontend

Navigate to the frontend:

cd frontend/assignmentsubmissionsystem.web

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will run on:

```

http://localhost:3000

### Demo Credentials

## Admin
Email: admin@assignment.com
Password: Admin@123
## Teacher
Email: teacher@assignment.com
Password: Teacher@123
## Student
Email: student@assignment.com
Password: Student@123

Replace the placeholders with the actual demo credentials before submission.

Testing

Frontend production build:

npm run build

Backend build:

dotnet build

```

The main application flows were tested for authentication, role-based access, CRUD operations, assignment management, submission, and grading.

## Assumptions

Users access features according to their assigned role.
Teachers can manage assignments associated with them and grade their students' submissions.
Students can submit assignments assigned to their academic class.
PostgreSQL is used as the application database.

## Known Limitations

Some advanced features such as pagination, notifications, and Docker configuration are not included.
File storage depends on the configured application environment.
The application is primarily designed for local development and evaluation.
Repository

The complete source code for the frontend, backend, database migrations, and configuration examples is included in this repository.

```

```
