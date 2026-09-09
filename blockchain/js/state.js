// One shared scenario object, threaded through every step of the walkthrough.
import { hexToBytes, bytesToHex, hash160, sha256d, utf8 } from './lib/hash.js';
import { randomPrivateKey, getPublicKey, sign } from './lib/crypto.js';
import { p2pkhAddress, p2pkhScript } from './lib/bitcoin.js';
import { seedChain } from './lib/chain.js';
import { round8, sighash, txid, feeOf } from './lib/tx.js';
import { merkleRoot } from './lib/merkle.js';

// Fixed keys so "Reset" is reproducible in a lecture. (secp256k1 test keys.)
export const SAMPLE_SK_HEX =
  '1e99423a4ed27608a15a2616a2b0e9e52ced330ac530edcc32c8ffc6a526aedd';
export const BOB_SK_HEX =
  'b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0';

const START_HEIGHT = 5;
const START_BITS = 12;

// Starting ledger. Mirrors the Lecture 2 funding example: Alice was earlier paid
// 6 BTC in a single output; she now wants to pay Bob.
function freshWorld() {
  return {
    height: START_HEIGHT,
    utxos: [
      { id: 'a1c4b7e9', owner: 'alice', amount: 6.0, from: 'an earlier funding transaction', scriptPubKey: null },
    ],
    mempool: [],   // transactions seen but not yet in a block
    views: {},     // per-party chain tips, used by the fork / equivocation steps
  };
}

export const scenario = {
  keypair: null,   // Alice: { sk, pk, pkFull, pkh, address, skHex }
  bob: null,       // Bob: same shape
  tx: null,        // the transaction under construction
  block: null,     // the candidate block { txs:[{label,txid}], merkleRoot, header }
  chain: [],       // [{ height, header, hash }]
  miner: { bits: START_BITS },
  world: freshWorld(),
  confirmed: null, // { txid, atHeight, payAmount } once Alice→Bob is in a block
};

const listeners = new Set();
export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
export function emitChange() {
  for (const fn of [...listeners]) {
    try { fn(scenario); } catch (err) { console.error('state listener failed', err); }
  }
}

export function makeKeypair(skHex) {
  const sk = skHex ? hexToBytes(skHex) : randomPrivateKey();
  const pk = getPublicKey(sk, true);       // 33-byte compressed
  const pkFull = getPublicKey(sk, false);  // 65-byte uncompressed (0x04 || x || y)
  return {
    sk, pk, pkFull,
    pkh: bytesToHex(hash160(pk)),
    address: p2pkhAddress(pk),
    skHex: bytesToHex(sk),
  };
}

export function setKeypair(kp) {
  scenario.keypair = kp;
  if (scenario.world.utxos[0]) scenario.world.utxos[0].scriptPubKey = p2pkhScript(kp.pkh);
  emitChange();
}

export function useSampleKeypair() {
  setKeypair(makeKeypair(SAMPLE_SK_HEX));
}

// ---- Step 3: build the draft transaction -------------------------------
export function buildDraftTx({ payAmount, fee }) {
  const alice = scenario.keypair, bob = scenario.bob;
  const inputs = scenario.world.utxos
    .filter(u => u.owner === 'alice')
    .map(u => ({
      outpoint: { txid: u.id, vout: 0 },
      prevValue: u.amount,
      prevOwner: 'alice',
      prevScriptPubKey: p2pkhScript(alice.pkh),
      scriptSig: '',
    }));
  const totalIn = round8(inputs.reduce((s, i) => s + i.prevValue, 0));
  const outputs = [{ value: round8(payAmount), recipient: 'bob', scriptPubKey: p2pkhScript(bob.pkh) }];
  const change = round8(totalIn - payAmount - fee);
  if (change > 1e-8) outputs.push({ value: change, recipient: 'alice', scriptPubKey: p2pkhScript(alice.pkh) });
  scenario.tx = { version: 1, inputs, outputs, locktime: 0, signed: false, sig: null, sigHex: null, sighashHex: null };
  emitChange();
}

// ---- Step 5: sign it --------------------------------------------------
export function signTx() {
  const tx = scenario.tx;
  if (!tx) return;
  const h = sighash(tx, 0);
  const sig = sign(hexToBytes(h), scenario.keypair.sk);
  tx.sighashHex = h;
  tx.sig = sig;
  tx.sigHex = sig.toCompactHex();
  tx.signed = true;
  tx.inputs.forEach(i => { i.scriptSig = '<sig> <pubkey>'; });
  emitChange();
}
export function unsignTx() {
  const tx = scenario.tx;
  if (!tx) return;
  tx.signed = false; tx.sig = null; tx.sigHex = null; tx.sighashHex = null;
  tx.inputs.forEach(i => { i.scriptSig = ''; });
  emitChange();
}

// ---- Step 6/7: the candidate block ----------------------------------
export function buildCandidateBlock() {
  const height = scenario.world.height + 1;
  const aliceTxid = scenario.tx ? txid(scenario.tx) : bytesToHex(sha256d(utf8('alice→bob (unbuilt)')));
  const txs = [
    { label: `coinbase → Miner M (${(3.125).toFixed(3)} BTC + fees)`, txid: bytesToHex(sha256d(utf8(`coinbase@${height}`))) },
    { label: 'Alice → Bob', txid: aliceTxid },
    { label: 'other user’s payment', txid: bytesToHex(sha256d(utf8('filler tx A'))) },
    { label: 'other user’s payment', txid: bytesToHex(sha256d(utf8('filler tx B'))) },
  ];
  const root = merkleRoot(txs.map(t => t.txid));
  const prev = scenario.chain[scenario.chain.length - 1];
  scenario.block = {
    height,
    txs,
    merkleRoot: root,
    header: {
      version: 1,
      prevHash: prev.hash,
      merkleRoot: root,
      time: prev.header.time + 600,
      bits: scenario.miner.bits,
      nonce: null,
    },
  };
  emitChange();
}

// ---- Step 8: apply a mined block to the shared ledger ----------------
export function applyMinedBlock({ nonce, hash }) {
  const b = scenario.block;
  if (!b || scenario.confirmed) return;
  b.header.nonce = nonce;
  b.hash = hash;

  const w = scenario.world;
  const tx = scenario.tx;
  const tid = txid(tx);
  const fee = feeOf(tx);

  w.utxos = w.utxos.filter(u => u.owner !== 'alice'); // Alice's input UTXO is spent
  tx.outputs.forEach((o, i) => w.utxos.push({
    id: `${tid.slice(0, 8)}:${i}`, owner: o.recipient, amount: o.value, scriptPubKey: o.scriptPubKey,
  }));
  w.utxos.push({
    id: `coinbase:${b.height}`, owner: 'minerM', amount: round8(3.125 + fee),
    coinbase: true, maturesAtHeight: b.height + 100,
  });
  w.height = b.height;
  w.mempool = [];

  scenario.chain.push({ height: b.height, header: b.header, hash, txs: b.txs });
  scenario.confirmed = { txid: tid, atHeight: b.height, payAmount: tx.outputs[0].value };
  emitChange();
}

export function chainTip() { return scenario.chain[scenario.chain.length - 1]; }

export function resetScenario() {
  scenario.keypair = makeKeypair(SAMPLE_SK_HEX);
  scenario.bob = makeKeypair(BOB_SK_HEX);
  scenario.tx = null;
  scenario.block = null;
  scenario.chain = seedChain(START_HEIGHT, START_BITS);
  scenario.miner = { bits: START_BITS };
  scenario.world = freshWorld();
  scenario.world.utxos[0].scriptPubKey = p2pkhScript(scenario.keypair.pkh);
  scenario.confirmed = null;
  emitChange();
}
