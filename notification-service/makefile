GO := go
BIN := .\bin
MAIN := cmd\consumer.go

ifeq ($(OS),Windows_NT)
    RM := del /Q /F
    RMDIR := rmdir /S /Q
    SEP := \
    CHECK_GO := where $(GO)
else
    RM := rm -f
    RMDIR := rm -rf
    SEP := /
    CHECK_GO := which $(GO)
endif

.PHONY: build run clean fmt lint help check-go

build: check-go
	$(GO) mod tidy
	$(GO) build -o $(BIN)$(SEP)app$(SEP)consumer.exe $(MAIN)

run: check-go
	$(GO) run $(MAIN)

clean:
	$(GO) clean -modcache
	if exist $(BIN) $(RMDIR) $(BIN)

fmt: check-go
	$(GO) fmt .\...

lint: check-go
	$(GO) vet .\...

help:
	@echo "Available commands:"
	@echo "  build  - Install dependencies and build binary"
	@echo "  run    - Run the notification service"
	@echo "  clean  - Clean Go mod cache and binaries"
	@echo "  fmt    - Format Go code"
	@echo "  lint   - Run Go vet for linting"