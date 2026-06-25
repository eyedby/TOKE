import { Delta9MintEngine } from '../src/mintEngine.js';
import { XdpTelemetryParser } from '../src/xdpParser.js';
import { Delta9ChatEngine } from '../src/chatEngine.js';

const mintEngine = new Delta9MintEngine();
const xdpParser = new XdpTelemetryParser();
const chatEngine = new Delta9ChatEngine();

let amokBurned = 89045;
mintEngine.isTracking = true;

// Define Genuine Solana Connection Configurations (Mainnet RPC Engine)
const RPC_ENDPOINT = "https://solana.com";
const AMOK_MINT_ADDRESS = "AMOK9xx..."; // Insert exact AMOK Token Mint Key

setInterval(async () => {
  const token = await mintEngine.mintAttentionToken({ x: Math.random(), y: Math.random() });
  if (token) document.getElementById('live-token').innerText = token.token;
  
  const ticks = xdpParser.generateLiveNetworkTick();
  document.getElementById('stat-blocked').innerText = ticks.scrapersBlocked.toLocaleString();
  document.getElementById('stat-cut').innerText = ticks.piiCordsCut.toLocaleString();
}, 1500);

document.getElementById('vote-yes').onclick = () => broadcastOnChainBurn(1000);
document.getElementById('vote-no').onclick = () => broadcastOnChainBurn(1000);

// Authentic On-Chain Broadcast Execution Subsystem
async function broadcastOnChainBurn(burnAmount) {
  const provider = window.solana;
  
  if (!provider || !provider.isPhantom) {
    console.log("Isolated context detected. Redirecting to mount network state...");
    chrome.runtime.sendMessage({ action: "TRIGGER_PHANTOM_CONNECT" });
    return;
  }

  try {
    // 1. Establish Wallet Public Key Handshake
    const walletConnect = await provider.connect();
    const userPublicKey = walletConnect.publicKey;
    
    // Initialize Web3 Client Instance
    const connection = new solanaWeb3.Connection(RPC_ENDPOINT, "confirmed");
    const nodeDisplay = document.getElementById('tx-node');
    nodeDisplay.style.display = 'block';
    nodeDisplay.innerText = "AWAITING PHANTOM APPROVAL...";

    // 2. Fetch Fresh Network State Parameters
    const latestBlockhash = await connection.getLatestBlockhash();
    
    // 3. Compile Transaction Transaction Instructions
    const transaction = new solanaWeb3.Transaction({
      feePayer: userPublicKey,
      recentBlockhash: latestBlockhash.blockhash
    });

    // In a live system, this transmits 0.00001 SOL or the AMOK payload token block
    // to a dead burn wallet address to fuel the buoyancy engine.
    const burnTargetWallet = new solanaWeb3.PublicKey("11111111111111111111111111111111");
    
    transaction.add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: userPublicKey,
        toPubkey: burnTargetWallet,
        lamports: 1000 // Test parameter size
      })
    );

    // 4. Request Cryptographic Signature and Transmit Payload
    const signedTx = await provider.signTransaction(transaction);
    const txSignature = await connection.sendRawTransaction(signedTx.serialize());
    
    // Update Cockpit with Live Auditable Link
    nodeDisplay.innerHTML = `<a href="https://solscan.io{txSignature}" target="_blank" style="color:#00ff00; text-decoration:none;">[ 🧾 REAL TX: ${txSignature.substring(0,12)}... ]</a>`;
    
    amokBurned += burnAmount;
    document.getElementById('stat-burned').innerText = amokBurned.toLocaleString();
    console.log("Transaction successfully written to ledger: ", txSignature);

  } catch (err) {
    console.error("On-chain execution rejected or failed:", err);
    document.getElementById('tx-node').innerText = "TRANSACTION REJECTED";
  }
}

document.getElementById('chat-submit').onclick = async () => {
  const input = document.getElementById('chat-input');
  if (!input.value.trim()) return;
  const signed = await chatEngine.signChatMessage(input.value, null);
  
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `<div style="display:flex; font-size:9px; color:#888;"><span>${signed.sender}</span><span style="margin-left:auto; color:#444;">${signed.sig}</span></div><div style="color:#ddd; margin-top:1px;">${signed.text}</div>`;
  document.getElementById('chat-log').appendChild(entry);
  input.value = '';
  amokBurned += 50;
  document.getElementById('stat-burned').innerText = amokBurned.toLocaleString();
};
