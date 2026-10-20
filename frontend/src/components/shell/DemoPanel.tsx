'use client';

import React, { useState, useEffect } from 'react';
import { AppPresentationState } from '@/types';

interface DemoPanelProps {
  currentState: AppPresentationState;
  onStateChange: (state: AppPresentationState) => void;
  backendOnline: boolean | null;
}

export const DemoPanel: React.FC<DemoPanelProps> = ({
  currentState,
  onStateChange,
  backendOnline,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check URL param ?demo=1 or stored session preference
    const params = new URLSearchParams(window.location.search);
    let storedOpen = false;
    try {
      storedOpen = sessionStorage.getItem('aegis_demo_panel') === '1';
    } catch {
      // Demo controls still work in memory when browser storage is denied.
    }
    if (params.get('demo') === '1' || storedOpen) setIsOpen(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsOpen((prev) => {
          const next = !prev;
          try {
            sessionStorage.setItem('aegis_demo_panel', next ? '1' : '0');
          } catch {
            // Persistence is optional for this presentation control.
          }
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) {
    return null; // Zero trace in normal professional website view
  }

  return (
    <aside
      id="aegis-demo-drawer"
      className="demo-floating-panel"
      role="dialog"
      aria-label="Judge Demo Switcher"
    >
      <div className="demo-panel-header">
        <div className="flex items-center gap-2">
          <span className="demo-badge-pill">DEMO / EVAL</span>
          <span className="font-bold text-[12px] text-white">Judge Switcher</span>
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            try {
              sessionStorage.setItem('aegis_demo_panel', '0');
            } catch {
              // Closing the panel does not require storage.
            }
          }}
          className="demo-close-btn"
          aria-label="Close demo panel"
          title="Close (Press Ctrl+Shift+D to reopen)"
        >
          ✕
        </button>
      </div>

      <div className="demo-panel-body">
        <label className="text-[11px] font-semibold text-[#6FD3FF] block mb-1">
          Simulated Presentation State:
        </label>
        <select
          id="demo-state-select"
          className="demo-select-control"
          value={currentState}
          onChange={(e) => onStateChange(e.target.value as AppPresentationState)}
        >
          <option value="default">State 1: Default (Normal)</option>
          <option value="waiting-approval">State 2: Waiting for Approval</option>
          <option value="payment-sent">State 3: Payment Sent Slip</option>
          <option value="attack-blocked">State 4: Attack Blocked</option>
          <option value="agent-paused">State 5: Agent Paused (Kill switch)</option>
          <option value="model-offline">State 6: Model Offline</option>
          <option value="empty-activity">State 7: Empty Activity</option>
        </select>

        <div className="demo-status-row">
          <span className="text-[10.5px] text-[#9DB8FF]">Backend Status:</span>
          {backendOnline === true ? (
            <span className="demo-status-live">● Live (:8000 / :8100)</span>
          ) : backendOnline === false ? (
            <span className="demo-status-offline">● Dual-Mode (Offline)</span>
          ) : (
            <span className="text-[10px] text-gray-400">Probing...</span>
          )}
        </div>

        <div className="demo-shortcut-tip">
          Shortcut: <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd> or <kbd>?demo=1</kbd>
        </div>
      </div>
    </aside>
  );
};
