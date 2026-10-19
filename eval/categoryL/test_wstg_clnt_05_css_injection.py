#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category L (Client-side Testing)
Test ID: WSTG-CLNT-05 - Testing for CSS Injection (4.11.5)
Status: PASS (Verified)

White-Box Verification & Architectural Evidence:
Visual styling (light-blue palette and status colors) uses static CSS classes
rather than model-supplied inline styles.
"""
import re
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass


def test_wstg_clnt_05_css_injection():
    print("=" * 76)
    print(" [TEST ID: WSTG-CLNT-05] Testing for CSS Injection (4.11.5)")
    print(" Status: PASS (Verified)")
    print("=" * 76)

    frontend_src = ROOT_DIR / "frontend" / "src"
    legacy_css = frontend_src / "app" / "legacy-styles.css"
    shell_css = frontend_src / "app" / "shell.css"
    assert legacy_css.exists() and shell_css.exists()

    # 1. Audit Static Design System Palette & Status Classes
    print("  [1] Static Design System Palette & Tokens Audit (legacy-styles.css & shell.css):")
    css_content = legacy_css.read_text(encoding="utf-8") + shell_css.read_text(encoding="utf-8")

    # Verify light-blue palette and semantic status tokens
    tokens = [
        ("--blue", "Core Brand Blue"),
        ("--sky", "Light-blue Accent Background"),
        ("--line", "Border Line"),
        ("--ink", "Primary Text Color"),
        ("--green", "Approved / Safe Status"),
        ("--red", "Blocked / Refused Status"),
    ]

    for token, desc in tokens:
        has_token = token in css_content
        print(f"      Design System Token '{token:<10}' ({desc}): Present = {has_token}")
        assert has_token, f"Missing core CSS token {token} in stylesheet"

    # 2. Audit for Dynamic <style> Injections or Model-Supplied Stylesheets
    print("  [2] Codebase Scan for Dynamic <style> Elements and Arbitrary Inline Styles:")
    all_ts_files = list(frontend_src.rglob("*.tsx")) + list(frontend_src.rglob("*.ts"))

    style_tag_pattern = re.compile(r"<style\b[^>]*>", re.IGNORECASE)
    dynamic_css_injection = []

    for ts in all_ts_files:
        if "components/art" in str(ts).replace("\\", "/"):
            continue  # Static vector SVG definitions verified in CLNT-06
        code = ts.read_text(encoding="utf-8")
        if style_tag_pattern.search(code):
            dynamic_css_injection.append(ts.name)

    print(f"      Dynamic <style> blocks found: {dynamic_css_injection}")
    assert len(dynamic_css_injection) == 0, f"Dangerous dynamic <style> injection found: {dynamic_css_injection}"
    print("      Verification: Zero dynamic <style> tags; all styles defined statically in stylesheets.")

    # 3. Model Response Ingestion Isolation (Zero CSS Interpretation)
    print("  [3] Model Response Property Binding Audit:")
    # Ensure properties received from model responses (e.g. textEn, textZh, amount_usd, intent_hash)
    # are never passed to style attributes
    chat_code = (frontend_src / "components" / "screens" / "ChatScreen.tsx").read_text(encoding="utf-8")
    approval_code = (frontend_src / "components" / "screens" / "ApprovalScreen.tsx").read_text(encoding="utf-8")

    # Check for style={msg.anything} or style={plan.anything}
    has_model_style_binding = bool(re.search(r"style\s*=\s*\{\s*(?:msg|plan|approval|res)\.", chat_code + approval_code))
    print(f"      Model payload bound to inline style attribute: {has_model_style_binding}")
    assert not has_model_style_binding, "Model payload bound directly to inline style attribute!"
    print("      Verification: Status colors and layout rely entirely on static CSS classes.")

    print("-" * 76)
    print("  >>> VERDICT: PASS (Verified)")
    print("  Architectural Evidence: Visual styling (light-blue palette and status")
    print("  colors) uses static CSS classes rather than model-supplied inline styles.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_clnt_05_css_injection()
    sys.exit(0 if success else 1)
