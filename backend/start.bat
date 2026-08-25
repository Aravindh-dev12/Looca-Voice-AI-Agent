@echo off
echo ============================================
echo   Looca Hybrid Voice - Setup and Start
echo ============================================
echo.

if not exist "venv\Scripts\python.exe" (
    echo [1/4] Creating virtual environment...
    python -m venv venv
    if errorlevel 1 exit /b 1
) else (
    echo [1/4] Virtual environment exists
)

echo [2/4] Installing Python dependencies...
venv\Scripts\python -m pip install --upgrade pip --quiet
venv\Scripts\pip install -r requirements.txt
if errorlevel 1 exit /b 1

echo [3/4] Checking offline runtime...
where espeak-ng >nul 2>nul
if errorlevel 1 echo WARNING: Install eSpeak NG for fully offline TTS.
where ollama >nul 2>nul
if errorlevel 1 echo NOTE: Install Ollama and run "ollama pull qwen3:4b" for offline reasoning.

echo [4/4] Starting hybrid backend...
echo   API Docs:       http://localhost:8000/docs
echo   Runtime status: http://localhost:8000/api/offline/status
echo   Health:         http://localhost:8000/api/health
venv\Scripts\python -m uvicorn app.hybrid_main:app --host 0.0.0.0 --port 8000 --reload
pause
