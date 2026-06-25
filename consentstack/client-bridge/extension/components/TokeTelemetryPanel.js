import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useOptoutSubscription } from '../hooks/useOptoutSubscription';
export const TokeTelemetryPanel = () => {
    const { isOptedOut, loading, error, triggerOptout } = useOptoutSubscription();
    return (_jsxs("div", { style: { padding: '16px', fontFamily: 'monospace', color: '#00ff00', backgroundColor: '#111', borderRadius: '4px' }, children: [_jsx("h3", { style: { margin: '0 0 12px 0', borderBottom: '1px solid #333', paddingBottom: '4px' }, children: "aiOut Perimeter Engine" }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("span", { children: "Status: " }), _jsx("span", { style: { color: isOptedOut ? '#00ff00' : '#ff0000', fontWeight: 'bold' }, children: isOptedOut ? 'PROTECTED (AMOK LOOP ACTIVE)' : 'IDLE (PERIMETER OPEN)' })] }), error && _jsxs("div", { style: { color: '#ff3333', marginBottom: '12px' }, children: ["Error: ", error] }), _jsx("button", { onClick: triggerOptout, disabled: loading || isOptedOut, style: {
                    width: '100%',
                    padding: '8px',
                    backgroundColor: isOptedOut ? '#222' : '#005500',
                    color: isOptedOut ? '#555' : '#00ff00',
                    border: '1px solid #00ff00',
                    cursor: (loading || isOptedOut) ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                }, children: loading ? 'INITIALIZING...' : isOptedOut ? 'SIGNAL LOCK ACTIVE' : 'ACTIVATE AMOK LOOP' })] }));
};
export default TokeTelemetryPanel;
