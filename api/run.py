import sys
import os

# Ensure backend is in the Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from backend import app  # ✅ Import from backend/__init__.py

if __name__ == "__main__":
    app.run(debug=True)
