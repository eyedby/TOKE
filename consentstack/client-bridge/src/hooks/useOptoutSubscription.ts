import { useState, useEffect } from 'react';

export interface SubscriptionState {
  isOptedOut: boolean;
  loading: boolean;
  error: string | null;
}

export const useOptoutSubscription = () => {
  const [state, setState] = useState<SubscriptionState>({
    isOptedOut: false,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ type: 'GET_SHIELD_STATUS' }, (response) => {
        if (response) {
          setState({ isOptedOut: response.isOptedOut, loading: false, error: null });
        }
      });
    }
  }, []);

  const triggerOptout = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      setState((prev) => ({ ...prev, loading: false, error: 'Extension context missing' }));
      return;
    }

    return new Promise<void>((resolve, reject) => {
      chrome.runtime.sendMessage({ type: 'TRIGGER_AMOK_LOOP' }, (response) => {
        if (response?.success) {
          setState({ isOptedOut: true, loading: false, error: null });
          resolve();
        } else {
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
