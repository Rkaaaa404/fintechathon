import sqlite3
import json
import time
import hashlib
from typing import Optional, Dict, Any, List
from .config import config

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(config.DATABASE_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    with conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                role TEXT NOT NULL DEFAULT 'student',
                created_at REAL NOT NULL
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS policy (
                user_id TEXT PRIMARY KEY,
                single_send_cap_usd REAL NOT NULL DEFAULT 500.0,
                daily_cap_usd REAL NOT NULL DEFAULT 1000.0,
                used_today_usd REAL NOT NULL DEFAULT 200.0,
                allowed_payees_json TEXT NOT NULL,
                is_paused INTEGER NOT NULL DEFAULT 0,
                updated_at REAL NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS policy_proposals (
                proposal_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                new_single_send_cap_usd REAL NOT NULL,
                new_daily_cap_usd REAL NOT NULL,
                effective_at REAL NOT NULL,
                guardian_required INTEGER NOT NULL DEFAULT 1,
                status TEXT NOT NULL DEFAULT 'PENDING',
                created_at REAL NOT NULL
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS audit_chain (
                entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
                action TEXT NOT NULL,
                actor TEXT NOT NULL,
                details_json TEXT NOT NULL,
                prev_hash TEXT NOT NULL,
                entry_hash TEXT NOT NULL,
                timestamp REAL NOT NULL
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS plans (
                plan_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                intent_hash TEXT NOT NULL,
                plan_data_json TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'WAITING_APPROVAL',
                created_at REAL NOT NULL
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS evidence_shares (
                share_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                recipient TEXT NOT NULL,
                recipient_zh TEXT NOT NULL,
                shared_fields TEXT NOT NULL,
                expires_at REAL NOT NULL,
                is_revoked INTEGER NOT NULL DEFAULT 0,
                created_at REAL NOT NULL
            )
        """)

        # Seed initial landlord share if not exists
        cur_share = conn.execute("SELECT share_id FROM evidence_shares WHERE share_id = 'share_landlord_a'")
        if not cur_share.fetchone():
            now_ts = time.time()
            conn.execute("""
                INSERT INTO evidence_shares (share_id, user_id, recipient, recipient_zh, shared_fields, expires_at, is_revoked, created_at)
                VALUES ('share_landlord_a', 'usr_ayu', 'Landlord A', '房东 A', 'Balance & regular deposits (redacted ID & account numbers)', ?, 0, ?)
            """, (now_ts + 14 * 86400, now_ts))

        # Seed student Ayu
        cur = conn.execute("SELECT user_id FROM users WHERE user_id = 'usr_ayu'")
        if not cur.fetchone():
            now = time.time()
            conn.execute(
                "INSERT INTO users (user_id, username, role, created_at) VALUES ('usr_ayu', 'Ayu', 'student', ?)",
                (now,)
            )
            payees = [
                {"id": "p1", "name": "Mom", "relation": "Mother", "initials": "IB"},
                {"id": "p2", "name": "Campus bursar", "relation": "Tuition", "initials": "BU"},
                {"id": "p3", "name": "Dad", "relation": "Father", "initials": "BA"}
            ]
            conn.execute(
                """
                INSERT INTO policy (user_id, single_send_cap_usd, daily_cap_usd, used_today_usd, allowed_payees_json, is_paused, updated_at)
                VALUES ('usr_ayu', 500.0, 1000.0, 200.0, ?, 0, ?)
                """,
                (json.dumps(payees), now)
            )

            # Genesis audit entry
            genesis_details = json.dumps({"event": "Genesis: AegisPath safety engine initialized"})
            genesis_hash = hashlib.sha256(f"0:{genesis_details}:{now}".encode('utf-8')).hexdigest()
            conn.execute(
                """
                INSERT INTO audit_chain (action, actor, details_json, prev_hash, entry_hash, timestamp)
                VALUES ('GENESIS', 'system', ?, '0'*64, ?, ?)
                """,
                (genesis_details, genesis_hash, now)
            )

init_db()
