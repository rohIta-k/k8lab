.PHONY: frontend backend dev build clean

frontend:
	$(MAKE) -C frontend dev

backend:
	cd backend && go run .

dev:
	$(MAKE) frontend

build:
	$(MAKE) -C frontend build

clean:
	$(MAKE) -C frontend clean