// 1. Fetch live background engine telemetry values on load
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["cookieCount", "trapCount"], (data) => {
    // Map data fields accurately to the elements matching image_444380.png
    document.getElementById("cookie-count").textContent = data.cookieCount || 0;
    document.getElementById("trap-count").textContent = data.trapCount || 0;
  });
});

// 2. Standardized Solana Wallet Handshake Logic
document.getElementById("wallet-connect-btn").addEventListener("click", async () => {
  // Direct check for injected browser wallet context
  const provider = window.solana || window.phantom?.solana;

  if (provider) {
    try {
      const resp = await provider.connect();
      const pubKey = resp.publicKey.toString();
      
      // Condense key for a clean digital presentation
      const shortenedKey = `${pubKey.slice(0, 5)}...${pubKey.slice(-4)}`;
      
      const btn = document.getElementById("wallet-connect-btn");
      btn.textContent = shortenedKey;
      btn.style.backgroundColor = "#1a1a1a";
      btn.style.border = "1px solid #00ffa3";
      btn.style.color = "#00ffa3";
    } catch (err) {
      console.log("Connection deferred or rejected by user.");
    }
  } else {
    // Graceful onboarding routing instead of unhandled console errors
    window.open("https://phantom.app/", "_blank");
  }
});