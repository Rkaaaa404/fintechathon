.PHONY: all setup dev verify test smoke eval contracts docker-up docker-down clean

PYTHON ?= py
NODE ?= node

all: verify

setup:
	$(PYTHON) scripts/setup.py

dev:
	$(PYTHON) scripts/dev.py

verify:
	$(PYTHON) scripts/verify.py

test:
	$(PYTHON) -m pytest

smoke:
	$(PYTHON) scripts/smoke.py

e2e:
	$(PYTHON) scripts/smoke.py

eval:
	$(PYTHON) -m eval.attacks

contracts:
	$(NODE) scripts/contracts.js

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down

clean:
	$(PYTHON) scripts/clean.py
