# SMAUP

SMAUP is a B2B social media agency management platform for coordinating agencies, clients, employees, content production, and operational workflows.

The project is currently in an early MVP phase. The active product surface is focused on the agency dashboard, authentication, agency-level data access, and task creation workflows.

## Technology

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase Authentication and Storage
- PostgreSQL with Prisma ORM

## Current Capabilities

- Agency owner registration and login
- Role-aware dashboard access
- Agency dashboard metrics and activity summaries
- Brand and employee data integration
- Task creation with platform, content type, due date, and assignee
- Agency-level tenant validation for dashboard actions
- Profile management and avatar upload

## Project Structure

```text
app/
  actions/              Server Actions
  (dashboard)/          Dashboard routes and views
  login/                Authentication UI
  register/             Registration UI
components/             Shared application components
lib/                    Authentication, Supabase, and Prisma utilities
prisma/                 Prisma schema
supabase/               Database reference schema
public/                 Static assets
```

## Requirements

- Node.js 20 or later
- A Supabase project
- PostgreSQL connection details

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example` and provide:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
```

Validate the Prisma schema:

```bash
npx prisma validate
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Quality Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Development Direction

The next development priorities are:

1. Strengthen centralized authentication and authorization.
2. Preserve agency-level tenant isolation across all mutations and queries.
3. Complete validation, error handling, and session lifecycle management.
4. Add automated tests for authentication, task creation, and tenant boundaries.
5. Expand the platform with client, employee, content, notification, and administration modules.

## License

This project is distributed under the terms defined in the `LICENSE` file.
