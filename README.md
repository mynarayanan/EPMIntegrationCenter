# Integration Centre

Enterprise data integration control plane for EPM, OLAP, cloud data warehouses, and hybrid enterprise systems.

## Architecture Overview
- **Control Plane (`apps/web`)**: Next.js (App Router), TypeScript, Tailwind CSS hosted on Vercel. Manages authentication, tenant governance, connector catalogue, connection configuration, mapping studio, and job orchestration triggers.
- **Persistence & Auth (`database/`)**: Supabase PostgreSQL with Row-Level Security (RLS) and Supabase Auth.
- **Execution Layer (`services/integration-worker`)**: Containerised Python runtime (introduced in later milestones) for long-running extraction jobs across Cloud (Oracle EPM, Anaplan, Snowflake, REST) and Hybrid/Private network sources (IBM TM1, Board, SFTP).

## Milestone 1 Setup & Deployment Guide
1. **Supabase Setup**:
   - Create a new Supabase project.
   - Open **SQL Editor** and execute `database/migrations/001_initial_schema.sql`.
   - Next, execute `database/seed/001_connectors.sql` to populate the 7 enterprise connector groups.
   - In **Authentication -> Providers -> Email**, ensure Email provider is enabled (optionally disable "Confirm email" during initial testing so you can sign in immediately after sign-up).
2. **Vercel Deployment**:
   - Push this repository to GitHub.
   - Import the repository into Vercel (leave Root Directory as `.` so `vercel.json` handles the monorepo build).
   - Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_APP_URL` in Vercel Environment Variables.
   - Deploy! Sign up on `/login` and your Enterprise Workspace tenant (`admin` role) will be automatically provisioned.
