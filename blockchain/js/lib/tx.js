// A teaching-simplified Bitcoin transaction model.
//
// The serialization below is NOT consensus-exact (no varints, no little-endian
// juggling) — it is a stable, readable string so the sighash and txid demos are
// reproducible. The *structure* (which bytes the signature commits to, what the
// txid does and does not cover) matches real Bitcoin.
import { sha256d, utf8, bytesToHex } from './hash.js';

export function round8(x) { return Math.round(x * 1e8) / 1e8; }
export function sumIn(tx) { return round8(tx.inputs.reduce((s, i) => s + i.prevValue, 0)); }
export function sumOut(tx) { return round8(tx.outputs.reduce((s, o) => s + o.value, 0)); }
export function feeOf(tx) { return round8(sumIn(tx) - sumOut(tx)); }

// forSighash: -1 = full tx; otherwise the index of the input being signed
// (its prev scriptPubKey is spliced in, all other scriptSigs are blanked).
export function serializeTx(tx, { forSighash = -1, withScriptSig = true } = {}) {
  const ins = tx.inputs.map((i, idx) => {
    let script = '';
    if (forSighash === -1) script = withScriptSig ? (i.scriptSig || '') : '';
    else if (idx === forSighash) script = i.prevScriptPubKey;
    return `${i.outpoint.txid}:${i.outpoint.vout}:${script}:${i.sequence || 'ffffffff'}`;
  }).join(',');
  const outs = tx.outputs.map(o => `${o.value.toFixed(8)}:${o.scriptPubKey}`).join(',');
  let s = `v${tx.version}|in[${ins}]|out[${outs}]|lock${tx.locktime}`;
  if (forSighash !== -1) s += '|SIGHASH_ALL';
  return s;
}

export function sighashPreimage(tx, inputIndex = 0) {
  return serializeTx(tx, { forSighash: inputIndex });
}

export function sighash(tx, inputIndex = 0) {
  return bytesToHex(sha256d(utf8(sighashPreimage(tx, inputIndex))));
}

// Modern (SegWit-style) txid: excludes scriptSig, so a third party cannot
// change the txid by mangling the signature encoding (malleability).
export function txid(tx) {
  return bytesToHex(sha256d(utf8(serializeTx(tx, { withScriptSig: false }))));
}

// Legacy txid: includes scriptSig -> malleable. Kept for the Step 5 comparison.
export function legacyTxid(tx) {
  return bytesToHex(sha256d(utf8(serializeTx(tx, { withScriptSig: true }))));
}

// The three per-input checks from Lecture 2, as data for the UI.
export function validateTx(tx, utxoSet) {
  const ids = new Set(utxoSet.map(u => u.id));
  const existence = tx.inputs.every(i => ids.has(i.outpoint.txid));
  const conservation = feeOf(tx) >= 0;
  const authorisation = !!tx.signed;
  return {
    existence, conservation, authorisation,
    fee: feeOf(tx),
    allPass: existence && conservation && authorisation,
  };
}
