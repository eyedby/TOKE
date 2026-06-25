import React from 'react';
import { useOptoutSubscription } from '../hooks/useOptoutSubscription';

export const TokeTelemetryPanel: React.FC = () => {
  const { isOptedOut, loading, error, triggerOptout } = useOptoutSubscription();

  return (
    <div style={{ padding: '16px', fontFamily: 'monospace', color: '#00ff00', backgroundColor: '#111', borderRadius: '4px' }}>
      <h3 style={{ margin: '0 0 12px 0', borderBottom: '1px solid #333', paddingBottom: '4px' }}>aiOut Perimeter Engine</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <span>Status: </span>
        <span style={{ color: isOptedOut ? '#00ff00' : '#ff0000', fontWeight: 'bold' }}>
          {isOptedOut ? 'PROTECTED (AMOK LOOP ACTIVE)' : 'IDLE (PERIMETER OPEN)'}
        </span>
      </div>

      {error && <div style={{ color: '#ff3333', marginBottom: '12px' }}>Error: {error}</div>}

      <button
        onClick={triggerOptout}
        disabled={loading || isOptedOut}
        style={{
          width: '100%',
          padding: '8px',
          backgroundColor: isOptedOut ? '#222' : '#005500',
          color: isOptedOut ? '#555' : '#00ff00',
          border: '1px solid #00ff00',
          cursor: (loading || isOptedOut) ? 'not-allowed' : 'pointer',
          fontWeight: 'bold'
        }}
      >
        {loading ? 'INITIALIZING...' : isOptedOut ? 'SIGNAL LOCK ACTIVE' : 'ACTIVATE AMOK LOOP'}
      </button>
    </div>
  );
};
export default TokeTelemetryPanel;
