// Track Beta: Live Cross-Browser Token Header Injector
let activeAttentionToken = "AWAITING_INITIAL_MINT";

// Listen for messages from the popup cockpit to update the active token
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "UPDATE_ATTENTION_TOKEN") {
    activeAttentionToken = request.token;
    console.log("Δ9 Perimeter Stamped with token:", activeAttentionToken);
  }
  if (request.action === "TRIGGER_PHANTOM_CONNECT") {
    chrome.tabs.create({ url: "https://solscan.io" });
  }
});

// Stamped on every outgoing HTTP packet header across the network wires
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    details.requestHeaders.push({
      name: "X-Delta9-Consent",
      value: activeAttentionToken
    });
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders", "extraHeaders"]
);
