@echo off

REM Navigate to the backend directory and set up the virtual environment
echo Setting up the backend...
cd BACKEND

if not exist .venv (
    python -m venv .venv
)

call .venv\Scripts\activate.bat

pip install -r requirements.txt

echo Backend setup complete.
echo

REM Run the Flask app in a new command window
echo Starting the backend...
start cmd /c "python .\SourceCode\main.py"

echo
echo

REM Navigate to the frontend directory and install dependencies
echo Setting up the frontend...
cd ..\FRONTEND\SourceCode

if not exist node_modules (
    npm install
)

echo Frontend setup complete.
echo 

REM Run the Next.js app in a new command window
echo Starting the frontend...
start cmd /c "npm run dev"

echo
echo

REM Wait for user input to close the script
echo Both servers are running. Press any key to exit.
pause
