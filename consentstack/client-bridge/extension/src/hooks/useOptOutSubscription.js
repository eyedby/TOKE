"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOptoutSubscription = void 0;
const react_1 = require("react");
const useOptoutSubscription = () => {
    const [state, setState] = (0, react_1.useState)({
        isOptedOut: false,
        loading: false,
        error: null,
    });
    // Check the initial tracking state from the background service worker
    (0, react_1.useEffect)(() => {
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.sendMessage({ type: 'GET_SHIELD_STATUS' }, (response) => {
                if (response) {
                    setState({ isOptedOut: response.isOptedOut, loading: false, error: null });
                }
            });
        }
    }, []);
    // Trigger the live depletion / opt-out signal across the client bridge
    const triggerOptout = async () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        if (typeof chrome === 'undefined' || !chrome.runtime) {
            setState((prev) => ({ ...prev, loading: false, error: 'Extension context missing' }));
            return;
        }
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ type: 'TRIGGER_AMOK_LOOP' }, (response) => {
                if (response?.success) {
                    setState({ isOptedOut: true, loading: false, error: null });
                    resolve();
                }
                else {
                    setState((prev) => ({
                        ...prev,
                        loading: false,
                        error: response?.error || 'Failed to initialize depletion loop'
                    }));
                    reject(new Error(response?.error));
                }
            });
        });
    };
    return { ...state, triggerOptout };
};
exports.useOptoutSubscription = useOptoutSubscription;
