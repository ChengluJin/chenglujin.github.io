// Toy proof-of-work target: "the hash must start with at least `bits` zero bits".
// Real Bitcoin compares the 256-bit hash against a 256-bit target; leading-zero
// counting is the same idea at a scale you can watch in a browser.
export function leadingZeroBits(hashHex) {
  let zeros = 0;
  for (const ch of hashHex) {
    const v = parseInt(ch, 16);
    if (v === 0) { zeros += 4; continue; }
    // leading zeros within this 4-bit nibble
    zeros += (v < 2 ? 3 : v < 4 ? 2 : v < 8 ? 1 : 0);
    break;
  }
  return zeros;
}

export function meetsBits(hashHex, bits) {
  return leadingZeroBits(hashHex) >= bits;
}

export function expectedAttempts(bits) {
  return 2 ** bits;
}

// Synchronous fallback miner (used when Web Workers are unavailable, and by the
// tests). Returns { nonce, hash, attempts } or null if the cap is hit.
export async function mineSync(header, bits, cap = 3_000_000) {
  const { serializeHeader } = await import('./chain.js');
  const { sha256d, utf8, bytesToHex } = await import('./hash.js');
  for (let nonce = 0; nonce < cap; nonce++) {
    const hh = bytesToHex(sha256d(utf8(serializeHeader({ ...header, nonce }))));
    if (leadingZeroBits(hh) >= bits) return { nonce, hash: hh, attempts: nonce + 1 };
  }
  return null;
}
