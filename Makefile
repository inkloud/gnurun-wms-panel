.PHONY: update clean codex build up down clean-all ensure-networks networks-clean

ensure-networks:
	docker network inspect public >/dev/null 2>&1 || docker network create public
	docker network inspect internal-life365-net >/dev/null 2>&1 || docker network create --internal internal-life365-net

update:
	python3 -m venv .venv
	rm -rf .venv/.gitignore
	./.venv/bin/pip3 install -r backend/requirements.txt
	./.venv/bin/pip3 freeze > backend/requirements-lock.txt
	cd frontend && npm install && npm run update
	rm frontend/package-lock.json

build:
	python3 -m venv .venv
	rm -rf .venv/.gitignore
	./.venv/bin/pip3 install -r backend/requirements-lock.txt
	cd frontend && npm install
	rm frontend/package-lock.json

clean:
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -delete

clean-all:
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -delete
	rm -rf .venv
	rm -rf frontend/node_modules
	rm -rf node_modules
	rm -rf .codex

codex:
	npm install @openai/codex --save-dev
	rm package.json package-lock.json
	npx codex

up: ensure-networks
	cd dev && . ./env.sh && docker compose up

down:
	cd dev && . ./env.sh && docker compose down -v
	docker image prune -a

networks-clean:
	if docker network inspect public >/dev/null 2>&1; then docker network rm public; fi
	if docker network inspect internal-life365-net >/dev/null 2>&1; then docker network rm internal-life365-net; fi
