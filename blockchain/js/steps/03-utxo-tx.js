import { el, clear, stepHead, ethCallout } from '../ui.js';
import { castBar, ledgerBeforeAfter } from '../components.js';
import { scenario, buildDraftTx, onChange } from '../state.js';
import { sumIn, sumOut, feeOf, validateTx, round8 } from '../lib/tx.js';

export default {
  id: 'utxo-tx', num: 3, lecture: 'L2',
  title: 'Build a transaction',
  lede: 'Bitcoin has no accounts or balances — only unspent transaction outputs (UTXOs). Alice picks which of hers to spend, sets the outputs, and whatever is left over is the miner fee.',

  mount(container) {
    let pay = 1.5;
    let fee = 0.001;

    const root = el('div');
    container.append(
      stepHead(this.num, this.lecture, this.title),
      el('p', { class: 'step-lede' }, this.lede),
      castBar(['alice', 'bob'], { caption: 'Alice is spending; Bob is the recipient. No node is involved yet — this is still a draft in Alice’s wallet.' }),
      root,
    );

    rebuild();
    const unsub = onChange(() => render());
    render();
    return unsub;

    function rebuild() {
      buildDraftTx({ payAmount: pay, fee }); // emits -> render()
    }

    function render() {
      clear(root);
      const tx = scenario.tx;
      if (!tx) return; // scenario was reset; main.js will re-mount this step
      const totalIn = sumIn(tx);
      const v = validateTx(tx, scenario.world.utxos);

      // ---- inputs ----
      const inputCards = tx.inputs.map(i => el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, 'INPUT — a UTXO Alice controls'),
        kv('outpoint', `${i.outpoint.txid}:${i.outpoint.vout}`),
        kv('value', `${i.prevValue.toFixed(8)} BTC`),
        kv('locked by', i.prevScriptPubKey),
      ));

      // ---- outputs (editable) ----
      const payField = numRow('Pay Bob', pay, 0.00000001, totalIn, (val) => { pay = clamp(val, 0, totalIn); rebuild(); });
      const feeField = numRow('Fee (what Miner M keeps)', fee, 0, totalIn, (val) => { fee = clamp(val, 0, totalIn); rebuild(); });
      const change = round8(totalIn - pay - fee);

      const outList = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, 'OUTPUTS — new UTXOs this transaction creates'),
        outRow('→ Bob', pay, scenario.bob.address),
        change > 0
          ? outRow('→ Alice (change)', change, scenario.keypair.address)
          : el('p', { class: 'stub', style: 'margin:6px 0 0' }, 'No change output — outputs + fee use up the whole input.'),
      );

      // ---- fee / conservation ----
      const feeVal = feeOf(tx);
      const feeBox = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, 'Fee is implicit: inputs − outputs'),
        el('div', { class: 'hex' },
          `${totalIn.toFixed(8)}  (Σ inputs)\n`,
          `− ${sumOut(tx).toFixed(8)}  (Σ outputs)\n`,
          `= ${feeVal.toFixed(8)}  BTC  ${feeVal < 0 ? '  ← negative: invalid!' : ''}`),
      );

      // ---- three checks ----
      const checks = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, 'The three per-input checks a node runs'),
        checkRow('Existence', v.existence, 'every input names a UTXO that is currently unspent'),
        checkRow('Conservation', v.conservation, 'Σ inputs ≥ Σ outputs (the difference is the fee)'),
        checkRow('Authorisation', v.authorisation, v.authorisation ? 'a valid signature is present' : 'no signature yet — Alice signs in Step 5', v.authorisation ? 'ok' : 'pending'),
      );

      root.append(
        el('div', { class: 'grid2' }, ...inputCards, outList),
        el('div', { class: 'grid2' }, el('div', {}, payField, feeField), feeBox),
        checks,
        ethCallout(
          ' No UTXOs. Alice and Bob are ', el('strong', { text: 'accounts with balances' }),
          '; the payment subtracts from Alice’s balance and adds to Bob’s, in place. Replay is prevented by a per-account ',
          el('strong', { text: 'nonce' }), ' that must increase by one each transaction — the job Bitcoin’s specific outpoint does here.'),
        ledgerBeforeAfter({
          before: `Alice controls one UTXO worth ${totalIn.toFixed(2)} BTC. Mempool empty. Chain height ${scenario.world.height}.`,
          after: change > 0
            ? `A draft transaction exists in Alice’s wallet: spends the ${totalIn.toFixed(2)} BTC UTXO, pays Bob ${pay.toFixed(3)}, returns ${change.toFixed(3)} as change, leaves ${feeVal.toFixed(3)} as the fee. Not signed, not broadcast — on-chain Alice still owns the whole ${totalIn.toFixed(2)} BTC.`
            : `Draft transaction: pays Bob ${pay.toFixed(3)}, fee ${feeVal.toFixed(3)}. Still unsigned and unbroadcast.`,
          note: 'The transaction destroys existing UTXOs and creates new ones — it never edits a balance.',
        }),
      );
    }
  },
};

function clamp(x, lo, hi) { return Math.min(hi, Math.max(lo, x)); }

function kv(k, val) {
  return el('div', { class: 'ba__row' }, el('span', { class: 'k' }, k), el('span', { class: 'v' }, val));
}
function numRow(label, value, min, max, onInput) {
  const input = el('input', { type: 'number', min, max, step: '0.001', value: String(round(value)) });
  input.addEventListener('change', () => { const n = parseFloat(input.value); if (!Number.isNaN(n)) onInput(n); });
  return el('div', { class: 'field' }, el('label', {}, label), input);
}
function round(x) { return Math.round(x * 1e8) / 1e8; }

function outRow(who, amount, addr) {
  return el('div', { class: 'panel', style: 'background:var(--bg-raised);margin-top:8px' },
    el('div', { style: 'font-weight:700;font-size:13px' }, `${who} — ${amount.toFixed(8)} BTC`),
    el('div', { class: 'pipe__val', style: 'font-size:11px;color:var(--ink-faint)' }, `locked to ${addr}`));
}

function checkRow(name, pass, why, mode) {
  const state = mode === 'pending' ? 'chip--neutral' : (pass ? 'chip--ok' : 'chip--bad');
  const glyph = mode === 'pending' ? '⧗' : (pass ? '✓' : '✗');
  return el('div', { class: 'ba__row' },
    el('span', { class: `chip ${state}`, style: 'flex:0 0 auto' }, `${glyph} ${name}`),
    el('span', { class: 'v', style: 'font-family:var(--sans);color:var(--ink-soft)' }, why));
}
