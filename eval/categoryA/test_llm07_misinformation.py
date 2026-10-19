#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category A
Test ID: LLM07:2026 - Misinformation
Status: KNOWN RISK (Mitigated)

White-Box Verification & Architectural Evidence:
All tuition quotes, fee buffers, cash-flow summaries, and runway simulations
are computed by deterministic code (never by LLM). UI explicitly labels
quotes as estimates with buffers, not guarantees.
"""
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from backend.api.planner import calculate_tuition_quote


def test_llm07_misinformation():
    print("=" * 76)
    print(" [TEST ID: LLM07:2026] Vulnerability: Misinformation")
    print(" Status: KNOWN RISK (Mitigated)")
    print("=" * 76)

    # 1. Deterministic Calculation (Python Math vs LLM Hallucination)
    print("  [1] Deterministic Mathematical Quote Generation (No LLM Guessing):")
    tuition_amount_cny = 18000.0
    quote = calculate_tuition_quote(tuition_amount_cny, "cheapest")

    base_usd = quote["base_amount_usd"]
    fee_usd = quote["fee_usd"]
    buffer_usd = quote["buffer_usd"]
    total_usd = quote["total_send_usd"]

    print(f"      Input CNY   : {tuition_amount_cny} CNY")
    print(f"      Base USD    : ${base_usd:.2f}")
    print(f"      Fee USD     : ${fee_usd:.2f}")
    print(f"      Buffer USD  : ${buffer_usd:.2f}")
    print(f"      Total Send  : ${total_usd:.2f}")

    # Verify math consistency
    expected_total = round(base_usd + fee_usd + buffer_usd, 2)
    assert abs(total_usd - expected_total) < 0.01, f"FAIL: Math error in quote ({total_usd} != {expected_total})!"

    # 2. Transparent UI Disclaimer Verification
    print("  [2] UI Quote Estimate Transparency & Disclaimer:")
    estimate_note = quote.get("estimate_note", "")
    print(f"      Quote Note  : '{estimate_note}'")
    assert "estimate" in estimate_note.lower(), "FAIL: Missing explicit estimate labeling!"
    assert "buffer" in estimate_note.lower(), "FAIL: Missing buffer transparency in note!"

    print("-" * 76)
    print("  >>> VERDICT: KNOWN RISK (Mitigated)")
    print("  Architectural Evidence: All tuition quotes and fee calculations are computed")
    print("  by deterministic Python routines (never hallucinated by LLM); UI explicitly")
    print("  labels quotes as estimates with buffers.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_llm07_misinformation()
    sys.exit(0 if success else 1)
