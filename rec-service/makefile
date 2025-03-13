PYTHON := python3
VENV := venv
REQS := requirements.txt

build:
	$(PYTHON) -m venv $(VENV)
	$(VENV)/bin/pip install --upgrade pip
	$(VENV)/bin/pip install -r $(REQS)

run:
	. $(VENV)/bin/activate && PYTHONPATH=$(PWD) $(VENV)/bin/uvicorn app.app:app --reload

clean:
	rm -rf $(VENV)

help:
	@echo "Available targets:"
	@echo "  build  - Set up the virtual environment and install dependencies"
	@echo "  run    - Run the FastAPI app"
	@echo "  clean  - Remove the virtual environment"