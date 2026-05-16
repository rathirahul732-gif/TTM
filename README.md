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

Create a `.env` file for local development (see `.env.example`). For production on Railway, set these environment variables in the Railway project settings:

- `DATABASE_URL` — PostgreSQL connection string (Railway provides this when you add a PostgreSQL plugin)
- `NEXTAUTH_SECRET` — a long random string
- `NEXTAUTH_URL` — your deployed site URL (e.g. `https://your-project.up.railway.app`)

## Deployment (Railway)

1. Push your `main` branch to GitHub (already done).
2. Go to Railway → New Project → Deploy from GitHub and select the `rathirahul732-gif/TTM` repo.
3. In Railway project settings, add environment variables listed above. Railway provides a `DATABASE_URL` when you add the PostgreSQL plugin — use that value.
4. In the Railway console, run database migrations once (via the Railway shell or build step):

```
npx prisma migrate deploy
```

5. The app's start command is `npm run start` and the `PORT` environment variable is used automatically by Railway. A `Procfile` is included.

If you prefer CI-based deploys, set up a GitHub Action or let Railway build from the `main` branch.

## API Endpoints

- POST /api/auth/signup - User registration
- POST /api/auth/[...nextauth] - Authentication
- GET/POST /api/projects - Project management
- GET/POST /api/tasks - Task management
