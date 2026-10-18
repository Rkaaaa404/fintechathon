#!/usr/bin/env bash
echo "===================================================================="
echo " AegisPath - AI Agent Digital Wallet Platform (Shenzhen 2026)"
echo " Next.js 16 + React 19 + FastAPI + Isolated Bank Gateway"
echo "===================================================================="
echo ""
echo "[1/2] Starting Backend Services (Core API :8000, Bank Gateway :8100)..."
python3 backend/server.py &
BACKEND_PID=$!

echo "[2/2] Starting Next.js 16 Frontend WebApp (:3000)..."
npm --prefix frontend run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM

echo ""
echo "===================================================================="
echo " Platform is running!"
echo " - Frontend WebApp:  http://127.0.0.1:3000"
echo " - API Core Docs:    http://127.0.0.1:8000/v1/docs"
echo " - Bank Gateway:     http://127.0.0.1:8100/v1/health"
echo "===================================================================="
wait
