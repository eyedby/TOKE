"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokeTelemetryPanel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const useOptoutSubscription_1 = require("../hooks/useOptoutSubscription");
const TokeTelemetryPanel = () => {
    const { isOptedOut, loading, error, triggerOptout } = (0, useOptoutSubscription_1.useOptoutSubscription)();
    return ((0, jsx_runtime_1.jsxs)("div", { style: { padding: '16px', fontFamily: 'monospace', color: '#00ff00', backgroundColor: '#111', borderRadius: '4px' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { margin: '0 0 12px 0', borderBottom: '1px solid #333', paddingBottom: '4px' }, children: "aiOut Perimeter Engine" }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '16px' }, children: [(0, jsx_runtime_1.jsx)("span", { children: "Status: " }), (0, jsx_runtime_1.jsx)("span", { style: { color: isOptedOut ? '#00ff00' : '#ff0000', fontWeight: 'bold' }, children: isOptedOut ? 'PROTECTED (AMOK LOOP ACTIVE)' : 'IDLE (PERIMETER OPEN)' })] }), error && (0, jsx_runtime_1.jsxs)("div", { style: { color: '#ff3333', marginBottom: '12px' }, children: ["Error: ", error] }), (0, jsx_runtime_1.jsx)("button", { onClick: triggerOptout, disabled: loading || isOptedOut, style: {
                    width: '100%',
                    padding: '8px',
                    backgroundColor: isOptedOut ? '#222' : '#005500',
                    color: isOptedOut ? '#555' : '#00ff00',
                    border: '1px solid #00ff00',
                    cursor: (loading || isOptedOut) ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                }, children: loading ? 'INITIALIZING...' : isOptedOut ? 'SIGNAL LOCK ACTIVE' : 'ACTIVATE AMOK LOOP' })] }));
};
exports.TokeTelemetryPanel = TokeTelemetryPanel;
exports.default = exports.TokeTelemetryPanel;
