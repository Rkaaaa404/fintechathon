#!/usr/bin/env bash
echo "===================================================================="
echo " AegisPath - AI Agent Digital Wallet Platform (FinTechathon 2026)"
echo "===================================================================="
echo ""
echo "[1/2] Starting Backend Services (Core API :8000, Bank Gateway :8100)..."
python3 backend/server.py &
BACKEND_PID=$!

echo "[2/2] Starting Frontend WebApp (:3000)..."
node frontend/server.js &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID; exit 0" SIGINT SIGTERM

echo ""
echo "===================================================================="
echo " Platform is running!"
echo " - Frontend WebApp:  http://127.0.0.1:3000"
echo " - API Core Docs:    http://127.0.0.1:8000/docs"
echo " - Bank Gateway:     http://127.0.0.1:8100/health"
echo "===================================================================="
wait
