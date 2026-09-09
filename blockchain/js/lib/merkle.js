// Merkle tree over a list of leaves, Bitcoin-style:
//   - leaves and nodes are 32-byte values
//   - parent = SHA-256d( left || right )
//   - on an odd row, the last node is duplicated (this is the CVE-2012-2459 quirk)
//
// Teaching simplification: we hash the hex-decoded leaf bytes directly and keep
// everything big-endian. Real Bitcoin byte-reverses txids first; the shape of the
// tree and every proof is identical.
import { sha256d, hexToBytes, bytesToHex, concat } from './hash.js';

function hashPair(aHex, bHex) {
  return bytesToHex(sha256d(concat(hexToBytes(aHex), hexToBytes(bHex))));
}

// Returns { root, levels } where levels[0] is the leaves and levels[n] is [root].
export function buildTree(leafHexes) {
  if (!leafHexes.length) return { root: '', levels: [[]] };
  const levels = [leafHexes.slice()];
  let row = leafHexes.slice();
  while (row.length > 1) {
    if (row.length % 2) row.push(row[row.length - 1]); // duplicate last
    const next = [];
    for (let i = 0; i < row.length; i += 2) next.push(hashPair(row[i], row[i + 1]));
    levels.push(next);
    row = next;
  }
  return { root: row[0], levels };
}

export function merkleRoot(leafHexes) {
  return buildTree(leafHexes).root;
}

// Proof for leaf at `index`: the sibling hashes from the bottom up, each tagged
// with the side it sits on.
export function merkleProof(leafHexes, index) {
  const { levels } = buildTree(leafHexes);
  const proof = [];
  let idx = index;
  for (let l = 0; l < levels.length - 1; l++) {
    const row = levels[l];
    const isRight = idx % 2 === 1;
    const sibling = isRight ? row[idx - 1] : (row[idx + 1] ?? row[idx]); // dup-last
    proof.push({ hash: sibling, side: isRight ? 'left' : 'right' });
    idx = Math.floor(idx / 2);
  }
  return proof;
}

// Recompute the root from a leaf + its proof.
export function verifyProof(leafHex, index, proof, expectedRoot) {
  let acc = leafHex;
  for (const step of proof) {
    acc = step.side === 'left' ? hashPair(step.hash, acc) : hashPair(acc, step.hash);
  }
  return { root: acc, ok: acc === expectedRoot };
}
