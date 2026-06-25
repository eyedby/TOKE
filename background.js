// Track Beta: Dynamic Header Injection & Sandbox Communication Link
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Δ9 Engine Initialized: Setting up local key perimeters.");
});

// Intercept outgoing network headers and inject tokens
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const windowBlock = Math.floor(timestamp / 600);
    
    details.requestHeaders.push({
      name: "X-Delta9-Consent",
      value: `SIG_BLOCK_${windowBlock}_VERIFIED`
    });

    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders", "extraHeaders"]
);

// Listen for sandbox bridge requests from the dashboard popup interface
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "TRIGGER_PHANTOM_CONNECT") {
    console.log("Routing connection trace request...");
    // Open a fresh tab to a web destination where window.phantom can safely mount
    chrome.tabs.create({ url: "https://solscan.io" });
  }
});
