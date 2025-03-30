PYTHON := python
VENV := venv
REQS := requirements.txt

ifeq ($(OS),Windows_NT)
    PYTHON_PATH := .\$(VENV)\Scripts
    RM := rmdir /s /q
    PIP := $(PYTHON_PATH)\pip
else
    PYTHON_PATH := ./$(VENV)/bin
    RM := rm -rf
    PIP := $(PYTHON_PATH)/pip
endif

build:
	$(PYTHON) -m venv $(VENV)
	$(PYTHON_PATH)\python -m pip install --upgrade pip
	$(PIP) install -r $(REQS)

run:
ifeq ($(OS),Windows_NT)
	$(PYTHON_PATH)\uvicorn app.app:app --reload
else
	. $(PYTHON_PATH)/activate && PYTHONPATH=$(PWD) $(PYTHON_PATH)/uvicorn app.app:app --reload
endif

clean:
	$(RM) $(VENV)

help:
	@echo "Available targets:"
	@echo "  build  - Set up the virtual environment and install dependencies"
	@echo "  run    - Run the FastAPI app"
	@echo "  clean  - Remove the virtual environment"