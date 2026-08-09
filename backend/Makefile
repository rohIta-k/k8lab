.PHONY: run build test fmt vet clean

run:
	go run ./cmd/server

build:
	go build -o bin/k8lab ./cmd/server

test:
	go test ./...

fmt:
	go fmt ./...

vet:
	go vet ./...

clean:
	rm -rf bin