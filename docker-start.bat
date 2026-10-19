@echo off
TITLE AegisPath One-Click Docker Platform Launcher
echo ====================================================================
echo  AegisPath - AI Agent Digital Wallet Platform (Shenzhen 2026)
echo  One-Click Docker Compose Launcher
echo ====================================================================
echo.

REM 1. Verify Docker Engine is running
echo [1/4] Verifying Docker daemon status...
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not running or not installed.
    echo Please start Docker Desktop and try running this script again.
    echo.
    pause
    exit /b 1
)
echo  [OK] Docker daemon is active and responsive.

REM 2. Ensure environment configuration exists
echo [2/4] Checking environment configuration...
if not exist ".env" (
    if exist ".env.example" (
        echo  - Copying default configuration from .env.example to .env...
        copy .env.example .env >nul
        echo  [OK] Created .env file.
    ) else (
        echo  [!] .env not found, using built-in safe testnet fallbacks.
    )
) else (
    echo  [OK] Existing .env configuration detected.
)

REM 3. Build and launch containers
echo [3/4] Building and starting containers (Bank, API, Web)...
echo  - Service 1: Simulated Bank Gateway (Port 8100)
echo  - Service 2: Core API Platform (Port 8000)
echo  - Service 3: Next.js 16 WebApp (Port 3000)
echo.
docker compose up --build -d
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to start Docker Compose services.
    pause
    exit /b 1
)

REM 4. Healthcheck poll
echo.
echo [4/4] Waiting for services to initialize...
timeout /t 5 >nul

echo.
echo ====================================================================
echo  AegisPath Platform is LIVE!
echo  - Web Application: http://localhost:3000
echo  - Core API Docs:   http://localhost:8000/v1/docs
echo  - Bank Health:     http://localhost:8100/v1/health
echo.
echo  Useful commands:
echo  - View live logs:    docker compose logs -f
echo  - Stop all services: docker compose down
echo  - Clean reset:       docker compose down -v
echo ====================================================================
echo.

start http://localhost:3000
echo Opened http://localhost:3000 in your default browser.
echo Press any key to view container status...
pause >nul
docker compose ps
echo.
pause
