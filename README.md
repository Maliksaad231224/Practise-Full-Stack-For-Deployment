# Fullstack React + FastAPI + Postgres

A minimal starter app with a React frontend, FastAPI backend, and PostgreSQL database.

## Structure

- `frontend/` - Vite React app
- `backend/` - FastAPI API
- `database/schema.sql` - Postgres schema
- `frontend/.env` - Frontend-only runtime config
- `backend/.env` - Backend-only runtime config
- `frontend/.env.example` and `backend/.env.example` - Example env files

## Local setup

1. Copy the example env files if you need a fresh local setup:

```bash
copy frontend\.env.example frontend\.env
copy backend\.env.example backend\.env
```

1. Start PostgreSQL (local)

Use a local PostgreSQL server or a managed Postgres instance. The steps below describe a straightforward local setup and verification flow. Adjust commands for your OS or Postgres installation. If you use a managed DB, set `DATABASE_URL` in `backend/.env` to the provider's connection string and skip local DB creation.

Prerequisites:

- PostgreSQL installed and running.
- `psql` CLI available on your PATH, or a GUI client (pgAdmin, DBeaver, TablePlus, etc.).

Step A — Create a database user and a database

Replace `todo_user`, `your_password`, and `todo_app` with values you prefer.

On macOS/Linux (or WSL) using shell commands:

```bash
# create a user (you will be prompted for a password)
createuser -P todo_user

# create the database owned by that user
createdb -O todo_user todo_app
```

On Windows with `psql` (connect first as the `postgres` superuser):

```sql
CREATE ROLE todo_user WITH LOGIN PASSWORD 'your_password';
CREATE DATABASE todo_app OWNER todo_user;
```

Step B — Apply the provided schema

Run the SQL script included in this repo to create tables and indexes:

```bash
psql -U todo_user -d todo_app -f database/schema.sql
```

If your Postgres server requires a host or port, add `-h host -p port` to the `psql` command or set `PGHOST`/`PGPORT` environment variables accordingly.

Step C — Configure `backend/.env`

Create `backend/.env` (or copy `backend/.env.example`) and set `DATABASE_URL` to a SQLAlchemy-compatible connection string. Example:

```env
DATABASE_URL=postgresql+psycopg://todo_user:your_password@localhost:5432/todo_app
CORS_ORIGINS=http://localhost:5173
```

Step D — Start the backend and verify connectivity

From the `backend/` folder, install dependencies and start the dev server. Then verify the health endpoint returns OK:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload

# in another terminal, verify
curl http://localhost:8000/health
# expected output: { "status": "ok" }
```

Troubleshooting tips:

- If you get connection errors from SQLAlchemy, check `DATABASE_URL` for typos and ensure Postgres is listening on the configured host/port.
- Test connectivity with `psql -h host -U todo_user -d todo_app` from the same machine that will run the backend.
- Check Postgres logs for authentication or permission issues.

1. Start the backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

1. Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend reads `frontend/.env`, and the backend reads `backend/.env`. The frontend expects the API at `VITE_API_BASE_URL`, defaulting to `http://localhost:8000`.

## Deployment

### Frontend

Build the React app before deployment so the production host can serve the generated static files from `frontend/dist`.

Deploy that output to a static hosting service such as Netlify, Vercel, GitHub Pages, or an Nginx-based container.

Set the frontend API base URL during the build or hosting configuration so the deployed app points to the public backend address through `VITE_API_BASE_URL`.

### Backend

Run the FastAPI application behind a production ASGI server or a managed container platform such as Render, Railway, Fly.io, or Azure App Service.

Make sure the backend runtime receives the same values as `backend/.env`, especially:

- `DATABASE_URL`
- `CORS_ORIGINS`

Expose the service on the public network interface used by your platform and configure the port through the platform’s environment or service settings.

### PostgreSQL

Use a managed PostgreSQL service in production, update `DATABASE_URL` to the managed connection string, and apply `database/schema.sql` to the target database before the first release.

### Notes

This repository no longer includes Docker orchestration. The project is structured for local development using a standalone Postgres server or a managed database. Use the service-specific `.env` files in `frontend/` and `backend/` to configure runtime values.

## Environment files

Both services use simple `.env` files placed inside their service folders. Copy the example files and update the values for your environment. Never commit real credentials to source control.

Frontend (`frontend/.env`)

- Purpose: provide values to Vite at build and runtime. Variables intended for browser exposure must be prefixed with `VITE_`.
- Required example variables:

```env
VITE_API_BASE_URL=http://localhost:8000
```

How to create from the example:

```bash
copy frontend\.env.example frontend\.env
# (or on macOS/Linux)
cp frontend/.env.example frontend/.env
```

Backend (`backend/.env`)

- Purpose: database connection, CORS origins, and other server-only secrets.
- Required example variables:

```env
DATABASE_URL=postgresql+psycopg://todo_user:your_password@localhost:5432/todo_app
CORS_ORIGINS=http://localhost:5173
```

How to create from the example:

```bash
copy backend\.env.example backend\.env
# (or on macOS/Linux)
cp backend/.env.example backend/.env
```

Best practices

- Keep secrets out of the frontend. Anything prefixed with `VITE_` is embedded into the built bundle and should not contain sensitive data.
- Use environment variables provided by your hosting platform for production rather than committing `.env` files.
- Validate your `DATABASE_URL` format if you encounter connection issues.
