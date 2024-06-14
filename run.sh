#!/bin/bash

# Navigate to the backend directory and set up the virtual environment
echo "Setting up the backend..."
cd BACKEND

if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi

source .venv/bin/activate

pip install -r requirements.txt

# Run the Flask app in the background
echo "Starting the backend..."
python SourceCode/main.py &

BACKEND_PID=$!

# Navigate to the frontend directory and install dependencies
echo "Setting up the frontend..."
cd ../FRONTEND/SourceCode

if [ ! -d "node_modules" ]; then
    npm install
fi

# Run the Next.js app
echo "Starting the frontend..."
npm run dev &

FRONTEND_PID=$!

# Trap and kill both processes on script exit
trap "kill $BACKEND_PID; kill $FRONTEND_PID" EXIT

# Wait for both processes to complete
wait $BACKEND_PID
wait $FRONTEND_PID
