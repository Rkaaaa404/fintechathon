# ====================================================================
# AegisPath - AI Agent Digital Wallet Platform (Shenzhen 2026)
# PowerShell Unified Launcher
# ====================================================================

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host " AegisPath Platform Launcher - FinTechathon 2026" -ForegroundColor Green
Write-Host " Next.js 16.4 + React 19 + FastAPI + Isolated Bank Gateway" -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $RootDir

Write-Host "[1/2] Launching Backend Services (Core API :8000 & Bank :8100)..." -ForegroundColor White
$PyCmd = if (Get-Command py -ErrorAction SilentlyContinue) { "py" } else { "python" }
Start-Process -FilePath $PyCmd -ArgumentList "backend/server.py" -WorkingDirectory $RootDir

Write-Host "[2/2] Launching Next.js 16 Frontend (:3000)..." -ForegroundColor White
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd frontend && npm run dev" -WorkingDirectory $RootDir

Write-Host ""
Write-Host "Waiting for services to initialize..." -ForegroundColor DarkGray
Start-Sleep -Seconds 3

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host " AegisPath Platform is Active!" -ForegroundColor Green
Write-Host "  - Frontend WebApp:  http://127.0.0.1:3000" -ForegroundColor White
Write-Host "  - Core API Swagger: http://127.0.0.1:8000/v1/docs" -ForegroundColor White
Write-Host "  - Bank Health:      http://127.0.0.1:8100/v1/health" -ForegroundColor White
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

Start-Process "http://127.0.0.1:3000"
