# GnuRun WMS Panel

GnuRun WMS Panel is a React + TypeScript admin interface for warehouse operations built on Vite and Bootstrap. It pairs with a FastAPI backend that lives in the `backend/` directory, while the repository root keeps orchestration files under `dev/docker-compose.yaml`.

## Project Structure

- `frontend/` – Vite + React source, tooling, and Dockerfile
- `backend/` – FastAPI service that exposes the WMS API

## Start with Docker

Run the stack from the repository root using inline environment variables:

```bash
export USER_ID=`id -u`
export GROUP_ID=`id -g`
```

Start the stack with Docker Compose in either mode:

```bash
cd dev
docker compose up
```

or

```bash
cd prod
docker compose up
```
The production stack expects an external Docker network named `public` to exist for
services that need ingress, alongside the `internal-life365-net` network.

## Development

You can use `Docker Compose` as described above.

### Frontend

From inside the `frontend/` directory:

- Install dependencies with `npm install`
- Start the development server with `npm run dev`

### Backend (FastAPI)

From the repository root:

- Create and activate a Python virtual environment for the API
- Install dependencies with `pip install -r backend/requirements.txt`
- Start the development server with `fastapi dev backend/api/app.py`

### Docker

From inside `frontend/`:

- Build the dev container with `docker build --build-arg USER_ID=$(id -u) --build-arg GROUP_ID=$(id -g) -t gnrwms-dev .`
- Run the dev container with `docker run --rm -it -p 5173:5173 -v "$(pwd)"/src:/app/src gnrwms-dev`

From the repository root:

- Build the backend container with `docker build -f backend/Dockerfile --build-arg USER_ID=$(id -u) --build-arg GROUP_ID=$(id -g) -t gnrwms-dev-backend .`
- Run the backend container with `docker run --rm -it -p 8003:8000 -v "$(pwd)"/backend:/app/backend gnrwms-dev-backend`
