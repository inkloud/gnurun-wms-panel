# GnuRun WMS Panel

GnuRun WMS Panel is a React + TypeScript admin interface for warehouse operations built on Vite and Bootstrap. It pairs with a FastAPI backend that lives in the `backend/` directory, while the repository root keeps orchestration files such as `docker-compose.yaml`.

## Project Structure

- `frontend/` – Vite + React source, tooling, and Dockerfile
- `backend/` – FastAPI service that exposes the WMS API
- `docker-compose.yaml` – Compose definition for the development services

## Development

### Frontend

From inside the `frontend/` directory:

- Install dependencies with `npm install`
- Start the development server with `npm run dev`
- Run linting with `npm run lint`
- Build production assets with `npm run build`
- Preview the production build with `npm run preview`

### Backend (FastAPI)

From inside the `backend/` directory (once the service scaffold is in place):

- Create and activate a Python virtual environment for the API
- Install dependencies (for example, `pip install -r requirements.txt`)
- Start the development server with `fastapi dev main.py` (adjust the module path as the project evolves)
- Keep backend configuration in `.env` or `.env.local` files rather than committing secrets

### Docker

From inside `frontend/`:

- Build the dev container with `docker build --build-arg USER_ID=$(id -u) --build-arg GROUP_ID=$(id -g) -t gnrwms-dev .`
- Run the dev container with `docker run --rm -it -p 5173:5173 -v "$(pwd)"/src:/app/src gnrwms-dev`

From inside `backend/`:

- Build the backend container with `docker build --build-arg USER_ID=$(id -u) --build-arg GROUP_ID=$(id -g) -t gnrwms-dev-backend .`
- Run the backend container with `docker run --rm -it -p 8000:8000 -v "$(pwd)"/:/app/ gnrwms-dev-backend`

From the repository root:

- Export your host IDs so the dev container runs as your user: `export USER_ID=$(id -u)` and `export GROUP_ID=$(id -g)` (or add those values to a `.env` file).
- With the IDs exported or provided inline, run `docker compose up` to bring up the frontend and, once defined, the FastAPI backend

### Starting the Docker Compose Cluster

Run the stack from the repository root using inline environment variables:

```bash
export USER_ID=`id -u`
export GROUP_ID=`id -g`
```

```bash
docker compose up
```

Repeat the same command whenever you need to restart the services:

```bash
docker compose up
```
