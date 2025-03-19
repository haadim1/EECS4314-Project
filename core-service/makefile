PYTHON := python3
VENV := venv
REQS := requirements.txt

build:
	$(PYTHON) -m venv $(VENV)
	$(VENV)/bin/pip install --upgrade pip
	$(VENV)/bin/pip install -r $(REQS)

run:
	source venv/bin/activate && PYTHONPATH=$(pwd) venv/bin/python run.py

clean:
	rm -rf $(VENV)

help:
	@echo "Available targets:"
	@echo "  build  - Set up the virtual environment and install dependencies"
	@echo "  run    - Run the Flask app"
	@echo "  clean  - Remove the virtual environment"
