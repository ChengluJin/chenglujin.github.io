// A small Bitcoin Script interpreter, enough for the Step 4 walkthrough:
// P2PKH, a hash-lock, t-of-n multisig, and an absolute time-lock (CLTV).
//
// Stack items are { label, hex } — `label` is what the UI shows, `hex` is the
// canonical byte string used for hashing and equality. Not consensus-exact
// (no minimal-push rules, no script-number encoding) but faithful in mechanics:
// a stack machine, no loops, halts in time linear in the script length.
import { sha256, hash160, hexToBytes, bytesToHex } from './hash.js';
import { verify } from './crypto.js';

export function item(label, hex) { return { label, hex: hex ?? '' }; }
const TRUE = () => item('true', '01');
const FALSE = () => item('false', '');
const truthy = (it) => it && it.hex !== '' && it.hex !== '00';

// ctx: { sighashHex, pubkeys:{label->hex}, verifySig(sigHex, pkHex)->bool,
//        txLocktime, chainTip } — verifySig is optional; without it, CHECKSIG
//        treats any present signature as valid (Step 4 runs before Step 5).
export function run(script, ctx = {}) {
  const stack = [];
  const alt = [];
  const trace = [{ op: '(start)', note: 'empty stack', stack: [] }];
  let ok = false, error = null;

  const snap = (op, note) => trace.push({ op, note: note || '', stack: stack.map(s => s.label) });
  const need = (n, op) => { if (stack.length < n) throw new Error(`${op}: stack underflow`); };

  const checkSig = (sig, pk) => {
    if (ctx.verifySig) return ctx.verifySig(sig.hex, pk.hex);
    return sig.hex !== ''; // Step 4: assume a present signature is valid
  };

  try {
    for (const tok of script) {
      if (tok.push) {
        stack.push(tok.push);
        snap(`PUSH ${tok.push.label}`);
        continue;
      }
      const op = tok.op;
      switch (op) {
        case 'OP_DUP':
          need(1, op); stack.push({ ...stack[stack.length - 1] }); snap(op); break;
        case 'OP_DROP':
          need(1, op); stack.pop(); snap(op); break;
        case 'OP_SWAP':
          need(2, op); { const n = stack.length; [stack[n - 1], stack[n - 2]] = [stack[n - 2], stack[n - 1]]; } snap(op); break;
        case 'OP_TOALTSTACK': need(1, op); alt.push(stack.pop()); snap(op); break;
        case 'OP_FROMALTSTACK': alt.length || err(op); stack.push(alt.pop()); snap(op); break;
        case 'OP_HASH160': {
          need(1, op); const x = stack.pop();
          stack.push(item(`HASH160(${x.label})`, bytesToHex(hash160(hexToBytes(x.hex || '')))));
          snap(op); break;
        }
        case 'OP_SHA256': {
          need(1, op); const x = stack.pop();
          stack.push(item(`SHA256(${x.label})`, bytesToHex(sha256(hexToBytes(x.hex || '')))));
          snap(op); break;
        }
        case 'OP_EQUAL': {
          need(2, op); const a = stack.pop(), b = stack.pop();
          const eq = a.hex === b.hex;
          stack.push(eq ? TRUE() : FALSE());
          snap(op, eq ? 'top two are equal' : 'top two differ');
          break;
        }
        case 'OP_EQUALVERIFY': {
          need(2, op); const a = stack.pop(), b = stack.pop();
          if (a.hex !== b.hex) throw new Error('OP_EQUALVERIFY failed: values differ');
          snap(op, 'equal — continue'); break;
        }
        case 'OP_VERIFY': {
          need(1, op); if (!truthy(stack.pop())) throw new Error('OP_VERIFY failed: top was false');
          snap(op); break;
        }
        case 'OP_CHECKSIG': {
          need(2, op); const pk = stack.pop(), sig = stack.pop();
          const good = checkSig(sig, pk);
          stack.push(good ? TRUE() : FALSE());
          snap(op, good ? 'signature valid for this pubkey' : 'signature invalid');
          break;
        }
        case 'OP_CHECKMULTISIG':
          throw new Error('OP_CHECKMULTISIG is run via the multisig preset (runMultisig)');
        case 'OP_CHECKLOCKTIMEVERIFY': {
          need(1, op); const lt = parseInt(stack[stack.length - 1].hex || '0', 16) || Number(stack[stack.length - 1].label);
          const now = ctx.chainTip ?? 0;
          if (Number.isFinite(lt) && lt > now) throw new Error(`OP_CHECKLOCKTIMEVERIFY: locktime ${lt} not yet reached (chain at ${now})`);
          snap(op, `locktime ${lt} ≤ chain height ${now} — continue`); break;
        }
        default:
          if (/^OP_(\d{1,2})$/.test(op)) { const k = op.slice(3); stack.push(item(k, Number(k).toString(16).padStart(2, '0'))); snap(`PUSH ${k}`); break; }
          throw new Error(`unknown opcode ${op}`);
      }
    }
    ok = stack.length === 1 && truthy(stack[stack.length - 1]);
    if (!ok && !error) trace.push({ op: '(end)', note: stack.length !== 1 ? `script left ${stack.length} items on the stack` : 'top item is false', stack: stack.map(s => s.label) });
    else if (ok) trace.push({ op: '(end)', note: 'one true value on the stack — spend authorised', stack: stack.map(s => s.label) });
  } catch (e) {
    error = e.message;
    trace.push({ op: '(halt)', note: e.message, stack: stack.map(s => s.label) });
  }
  return { ok, error, trace };
}
function err(op) { throw new Error(`${op}: alt stack underflow`); }

// t-of-n multisig has its own runner because CHECKMULTISIG pops a variable
// number of items and scans signatures against pubkeys in order.
export function runMultisig({ sigs, pubkeys, t, ctx = {} }) {
  const trace = [{ op: '(start)', note: `${t}-of-${pubkeys.length} multisig`, stack: [] }];
  const stack = ['OP_0 (the off-by-one dummy)', ...sigs.map(s => s.label)];
  trace.push({ op: `PUSH dummy + ${sigs.length} signatures (scriptSig)`, stack: [...stack] });
  trace.push({ op: `PUSH ${t}, ${pubkeys.length} pubkeys, ${pubkeys.length} (scriptPubKey)`, stack: [...stack, `${t}`, ...pubkeys.map(p => p.label), `${pubkeys.length}`] });

  const verifySig = ctx.verifySig || ((sh) => sh !== '');
  let pi = 0, matched = 0;
  for (const sig of sigs) {
    let found = false;
    while (pi < pubkeys.length) {
      const pk = pubkeys[pi++];
      if (verifySig(sig.hex, pk.hex)) { found = true; matched++; break; }
    }
    trace.push({
      op: `check ${sig.label}`,
      note: found ? `matches ${pubkeys[pi - 1].label}` : 'no remaining pubkey matches — fail',
      stack: [],
    });
    if (!found) break;
  }
  const ok = matched >= t;
  trace.push({ op: '(end)', note: ok ? `${matched} valid signatures ≥ ${t} required — authorised` : `only ${matched} valid signatures — rejected`, stack: [ok ? 'true' : 'false'] });
  return { ok, error: ok ? null : 'insufficient valid signatures', trace };
}
