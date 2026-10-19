#!/usr/bin/env bash
set -e

echo "===================================================================="
echo " AegisPath - AI Agent Digital Wallet Platform (Shenzhen 2026)"
echo " One-Click Docker Compose Launcher (Linux / macOS)"
echo "===================================================================="
echo ""

# 1. Verify Docker Engine
echo "[1/4] Checking Docker daemon status..."
if ! docker info >/dev/null 2>&1; then
    echo "[ERROR] Docker is not running or not installed."
    echo "Please start Docker and try again."
    exit 1
fi
echo " [OK] Docker daemon is running."

# 2. Check .env
echo "[2/4] Checking environment configuration..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo " [OK] Created .env from .env.example."
    else
        echo " [!] .env not found, using built-in safe testnet fallbacks."
    fi
else
    echo " [OK] Existing .env configuration detected."
fi

# 3. Build & start
echo "[3/4] Building and launching containers..."
docker compose up --build -d

# 4. Wait
echo "[4/4] Waiting for services to initialize..."
sleep 4

echo ""
echo "===================================================================="
echo " AegisPath Platform is LIVE!"
echo "  - Frontend: http://localhost:3000"
echo "  - Core API: http://localhost:8000/v1/docs"
echo "  - Bank:     http://localhost:8100/v1/health"
echo "===================================================================="
docker compose ps
