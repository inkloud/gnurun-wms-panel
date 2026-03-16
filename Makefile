.PHONY: update clean codex build up down

update:
	python3 -m venv .venv
	rm -rf .venv/.gitignore
	./.venv/bin/pip3 install -r backend/requirements.txt
	./.venv/bin/pip3 freeze > backend/requirements-lock.txt
	cd frontend && npm install && npm run update
	rm frontend/package-lock.json

build:
	python3 -m venv .venv
	./.venv/bin/pip3 install -r backend/requirements-lock.txt
	cd frontend && npm install
	rm frontend/package-lock.json

clean:
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -delete
	rm -rf .venv/
	rm -rf frontend/node_modules/

codex:
	npm install @openai/codex --save-dev
	rm package.json package-lock.json
	npx codex

up:
	cd dev && . ./env.sh && docker compose up

down:
	cd dev && . ./env.sh && docker compose down -v
	docker image prune -a
