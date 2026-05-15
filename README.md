# Team Task Manager

A full-stack web application for managing team projects and tasks with role-based access control.

## Features

- User authentication (Signup/Login)
- Project creation and management
- Task creation, assignment, and status tracking
- Dashboard with task overview and overdue alerts
- Role-based access (Admin/Member)

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Next.js API Routes
- Database: PostgreSQL (SQLite for dev)
- Authentication: NextAuth.js
- ORM: Prisma

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up the database: `npx prisma migrate dev`
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env` file with:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Deployment

Deploy to Railway:

1. Connect your GitHub repo to Railway
2. Set environment variables in Railway
3. Change DATABASE_URL to Railway PostgreSQL URL
4. Run `npx prisma migrate deploy` for production

## API Endpoints

- POST /api/auth/signup - User registration
- POST /api/auth/[...nextauth] - Authentication
- GET/POST /api/projects - Project management
- GET/POST /api/tasks - Task management
