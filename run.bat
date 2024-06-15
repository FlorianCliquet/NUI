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
    echo ⚙️  Setting up the backend...
    python -m venv .venv

    call .venv\Scripts\activate.bat

    echo  * ⚙️  Installing Python dependencies...
    pip install -r requirements.txt
    echo  * [32m✓[0m Dependencies installed.
    echo [32m✓[0m Backend setup complete.
    echo.
)


REM Run the Flask app in a new command window and capture the PID
echo 🔧 Starting the backend.
del backend_error_report.log 2>nul
start "nuibackend" /MIN cmd /c ".\.venv\Scripts\python.exe .\SourceCode\main.py 2>backend_error_report.log"

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
del ../frontend_error_report.log 2>nul
start "nuifrontend" /MIN cmd /c "npm run dev 2>..\frontend_error_report.log"

echo.
echo.

cd ..\..

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
tasklist /FI "WindowTitle eq nuibackend*" | findstr "cmd.exe" > temp.txt
for %%R in (temp.txt) do if not %%~zR lss 1 (
    taskkill /FI "WindowTitle eq nuibackend*" /T /F >nul 2>&1
    echo  * [32m✓[0m Backend stopped.
) else (
    tasklist /FI "WindowTitle eq Sélection nuibackend*" | findstr "cmd.exe" > temp.txt
    for %%R in (temp.txt) do if not %%~zR lss 1 (
        taskkill /FI "WindowTitle eq Sélection nuibackend*" /T /F >nul 2>&1
        echo  * [32m✓[0m Backend stopped.
    ) else (
        echo  * [31m✗[0m Failed to stop backend.
        set WARNING=true
    )
)
del temp.txt > nul

REM Stop the frontend
tasklist /FI "WindowTitle eq npm*" | findstr "cmd.exe" > temp.txt
for %%R in (temp.txt) do if not %%~zR lss 1 (
    taskkill /FI "WindowTitle eq npm*" /T /F >nul 2>&1
    echo  * [32m✓[0m Frontend stopped.
) else (
    tasklist /FI "WindowTitle eq nuifrontend*" | findstr "cmd.exe" > temp.txt
    for %%R in (temp.txt) do if not %%~zR lss 1 (
        taskkill /FI "WindowTitle eq nuifrontend*" /T /F >nul 2>&1
        echo  * [32m✓[0m Frontend stopped.
    ) else (
        tasklist /FI "WindowTitle eq Sélection npm*" | findstr "cmd.exe" > temp.txt
        for %%R in (temp.txt) do if not %%~zR lss 1 (
            taskkill /FI "WindowTitle eq Sélection npm*" /T /F >nul 2>&1
            echo  * [32m✓[0m Frontend stopped.
        ) else (
            echo  * [31m✗[0m Failed to stop frontend.
            set WARNING=true
        )
    )
)
del temp.txt > nul

if %WARNING%==true (
    echo ⚠️  [33mSome processes could not be stopped. Please close them manually.[0m
)

REM Deactivate the virtual environment
cd BACKEND
call .venv\Scripts\deactivate.bat
echo  * [32m✓[0m Virtual environment deactivated.
cd ..


REM Check log files for errors before cleanup
echo  * 📖 Checking logs for errors...

set ERROR_FOUND=false

REM Check backend log
if exist .\BACKEND\backend_error_report.log (

    REM Check if the log file is empty  
    for %%R in (.\BACKEND\backend_error_report.log) do if not %%~zR lss 1 (
        
        REM Check for errors in the log file
        findstr /C:"Traceback" .\BACKEND\backend_error_report.log > temp.txt
        for %%R in (temp.txt) do if not %%~zR lss 1 (
            echo    - [31mErrors found in backend :[30m
            type .\BACKEND\backend_error_report.log
            echo [0m
            set ERROR_FOUND=true

            findstr /C:"ModuleNotFoundError" .\BACKEND\backend_error_report.log >temp.txt
            for %%R in (temp.txt) do if not %%~zR lss 1 (
                echo      + [33mSome Python dependencies seem to be missing. Trying to install them.[0m
                call .\BACKEND\.venv\Scripts\pip.exe install -r .\BACKEND\requirements.txt 1>nul
                if %ERRORLEVEL%==0 (
                    echo      + [32m✓[0m Dependencies installed. Try running the app again.
                ) else (
                    echo      + [31m✗[0m Failed to install dependencies. Please try installing them manually.
                )
            )
        )
        del temp.txt > nul
    )
)

REM Check frontend log
if exist .\FRONTEND\frontend_error_report.log (
    for %%R in (.\FRONTEND\frontend_error_report.log) do if not %%~zR lss 1 (
        echo    - [31mErrors found in frontend :[30m
        type .\FRONTEND\frontend_error_report.log
        echo [0m
        set ERROR_FOUND=true
    )
)

REM Display error logs if any error was found
if %ERROR_FOUND%==true (
    echo    - [31mErrors were detected during the execution.[0m
    echo    - Try running the app again.
    echo    - If the errors persist, check [4mbackend_error_report.log[0m and [4mfrontend_error_report.log[0m for details.
) else (
    echo    - [32m✓[0m No errors were detected during the execution. The app has been stopped successfully.
)

echo [32m✓[0m Cleanup complete.

timeout /t 1 >nul
exit /b