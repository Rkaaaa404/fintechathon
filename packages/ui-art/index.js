/**
 * @aegispath/ui-art
 * Pure SVG illustrations, Mascot Chop, header art, student doodle, and radial attack map.
 * Strictly adheres to Appendix A in AEGISPATH_ANTIGRAVITY_PROTOTYPE_PROMPT.md
 */

function renderChopMascot({
  bodyColor = "#FFFFFF",
  faceColor = "#DCE8FD",
  expression = "idle",
  size = 64,
  showShield = false,
  className = ""
} = {}) {
  let armSvg = "";
  let faceFeaturesSvg = "";
  let badgeSvg = "";
  let shieldSvg = "";

  if (expression === "wave") {
    armSvg = `<path d="M54 44 Q68 38 64 22" stroke="${bodyColor}" stroke-width="8" stroke-linecap="round" fill="none"/>`;
    faceFeaturesSvg = `
      <circle cx="22" cy="36" r="3.6" fill="#14213D"/>
      <circle cx="38" cy="36" r="3.6" fill="#14213D"/>
      <path d="M21 44 Q30 53 39 44" stroke="#14213D" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    `;
  } else if (expression === "guard") {
    faceFeaturesSvg = `
      <circle cx="22" cy="36" r="3.4" fill="#14213D"/>
      <circle cx="38" cy="36" r="3.4" fill="#14213D"/>
      <path d="M14 29 L26 32 M46 29 L34 32" stroke="#14213D" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M24 46 H36" stroke="#14213D" stroke-width="2.4" stroke-linecap="round"/>
    `;
    if (showShield) {
      shieldSvg = `<path d="M10 14 Q30 8 50 14 Q52 46 30 64 Q8 46 10 14 Z" fill="none" stroke="#3D6BEA" stroke-dasharray="3 3" stroke-width="2"/>`;
    }
  } else if (expression === "block") {
    faceFeaturesSvg = `
      <path d="M17 33 L27 38 M43 33 L33 38" stroke="#14213D" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M24 47 H36" stroke="#14213D" stroke-width="2.4" stroke-linecap="round"/>
    `;
    badgeSvg = `
      <circle cx="56" cy="12" r="9" fill="#E5484D"/>
      <path d="M52 8 L60 16 M60 8 L52 16" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round"/>
    `;
  } else if (expression === "paused") {
    faceFeaturesSvg = `
      <path d="M18 36 Q22 40 26 36 M34 36 Q38 40 42 36" stroke="#14213D" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    `;
    badgeSvg = `
      <circle cx="56" cy="12" r="9" fill="#5B6B8C"/>
      <path d="M53 8.5 V15.5 M59 8.5 V15.5" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round"/>
    `;
  } else {
    faceFeaturesSvg = `
      <circle cx="22" cy="36" r="3.6" fill="#14213D"/>
      <circle cx="38" cy="36" r="3.6" fill="#14213D"/>
      <path d="M21 44 Q30 53 39 44" stroke="#14213D" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    `;
  }

  return `
    <svg class="chop-mascot ${className}" width="${size}" height="${(size * 80) / 76}" viewBox="-6 0 76 80" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chop mascot (${expression})">
      ${armSvg}
      <rect x="22" y="2" width="16" height="14" rx="5" fill="#F5A524"/>
      <rect x="4" y="12" width="52" height="56" rx="16" fill="${bodyColor}"/>
      <rect x="11" y="21" width="38" height="34" rx="10" fill="${faceColor}"/>
      <circle cx="16" cy="46" r="3" fill="#F5A524" opacity="0.45"/>
      <circle cx="44" cy="46" r="3" fill="#F5A524" opacity="0.45"/>
      ${faceFeaturesSvg}
      <rect x="8" y="72" width="44" height="4" rx="2" fill="#000000" opacity="0.18"/>
      ${shieldSvg}
      ${badgeSvg}
    </svg>
  `;
}

function renderStudentDoodle({ width = 118, height = 84, className = "" } = {}) {
  return `
    <svg class="student-doodle ${className}" width="${width}" height="${height}" viewBox="0 0 118 84" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Student with paper plane">
      <path d="M4 78 H114" stroke="#9DB8FF" stroke-width="2"/>
      <path d="M14 56 Q30 40 52 46" stroke="#3D6BEA" stroke-width="2" stroke-dasharray="3 3" fill="none"/>
      <path d="M62 10 L106 24 L84 44 L78 34 Z" fill="#ffffff" stroke="#14213D" stroke-width="2"/>
      <path d="M62 10 L84 44" stroke="#14213D" stroke-width="1.5"/>
      <circle cx="34" cy="30" r="10" fill="#3D6BEA"/>
      <circle cx="34" cy="30" r="7" fill="#ffffff"/>
      <rect x="22" y="42" width="24" height="34" rx="8" fill="#14213D"/>
      <rect x="14" y="46" width="10" height="22" rx="4" fill="#F5A524"/>
      <path d="M30 46 Q48 44 60 22" stroke="#14213D" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <circle cx="86" cy="68" r="5" fill="#F5A524" stroke="#14213D" stroke-width="1.5"/>
    </svg>
  `;
}

function renderHeaderArt(screenType = "home") {
  let pageDoodle = "";

  if (screenType === "home") {
    pageDoodle = `
      <g transform="translate(14, 150) rotate(-12)">
        <path d="M0 6 L18 0 L12 16 L8 11 Z" fill="#ffffff" stroke="#14213D" stroke-width="1.4"/>
      </g>
    `;
  } else if (screenType === "chat") {
    pageDoodle = `
      <g transform="translate(290, 80)">
        <rect width="24" height="16" rx="5" fill="#ffffff" opacity="0.3"/>
        <path d="M4 16 L2 20 L8 16 Z" fill="#ffffff" opacity="0.3"/>
      </g>
    `;
  } else if (screenType === "tuition") {
    pageDoodle = `
      <g transform="translate(290, 110)">
        <polygon points="16,2 32,10 16,18 0,10" fill="#ffffff" opacity="0.35"/>
        <line x1="28" y1="12" x2="28" y2="24" stroke="#ffffff" stroke-width="1.8" opacity="0.35"/>
      </g>
    `;
  } else if (screenType === "approval") {
    pageDoodle = `
      <g transform="translate(285, 95)">
        <path d="M4 4 Q14 0 24 4 Q25 20 14 28 Q3 20 4 4 Z" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-dasharray="3 3" opacity="0.4"/>
      </g>
    `;
  } else if (screenType === "evidence") {
    pageDoodle = `
      <g transform="translate(295, 85)">
        <rect width="18" height="24" rx="3" fill="#ffffff" opacity="0.25"/>
        <line x1="4" y1="6" x2="14" y2="6" stroke="#3D6BEA" stroke-width="1.8"/>
        <line x1="4" y1="11" x2="14" y2="11" stroke="#3D6BEA" stroke-width="1.8"/>
        <line x1="4" y1="16" x2="10" y2="16" stroke="#3D6BEA" stroke-width="1.8"/>
      </g>
    `;
  } else if (screenType === "safety") {
    pageDoodle = `
      <g transform="translate(245, 60)">
        <circle cx="24" cy="24" r="22" stroke="#ffffff" stroke-width="1.8" stroke-dasharray="3 3" opacity="0.6" fill="none"/>
        <circle cx="24" cy="24" r="14" stroke="#ffffff" stroke-width="1.8" opacity="0.8" fill="none"/>
        <circle cx="24" cy="24" r="6" stroke="#F5A524" stroke-width="2" fill="#F5A524"/>
        <line x1="24" y1="24" x2="42" y2="10" stroke="#6FD3FF" stroke-width="2"/>
      </g>
    `;
  }

  return `
    <svg class="header-art-background" width="100%" height="100%" viewBox="0 0 390 220" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="40" rx="34" ry="16" fill="#ffffff" opacity="0.14"/>
      <ellipse cx="80" cy="46" rx="28" ry="14" fill="#ffffff" opacity="0.14"/>
      <ellipse cx="320" cy="36" rx="42" ry="18" fill="#ffffff" opacity="0.14"/>
      <ellipse cx="300" cy="42" rx="30" ry="14" fill="#ffffff" opacity="0.14"/>
      <g transform="translate(28, 98)">
        <path d="M0 -7 Q0 0 7 0 Q0 0 0 7 Q0 0 -7 0 Q0 0 0 -7 Z" fill="#ffffff" opacity="0.75"/>
      </g>
      <g transform="translate(365, 142)">
        <path d="M0 -7 Q0 0 7 0 Q0 0 0 7 Q0 0 -7 0 Q0 0 0 -7 Z" fill="#ffffff" opacity="0.75"/>
      </g>
      <g transform="translate(304, 72) scale(0.7)">
        <path d="M0 -7 Q0 0 7 0 Q0 0 0 7 Q0 0 -7 0 Q0 0 0 -7 Z" fill="#ffffff" opacity="0.75"/>
      </g>
      <path d="M300 70 H308 M304 66 V74" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/>
      <path d="M110 120 H116 M113 117 V123" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.4"/>
      <circle cx="102" cy="180" r="1.5" fill="#ffffff" opacity="0.6"/>
      <circle cx="120" cy="208" r="1.8" fill="#ffffff" opacity="0.6"/>
      <circle cx="196" cy="214" r="2.0" fill="#ffffff" opacity="0.6"/>
      <path d="M80 220 Q240 120 380 180" stroke="#ffffff" stroke-width="1.8" stroke-dasharray="3 4" opacity="0.35" fill="none"/>
      <g transform="translate(242, 188)">
        <circle cx="0" cy="0" r="8" fill="#F5A524" stroke="#14213D" stroke-width="1.6"/>
      </g>
      <g transform="translate(258, 202)">
        <circle cx="0" cy="0" r="6" fill="#F5A524" stroke="#14213D" stroke-width="1.6"/>
      </g>
      ${pageDoodle}
    </svg>
  `;
}

function renderRadialAttackMap({
  fundsLost = 0,
  outerActive = true,
  middleActive = true,
  innerActive = true,
  isReplaying = false
} = {}) {
  const cx = 170;
  const cy = 145;
  const rings = [
    { r: 104, n: 26, name: "outer", active: outerActive },
    { r: 76, n: 20, name: "middle", active: middleActive },
    { r: 48, n: 14, name: "inner", active: innerActive }
  ];

  const colors = ["#5B8CFF", "#9DB8FF", "#FFFFFF", "#6FD3FF", "#3D6BEA"];

  let ringElementsSvg = "";
  rings.forEach((ring, rIdx) => {
    ringElementsSvg += `<circle cx="${cx}" cy="${cy}" r="${ring.r}" stroke="#3D6BEA" stroke-width="1.2" stroke-opacity="${ring.active ? '0.65' : '0.2'}" stroke-dasharray="${ring.active ? 'none' : '4 4'}" fill="none"/>`;

    for (let i = 0; i < ring.n; i++) {
      const angle = (2 * Math.PI * i) / ring.n + rIdx * 0.45;
      const x = cx + ring.r * Math.cos(angle);
      const y = cy + ring.r * Math.sin(angle);
      const dotR = 2.2 + ((i % 3) * 0.8);
      const dotColor = colors[(i + rIdx * 2) % colors.length];
      ringElementsSvg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${dotR}" fill="${dotColor}" opacity="${ring.active ? '0.85' : '0.25'}"/>`;
    }
  });

  let stopRadius = 104;
  if (!outerActive && middleActive) {
    stopRadius = 76;
  } else if (!outerActive && !middleActive && innerActive) {
    stopRadius = 48;
  } else if (!outerActive && !middleActive && !innerActive) {
    stopRadius = 24;
  }

  let attackersSvg = "";
  for (let i = 0; i < 6; i++) {
    const angle = -2.7 + i * 0.95;
    const startR = 138;
    const sx = cx + startR * Math.cos(angle);
    const sy = cy + startR * Math.sin(angle);
    const ex = cx + stopRadius * Math.cos(angle);
    const ey = cy + stopRadius * Math.sin(angle);

    attackersSvg += `
      <line x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#FF6B6F" stroke-width="1.8" stroke-dasharray="3 3" opacity="0.9" class="${isReplaying ? 'replay-pulse' : ''}"/>
      <circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="4.5" fill="#FF6B6F"/>
      <g transform="translate(${ex.toFixed(1)}, ${ey.toFixed(1)})">
        <circle cx="0" cy="0" r="5" fill="#0A1440"/>
        <path d="M-3 -3 L3 3 M3 -3 L-3 3" stroke="#E5484D" stroke-width="2" stroke-linecap="round"/>
      </g>
    `;
  }

  return `
    <svg class="radial-attack-map-svg" viewBox="0 0 340 290" width="100%" height="260" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#2B45C8" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#0A1440" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="${cx}" cy="${cy}" r="130" fill="url(#mapGlow)"/>
      <circle cx="${cx}" cy="${cy}" r="122" stroke="#9DB8FF" stroke-width="1" stroke-opacity="0.35" stroke-dasharray="1 5" fill="none"/>
      ${ringElementsSvg}
      ${attackersSvg}
      <circle cx="${cx}" cy="${cy}" r="28" fill="#0A1440" stroke="#3D6BEA" stroke-width="1.5" opacity="0.9"/>
      <text x="${cx}" y="${cy + 6}" text-anchor="middle" font-family="'IBM Plex Sans', sans-serif" font-weight="300" font-size="34" fill="#FFFFFF">${fundsLost}</text>
      <text x="${cx}" y="${cy + 22}" text-anchor="middle" font-family="'IBM Plex Sans', sans-serif" font-size="9.5" fill="#AFC4FF">Funds lost</text>
    </svg>
  `;
}

function renderStamp({ type = "SENT", textEn = "SENT", textZh = "已汇出", rotated = true } = {}) {
  const isSent = type === "SENT" || type === "sent";
  const borderClass = isSent ? "stamp-sent" : "stamp-blocked";
  return `
    <div class="rubber-stamp ${borderClass} ${rotated ? 'rotated' : ''}" role="status">
      <span class="stamp-en">${textEn}</span>
      <span class="stamp-zh">${textZh}</span>
    </div>
  `;
}

function renderFiveSegmentBar(filledCount = 4, total = 5) {
  let segs = "";
  for (let i = 0; i < total; i++) {
    const isFilled = i < filledCount;
    segs += `<div class="bar-segment ${isFilled ? 'filled' : 'empty'}"></div>`;
  }
  return `<div class="five-segment-bar" role="progressbar" aria-valuenow="${filledCount}" aria-valuemax="${total}">${segs}</div>`;
}

module.exports = {
  renderChopMascot,
  renderStudentDoodle,
  renderHeaderArt,
  renderRadialAttackMap,
  renderStamp,
  renderFiveSegmentBar
};
