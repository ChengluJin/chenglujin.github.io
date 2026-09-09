// Block headers and a small seeded chain.
// Header serialization is teaching-simplified (a readable string, not the real
// 80-byte layout) but the field set and the prev-hash linkage are faithful.
import { sha256d, utf8, bytesToHex } from './hash.js';

export const HEADER_FIELDS = [
  ['version', 'format version'],
  ['prevHash', 'hash of the previous block header — the chain link'],
  ['merkleRoot', 'commitment to every transaction in this block'],
  ['time', 'unix timestamp (roughly; rules bound how far off it may be)'],
  ['bits', 'the proof-of-work target, packed'],
  ['nonce', 'the number miners vary to search for a valid hash'],
];

export function serializeHeader(h) {
  return `v${h.version}|prev:${h.prevHash}|mkr:${h.merkleRoot}|t:${h.time}|bits:${h.bits}|nonce:${h.nonce ?? ''}`;
}

export function headerHash(h) {
  return bytesToHex(sha256d(utf8(serializeHeader(h))));
}

// A short confirmed chain to build on. `bits` is the toy PoW difficulty
// (required leading zero bits); the seed headers are not re-mined.
export function seedChain(tipHeight = 5, bits = 12) {
  const genesis = {
    height: 0,
    header: {
      version: 1,
      prevHash: '0'.repeat(64),
      merkleRoot: bytesToHex(sha256d(utf8('genesis coinbase'))),
      time: 1231006505,
      bits,
      nonce: 2083236893,
    },
  };
  genesis.hash = headerHash(genesis.header);
  const chain = [genesis];
  for (let h = 1; h <= tipHeight; h++) {
    const prev = chain[h - 1];
    const header = {
      version: 1,
      prevHash: prev.hash,
      merkleRoot: bytesToHex(sha256d(utf8(`block ${h} transactions`))),
      time: 1231006505 + h * 600,
      bits,
      nonce: 100000 + h,
    };
    chain.push({ height: h, header, hash: headerHash(header) });
  }
  return chain;
}
