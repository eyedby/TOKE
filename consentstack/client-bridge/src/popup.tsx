import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { TokeTelemetryPanel } from './components/TokeTelemetryPanel';

interface LiveTelemetry {
  cookies: number;
  traps: number;
}

const ExtensionPopupMain: React.FC = () => {
  const [extensionEnabled, setExtensionEnabled] = useState<boolean>(true);
  const [walletKey, setWalletKey] = useState<string | null>(null);
  const [stats, setStats] = useState<LiveTelemetry>({ cookies: 0, traps: 0 });

  // 1. Sync counts and current active/disabled state on mount
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(["cookieCount", "trapCount", "extensionEnabled"], (data) => {
        setStats({
          cookies: data.cookieCount || 0,
          traps: data.trapCount || 0
        });
        if (data.extensionEnabled !== undefined) {
          setExtensionEnabled(data.extensionEnabled);
        }
      });
    }
  }, []);

  // Update body class dynamically to preserve your .disabled style rules
  useEffect(() => {
    document.body.classList.toggle('disabled', !extensionEnabled);
  }, [extensionEnabled]);

  // 2. Handle Extension Master Toggle
  const handleToggleChange = () => {
    const nextState = !extensionEnabled;
    setExtensionEnabled(nextState);
    
    if (typeof chrome !== 'undefined') {
      chrome.storage.local.set({ extensionEnabled: nextState });
      
      // Dispatch state out to current active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'TOGGLE', enabled: nextState });
        }
      });
    }
  };

  // 3. Solana Wallet Verification Hook
  const connectSolanaWallet = async () => {
    const provider = (window as any).solana || (window as any).phantom?.solana;
    if (provider) {
      try {
        const resp = await provider.connect();
        setWalletKey(resp.publicKey.toString());
      } catch (err) {
        console.log("Connection deferred or rejected.");
      }
    } else {
      window.open("https://phantom.app/", "_blank");
    }
  };

  const shortKey = walletKey ? `${walletKey.slice(0, 5)}...${walletKey.slice(-4)}` : null;

  return (
    <>
      {/* Header */}
      <div className="header">
        <span className="header-name">TOKE</span>
        <span className="header-sub">aiOut telemetry</span>
      </div>

      {/* Toggle */}
      <div className="toggle-row">
        <div>
          <div className="toggle-label">Extension</div>
          <div className={`toggle-status ${extensionEnabled ? 'on' : 'off'}`}>
            {extensionEnabled ? 'ACTIVE' : 'DISABLED'}
          </div>
        </div>
        <label className="switch">
          <input 
            type="checkbox" 
            checked={extensionEnabled} 
            onChange={handleToggleChange} 
          />
          <span className="slider"></span>
        </label>
      </div>

      {/* Telemetry Readouts */}
      <div className="section-label">Signal</div>
      <div className="meter-container">
        <div className="meter-row">
          <span className="label">Fingerprint Blocks</span>
          <span className="value">{stats.traps}</span>
        </div>
        <div className="meter-row">
          <span className="label">Spoofed Cookies</span>
          <span className="value">{stats.cookies}</span>
        </div>
      </div>

      {/* TOKE: Political Currency */}
      <a href="https://keepaion.com/issues.html" target="_blank" className="btn toke-btn">
        ⚡ Political Currency — TOKE
      </a>

      {/* React Embedded Control System (AMOK verify button lives inside here) */}
      <TokeTelemetryPanel />

      {/* Wallet Infrastructure Handshake */}
      <button onClick={connectSolanaWallet} className="btn wallet-btn">
        {shortKey ? `IDENTITY: ${shortKey}` : 'Connect Wallet'}
      </button>
    </>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<ExtensionPopupMain />);
}
