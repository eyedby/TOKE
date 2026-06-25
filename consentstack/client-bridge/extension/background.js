// Keep track of the live shield state in background memory
let isShieldActive = false;

// Bare-metal network-level protection
chrome.runtime.onInstalled.addListener(() => {
  console.log("aiOut perimeter engine initialized.");

  const rules = [{
    "id": 1,
    "priority": 1,
    "action": { "type": "block" },
    "condition": {
      "urlFilter": "||ai-scraper-bot-domain.com",
      "resourceTypes": ["xmlhttprequest", "sub_frame"]
    }
  }];

  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rules,
    removeRuleIds: [1]
  });
});

// Intercept incoming token depletion messages from frontend popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background intercepted packet type:", message.type);

  // 1. Handle the initial UI status query when the panel opens
  if (message.type === "GET_SHIELD_STATUS") {
    sendResponse({ isOptedOut: isShieldActive });
  }

  // 2. Handle the core loop initiation signal from the front-end button
  else if (message.type === "TRIGGER_AMOK_LOOP") {
    console.log("Initializing Solana Token-2022 Burn Loop...");
    
    // Flip our local status wire to true
    isShieldActive = true;
    
    // Execute logic or dispatch to your Solana token loop
    sendResponse({ 
      success: true,
      status: "BURN_INITIALIZED", 
      timestamp: new Date().toISOString(),
      details: "Signal dispatched to Token-2022 loop."
    });
  }
  
  return true; // Keeps the messaging channel open for asynchronous processing
});
