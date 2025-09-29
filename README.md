# GnuRun WMS Panel

GnuRun WMS Panel is a React + TypeScript admin interface for warehouse operations built on Vite and Bootstrap. The application code now lives in the `frontend/` directory so the repository root only carries orchestration files like `docker-compose.yaml`.

## Project Structure

-   `frontend/` – Vite + React source, tooling, and Dockerfile
-   `docker-compose.yaml` – Compose definition for the Vite dev server

## Development

From inside the `frontend/` directory:

-   Install dependencies with `npm install`
-   Start the development server with `npm run dev`
-   Run linting with `npm run lint`
-   Build production assets with `npm run build`
-   Preview the production build with `npm run preview`

### Docker

From inside `frontend/`:

-   Build the dev container with `docker build -t gnrwms-dev .`
-   Run the dev container with `docker run --rm -it -p 5173:5173 -v "$(pwd)"/src:/app/src gnrwms-dev`

From the repository root:

-   Export your host IDs so the dev container runs as your user: `export LOCAL_UID=$(id -u)` and `export LOCAL_GID=$(id -g)` (or add those values to a `.env` file)
-   Start the dev environment with `docker compose up`
