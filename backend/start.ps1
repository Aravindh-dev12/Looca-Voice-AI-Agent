# Looca Hybrid Backend Startup Script
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Looca Hybrid Voice - Setup & Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path "venv\Scripts\python.exe")) {
    Write-Host "[1/4] Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    if ($LASTEXITCODE -ne 0) { exit 1 }
} else {
    Write-Host "[1/4] Virtual environment exists" -ForegroundColor Green
}

Write-Host "[2/4] Installing Python dependencies..." -ForegroundColor Yellow
.\venv\Scripts\python -m pip install --upgrade pip --quiet
.\venv\Scripts\pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "[3/4] Checking offline runtime..." -ForegroundColor Yellow
if (-not (Get-Command espeak-ng -ErrorAction SilentlyContinue)) {
    Write-Host "WARNING: Install eSpeak NG for fully offline TTS." -ForegroundColor Yellow
}
if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
    Write-Host "NOTE: Install Ollama and run 'ollama pull qwen3:4b' for offline reasoning." -ForegroundColor DarkYellow
}

Write-Host "[4/4] Starting hybrid backend..." -ForegroundColor Green
Write-Host "  API Docs:       http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  Runtime status: http://localhost:8000/api/offline/status" -ForegroundColor Cyan
Write-Host "  Health:         http://localhost:8000/api/health" -ForegroundColor Cyan

.\venv\Scripts\python -m uvicorn app.hybrid_main:app --reload --port 8000 --host 0.0.0.0
