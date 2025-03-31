PYTHON := python
VENV := venv
REQS := requirements.txt

ifeq ($(OS),Windows_NT)
    PYTHON_PATH := .\$(VENV)\Scripts
    RM := rmdir /s /q
    ACTIVATE := $(PYTHON_PATH)\activate
    PIP_UPGRADE := $(PYTHON_PATH)\python -m pip install --upgrade pip
else
    PYTHON_PATH := ./$(VENV)/bin
    RM := rm -rf
    ACTIVATE := . $(PYTHON_PATH)/activate
    PIP_UPGRADE := $(PYTHON_PATH)/python -m pip install --upgrade pip
endif

build:
	$(PYTHON) -m venv $(VENV)
	$(PIP_UPGRADE)
	$(PYTHON_PATH)\pip install -r $(REQS)

run:
ifeq ($(OS),Windows_NT)
	$(PYTHON_PATH)\python app.py
else
	$(ACTIVATE) && PYTHONPATH=$(PWD) $(PYTHON_PATH)/python app.py
endif

clean:
	$(RM) $(VENV)

build-macos:
	$(PYTHON) -m venv $(VENV)
	./$(VENV)/bin/python -m pip install --upgrade pip
	./$(VENV)/bin/pip install -r $(REQS)
	
help:
	@echo "Available targets:"
	@echo "  build  - Set up the virtual environment and install dependencies"
	@echo "  run    - Run the Flask app"
	@echo "  clean  - Remove the virtual environment"
