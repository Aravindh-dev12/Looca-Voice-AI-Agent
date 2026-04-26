@echo off
echo ============================================
echo   Looca Backend - Setup and Start
echo ============================================
echo.

REM Check if venv exists
if not exist "venv\Scripts\python.exe" (
    echo [1/4] Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        echo Make sure Python 3.11+ is installed and in PATH
        pause
        exit /b 1
    )
) else (
    echo [1/4] Virtual environment already exists
)

echo [2/4] Installing dependencies...
venv\Scripts\pip install --upgrade pip --quiet
venv\Scripts\pip install fastapi uvicorn[standard] sqlalchemy aiosqlite asyncpg psycopg2-binary pydantic pydantic-settings python-jose[cryptography] passlib[bcrypt] python-multipart httpx --quiet

echo [3/4] Checking database connection...
venv\Scripts\python -c "from app.config import get_settings; s=get_settings(); print('  Database URL:', s.DATABASE_URL)"

echo [4/4] Starting backend server...
echo.
echo   Backend: http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo   Health:   http://localhost:8000/api/health
echo.
venv\Scripts\python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
