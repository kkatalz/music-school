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

Migrations run automatically when the api container starts, via the `command:`
in `docker-compose.yml` (not the Dockerfile). Because it is `&&`-chained, a
failed migration means the API does not start at all. To seed demo data:

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

! The seed truncates the four tables first, so it is safe to re-run.

## Supabase
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


* On the free plan the service sleeps after ~15 minutes of inactivity, so the first
request after an idle period takes 30–60 seconds.



### `VITE_PROXY_TARGET` (frontend, dev only)

`frontend-react/vite.config.ts` reads this to decide where the dev server
proxies `/api`. It is not read from `.env` and never reaches the browser.

| Context                   | Value                   | Set by               |
| ------------------------- | ----------------------- | -------------------- |
| `docker compose up`       | `http://api:3000`       | `docker-compose.yml` |
| `npm run dev` on the host | `http://localhost:3000` | default in `vite.config.ts` |

Both are covered already, so there is normally nothing to set by hand. It plays
no part in the production build, where `vercel.json` does the proxying.
