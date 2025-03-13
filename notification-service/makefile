GO := go

build:
	$(GO) mod tidy

run:
	$(GO) run cmd/consumer.go

clean:
	$(GO) clean -modcache

fmt:
	$(GO) fmt ./...

lint:
	$(GO) vet ./...

help:
	@echo "Available commands:"
	@echo "  build  - Install Go dependencies"
	@echo "  run    - Run the notification service"
	@echo "  clean  - Clean Go mod cache"
	@echo "  fmt    - Format Go code"
	@echo "  lint   - Run Go vet for linting"