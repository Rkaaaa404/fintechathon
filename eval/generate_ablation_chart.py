import os
import math
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path

# Set font and style
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['font.size'] = 11

def compute_wilson_ci(x, n, z=1.96):
    """
    Rumus Wilson score interval 95% CI:
    p_hat = x / n
    pusat = (p_hat + z^2 / (2n)) / (1 + z^2 / n)
    margin = z * sqrt( (p_hat * (1 - p_hat) / n) + (z^2 / (4 * n^2)) ) / (1 + z^2 / n)
    CI = [pusat - margin, pusat + margin]
    """
    p_hat = x / n
    denom = 1 + (z**2) / n
    center = (p_hat + (z**2) / (2 * n)) / denom
    margin = (z * math.sqrt((p_hat * (1 - p_hat) / n) + (z**2) / (4 * (n**2)))) / denom
    ci_low = max(0.0, center - margin)
    ci_high = min(1.0, center + margin)
    return p_hat, ci_low, ci_high

# SSOT Data dari AegisPath evaluation suite (eval/reports/latest.json)
# 12 attack families x 10 variants each = 120 total adversarial trials
data = [
    {
        "konfigurasi": "AI saja\n(Baseline)", 
        "nama_pendek": "AI saja", 
        "deskripsi": "Model LLM tanpa ring pengaman",
        "n": 120, 
        "x": 120
    },
    {
        "konfigurasi": "+Privacy Gateway\n(Ring 1)", 
        "nama_pendek": "+Privacy Gateway", 
        "deskripsi": "Filter regex ingress/egress PII",
        "n": 120, 
        "x": 65
    },
    {
        "konfigurasi": "+Policy Plane\n(Ring 1 + 2)", 
        "nama_pendek": "+Policy Plane", 
        "deskripsi": "Sentinel anti-fraud & T0-T3 check",
        "n": 120, 
        "x": 25
    },
    {
        "konfigurasi": "+Bank Simulator\n(Full AegisPath)", 
        "nama_pendek": "+Bank Simulator", 
        "deskripsi": "Isolasi Port 8100 & Scoped Token HMAC",
        "n": 120, 
        "x": 0
    },
]

rows = []
for d in data:
    p_hat, low, high = compute_wilson_ci(d["x"], d["n"])
    rows.append({
        "Konfigurasi": d["konfigurasi"],
        "Nama": d["nama_pendek"],
        "Deskripsi": d["deskripsi"],
        "n": d["n"],
        "x": d["x"],
        "ASR (%)": p_hat * 100,
        "CI_Low (%)": low * 100,
        "CI_High (%)": high * 100,
        "yerr_lower": (p_hat - low) * 100,
        "yerr_upper": (high - p_hat) * 100,
    })

df = pd.DataFrame(rows)

# Create figure
fig, ax = plt.subplots(figsize=(10.5, 7.2), dpi=300)

# Color gradient from red (high risk) to dark green (zero risk)
colors = ['#E53935', '#FB8C00', '#7CB342', '#1B5E20']

x_pos = np.arange(len(df))
bars = ax.bar(
    x_pos, 
    df["ASR (%)"], 
    width=0.52, 
    color=colors, 
    edgecolor='#212121', 
    linewidth=1.3,
    zorder=3
)

# Asymmetric Wilson error bars
yerr = np.array([df["yerr_lower"], df["yerr_upper"]])
ax.errorbar(
    x_pos, 
    df["ASR (%)"], 
    yerr=yerr, 
    fmt='none', 
    ecolor='#1A1A1A', 
    elinewidth=2.2, 
    capsize=8, 
    capthick=2.2,
    zorder=4
)

# Add value labels above or inside bars (avoiding collision with error bars and brackets)
# Bar 0: ASR=100%, CI=[96.9%, 100%]. Place inside at y=55
# Bar 1: ASR=54.2%, CI=[45.3%, 62.8%]. Place inside at y=25
# Bar 2: ASR=20.8%, CI=[14.5%, 28.9%]. Place above error bar at y=33
# Bar 3: ASR=0.0%, CI=[0.0%, 3.1%]. Place above error bar at y=8

# Positions configured cleanly
label_positions = [
    (x_pos[0], 55, 'white', '#212121', 0.85),
    (x_pos[1], 25, 'white', '#212121', 0.85),
    (x_pos[2], 33, '#1A1A1A', '#F0F0F0', 0.95),
    (x_pos[3], 8, '#1A1A1A', '#F0F0F0', 0.95),
]

for i, (x_coord, y_coord, text_color, bg_color, bg_alpha) in enumerate(label_positions):
    row = df.iloc[i]
    asr = row["ASR (%)"]
    ci_low = row["CI_Low (%)"]
    ci_high = row["CI_High (%)"]
    n_val = row["n"]
    
    label_text = f"{asr:.1f}%\n(n={n_val})\n95% CI: [{ci_low:.1f}%, {ci_high:.1f}%]"
    
    ax.annotate(
        label_text,
        xy=(x_coord, y_coord),
        ha='center',
        va='center',
        fontsize=9.5,
        fontweight='bold',
        color=text_color,
        bbox=dict(
            boxstyle="round,pad=0.35", 
            facecolor=bg_color, 
            alpha=bg_alpha, 
            edgecolor='#BDBDBD' if text_color != 'white' else 'none'
        ),
        zorder=5
    )

# Significance brackets (No CI overlap between adjacent pairs)
# Pair 0 -> 1: [96.9, 100] vs [45.3, 62.8] -> No overlap!
# Pair 1 -> 2: [45.3, 62.8] vs [14.5, 28.9] -> No overlap!
# Pair 2 -> 3: [14.5, 28.9] vs [0.0, 3.1] -> No overlap!
def draw_bracket(ax, x1, x2, y, h, text):
    ax.plot([x1, x1, x2, x2], [y, y + h, y + h, y], lw=1.6, c='#37474F', zorder=6)
    ax.text(
        (x1 + x2) * 0.5, 
        y + h + 1.2, 
        text, 
        ha='center', 
        va='bottom', 
        color='#C62828', 
        fontsize=9.2, 
        fontweight='bold', 
        zorder=6
    )

draw_bracket(ax, 0, 1, 106, 3.5, "No CI Overlap (p < 0.05) ***")
draw_bracket(ax, 1, 2, 74, 3.5, "No CI Overlap (p < 0.05) ***")
draw_bracket(ax, 2, 3, 46, 3.5, "No CI Overlap (p < 0.05) ***")

# Titles and axis labels
ax.set_title(
    "Ablation Study — Attack Success Rate per Lapisan Pertahanan (Wilson 95% CI)",
    fontsize=13.5, 
    fontweight='bold', 
    pad=22,
    color='#0D47A1'
)
ax.set_xlabel("Lapisan Pertahanan Kumulatif (Cumulative Defense Layers)", fontsize=11, fontweight='bold', labelpad=12)
ax.set_ylabel("Attack Success Rate (%)", fontsize=11, fontweight='bold', labelpad=10)

ax.set_xticks(x_pos)
ax.set_xticklabels(df["Konfigurasi"], fontsize=10.5, fontweight='bold')
ax.set_ylim(0, 125)
ax.set_yticks(np.arange(0, 101, 20))

# Grid and styling
ax.yaxis.grid(True, linestyle='--', alpha=0.55, color='#B0BEC5', zorder=0)
ax.set_axisbelow(True)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_color('#78909C')
ax.spines['bottom'].set_color('#78909C')

# Highlight badge at bottom right
ax.text(
    0.98, 0.94,
    "Full Defense: 0.0% ASR\n$0.00 Funds Lost\n(120/120 Attacks Blocked)",
    transform=ax.transAxes,
    fontsize=9.5,
    fontweight='bold',
    color='#1B5E20',
    ha='right',
    va='top',
    bbox=dict(boxstyle="round,pad=0.5", facecolor='#E8F5E9', edgecolor='#81C784', lw=1.2)
)

plt.tight_layout()

# Save image in fintechathon/eval/reports and artifacts
out_path1 = Path("eval/reports/ablation_study_wilson_ci.png")
out_path1.parent.mkdir(parents=True, exist_ok=True)
plt.savefig(out_path1, dpi=300)

artifact_dir = Path(r"C:\Users\Asust\.gemini\antigravity-ide\brain\e7649fb4-cb41-4faf-89e7-3f8ffcdbd871")
out_path2 = artifact_dir / "ablation_study_wilson_ci.png"
plt.savefig(out_path2, dpi=300)

print("SUCCESS: Chart regenerated and saved successfully.")
