// ECDSA over secp256k1 — the signature scheme Bitcoin uses to authorise spends.
import * as secp from './noble-secp256k1/index.js';
import { sha256 } from './noble-hashes/sha256.js';
import { hmac } from './noble-hashes/hmac.js';

// Enable synchronous, deterministic (RFC 6979) signing without WebCrypto,
// so the demos work identically on file servers and GitHub Pages.
secp.etc.hmacSha256Sync = (key, ...msgs) =>
  hmac(sha256, key, secp.etc.concatBytes(...msgs));

export function randomPrivateKey() {
  return secp.utils.randomPrivateKey();
}

export function getPublicKey(sk, compressed = true) {
  return secp.getPublicKey(sk, compressed);
}

// msgHash: 32-byte Uint8Array. Returns a Signature object (.r, .s, .toCompactHex()).
export function sign(msgHash, sk) {
  return secp.sign(msgHash, sk);
}

export function verify(sig, msgHash, pk, opts) {
  return secp.verify(sig, msgHash, pk, opts);
}

export const CURVE = secp.CURVE;
export const Signature = secp.Signature;

// For the malleability demo: the same signature has two valid s-values, s and n−s.
// Bitcoin (BIP-146) now requires the "low-s" form; older nodes accepted both.
export function malleate(sig) {
  const sHigh = secp.CURVE.n - sig.s;
  return new secp.Signature(sig.r, sHigh);
}

export { secp };
