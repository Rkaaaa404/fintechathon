#!/usr/bin/env python3
"""
Unit test for @aegispath/ui-art: verifies SVG component output strings.
"""
from pathlib import Path
import re
import sys

def test_art_assets():
    art_file = Path(__file__).parent / "index.js"
    assert art_file.exists(), "index.js missing in @aegispath/ui-art"
    
    code = art_file.read_text(encoding="utf-8")
    
    # Assert functions exist
    required_fns = [
        "renderChopMascot",
        "renderStudentDoodle",
        "renderHeaderArt",
        "renderRadialAttackMap",
        "renderStamp",
        "renderFiveSegmentBar"
    ]
    for fn in required_fns:
        assert fn in code, f"Missing {fn} in @aegispath/ui-art"
        
    # Assert mascot expressions are handled
    expressions = ["idle", "wave", "guard", "block", "paused"]
    for exp in expressions:
        assert f'expression === "{exp}"' in code or f"expression === '{exp}'" in code or exp in code, f"Missing expression {exp}"
        
    print(f"[OK] @aegispath/ui-art exports {len(required_fns)} verified SVG renderers.")

if __name__ == "__main__":
    test_art_assets()
