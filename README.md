# SolarQuote

Branded solar quotes for installers — built with Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Prisma, and Supabase (Auth, Postgres, Storage).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Connecting Supabase (required for auth/database features)

The app runs with placeholder env values out of the box so UI-only work isn't blocked, but auth, quotes, customers, and products need a real Supabase project.

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Copy `.env.local.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` — from **Project Settings → API**.
   - `DATABASE_URL` (pooled, port 6543) and `DIRECT_URL` (direct, port 5432) — from **Project Settings → Database → Connection string**. Keep `?pgbouncer=true` on `DATABASE_URL`.
3. Run the migration — this also creates the public `logos` Storage bucket and its access policies, so there's no separate manual Storage setup:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```
4. In **Authentication → URL Configuration**, set the Site URL to `http://localhost:3000` (and your real domain later) so password-reset links redirect correctly.

## Tech stack

Next.js 15+ App Router, TypeScript, Tailwind CSS v4, shadcn/ui (`base-nova`), Prisma ORM with the `@prisma/adapter-pg` driver adapter, Supabase (Auth/Postgres/Storage), React Hook Form + Zod, `@react-pdf/renderer`, React Email, date-fns.

## Project structure

- `app/` — routes only; pages stay thin and delegate to `features/*` and `actions/*`.
- `components/` — shadcn primitives + shared chrome (sidebar, nav, status pill, empty states).
- `features/<domain>/` — domain UI grouped by area (marketing, auth, onboarding, dashboard, quotes, customers, products).
- `actions/<domain>.ts` — `"use server"` entry points: validate input, call `services/`, revalidate.
- `services/<domain>.ts` — business logic + Prisma queries, framework-agnostic.
- `lib/` — infra clients (Supabase browser/server/admin, Prisma, PDF templates).
- `lib/validations/` — Zod schemas shared by forms and server actions.
- `utils/` — pure helpers (currency/date formatting, initials).
- `prisma/` — schema and migrations.
