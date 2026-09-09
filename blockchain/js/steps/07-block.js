import { el, clear, stepHead, ethCallout, noteCallout } from '../ui.js';
import { castBar, ledgerBeforeAfter } from '../components.js';
import { scenario, buildCandidateBlock, onChange } from '../state.js';
import { HEADER_FIELDS, serializeHeader } from '../lib/chain.js';
import { expectedAttempts } from '../lib/pow.js';

export default {
  id: 'block', num: 7, lecture: 'L1 · L2',
  title: 'Assemble the block',
  lede: 'A block is a list of transactions plus an 80-byte header. The header is what the chain is actually made of — everything else hangs off the Merkle root.',

  mount(container) {
    buildCandidateBlock(); // refresh from the latest transaction / chain tip

    const root = el('div');
    container.append(
      stepHead(this.num, this.lecture, this.title),
      el('p', { class: 'step-lede' }, this.lede),
      castBar(['minerM', 'honest'], { caption: 'Miner M assembles the candidate. The honest nodes hold block ' + scenario.world.height + ', whose hash M must point back to.' }),
      root,
    );

    render();
    const unsub = onChange(render);
    return unsub;

    function render() {
      clear(root);
      const b = scenario.block;
      if (!b) return; // scenario was reset; main.js will re-mount
      const prev = scenario.chain[scenario.chain.length - 1];
      const h = b.header;

      const fieldVals = {
        version: String(h.version),
        prevHash: h.prevHash,
        merkleRoot: h.merkleRoot,
        time: `${h.time}  (~${new Date(h.time * 1000).toISOString().slice(0, 16).replace('T', ' ')} UTC)`,
        bits: `${h.bits}  → (simplified) require ${h.bits} leading zero bits  ·  ≈ ${expectedAttempts(h.bits).toLocaleString()} hashes expected`,
        nonce: '—  (found in Step 8)',
      };

      const headerTable = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, '80-byte header — 6 fields'),
        ...HEADER_FIELDS.map(([key, desc]) => el('div', { class: 'ba__row', style: 'align-items:baseline' },
          el('span', { class: 'k', style: 'flex:0 0 96px' }, key),
          el('span', { class: 'v', style: 'flex:1;word-break:break-all' }, fieldVals[key],
            el('div', { style: 'font-family:var(--sans);font-size:11px;color:var(--ink-faint)' }, desc)))),
      );

      const bitsNote = noteCallout('Simplification',
        ' Real Bitcoin packs the target into ', el('strong', { text: '4 bytes ("nBits")' }),
        ' — a floating-point-style encoding of a full 256-bit threshold, and a valid header is one whose double-SHA-256 (read as a 256-bit number) is ', el('strong', { text: 'below that threshold' }),
        '. This walkthrough replaces that with a plain “', el('strong', { text: 'N leading zero bits' }),
        '” rule so you can watch the search succeed in Step 8. The idea — a rare target you can only hit by brute force — is identical.');

      const wired = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, 'Two fields are wired from elsewhere'),
        el('div', { class: 'pipe' },
          el('div', { class: 'pipe__stage' },
            el('h4', {}, `chain tip — block ${prev.height}`),
            el('div', { class: 'pipe__val' }, prev.hash)),
          el('div', { class: 'pipe__op' }, 'becomes prevHash'),
          el('div', { class: 'pipe__stage' },
            el('h4', {}, 'Step 6 Merkle root'),
            el('div', { class: 'pipe__val' }, h.merkleRoot)),
          el('div', { class: 'pipe__op' }, 'becomes merkleRoot'),
        ),
      );

      const body = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, `Block body — ${b.txs.length} transactions` ),
        ...b.txs.map((t, i) => el('div', { class: 'ba__row' },
          el('span', { class: 'k', style: 'flex:0 0 30px' }, i === 0 ? '⛏' : `#${i}`),
          el('span', { class: 'v', style: 'flex:1' }, `${t.label}`,
            el('span', { style: 'color:var(--ink-faint);margin-left:8px' }, `${t.txid.slice(0, 12)}…`)))),
      );

      const serialized = el('div', { class: 'hex' },
        el('span', { class: 'hex--label' }, 'the header, serialized (nonce still blank)'),
        serializeHeader(h));

      root.append(
        headerTable, bitsNote, wired, serialized, body,
        el('p', { class: 'stub', style: 'margin-top:6px' },
          'This candidate is ', el('strong', { text: 'not valid yet' }),
          ' — the nonce is blank, so double-SHA-256(header) is just some random-looking number, almost certainly above the target. Every node would reject it. Step 8 fixes that.'),
        ethCallout(
          ' An Ethereum header carries the same kind of fields plus a commitment to the entire ',
          el('strong', { text: 'world-state root' }), ' after the block’s transactions, so a light client can prove any account balance, not just that a transaction was included.'),
        ledgerBeforeAfter({
          before: `Transactions waiting in mempools. The heaviest valid chain ends at block ${prev.height}.`,
          after: `Miner M holds a candidate block: header filled except the nonce, body of ${b.txs.length} transactions, pointing back to block ${prev.height}. Invalid until it has proof of work.`,
        }),
      );
    }
  },
};
