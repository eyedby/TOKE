import { Delta9MintEngine } from '../src/mintEngine.js';
import { XdpTelemetryParser } from '../src/xdpParser.js';
import { Delta9ChatEngine } from '../src/chatEngine.js';

const mintEngine = new Delta9MintEngine();
const xdpParser = new XdpTelemetryParser();
const chatEngine = new Delta9ChatEngine();

let amokBurned = 89045;
mintEngine.isTracking = true;

// Active UI Handlers
setInterval(async () => {
  const token = await mintEngine.mintAttentionToken({ x: Math.random(), y: Math.random() });
  if (token) document.getElementById('live-token').innerText = token.token;
  
  const ticks = xdpParser.generateLiveNetworkTick();
  document.getElementById('stat-blocked').innerText = ticks.scrapersBlocked.toLocaleString();
  document.getElementById('stat-cut').innerText = ticks.piiCordsCut.toLocaleString();
}, 1500);

document.getElementById('vote-yes').onclick = () => triggerVote();
document.getElementById('vote-no').onclick = () => triggerVote();

function triggerVote() {
  const hash = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const node = document.getElementById('tx-node');
  node.style.display = 'block';
  node.innerHTML = `<a href="https://solscan.io{hash}" target="_blank" style="color:#00ff00; text-decoration:none;">[ 🧾 TX: ${hash.substring(0,10)}... ]</a>`;
  amokBurned += 1000;
  document.getElementById('stat-burned').innerText = amokBurned.toLocaleString();
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
