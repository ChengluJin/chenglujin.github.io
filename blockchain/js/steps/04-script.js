import { el, clear, stepHead, ethCallout, noteCallout } from '../ui.js';
import { castBar, ledgerBeforeAfter } from '../components.js';
import { scenario, onChange } from '../state.js';
import { run, runMultisig, item } from '../lib/script.js';
import { verify } from '../lib/crypto.js';
import { sha256, hexToBytes, bytesToHex, utf8 } from '../lib/hash.js';

export default {
  id: 'script', num: 4, lecture: 'L2',
  title: 'Lock & unlock the coins (Script)',
  lede: 'Every output carries a tiny stack program that locks it. To spend it, the input supplies data that makes the combined program finish with one true value on the stack — and every validating node re-runs it.',

  mount(container) {
    let preset = 'p2pkh';
    let cltvUnlocked = false;
    let cursor = 999; // execution step highlighted; large = show whole trace

    const root = el('div');
    container.append(
      stepHead(this.num, this.lecture, this.title),
      el('p', { class: 'step-lede' }, this.lede),
      castBar(['alice', 'bob', 'honest'], { caption: 'Alice provides the unlocking data; the honest nodes are the ones who actually execute the script when they validate the spend.' }),
      root,
    );

    render();
    const unsub = onChange(render);
    return unsub;

    function realVerify(sigHex, pkHex) {
      if (!scenario.tx || !scenario.tx.signed) return true; // Step 4 runs before Step 5
      try { return verify(scenario.tx.sigHex, hexToBytes(scenario.tx.sighashHex), pkHex); }
      catch { return false; }
    }

    function buildPreset() {
      const a = scenario.keypair, b = scenario.bob;
      const sigHex = scenario.tx && scenario.tx.signed ? scenario.tx.sigHex : '';
      const sigItem = item("Alice’s signature", sigHex);

      if (preset === 'p2pkh') {
        return {
          title: 'P2PKH — pay to public-key hash (the standard lock)',
          scriptSig: [{ push: sigItem }, { push: item("Alice’s public key", bytesToHex(a.pk)) }],
          scriptPubKey: [
            { op: 'OP_DUP' }, { op: 'OP_HASH160' },
            { push: item(`⟨${a.pkh.slice(0, 6)}…⟩ expected pkh`, a.pkh) },
            { op: 'OP_EQUALVERIFY' }, { op: 'OP_CHECKSIG' },
          ],
          ctx: { verifySig: realVerify },
          why: 'The public key is only revealed when Alice spends — until then the output shows just its 20-byte hash. And the signature commits to the outputs, so a miner cannot redirect the payment.',
        };
      }
      if (preset === 'hashlock') {
        const secretHex = bytesToHex(utf8('open sesame'));
        const h = bytesToHex(sha256(hexToBytes(secretHex)));
        return {
          title: 'Hash-lock — reveal a secret to unlock (basis of atomic swaps)',
          scriptSig: [{ push: item("Bob’s signature", scenario.tx?.signed ? scenario.tx.sigHex : 'sig') }, { push: item("secret preimage", secretHex) }],
          scriptPubKey: [
            { op: 'OP_SHA256' },
            { push: item(`⟨${h.slice(0, 6)}…⟩ expected hash`, h) },
            { op: 'OP_EQUALVERIFY' },
            { push: item("Bob’s public key", bytesToHex(scenario.bob.pk)) },
            { op: 'OP_CHECKSIG' },
          ],
          ctx: { verifySig: () => true },
          why: 'Anyone who learns the preimage can claim the coin. Chain two of these with the same hash on two blockchains and you get a trustless swap.',
        };
      }
      if (preset === 'cltv') {
        const lock = 210000;
        return {
          title: 'Time-lock (CLTV) — an inheritance vault',
          scriptSig: [{ push: item("heir’s signature", 'sig') }],
          scriptPubKey: [
            { push: item(String(lock), (lock).toString(16)) },
            { op: 'OP_CHECKLOCKTIMEVERIFY' },
            { op: 'OP_DROP' },
            { push: item("heir’s public key", bytesToHex(scenario.bob.pk)) },
            { op: 'OP_CHECKSIG' },
          ],
          ctx: { verifySig: () => true, chainTip: cltvUnlocked ? lock + 1 : scenario.world.height },
          why: 'The heir can spend only once the chain passes block 210 000. A second branch (not shown) lets the owner spend any time before then.',
          toggle: {
            label: cltvUnlocked ? `Chain is past block ${lock}` : `Advance chain past block ${lock}`,
            on: () => { cltvUnlocked = !cltvUnlocked; cursor = 999; render(); },
          },
        };
      }
      // multisig
      const pkA = item('pubkey 1 (customer)', 'AA');
      const pkB = item('pubkey 2 (service)', 'BB');
      const pkC = item('pubkey 3 (recovery)', 'CC');
      return {
        multisig: true,
        title: '2-of-3 multisig — escrow with a neutral third key',
        sigs: [item('signature by key 1', 'AA'), item('signature by key 3', 'CC')],
        pubkeys: [pkA, pkB, pkC],
        t: 2,
        ctx: { verifySig: (s, p) => s === p },
        why: 'The judge (key 3) never holds the money: any two of the three can move it, so the judge can only break ties, never steal.',
      };
    }

    function render() {
      clear(root);
      const P = buildPreset();

      const tabs = el('div', { class: 'controls' },
        pill('p2pkh', 'P2PKH'), pill('hashlock', 'Hash-lock'),
        pill('multisig', '2-of-3 multisig'), pill('cltv', 'Time-lock'));

      let result, combined;
      if (P.multisig) {
        result = runMultisig({ sigs: P.sigs, pubkeys: P.pubkeys, t: P.t, ctx: P.ctx });
      } else {
        combined = [...P.scriptSig, ...P.scriptPubKey];
        result = run(combined, P.ctx);
      }

      // scripts panel
      const scriptsPanel = P.multisig
        ? el('div', { class: 'panel' },
            el('div', { class: 'panel__title' }, 'The scripts'),
            el('div', { class: 'hex' },
              el('span', { class: 'hex--label' }, 'scriptPubKey (the lock, fixed when the UTXO was created)'),
              `OP_2  <pk1> <pk2> <pk3>  OP_3  OP_CHECKMULTISIG`),
            el('div', { class: 'hex', style: 'margin-top:6px' },
              el('span', { class: 'hex--label' }, 'scriptSig (the key, supplied by the spender)'),
              `OP_0  <sig by pk1>  <sig by pk3>`))
        : el('div', { class: 'panel' },
            el('div', { class: 'panel__title' }, 'The scripts run back to back, sharing one stack' ),
            el('div', { class: 'hex' },
              el('span', { class: 'hex--label' }, 'scriptSig — supplied by the spender (runs first)'),
              P.scriptSig.map(tokenText).join('  ')),
            el('div', { class: 'hex', style: 'margin-top:6px' },
              el('span', { class: 'hex--label' }, 'scriptPubKey — the lock on the output'),
              P.scriptPubKey.map(tokenText).join('  ')));

      // trace
      const maxStep = result.trace.length - 1;
      const c = Math.min(cursor, maxStep);
      const slider = el('input', { type: 'range', min: '0', max: String(maxStep), value: String(c) });
      slider.addEventListener('input', () => { cursor = parseInt(slider.value); render(); });

      const traceRows = result.trace.map((tr, idx) => el('div', {
        class: 'ba__row',
        style: `align-items:baseline;${idx > c ? 'opacity:.35' : ''}${idx === c ? ';background:var(--accent-soft)' : ''}`,
      },
        el('span', { class: 'k', style: 'flex:0 0 200px;font-family:var(--mono)' }, tr.op),
        el('span', { class: 'v', style: 'flex:1' },
          `[ ${tr.stack.join('  |  ') || '∅'} ]`,
          tr.note ? el('span', { style: 'color:var(--ink-faint);font-family:var(--sans);margin-left:8px' }, `— ${tr.note}`) : null),
      ));

      const verdict = result.ok
        ? el('span', { class: 'chip chip--ok' }, '✓ spend authorised — one true value on the stack')
        : el('span', { class: 'chip chip--bad' }, `✗ rejected — ${result.error || 'script did not finish true'}`);

      root.append(
        tabs,
        P.toggle ? el('div', { class: 'controls' }, el('button', { class: 'btn btn--sm', onclick: P.toggle.on }, P.toggle.label)) : null,
        el('p', { class: 'stub', style: 'margin:-4px 0 10px' }, el('strong', { text: P.title })),
        scriptsPanel,
        el('div', { class: 'panel' },
          el('div', { class: 'panel__title' }, 'Execution — drag to step through'),
          slider,
          el('div', { style: 'margin-top:8px' }, ...traceRows),
          el('div', { style: 'margin-top:10px' }, verdict)),
        el('p', { class: 'stub' }, P.why),
        !scenario.tx || !scenario.tx.signed
          ? noteCallout('Note', ' Alice hasn’t signed yet (Step 5), so OP_CHECKSIG here assumes the signature is valid. Sign in Step 5 and this becomes a real ECDSA check.')
          : null,
        ethCallout(
          ' There is no Script. A spend condition is arbitrary code in a ', el('strong', { text: 'contract account' }),
          ', written in Solidity and run by the EVM. Because that code can loop, nodes cannot bound its cost from the length alone — so every instruction is metered with ', el('strong', { text: 'gas' }), ' (Step 11).'),
        ledgerBeforeAfter({
          before: 'The transaction is still a draft. Bob’s new output has a P2PKH lock naming the hash of his public key.',
          after: 'Alice’s input has the matching unlocking data. The combined script runs to TRUE — but only for real once she signs. Nothing on chain yet.',
        }),
      );

      function pill(key, label) {
        return el('button', {
          class: 'btn btn--sm' + (preset === key ? ' btn--primary' : ''),
          onclick: () => { preset = key; cursor = 999; render(); },
        }, label);
      }
    }
  },
};

function tokenText(t) {
  return t.push ? `<${t.push.label}>` : t.op;
}
