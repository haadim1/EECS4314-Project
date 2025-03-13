VENV_DIR=venv
PYTHON=$(VENV_DIR)/bin/python
PIP=$(VENV_DIR)/bin/pip
UVICORN=$(VENV_DIR)/bin/uvicorn

install:
	python3 -m venv $(VENV_DIR)
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt

run:
	. $(VENV_DIR)/bin/activate && PYTHONPATH=$(PWD) $(UVICORN) app.main:app --reload

freeze:
	$(PIP) freeze > requirements.txt

clean:
	rm -rf $(VENV_DIR) requirements.txt
