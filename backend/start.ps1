# Looca Backend Startup Script
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Looca Backend - Setup & Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if venv exists
if (-not (Test-Path "venv\Scripts\python.exe")) {
    Write-Host "[1/3] Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to create virtual environment" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[1/3] Virtual environment exists" -ForegroundColor Green
}

# Activate and install
Write-Host "[2/3] Installing dependencies..." -ForegroundColor Yellow
.\venv\Scripts\pip install --upgrade pip --quiet
.\venv\Scripts\pip install fastapi uvicorn[standard] sqlalchemy aiosqlite asyncpg psycopg2-binary pydantic pydantic-settings python-jose[cryptography] passlib[bcrypt] python-multipart httpx --quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install packages" -ForegroundColor Red
    exit 1
}
Write-Host "[2/3] Dependencies installed" -ForegroundColor Green

# Check database config
Write-Host "[3/3] Checking database..." -ForegroundColor Yellow
$pythonCheck = @"
from app.config import get_settings
s = get_settings()
print(f"  Database: {s.DATABASE_URL}")
"@
.\venv\Scripts\python -c $pythonCheck

Write-Host ""
Write-Host "Starting server..." -ForegroundColor Green
Write-Host "  API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  Health:   http://localhost:8000/api/health" -ForegroundColor Cyan
Write-Host ""

# Start server
.\venv\Scripts\python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
