@echo off
TITLE AegisPath Platform Launcher
echo ====================================================================
echo  AegisPath - AI Agent Digital Wallet Platform (FinTechathon 2026)
echo ====================================================================
echo.
echo [1/2] Starting Backend Services (Core API :8000, Bank Gateway :8100)...
start "AegisPath Backend" cmd /k "py backend/server.py"

echo [2/2] Starting Frontend WebApp (:3000)...
start "AegisPath Frontend" cmd /k "node frontend/server.js"

echo.
echo ====================================================================
echo  Platform is booting up!
echo  - Frontend WebApp:  http://127.0.0.1:3000
echo  - API Core Docs:    http://127.0.0.1:8000/docs
echo  - Bank Gateway:     http://127.0.0.1:8100/health
echo ====================================================================
echo.
pause
