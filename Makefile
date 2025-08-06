# Development commands
.PHONY: dev
dev:
	docker-compose -f docker-compose.dev.yml up --build

.PHONY: dev-stop
dev-stop:
	docker-compose -f docker-compose.dev.yml down

# Production commands
.PHONY: prod
prod:
	docker-compose up --build

.PHONY: prod-stop
prod-stop:
	docker-compose down

# Code quality
.PHONY: lint
lint:
	cd cur8t-web && pnpm lint

.PHONY: format
format:
	cd cur8t-web && pnpm format

.PHONY: check
check: lint format

# Testing
.PHONY: test
test:
	cd cur8t-web && pnpm test

# Utility commands
.PHONY: clean
clean:
	docker system prune -f
	docker volume prune -f

.PHONY: install
install:
	cd cur8t-web && pnpm install
	cd agents-api && pip install -r requirements.txt
	cd extension-api && pip install -r requirements.txt

# Help
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make dev        - Start development environment"
	@echo "  make dev-stop   - Stop development environment"
	@echo "  make prod       - Start production environment"
	@echo "  make prod-stop  - Stop production environment"
	@echo "  make lint       - Run ESLint"
	@echo "  make format     - Run Prettier"
	@echo "  make check      - Run lint + format"
	@echo "  make test       - Run tests"
	@echo "  make clean      - Clean Docker resources"
	@echo "  make install    - Install all dependencies"
	@echo "  make help       - Show this help"