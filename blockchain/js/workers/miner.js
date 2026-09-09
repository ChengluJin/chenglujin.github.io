// Proof-of-work search, off the main thread. Chunked so a "stop" message is
// processed between batches.
import { sha256 } from '../lib/noble-hashes/sha256.js';
import { serializeHeader } from '../lib/chain.js';
import { leadingZeroBits } from '../lib/pow.js';

const enc = new TextEncoder();
const sha256d = (b) => sha256(sha256(b));
function hex(b) {
  let s = '';
  for (let i = 0; i < b.length; i++) s += b[i].toString(16).padStart(2, '0');
  return s;
}

let state = null;
const BATCH = 12000;

function step() {
  if (!state || !state.running) return;
  const { header, bits } = state;
  for (let k = 0; k < BATCH; k++) {
    const hh = hex(sha256d(enc.encode(serializeHeader({ ...header, nonce: state.nonce }))));
    state.attempts++;
    const z = leadingZeroBits(hh);
    if (z > state.best) { state.best = z; state.bestHash = hh; }
    if (z >= bits) {
      self.postMessage({
        type: 'found', nonce: state.nonce, hash: hh,
        attempts: state.attempts, ms: performance.now() - state.t0,
      });
      state.running = false;
      return;
    }
    state.nonce++;
  }
  const secs = (performance.now() - state.t0) / 1000;
  self.postMessage({
    type: 'progress', attempts: state.attempts, nonce: state.nonce,
    best: state.best, bestHash: state.bestHash, hashPerSec: state.attempts / Math.max(secs, 1e-6),
  });
  setTimeout(step, 0);
}

self.onmessage = (e) => {
  const m = e.data;
  if (m.type === 'start') {
    state = { header: m.header, bits: m.bits, nonce: m.startNonce || 0, attempts: 0, best: 0, bestHash: '', running: true, t0: performance.now() };
    step();
  } else if (m.type === 'stop' && state) {
    state.running = false;
  }
};
