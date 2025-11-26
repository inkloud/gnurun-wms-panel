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

## Development

You can use `Docker Compose` as described above.

### Frontend

From inside the `frontend/` directory:

- Install dependencies with `npm install`
- Start the development server with `npm run dev`

### Backend (FastAPI)

From inside the `backend/` directory (once the service scaffold is in place):

- Create and activate a Python virtual environment for the API
- Install dependencies with `pip install -r requirements.txt`
- Start the development server with `fastapi dev main.py`

### Docker

From inside `frontend/`:

- Build the dev container with `docker build --build-arg USER_ID=$(id -u) --build-arg GROUP_ID=$(id -g) -t gnrwms-dev .`
- Run the dev container with `docker run --rm -it -p 5173:5173 -v "$(pwd)"/src:/app/src gnrwms-dev`

From inside `backend/`:

- Build the backend container with `docker build --build-arg USER_ID=$(id -u) --build-arg GROUP_ID=$(id -g) -t gnrwms-dev-backend .`
- Run the backend container with `docker run --rm -it -p 8000:8000 -v "$(pwd)"/:/app/ gnrwms-dev-backend`
