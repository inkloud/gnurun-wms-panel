# GnuRun WMS Panel

GnuRun WMS Panel is a React + TypeScript admin interface for warehouse operations built on Vite and Bootstrap.

## Development

-   Install dependencies with `npm install`
-   Start the development server with `npm run dev`
-   Run linting with `npm run lint`
-   Build production assets with `npm run build`
-   Preview the production build with `npm run preview`

### Docker

-   Build the dev container with `docker build -t gnrwms-dev .`
-   Run the dev container with `docker run --rm -it -p 5173:5173 -v "$(pwd)":/app gnrwms-dev`
-   Start the dev environment with `docker compose up`
