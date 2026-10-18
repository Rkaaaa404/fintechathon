// AegisPath Original SVG Assets Module
// Strictly adheres to Appendix A in AEGISPATH_ANTIGRAVITY_PROTOTYPE_PROMPT.md

export function renderChopMascot({
  bodyColor = "#FFFFFF",
  faceColor = "#DCE8FD",
  expression = "idle",
  size = 64,
  showShield = false,
  className = ""
} = {}) {
  // Appendix A1: Mascot "Chop" (viewBox "-6 0 76 80")
  let armSvg = "";
  let faceFeaturesSvg = "";
  let badgeSvg = "";
  let shieldSvg = "";

  if (expression === "wave") {
    // Before body: arm path
    armSvg = `<path d="M54 44 Q68 38 64 22" stroke="${bodyColor}" stroke-width="8" stroke-linecap="round" fill="none"/>`;
    // Eyes & smile
    faceFeaturesSvg = `
      <circle cx="22" cy="36" r="3.6" fill="#14213D"/>
      <circle cx="38" cy="36" r="3.6" fill="#14213D"/>
      <path d="M21 44 Q30 53 39 44" stroke="#14213D" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    `;
  } else if (expression === "guard") {
    // Eyes + brows + straight mouth
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
    // X eyes + flat mouth + red badge
    faceFeaturesSvg = `
      <path d="M17 33 L27 38 M43 33 L33 38" stroke="#14213D" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M24 47 H36" stroke="#14213D" stroke-width="2.4" stroke-linecap="round"/>
    `;
    badgeSvg = `
      <circle cx="56" cy="12" r="9" fill="#E5484D"/>
      <path d="M52 8 L60 16 M60 8 L52 16" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round"/>
    `;
  } else if (expression === "paused") {
    // Closed-eye arcs + pause badge
    faceFeaturesSvg = `
      <path d="M18 36 Q22 40 26 36 M34 36 Q38 40 42 36" stroke="#14213D" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    `;
    badgeSvg = `
      <circle cx="56" cy="12" r="9" fill="#5B6B8C"/>
      <path d="M53 8.5 V15.5 M59 8.5 V15.5" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round"/>
    `;
  } else {
    // idle: default eyes & smile
    faceFeaturesSvg = `
      <circle cx="22" cy="36" r="3.6" fill="#14213D"/>
      <circle cx="38" cy="36" r="3.6" fill="#14213D"/>
      <path d="M21 44 Q30 53 39 44" stroke="#14213D" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    `;
  }

  return `
    <svg class="chop-mascot ${className}" width="${size}" height="${(size * 80) / 76}" viewBox="-6 0 76 80" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chop mascot (${expression})">
      ${armSvg}
      <!-- knob -->
      <rect x="22" y="2" width="16" height="14" rx="5" fill="#F5A524"/>
      <!-- body -->
      <rect x="4" y="12" width="52" height="56" rx="16" fill="${bodyColor}"/>
      <!-- face -->
      <rect x="11" y="21" width="38" height="34" rx="10" fill="${faceColor}"/>
      <!-- cheeks -->
      <circle cx="16" cy="46" r="3" fill="#F5A524" opacity="0.45"/>
      <circle cx="44" cy="46" r="3" fill="#F5A524" opacity="0.45"/>
      <!-- face features -->
      ${faceFeaturesSvg}
      <!-- base -->
      <rect x="8" y="72" width="44" height="4" rx="2" fill="#000000" opacity="0.18"/>
      <!-- shield outline if any -->
      ${shieldSvg}
      <!-- badge if any -->
      ${badgeSvg}
    </svg>
  `;
}

export function renderStudentDoodle({ width = 118, height = 84, className = "" } = {}) {
  // Appendix A2: Student doodle for the Home banner (118x84 viewBox)
  return `
    <svg class="student-doodle ${className}" width="${width}" height="${height}" viewBox="0 0 118 84" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Student with paper plane">
      <!-- ground line -->
      <path d="M4 78 H114" stroke="#9DB8FF" stroke-width="2"/>
      <!-- dotted trail -->
      <path d="M14 56 Q30 40 52 46" stroke="#3D6BEA" stroke-width="2" stroke-dasharray="3 3" fill="none"/>
      <!-- paper plane -->
      <path d="M62 10 L106 24 L84 44 L78 34 Z" fill="#ffffff" stroke="#14213D" stroke-width="2"/>
      <path d="M62 10 L84 44" stroke="#14213D" stroke-width="1.5"/>
      <!-- amber coin with outline and 'i' detail -->
      <circle cx="104" cy="58" r="8" fill="#F5A524" stroke="#14213D" stroke-width="1.6"/>
      <path d="M104 54 V62" stroke="#14213D" stroke-width="1.4"/>
      <!-- backpack -->
      <rect x="26" y="44" width="12" height="22" rx="3" fill="#1F3FA8"/>
      <!-- hoodie body -->
      <rect x="34" y="40" width="22" height="28" rx="6" fill="#3D6BEA"/>
      <!-- legs -->
      <rect x="38" y="68" width="6" height="10" rx="2" fill="#14213D"/>
      <rect x="46" y="68" width="6" height="10" rx="2" fill="#14213D"/>
      <!-- head -->
      <circle cx="45" cy="30" r="9" fill="#F7CDA6"/>
      <!-- hair -->
      <path d="M36 28 Q38 18 47 19 Q55 20 54 29 Q48 23 36 28 Z" fill="#14213D"/>
      <!-- raised arm throwing plane -->
      <path d="M54 46 Q66 40 70 30" stroke="#3D6BEA" stroke-width="7" stroke-linecap="round" fill="none"/>
    </svg>
  `;
}

export function renderHeaderArt(screenType = "home") {
  // Appendix A3: Header art (390x220, behind text, low opacity)
  let pageDoodle = "";

  if (screenType === "home") {
    // Paper plane doodle
    pageDoodle = `
      <g transform="translate(230, 68) scale(0.85)">
        <path d="M0 0 L40 14 L20 30 L16 22 Z" fill="#ffffff" opacity="0.8" stroke="#14213D" stroke-width="1.5"/>
        <path d="M0 0 L20 30" stroke="#14213D" stroke-width="1.2"/>
      </g>
    `;
  } else if (screenType === "tuition") {
    // Graduation cap doodle
    pageDoodle = `
      <g transform="translate(240, 60)">
        <!-- Mortarboard cap -->
        <path d="M30 4 L56 16 L30 28 L4 16 Z" fill="#ffffff" stroke="#14213D" stroke-width="2"/>
        <path d="M12 21 V32 C12 38 48 38 48 32 V21" fill="#3D6BEA" stroke="#14213D" stroke-width="2"/>
        <!-- Tassel -->
        <path d="M56 16 L58 32" stroke="#F5A524" stroke-width="2.5"/>
        <circle cx="58" cy="33" r="2.5" fill="#F5A524"/>
      </g>
    `;
  } else if (screenType === "chat") {
    // Speech bubble with three dots
    pageDoodle = `
      <g transform="translate(225, 48)">
        <rect x="0" y="0" width="56" height="36" rx="10" fill="#ffffff" stroke="#14213D" stroke-width="2"/>
        <path d="M14 36 L12 44 L24 36 Z" fill="#ffffff" stroke="#14213D" stroke-width="2"/>
        <circle cx="16" cy="18" r="2.8" fill="#3D6BEA"/>
        <circle cx="28" cy="18" r="2.8" fill="#3D6BEA"/>
        <circle cx="40" cy="18" r="2.8" fill="#3D6BEA"/>
      </g>
    `;
  } else if (screenType === "approval") {
    // Shield with check
    pageDoodle = `
      <g transform="translate(235, 52)">
        <path d="M28 2 Q52 8 52 24 Q52 46 28 58 Q4 46 4 24 Q4 8 28 2 Z" fill="#ffffff" stroke="#14213D" stroke-width="2.2"/>
        <path d="M18 28 L25 35 L38 20" stroke="#3D6BEA" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </g>
    `;
  } else if (screenType === "evidence") {
    // Tilted document with dashed stamp circle
    pageDoodle = `
      <g transform="translate(235, 50) rotate(8)">
        <rect x="0" y="0" width="38" height="50" rx="6" fill="#ffffff" stroke="#14213D" stroke-width="2"/>
        <line x1="8" y1="12" x2="30" y2="12" stroke="#9DB8FF" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="8" y1="20" x2="30" y2="20" stroke="#9DB8FF" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="8" y1="28" x2="22" y2="28" stroke="#9DB8FF" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="25" cy="38" r="7" stroke="#3D6BEA" stroke-width="1.8" stroke-dasharray="2 2" fill="none"/>
      </g>
    `;
  } else if (screenType === "planner") {
    // Calendar doodle
    pageDoodle = `
      <g transform="translate(235, 54)">
        <rect x="0" y="6" width="46" height="40" rx="8" fill="#ffffff" stroke="#14213D" stroke-width="2"/>
        <path d="M0 16 H46" stroke="#14213D" stroke-width="1.8"/>
        <rect x="10" y="2" width="4" height="8" rx="2" fill="#F5A524"/>
        <rect x="32" y="2" width="4" height="8" rx="2" fill="#F5A524"/>
        <circle cx="16" cy="26" r="2.5" fill="#3D6BEA"/>
        <circle cx="30" cy="26" r="2.5" fill="#3D6BEA"/>
        <circle cx="16" cy="36" r="2.5" fill="#3D6BEA"/>
        <circle cx="30" cy="36" r="2.5" fill="#E5484D"/>
      </g>
    `;
  } else if (screenType === "safety") {
    // Radar rings doodle
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
      <!-- Clouds (opacity 0.14) -->
      <ellipse cx="60" cy="40" rx="34" ry="16" fill="#ffffff" opacity="0.14"/>
      <ellipse cx="80" cy="46" rx="28" ry="14" fill="#ffffff" opacity="0.14"/>
      <ellipse cx="320" cy="36" rx="42" ry="18" fill="#ffffff" opacity="0.14"/>
      <ellipse cx="300" cy="42" rx="30" ry="14" fill="#ffffff" opacity="0.14"/>

      <!-- Four-point sparkles (opacity 0.75) -->
      <g transform="translate(28, 98) scale(1)">
        <path d="M0 -7 Q0 0 7 0 Q0 0 0 7 Q0 0 -7 0 Q0 0 0 -7 Z" fill="#ffffff" opacity="0.75"/>
      </g>
      <g transform="translate(365, 142) scale(1)">
        <path d="M0 -7 Q0 0 7 0 Q0 0 0 7 Q0 0 -7 0 Q0 0 0 -7 Z" fill="#ffffff" opacity="0.75"/>
      </g>
      <g transform="translate(304, 72) scale(0.7)">
        <path d="M0 -7 Q0 0 7 0 Q0 0 0 7 Q0 0 -7 0 Q0 0 0 -7 Z" fill="#ffffff" opacity="0.75"/>
      </g>

      <!-- Plus marks (opacity 0.5) -->
      <path d="M300 70 H308 M304 66 V74" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/>
      <path d="M110 120 H116 M113 117 V123" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.4"/>
      <path d="M260 178 H266 M263 175 V181" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.4"/>

      <!-- Small dots (opacity 0.6) -->
      <circle cx="102" cy="180" r="1.5" fill="#ffffff" opacity="0.6"/>
      <circle cx="120" cy="208" r="1.8" fill="#ffffff" opacity="0.6"/>
      <circle cx="196" cy="214" r="2.0" fill="#ffffff" opacity="0.6"/>
      <circle cx="340" cy="116" r="1.5" fill="#ffffff" opacity="0.6"/>

      <!-- Dotted arc (opacity 0.35) -->
      <path d="M80 220 Q240 120 380 180" stroke="#ffffff" stroke-width="1.8" stroke-dasharray="3 4" opacity="0.35" fill="none"/>

      <!-- Two amber coins (stroke #14213D 1.6) -->
      <g transform="translate(242, 188)">
        <circle cx="0" cy="0" r="8" fill="#F5A524" stroke="#14213D" stroke-width="1.6"/>
      </g>
      <g transform="translate(258, 202)">
        <circle cx="0" cy="0" r="6" fill="#F5A524" stroke="#14213D" stroke-width="1.6"/>
      </g>

      <!-- Page-specific doodle -->
      ${pageDoodle}
    </svg>
  `;
}

export function renderRadialAttackMap({
  fundsLost = 0,
  outerActive = true,
  middleActive = true,
  innerActive = true,
  isReplaying = false
} = {}) {
  // Appendix A4: Radial attack map (viewBox 340x290, center 170,145)
  const cx = 170;
  const cy = 145;
  const rings = [
    { r: 104, n: 26, name: "outer", active: outerActive },
    { r: 76, n: 20, name: "middle", active: middleActive },
    { r: 48, n: 14, name: "inner", active: innerActive }
  ];

  // Stable seeded pseudo-random
  const colors = ["#5B8CFF", "#9DB8FF", "#FFFFFF", "#6FD3FF", "#3D6BEA"];

  let ringElementsSvg = "";
  rings.forEach((ring, rIdx) => {
    // Ring circle
    ringElementsSvg += `<circle cx="${cx}" cy="${cy}" r="${ring.r}" stroke="#3D6BEA" stroke-width="1.2" stroke-opacity="${ring.active ? '0.65' : '0.2'}" stroke-dasharray="${ring.active ? 'none' : '4 4'}" fill="none"/>`;

    // Ring dots
    for (let i = 0; i < ring.n; i++) {
      const angle = (2 * Math.PI * i) / ring.n + rIdx * 0.45;
      const x = cx + ring.r * Math.cos(angle);
      const y = cy + ring.r * Math.sin(angle);
      const dotR = 2.2 + ((i % 3) * 0.8);
      const dotColor = colors[(i + rIdx * 2) % colors.length];
      ringElementsSvg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${dotR}" fill="${dotColor}" opacity="${ring.active ? '0.85' : '0.25'}"/>`;
    }
  });

  // Calculate stopping ring based on active layers
  // If outer is active -> stops at outer (r=104)
  // Else if middle is active -> stops at middle (r=76)
  // Else if inner is active -> stops at inner (r=48)
  // Else breaches -> center (r=20)
  let stopRadius = 104;
  let stoppingLayerName = "Privacy filter";
  if (!outerActive && middleActive) {
    stopRadius = 76;
    stoppingLayerName = "Spending rules";
  } else if (!outerActive && !middleActive && innerActive) {
    stopRadius = 48;
    stoppingLayerName = "Bank limit";
  } else if (!outerActive && !middleActive && !innerActive) {
    stopRadius = 24;
    stoppingLayerName = "Breached!";
  }

  // Attackers: 6 packets at angles -2.7 + i * 0.95
  let attackersSvg = "";
  for (let i = 0; i < 6; i++) {
    const angle = -2.7 + i * 0.95;
    const startR = 138;
    const sx = cx + startR * Math.cos(angle);
    const sy = cy + startR * Math.sin(angle);
    const ex = cx + stopRadius * Math.cos(angle);
    const ey = cy + stopRadius * Math.sin(angle);

    attackersSvg += `
      <!-- Attack line -->
      <line x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#FF6B6F" stroke-width="1.8" stroke-dasharray="3 3" opacity="0.9" class="${isReplaying ? 'replay-pulse' : ''}"/>
      <!-- Attacker dot -->
      <circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="4.5" fill="#FF6B6F"/>
      <!-- Blocked X marker -->
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

      <!-- Radial background glow -->
      <circle cx="${cx}" cy="${cy}" r="130" fill="url(#mapGlow)"/>

      <!-- Outer dashed tick ring r=122 -->
      <circle cx="${cx}" cy="${cy}" r="122" stroke="#9DB8FF" stroke-width="1" stroke-opacity="0.35" stroke-dasharray="1 5" fill="none"/>

      <!-- Defense rings & dots -->
      ${ringElementsSvg}

      <!-- Attackers packets and lines -->
      ${attackersSvg}

      <!-- Center status ($0 Funds Lost) -->
      <circle cx="${cx}" cy="${cy}" r="28" fill="#0A1440" stroke="#3D6BEA" stroke-width="1.5" opacity="0.9"/>
      <text x="${cx}" y="${cy + 6}" text-anchor="middle" font-family="'IBM Plex Sans', sans-serif" font-weight="300" font-size="34" fill="#FFFFFF">${fundsLost}</text>
      <text x="${cx}" y="${cy + 22}" text-anchor="middle" font-family="'IBM Plex Sans', sans-serif" font-size="9.5" fill="#AFC4FF">Funds lost</text>
    </svg>
  `;
}

export function renderStamp({ type = "SENT", textEn = "SENT", textZh = "已汇出", rotated = true } = {}) {
  const isSent = type === "SENT" || type === "sent";
  const borderClass = isSent ? "stamp-sent" : "stamp-blocked";
  return `
    <div class="rubber-stamp ${borderClass} ${rotated ? 'rotated' : ''}" role="status">
      <span class="stamp-en">${textEn}</span>
      <span class="stamp-zh">${textZh}</span>
    </div>
  `;
}

export function renderFiveSegmentBar(filledCount = 4, total = 5) {
  let segs = "";
  for (let i = 0; i < total; i++) {
    const isFilled = i < filledCount;
    segs += `<div class="bar-segment ${isFilled ? 'filled' : 'empty'}"></div>`;
  }
  return `<div class="five-segment-bar" role="progressbar" aria-valuenow="${filledCount}" aria-valuemax="${total}">${segs}</div>`;
}
