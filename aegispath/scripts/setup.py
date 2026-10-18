#!/usr/bin/env python3
"""
Setup script to initialize .env from .env.example if missing.
"""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent

def setup():
    env_example = ROOT / ".env.example"
    env_target = ROOT / ".env"
    if not env_target.exists() and env_example.exists():
        shutil.copy(env_example, env_target)
        print("Created .env from .env.example")
    print("Environment setup verified.")

if __name__ == "__main__":
    setup()
