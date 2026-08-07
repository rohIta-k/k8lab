.PHONY: frontend backend dev build clean

frontend:
	$(MAKE) -C frontend dev

backend:
	@echo "Backend not implemented yet"

dev:
	$(MAKE) frontend

build:
	$(MAKE) -C frontend build

clean:
	$(MAKE) -C frontend clean