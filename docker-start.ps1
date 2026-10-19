# ====================================================================
# AegisPath - AI Agent Digital Wallet Platform (Shenzhen 2026)
# PowerShell One-Click Docker Compose Launcher
# ====================================================================

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host " AegisPath Platform Launcher - FinTechathon 2026" -ForegroundColor Green
Write-Host " One-Click Docker Compose Launcher (Next.js + FastAPI + Bank Daemon)" -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $RootDir

# 1. Verify Docker Engine
Write-Host "[1/4] Verifying Docker daemon status..." -ForegroundColor White
try {
    $dockerCheck = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Docker is not running"
    }
    Write-Host " [OK] Docker daemon is active and responsive." -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker is not running or not installed." -ForegroundColor Red
    Write-Host "Please start Docker Desktop and run this script again." -ForegroundColor Yellow
    exit 1
}

# 2. Check .env configuration
Write-Host "[2/4] Checking environment configuration..." -ForegroundColor White
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host " [OK] Created .env configuration from .env.example." -ForegroundColor Green
    } else {
        Write-Host " [!] .env not found, using built-in safe testnet fallbacks." -ForegroundColor Yellow
    }
} else {
    Write-Host " [OK] Existing .env configuration detected." -ForegroundColor Green
}

# 3. Build and launch services
Write-Host "[3/4] Building and launching containers in detached mode..." -ForegroundColor White
Write-Host " - Port 8100: Isolated Bank Gateway" -ForegroundColor Gray
Write-Host " - Port 8000: API Core (Policy, Planner, Sentinel)" -ForegroundColor Gray
Write-Host " - Port 3000: Next.js 16 WebApp" -ForegroundColor Gray
docker compose up --build -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] docker compose up failed to start." -ForegroundColor Red
    exit 1
}

# 4. Wait for services to be ready
Write-Host "[4/4] Waiting for services to initialize..." -ForegroundColor White
Start-Sleep -Seconds 4

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host " AegisPath Platform is LIVE in Docker!" -ForegroundColor Green
Write-Host "  - Frontend WebApp:  http://localhost:3000" -ForegroundColor White
Write-Host "  - Core API Swagger: http://localhost:8000/v1/docs" -ForegroundColor White
Write-Host "  - Bank Health:      http://localhost:8100/v1/health" -ForegroundColor White
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Gray
Write-Host "  docker compose logs -f    # View streaming logs" -ForegroundColor Gray
Write-Host "  docker compose down       # Stop all services" -ForegroundColor Gray
Write-Host "  docker compose down -v    # Clean reset database volumes" -ForegroundColor Gray
Write-Host ""

Start-Process "http://localhost:3000"
docker compose ps
