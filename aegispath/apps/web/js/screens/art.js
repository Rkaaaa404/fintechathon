// Dev Art Gallery Screen (Route /dev/art)
import { renderChopMascot, renderStudentDoodle, renderRadialAttackMap, renderStamp } from '../svgAssets.js';

export function renderArtScreen(state) {
  return `
    <div class="screen-container art-screen" style="padding: 24px; background: #FFFFFF; min-height: 100%;">
      <header class="art-header" style="border-bottom: 1px solid var(--line); padding-bottom: 16px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="font-size: 22px; font-weight: 700; color: var(--blue-deep); margin: 0 0 4px 0;">AegisPath UI-Art Showcase</h1>
            <p style="font-size: 13px; color: var(--slate); margin: 0;">Verified SVG Assets from Appendix A · Route: /dev/art</p>
          </div>
          <button class="pill-testnet" onclick="window.location.hash='#/'" style="cursor: pointer;">Back to Home</button>
        </div>
      </header>

      <div style="font-size: 16px; font-weight: 700; margin: 24px 0 12px 0;">Mascot "Chop" Expressions</div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px;">
        <div class="chop-card" style="background: var(--mist); border-radius: var(--radius-tile); padding: 14px; text-align: center;">
          ${renderChopMascot({ expression: 'idle', size: 64, bodyColor: '#3D6BEA', faceColor: '#FFFFFF' })}
          <div style="font-size: 12px; font-weight: 600; margin-top: 8px;">Idle (Blue)</div>
        </div>
        <div class="chop-card" style="background: var(--blue); color: #fff; border-radius: var(--radius-tile); padding: 14px; text-align: center;">
          ${renderChopMascot({ expression: 'wave', size: 64, bodyColor: '#FFFFFF', faceColor: '#DCE8FD' })}
          <div style="font-size: 12px; font-weight: 600; margin-top: 8px;">Wave (Hero)</div>
        </div>
        <div class="chop-card" style="background: var(--mist); border-radius: var(--radius-tile); padding: 14px; text-align: center;">
          ${renderChopMascot({ expression: 'guard', size: 64, bodyColor: '#3D6BEA', faceColor: '#FFFFFF', showShield: true })}
          <div style="font-size: 12px; font-weight: 600; margin-top: 8px;">Guard (Shield)</div>
        </div>
        <div class="chop-card" style="background: var(--mist); border-radius: var(--radius-tile); padding: 14px; text-align: center;">
          ${renderChopMascot({ expression: 'block', size: 64, bodyColor: '#3D6BEA', faceColor: '#FFFFFF' })}
          <div style="font-size: 12px; font-weight: 600; margin-top: 8px;">Block (X-Eyes)</div>
        </div>
        <div class="chop-card" style="background: var(--mist); border-radius: var(--radius-tile); padding: 14px; text-align: center;">
          ${renderChopMascot({ expression: 'paused', size: 64, bodyColor: '#3D6BEA', faceColor: '#FFFFFF' })}
          <div style="font-size: 12px; font-weight: 600; margin-top: 8px;">Paused (Kill Switch)</div>
        </div>
      </div>

      <div style="font-size: 16px; font-weight: 700; margin: 28px 0 12px 0;">Student Banner Doodle</div>
      <div style="background: var(--sky); padding: 20px; border-radius: var(--radius-card); display: flex; justify-content: center;">
        ${renderStudentDoodle()}
      </div>

      <div style="font-size: 16px; font-weight: 700; margin: 28px 0 12px 0;">Three-Ring Radial Attack Map</div>
      <div style="background: var(--night); border-radius: var(--radius-card); padding: 20px; text-align: center;">
        ${renderRadialAttackMap({ stoppedRing: 'outer', fundsLost: 0 })}
      </div>
    </div>
  `;
}
