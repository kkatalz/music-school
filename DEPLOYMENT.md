# Deployment

| Piece            | Runs on  | Notes                                            |
| ---------------- | -------- | ------------------------------------------------ |
| Postgres         | Supabase | project `music-school`, region `eu-central-1`     |
| NestJS API       | Render   | web service `music-school-api`, region Frankfurt  |
| React app (Vite) | Vercel   | static build, proxies `/api` to Render            |

The browser only ever talks to the Vercel domain. Vercel rewrites `/api/*` to the
Render service, so requests stay same-origin and no CORS is involved.

```
browser ──> Vercel (static + /api rewrite) ──> Render (NestJS) ──> Supabase (Postgres)
```

## Local development

Everything runs from the repo root:

```bash
cp .env.example .env     # then edit the values
docker compose up --build
```

- API: http://localhost:3000/api
- App: http://localhost:5173
- Postgres: `localhost:5400` (5432 inside the container)

`docker compose` reads `.env` from the directory containing `docker-compose.yml`,
which is why it lives at the repo root and not in `backend/`. The api service
builds `DATABASE_URL` from the `POSTGRES_*` values against the `db` service
hostname, so the two cannot drift apart.

Migrations run automatically when the api container starts. To seed demo data:

```bash
cd backend && npm run db:seed
```

That creates 4 teachers, 8 students, 6 subjects and 38 grades. Every account uses
the password `password123`:

| Role         | Email                            |
| ------------ | -------------------------------- |
| Head teacher | `head.teacher@music-school.test` |
| Teacher      | `andriy.melnyk@music-school.test`|
| Student      | `sofia.tkachenko@music-school.test` |

The seed truncates the four tables first, so it is safe to re-run.

## Supabase

The schema was created from the existing TypeORM migrations and their rows were
written into the `migrations` table, so `migration:run` against this database is
a no-op rather than an attempt to re-create everything.

Two things differ from a plain local Postgres:

- **RLS is enabled on every table with no policies.** Supabase exposes the
  `public` schema over PostgREST to anyone holding the anon key; without this,
  `teachers.password` would be publicly readable. The API is unaffected because
  it connects as a role with `BYPASSRLS`.
- **The API does not connect as the project superuser.** A dedicated
  `music_school_app` login role owns the connection, with DML grants on the
  existing tables plus `ALTER DEFAULT PRIVILEGES` so future migrations are
  covered too.

Connections go through the **session pooler** on port 5432
(`aws-0-eu-central-1.pooler.supabase.com`), not the direct `db.<ref>.supabase.co`
host, which is IPv6-only. The pooler username is `<role>.<project-ref>`.

## Render

Settings for the `music-school-api` web service:

| Setting        | Value                                                 |
| -------------- | ----------------------------------------------------- |
| Root Directory | `backend`                                             |
| Build Command  | `npm ci && npm run build`                             |
| Start Command  | `npm run migration:run:prod && npm run start:prod`     |
| Health Check   | `/api`                                                |

`migration:run:prod` uses the compiled `dist/ormconfig.js` and the `typeorm`
binary, so the production image needs no `ts-node` or devDependencies at runtime.

Render injects `PORT` itself; the app binds `0.0.0.0` so it is reachable from
outside the container. `render.yaml` in the repo root describes the same service
as a Blueprint.

On the free plan the service sleeps after ~15 minutes of inactivity, so the first
request after an idle period takes 30–60 seconds.

## Vercel

Import the repo and set **Root Directory** to `frontend-react`. The rest comes
from `frontend-react/vercel.json`: the Vite preset, `dist` as the output, the
`/api` rewrite to the Render host, and the SPA fallback to `index.html` for
client-side routes. Rewrites are evaluated after the filesystem check, so hashed
assets under `/assets` still serve normally.

If the Render URL ever changes, update the rewrite destination in
`frontend-react/vercel.json`.

## Environment variables

Set on Render; none of them are committed.

| Variable       | Purpose                                                       |
| -------------- | ------------------------------------------------------------- |
| `DATABASE_URL` | Supabase session-pooler connection string                      |
| `DATABASE_SSL` | `true` for managed Postgres; unset/`false` for local docker     |
| `JWT_SECRET`   | Signing key for auth tokens                                    |
| `NODE_VERSION` | `20`                                                           |

Local values live in the root `.env`, which is gitignored; `.env.example`
documents the shape.
