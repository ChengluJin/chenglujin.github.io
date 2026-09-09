// Hashing helpers — thin wrappers over the vendored @noble/hashes.
import { sha256 } from './noble-hashes/sha256.js';
import { ripemd160 } from './noble-hashes/ripemd160.js';
import { keccak_256 } from './noble-hashes/sha3.js';

export { sha256, ripemd160, keccak_256 };

const _enc = new TextEncoder();
export function utf8(s) { return _enc.encode(s); }

export function bytesToHex(b) {
  let s = '';
  for (let i = 0; i < b.length; i++) s += b[i].toString(16).padStart(2, '0');
  return s;
}

export function hexToBytes(hex) {
  hex = String(hex).replace(/^0x/i, '').replace(/\s+/g, '');
  if (hex.length % 2) hex = '0' + hex;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

export function concat(...arrs) {
  let n = 0;
  for (const a of arrs) n += a.length;
  const out = new Uint8Array(n);
  let o = 0;
  for (const a of arrs) { out.set(a, o); o += a.length; }
  return out;
}

// Bitcoin's building blocks
export function sha256d(data) { return sha256(sha256(data)); }   // block & tx IDs, PoW, checksums
export function hash160(data) { return ripemd160(sha256(data)); } // pay-to-public-key-hash
