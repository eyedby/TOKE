import React, { useState, useEffect, useRef } from 'react';
import { Delta9MintEngine } from './mintEngine';
import { XdpTelemetryParser } from './xdpParser';
import { Delta9ChatEngine } from './chatEngine';

export default function TugOfWarDashboard() {
  const [timeLeft, setTimeLeft] = useState(172800); // 48 hours in seconds
  const [voteTx, setVoteTx] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liveToken, setLiveToken] = useState("AWAITING INITIAL MINT...");
  const [stats, setStats] = useState({ scrapersBlocked: 14209, piiCordsCut: 432, amokBurned: 89045 });
  
  // Chat Module State
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState([
    { text: "AI SCRAPERS ARE OVER-HARVESTING THE CORE SUBSTRATE.", sender: "NODE_4081", sig: "MSG_SIG_[f23a9d]", timestamp: Date.now() - 60000 },
    { text: "BURN AMOK TO INTEGRATE INTENTIONAL DEBATE.", sender: "NODE_9921", sig: "MSG_SIG_[88bc11]", timestamp: Date.now() - 30000 }
  ]);

  const mintEngineRef = useRef(new Delta9MintEngine());
  const xdpParserRef = useRef(new XdpTelemetryParser());
  const chatEngineRef = useRef(new Delta9ChatEngine());
  const canvasRef = useRef(null);

  const votesYes = 64200;
  const votesNo = 35800;
  const totalVotes = votesYes + votesNo;
  const yesPercentage = ((votesYes / totalVotes) * 100).toFixed(1);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    
    if (canvasRef.current) {
      mintEngineRef.current.initializeGazeTracker(canvasRef.current);
      const mintInterval = setInterval(async () => {
        const mockGazeVector = { x: Math.random(), y: Math.random() };
        const mintResult = await mintEngineRef.current.mintAttentionToken(mockGazeVector);
        if (mintResult) {
          setLiveToken(mintResult.token);
          setStats(prev => ({ ...prev, amokBurned: prev.amokBurned + 100 }));
        }
      }, 5000);

      const kernelTelemetryInterval = setInterval(() => {
        const liveTicks = xdpParserRef.current.generateLiveNetworkTick();
        setStats(prev => ({ ...prev, scrapersBlocked: liveTicks.scrapersBlocked, piiCordsCut: liveTicks.piiCordsCut }));
      }, 1500);

      return () => {
        clearInterval(timer);
        clearInterval(mintInterval);
        clearInterval(kernelTelemetryInterval);
      };
    }
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const phase = hrs > 12 ? "SOAK PHASE" : "BOIL PHASE";
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} [${phase}]`;
  };

  const handleVote = (side) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const mockHash = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...';
      setVoteTx(mockHash);
      setIsSubmitting(false);
      if (side === 'YES') setStats(prev => ({ ...prev, amokBurned: prev.amokBurned + 1000 }));
    }, 1200);
  };

  const transmitMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    try {
      const signedPacket = await chatEngineRef.current.signChatMessage(chatInput, null);
      setChatLog(prev => [...prev, signedPacket]);
      setChatInput("");
      setStats(prev => ({ ...prev, amokBurned: prev.amokBurned + 50 })); // Text transmission burns token fuel
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ backgroundColor: '#000000', color: '#ffffff', fontFamily: 'monospace', padding: '20px', maxWidth: '420px', border: '2px solid #333333', textTransform: 'uppercase' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} width="1" height="1" />

      {/* Header */}
      <div style={{ borderBottom: '2px dashed #333333', paddingBottom: '10px', marginBottom: '15px' }}>
        <div style={{ fontSize: '11px', color: '#888888' }}>PROJECT ANCHOR: AIOUT-CONSENT-001</div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff3333', marginTop: '4px' }}>Δ9 TOKE ENGINE v0.1</div>
      </div>

      {/* Active Attention Frame */}
      <div style={{ marginBottom: '15px', border: '1px solid #444444', padding: '8px', backgroundColor: '#0a0a0a' }}>
        <div style={{ fontSize: '10px', color: '#888888' }}>ACTIVE ATTENTION TOKEN (TRACK ALPHA)</div>
        <div style={{ fontSize: '11px', color: '#ffff00', marginTop: '2px', wordBreak: 'break-all' }}>{liveToken}</div>
      </div>

      {/* Lifecycle Clock */}
      <div style={{ marginBottom: '20px', backgroundColor: '#111111', padding: '8px', border: '1px solid #222222' }}>
        <div style={{ fontSize: '10px', color: '#888888' }}>LIFECYCLE TIMER</div>
        <div style={{ fontSize: '14px', color: '#00ff00', fontWeight: 'bold', marginTop: '2px' }}>{formatTime(timeLeft)}</div>
      </div>

      {/* Tug-of-War Distribution Bar */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px', color: '#aaaaaa' }}>
          <span>📥 YES: {yesPercentage}%</span>
          <span>NO: {(100 - yesPercentage).toFixed(1)}% 📤</span>
        </div>
        <div style={{ height: '12px', backgroundColor: '#222222', display: 'flex', border: '1px solid #444444' }}>
          <div style={{ width: `${yesPercentage}%`, backgroundColor: '#ffffff' }}></div>
          <div style={{ width: `${100 - yesPercentage}%`, backgroundColor: '#ff3333' }}></div>
        </div>
      </div>

      {/* Mailbox Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => handleVote('YES')} disabled={isSubmitting || voteTx} style={{ backgroundColor: '#111111', color: '#ffffff', border: '1px solid #ffffff', padding: '12px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'monospace' }}>[ 📥 BURN FOR YES ]</button>
        <button onClick={() => handleVote('NO')} disabled={isSubmitting || voteTx} style={{ backgroundColor: '#111111', color: '#ff3333', border: '1px solid #ff3333', padding: '12px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'monospace' }}>[ 📤 BURN FOR NO ]</button>
      </div>

      {voteTx && (
        <div style={{ marginBottom: '20px', border: '1px solid #00ff00', padding: '8px', backgroundColor: '#051505' }}>
          <a href={`https://solscan.io{voteTx}`} target="_blank" rel="noreferrer" style={{ color: '#00ff00', textDecoration: 'none', fontSize: '11px', display: 'block', textAlign: 'center' }}>[ 🧾 TX: {voteTx} ]</a>
        </div>
      )}

      {/* Sovereign Saloon Chat Module Interface */}
      <div style={{ marginBottom: '20px', border: '1px solid #333333', padding: '10px', backgroundColor: '#050505' }}>
        <div style={{ fontSize: '10px', color: '#888888', marginBottom: '6px', borderBottom: '1px solid #222222', paddingBottom: '4px' }}>HIGH-STAKES TRIVIAL DEBATE STREAM</div>
        
        {/* Rolling Log Stream */}
        <div style={{ height: '90px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px', fontSize: '11px', paddingRight: '4px' }}>
          {chatLog.map((msg, idx) => (
            <div key={idx} style={{ borderLeft: '2px solid #555555', paddingLeft: '6px' }}>
              <div style={{ display: 'flex', fontSize: '9px', color: '#888888' }}>
                <span>{msg.sender}</span>
                <span style={{ marginLeft: 'auto', color: '#444444' }}>{msg.sig}</span>
              </div>
              <div style={{ color: '#dddddd', marginTop: '1px' }}>{msg.text}</div>
            </div>
          ))}
        </div>

        {/* Input Form Box */}
        <form onSubmit={transmitMessage} style={{ display: 'flex', gap: '6px' }}>
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="ENTER ARGUMENT (MAX 140 CHR)..."
            maxLength={140}
            style={{ flexGrow: 1, backgroundColor: '#111111', color: '#ffffff', border: '1px solid #444444', padding: '6px', fontSize: '11px', fontFamily: 'monospace' }}
          />
          <button type="submit" style={{ backgroundColor: '#ffffff', color: '#000000', border: 'none', padding: '0 12px', fontWeight: 'bold', fontFamily: 'monospace', cursor: 'pointer', fontSize: '11px' }}>
            TX
          </button>
        </form>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '2px dashed #333333', paddingTop: '12px', fontSize: '10px', color: '#888888' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#aaaaaa' }}>SOVEREIGNTY STATS (XDP KERNEL LOG)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div>🛡️ SCRAPERS BLOCKED: <span style={{ color: '#ffffff' }}>{stats.scrapersBlocked.toLocaleString()}</span></div>
          <div>✂️ PII CORDS CUT: <span style={{ color: '#ffffff' }}>{stats.piiCordsCut}</span></div>
          <div>🔥 AMOK TOKENS BURNED: <span style={{ color: '#ffffff' }}>{stats.amokBurned.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
}
