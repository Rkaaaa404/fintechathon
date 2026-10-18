@echo off
TITLE AegisPath Platform Launcher - FinTechathon 2026
echo ====================================================================
echo  AegisPath - AI Agent Digital Wallet Platform (Shenzhen 2026)
echo  Next.js 16 + React 19 + FastAPI + Isolated Bank Gateway
echo ====================================================================
echo.

echo [1/2] Starting Backend Services (Core API :8000, Bank Gateway :8100)...
where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start "AegisPath Backend (API:8000 + Bank:8100)" cmd /k "py backend/server.py"
) else (
    start "AegisPath Backend (API:8000 + Bank:8100)" cmd /k "python backend/server.py"
)

echo [2/2] Starting Next.js 16 Frontend WebApp (:3000)...
start "AegisPath Frontend (Next.js :3000)" cmd /k "cd frontend && npm run dev"

echo.
echo ====================================================================
echo  Platform is booting up!
echo  - Frontend WebApp:  http://127.0.0.1:3000
echo  - API Core Docs:    http://127.0.0.1:8000/v1/docs
echo  - Bank Gateway:     http://127.0.0.1:8100/v1/health
echo ====================================================================
echo.
timeout /t 3 >nul
start http://127.0.0.1:3000
pause
