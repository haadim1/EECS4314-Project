# Variables
PYTHON := python3
VENV := venv
REQS := requirements.txt

default: build

setup: 
	$(PYTHON) -m venv $(VENV)
	$(VENV)/bin/pip install --upgrade pip
	echo "flask" > $(REQS)
	$(VENV)/bin/pip install -r $(REQS)

deps:
	$(VENV)/bin/pip install -r $(REQS)

build: setup deps

run:
	source $(VENV)/bin/activate && $(VENV)/bin/python app.py

clean:
	rm -rf $(VENV)
