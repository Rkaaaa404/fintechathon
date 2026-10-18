import sqlite3
import json
import time
from typing import Optional, Dict, Any, List
from .config import config

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(config.DATABASE_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    with conn:
        # Accounts table (simulated custodial accounts)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS accounts (
                account_id TEXT PRIMARY KEY,
                owner_name TEXT NOT NULL,
                balance_usd REAL NOT NULL,
                currency TEXT NOT NULL DEFAULT 'USD',
                updated_at REAL NOT NULL
            )
        """)
        # Double-entry ledger
        conn.execute("""
            CREATE TABLE IF NOT EXISTS ledger (
                tx_id TEXT PRIMARY KEY,
                account_id TEXT NOT NULL,
                payee_id TEXT NOT NULL,
                payee_name TEXT NOT NULL,
                amount_usd REAL NOT NULL,
                fee_usd REAL NOT NULL,
                direction TEXT NOT NULL, -- DEBIT / CREDIT
                status TEXT NOT NULL,    -- COMPLETED / BLOCKED
                idempotency_key TEXT,
                scoped_token_hash TEXT NOT NULL,
                created_at REAL NOT NULL,
                FOREIGN KEY (account_id) REFERENCES accounts(account_id)
            )
        """)
        # Idempotency cache table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS idempotency_records (
                idempotency_key TEXT PRIMARY KEY,
                response_json TEXT NOT NULL,
                created_at REAL NOT NULL
            )
        """)
        # Used nonces (replay prevention)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS used_nonces (
                nonce TEXT PRIMARY KEY,
                used_at REAL NOT NULL
            )
        """)

        # Seed initial testnet student account for Ayu if not exists
        cur = conn.execute("SELECT account_id FROM accounts WHERE account_id = 'acc_student_ayu'")
        if not cur.fetchone():
            conn.execute("""
                INSERT INTO accounts (account_id, owner_name, balance_usd, currency, updated_at)
                VALUES ('acc_student_ayu', 'Ayu', 12450.00, 'USD', ?)
            """, (time.time(),))
        else:
            # Ensure sufficient testnet balance for repeated demo/smoke runs
            conn.execute("""
                UPDATE accounts SET balance_usd = MAX(balance_usd, 12450.00) WHERE account_id = 'acc_student_ayu'
            """)

init_db()
