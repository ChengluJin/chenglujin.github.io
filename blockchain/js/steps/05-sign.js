import { el, clear, stepHead, ethCallout, noteCallout } from '../ui.js';
import { castBar, ledgerBeforeAfter } from '../components.js';
import { scenario, buildDraftTx, signTx, unsignTx, onChange } from '../state.js';
import { sighashPreimage, sighash, txid, legacyTxid } from '../lib/tx.js';
import { verify, malleate } from '../lib/crypto.js';
import { hexToBytes } from '../lib/hash.js';

export default {
  id: 'sign', num: 5, lecture: 'L1 · L2',
  title: 'Sign the transaction',
  lede: 'Alice hashes the transaction (the sighash) and signs that hash with her private key. Every node can then check it with her public key — and only her public key.',

  mount(container) {
    let tampered = false;
    let malleable = false;

    if (!scenario.tx) buildDraftTx({ payAmount: 1.5, fee: 0.001 });

    const root = el('div');
    container.append(
      stepHead(this.num, this.lecture, this.title),
      el('p', { class: 'step-lede' }, this.lede),
      castBar(['alice'], { caption: 'Only Alice can sign — it needs her private key. Verification, done later by every node, needs only her public key.' }),
      root,
    );

    render();
    const unsub = onChange(render);
    return unsub;

    // a copy of the tx with Bob's output nudged, for the tamper demo
    function tamperedTx() {
      const t = structuredClone({ ...scenario.tx, sig: null });
      t.outputs[0].value = Math.round((t.outputs[0].value + 0.01) * 1e8) / 1e8;
      return t;
    }

    function render() {
      clear(root);
      const tx = scenario.tx;
      if (!tx) return; // scenario was reset; main.js will re-mount this step
      const signed = tx.signed;
      const preimage = sighashPreimage(tx, 0);
      const shownTx = tampered ? tamperedTx() : tx;
      const shownHash = sighash(shownTx, 0);

      // 1. sighash
      const sighashPanel = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, '1 — What gets signed: the sighash (SIGHASH_ALL)'),
        el('div', { class: 'hex' },
          el('span', { class: 'hex--label' }, 'serialized transaction, this input’s scriptPubKey spliced in, all outputs included'),
          preimage),
        el('div', { class: 'pipe__op', style: 'margin:6px 0' }, 'SHA-256d'),
        el('div', { class: 'hex' },
          el('span', { class: 'hex--label' }, tampered ? 'sighash of the TAMPERED transaction' : 'sighash (32 bytes)'),
          shownHash),
      );

      // 2. sign
      const signRow = el('div', { class: 'controls' },
        signed
          ? el('button', { class: 'btn btn--sm', onclick: () => unsignTx() }, 'Un-sign')
          : el('button', { class: 'btn btn--primary btn--sm', onclick: () => signTx() }, 'Sign with Alice’s private key'),
        signed ? el('span', { class: 'chip chip--ok' }, '✓ signed') : el('span', { class: 'chip chip--neutral' }, 'unsigned'),
      );

      const sigPanel = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, '2 — The signature (ECDSA over secp256k1)'),
        signRow,
        signed ? el('div', { class: 'hex', style: 'margin-top:8px' },
          el('span', { class: 'hex--label' }, 'r ‖ s (64 bytes, compact)'),
          tx.sigHex) : null,
      );

      // 3. verify
      let verifyChip;
      if (!signed) {
        verifyChip = el('span', { class: 'chip chip--neutral' }, 'nothing to verify yet');
      } else {
        const sigForCheck = malleable ? malleate(tx.sig).toCompactHex() : tx.sig;
        const good = verify(sigForCheck, hexToBytes(shownHash), scenario.keypair.pk, { lowS: !malleable });
        verifyChip = good
          ? el('span', { class: 'chip chip--ok' }, '✓ verify(pubkey, sighash, signature) → valid')
          : el('span', { class: 'chip chip--bad' }, '✗ verify → INVALID');
      }

      const verifyPanel = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, '3 — Anyone verifies with Alice’s public key'),
        verifyChip,
        el('div', { class: 'controls', style: 'margin-top:10px' },
          el('button', {
            class: 'btn btn--sm' + (tampered ? ' btn--primary' : ''),
            onclick: () => { tampered = !tampered; render(); },
          }, tampered ? 'Undo tamper' : 'Tamper: add 0.01 BTC to Bob’s output'),
          el('button', {
            class: 'btn btn--sm' + (malleable ? ' btn--primary' : ''),
            disabled: !signed,
            onclick: () => { malleable = !malleable; render(); },
          }, malleable ? 'Undo malleability' : 'Apply malleability (s → n−s)'),
        ),
        tampered ? el('p', { class: 'stub', style: 'margin:8px 0 0' },
          'One changed byte in the transaction → a completely different sighash → the old signature no longer verifies. Alice’s payment cannot be altered in flight.') : null,
        malleable && signed ? el('p', { class: 'stub', style: 'margin:8px 0 0' },
          `The high-s form is a second valid encoding of the same signature — still verifies (with the legacy rule), but it changes the legacy txid: `,
          el('code', { text: legacyTxid(tx).slice(0, 16) + '…' }),
          ` → `,
          el('code', { text: legacyTxid({ ...tx, inputs: tx.inputs.map(i => ({ ...i, scriptSig: i.scriptSig + ' ' })) }).slice(0, 16) + '…' }),
          `. SegWit fixed this by keeping signatures out of the txid: the modern txid `,
          el('code', { text: txid(tx).slice(0, 16) + '…' }), ` doesn’t move.`) : null,
      );

      root.append(
        sighashPanel, sigPanel, verifyPanel,
        ethCallout(
          ' Same ECDSA / secp256k1. The message signed is the RLP encoding of the transaction fields, including the account ',
          el('strong', { text: 'nonce' }), ', gas limit, gas price, and ', el('strong', { text: 'chainId' }),
          ' (EIP-155, so a mainnet signature can’t be replayed on a testnet).'),
        noteCallout('Signatures ≠ double-spend protection',
          ' A signature stops the payment being forged or altered. It does not stop Alice signing a ',
          el('strong', { text: 'second, conflicting' }), ' transaction that spends the same 6 BTC input — that is equivocation, and defeating it is the job of consensus (Step 10).'),
        ledgerBeforeAfter({
          before: 'Unsigned draft — every node would reject it: the authorisation check fails.',
          after: signed
            ? 'Signed and broadcastable. Any node can now confirm Alice authorised exactly these inputs and outputs. Still only in Alice’s wallet — not in a mempool, not on a chain.'
            : 'Still unsigned. Click “Sign” above.',
        }),
      );
    }
  },
};
