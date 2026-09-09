// Bitcoin-specific derivations (and the Ethereum contrast for addresses).
import { sha256, ripemd160, hash160, keccak_256, concat, bytesToHex, utf8 } from './hash.js';
import { base58check } from './base58check.js';

export function pubkeyHash(pubkey) {
  return hash160(pubkey); // RIPEMD160(SHA256(pubkey))
}

// Human-readable P2PKH locking script for a given 20-byte public-key hash (hex).
export function p2pkhScript(pkhHex) {
  return `OP_DUP OP_HASH160 <${short(pkhHex)}> OP_EQUALVERIFY OP_CHECKSIG`;
}
function short(hex) {
  return hex.length > 12 ? `${hex.slice(0, 6)}…${hex.slice(-4)}` : hex;
}

// Mainnet P2PKH address: Base58Check( 0x00 || HASH160(pubkey) )  ->  "1..."
export function p2pkhAddress(pubkey) {
  const pkh = hash160(pubkey);
  return base58check(concat(Uint8Array.of(0x00), pkh));
}

// The two hashing steps, exposed so the pipeline view can show intermediates.
export function p2pkhStages(pubkey) {
  const sha = sha256(pubkey);
  const pkh = ripemd160(sha);
  const payload = concat(Uint8Array.of(0x00), pkh);
  return { sha, pkh, payload, address: base58check(payload) };
}

// Ethereum address from a public key: last 20 bytes of Keccak-256(x || y),
// rendered with EIP-55 mixed-case checksum. No Base58, no version byte.
export function ethAddress(pubkey) {
  let xy = pubkey;
  if (xy.length === 65 && xy[0] === 0x04) xy = xy.slice(1); // strip uncompressed tag
  if (xy.length !== 64) throw new Error('ethAddress needs the 64-byte uncompressed public key');
  const body = bytesToHex(keccak_256(xy).slice(12)); // 20 bytes, lowercase hex
  const mask = bytesToHex(keccak_256(utf8(body)));
  let out = '0x';
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    out += (c >= 'a' && c <= 'f' && parseInt(mask[i], 16) >= 8) ? c.toUpperCase() : c;
  }
  return out;
}
