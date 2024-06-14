@echo off
REM Description: Run this script to set up and start the app on Windows.

REM SETTINGS
set OPENBROWSER=true
set URL="http://localhost:3000"

chcp 65001 >NUL
setlocal enabledelayedexpansion

echo.
echo 🚀 Starting the app...
echo.
echo.

REM Navigate to the backend directory and set up the virtual environment
cd BACKEND

if not exist .venv (
    echo ⚙️ Setting up the backend...
    python -m venv .venv

    call .venv\Scripts\activate.bat

    echo  * ⚙️ Installing Python dependencies...
    pip install -r requirements.txt
    echo  * [32m✓[0m Dependencies installed.
    echo [32m✓[0m Backend setup complete.
    echo.
)


REM Run the Flask app in a new command window and capture the PID
echo 🔧 Starting the backend.
start "nuibackend" /MIN cmd /c "python .\SourceCode\main.py"

echo.
echo.

REM Navigate to the frontend directory and install dependencies
cd ..\FRONTEND\SourceCode

if not exist node_modules (
    echo ⚙️ Setting up the frontend...
    npm install
    echo [32m✓[0m Frontend setup complete.
    echo.
)


REM Run the Next.js app in a new command window and capture the PID
echo 🔧 Starting the frontend.
start "nuifrontend" /MIN cmd /c "npm run dev"

echo.
echo.


REM Open the app in the default browser
if %OPENBROWSER%==true (
    echo 🌐 Opening the app in the default browser.
    start "" %URL%
    echo.
)

REM Wait for user input to close the script
echo [35mApp is running.[0m [30mPress any key to exit.[0m
pause

REM Cleanup on exit
echo.
echo 🧹 Cleaning up...

set WARNING=false

REM Stop the backend
set ERRORLEVEL=0
tasklist /FI "WindowTitle eq nuibackend*" | findstr "cmd.exe" >nul
if %ERRORLEVEL%==0 (
    taskkill /FI "WindowTitle eq nuibackend*" /T /F >nul 2>&1
    echo  * [32m✓[0m Backend stopped.
) else (
    tasklist /FI "WindowTitle eq Sélection nuibackend*" | findstr "cmd.exe" >nul
    if %ERRORLEVEL%==0 (
        taskkill /FI "WindowTitle eq Sélection nuibackend*" /T /F >nul 2>&1
        echo  * [32m✓[0m Backend stopped.
    ) else (
        echo  * [31m✗[0m Failed to stop backend.
        set WARNING=true
    )
)

REM Stop the frontend
tasklist /FI "WindowTitle eq npm*" | findstr "cmd.exe" >nul
if %ERRORLEVEL%==0 (
    taskkill /FI "WindowTitle eq npm*" /T /F >nul 2>&1
    echo  * [32m✓[0m Frontend stopped.
) else (
    tasklist /FI "WindowTitle eq nuifrontend*" | findstr "cmd.exe" >nul
    if %ERRORLEVEL%==0 (
        taskkill /FI "WindowTitle eq nuifrontend*" /T /F >nul 2>&1
        echo  * [32m✓[0m Frontend stopped.
    ) else (
        tasklist /FI "WindowTitle eq Sélection npm*" | findstr "cmd.exe" >nul
        if %ERRORLEVEL%==0 (
            taskkill /FI "WindowTitle eq Sélection npm*" /T /F >nul 2>&1
            echo  * [32m✓[0m Frontend stopped.
        ) else (
            echo  * [31m✗[0m Failed to stop frontend.
            set WARNING=true
        )
    )
)

if %WARNING%==true (
    echo ⚠️  [33mSome processes could not be stopped. Please close them manually.[0m
) else (
    echo [32m✓[0m Cleanup complete.
)

exit /b