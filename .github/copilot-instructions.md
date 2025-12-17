# Copilot Instructions for the ezyZip Project

Welcome to the ezyZip project! This document provides essential guidelines for AI coding agents to be productive in this codebase. Please follow these instructions to ensure consistency and alignment with the project's architecture and conventions.

## Project Overview
The ezyZip project is a web-based application designed for emotion recognition and sales data analysis. It consists of the following major components:

1. **Backend (Python)**:
   - `app.py` and `appq.py` are the main entry points for the backend logic.
   - Handles routes, data processing, and integration with the frontend.

2. **Frontend (HTML, JavaScript)**:
   - Located in the `templates/` directory for HTML files.
   - JavaScript files are in `static/js/`.
   - Key files:
     - `templates/emotion_intel.html`: Handles the emotion recognition interface.
     - `static/js/emotion-intel.js`: Contains logic for emotion-related frontend interactions.

3. **Data Files**:
   - `emotion_log.csv`: Stores logs related to emotion recognition.
   - `sales_data.csv` and `training_data.csv`: Contain sales and training data for analysis.

## Developer Workflows

### Running the Application
- Use `app.py` as the main entry point to start the backend server.
- Command:
  ```bash
  python app.py
  ```

### Installing Dependencies
- Install required Python packages using:
  ```bash
  pip install -r requirement.txt
  ```

### Debugging
- Use print statements or Python's built-in `logging` module for debugging.
- Frontend debugging can be done using browser developer tools.

## Project-Specific Conventions

### Backend
- Follow Flask conventions for route definitions and request handling.
- Use clear and descriptive variable names for data processing.

### Frontend
- JavaScript files are modularized by functionality (e.g., `camera.js` for camera interactions).
- Ensure compatibility with modern browsers.

### Data Handling
- CSV files are the primary data format.
- Use Python's `csv` module or Pandas for data manipulation.

## Integration Points
- The backend serves HTML templates and static files to the frontend.
- JavaScript files make AJAX calls to backend routes for dynamic data updates.

## Examples

### Adding a New Route
To add a new route in `app.py`:
```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/new-route')
def new_route():
    return render_template('new_template.html')
```

### Frontend Interaction
To make an AJAX call from the frontend:
```javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Key Files and Directories
- `app.py`: Main backend logic.
- `templates/`: HTML templates.
- `static/js/`: JavaScript files.
- `emotion_log.csv`: Logs for emotion recognition.

---

Feel free to update this document as the project evolves!