import { el, clear, stepHead, ethCallout, noteCallout } from '../ui.js';
import { castBar, ledgerBeforeAfter } from '../components.js';
import { scenario, buildDraftTx, signTx, buildCandidateBlock, applyMinedBlock, onChange } from '../state.js';
import { serializeHeader } from '../lib/chain.js';
import { expectedAttempts, leadingZeroBits, mineSync } from '../lib/pow.js';
import { feeOf } from '../lib/tx.js';

export default {
  id: 'mine', num: 8, lecture: 'L1 · L3',
  title: 'Mine it: proof of work',
  lede: 'Try nonce after nonce until double-SHA-256 of the header lands below the target. Work, not permission, is what earns the right to add a block.',

  mount(container) {
    // make sure there is a signed transaction and a fresh candidate
    if (!scenario.tx) buildDraftTx({ payAmount: 1.5, fee: 0.001 });
    if (!scenario.tx.signed) signTx();
    if (!scenario.confirmed) buildCandidateBlock();

    let worker = null;
    let mining = false;
    let stats = { attempts: 0, hashPerSec: 0, best: 0, bestHash: '' };

    const root = el('div');
    container.append(
      stepHead(this.num, this.lecture, this.title),
      el('p', { class: 'step-lede' }, this.lede),
      castBar(['minerM', 'honest', 'evil'], { caption: 'Miner M races other miners (some honest, some like E). Whoever finds a valid nonce first this round wins; the rest keep validating.' }),
      root,
    );

    render();
    const unsub = onChange(render);
    return () => { stopMining(); unsub(); };

    function stopMining() {
      mining = false;
      if (worker) { worker.postMessage({ type: 'stop' }); worker.terminate(); worker = null; }
    }

    function startMining() {
      if (scenario.confirmed) return;
      const header = { ...scenario.block.header, nonce: null };
      const bits = scenario.miner.bits;
      stats = { attempts: 0, hashPerSec: 0, best: 0, bestHash: '' };
      mining = true;
      render();

      if (typeof Worker !== 'undefined') {
        try {
          worker = new Worker(new URL('../workers/miner.js', import.meta.url), { type: 'module' });
        } catch (e) {
          worker = null;
        }
      }
      if (worker) {
        worker.onmessage = (ev) => {
          const m = ev.data;
          if (m.type === 'progress') { stats = m; render(); }
          else if (m.type === 'found') { stats = { ...stats, attempts: m.attempts }; finish(m.nonce, m.hash, m.attempts); }
        };
        worker.postMessage({ type: 'start', header, bits });
      } else {
        // fallback: main-thread mine (kept small; only reached without Worker support)
        mineSync(header, Math.min(bits, 18)).then((res) => {
          if (res && mining) finish(res.nonce, res.hash, res.attempts);
        });
      }
    }

    function finish(nonce, hash, attempts) {
      stopMining();
      applyMinedBlock({ nonce, hash }); // mutates the shared ledger -> onChange -> render
    }

    function render() {
      clear(root);
      if (!scenario.block) return; // scenario was reset; main.js will re-mount
      const done = !!scenario.confirmed;
      const bits = scenario.miner.bits;
      const b = scenario.block;
      const fee = scenario.tx ? feeOf(scenario.tx) : 0;

      // difficulty control
      const slider = el('input', { type: 'range', min: '8', max: '22', value: String(bits), disabled: mining || done });
      slider.addEventListener('input', () => { scenario.miner.bits = parseInt(slider.value); if (scenario.block) scenario.block.header.bits = scenario.miner.bits; render(); });

      const controls = el('div', {},
        el('div', { class: 'field' },
          el('label', {}, `Difficulty — require ${bits} leading zero bits  (≈ ${expectedAttempts(bits).toLocaleString()} hashes expected)`),
          slider),
        el('div', { class: 'controls' },
          done
            ? el('span', { class: 'chip chip--ok' }, `✓ mined — block ${b.height} is on the chain`)
            : mining
              ? el('button', { class: 'btn btn--sm', onclick: stopMining }, '■ Stop')
              : el('button', { class: 'btn btn--primary btn--sm', onclick: startMining }, '▶ Start mining'),
          bits >= 21 && !done ? el('span', { class: 'chip chip--neutral' }, 'this may take a while') : null,
        ),
      );

      // live search panel
      const searchPanel = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, 'The search: double-SHA-256(header + nonce) must have ≥ N leading zero bits'),
        el('p', { class: 'stub', style: 'margin:0 0 8px' },
          'Simplified target (see Step 7): real Bitcoin compares the 256-bit hash against a packed 256-bit threshold; here it is a plain leading-zeros count so the search finishes while you watch.'),
        el('div', { class: 'hex' },
          el('span', { class: 'hex--label' }, 'header being hashed'),
          serializeHeader({ ...b.header, nonce: done ? b.header.nonce : (mining ? stats.nonce ?? 0 : '⟨varies⟩') })),
        el('div', { class: 'ba__row' }, el('span', { class: 'k' }, 'attempts'), el('span', { class: 'v' }, (done ? '—' : stats.attempts).toLocaleString?.() ?? String(stats.attempts))),
        el('div', { class: 'ba__row' }, el('span', { class: 'k' }, 'hashes/sec'), el('span', { class: 'v' }, mining ? Math.round(stats.hashPerSec).toLocaleString() : '—')),
        el('div', { class: 'ba__row' }, el('span', { class: 'k' }, 'best so far'), el('span', { class: 'v' }, `${done ? bits : stats.best} leading zero bits  ${stats.bestHash ? stats.bestHash.slice(0, 20) + '…' : ''}`)),
        done ? el('div', { class: 'hex', style: 'margin-top:8px' },
          el('span', { class: 'hex--label' }, `valid! nonce = ${b.header.nonce}`),
          b.hash) : null,
      );

      // work vs luck
      const luck = el('p', { class: 'stub' },
        `Expected work is ${expectedAttempts(bits).toLocaleString()} hashes, but any single try has a `,
        `1-in-${expectedAttempts(bits).toLocaleString()} chance — so the actual count is random. `,
        `PoW also picks the block proposer: your share of the world’s hash power is your share of blocks.`);

      // scale note (real network)
      const scaleNote = el('p', { class: 'stub' },
        `This tab does a few hundred thousand hashes/sec. The Bitcoin network does on the order of `,
        el('strong', { text: '~7 × 10²⁰ hashes/sec (700 EH/s)' }), ` — roughly ten orders of magnitude more than a single laptop, which is why rewriting history is infeasible.`);

      root.append(
        controls,
        searchPanel,
        luck,
        scaleNote,
        ethCallout(
          ' No proof of work since 2022. One validator is pseudo-randomly chosen as ',
          el('strong', { text: 'block proposer' }), ' each 12-second slot, weighted by stake (≥ 32 ETH). ',
          'Signing conflicting or invalid blocks gets that stake ', el('strong', { text: 'slashed' }), '.'),
        ledgerBeforeAfter({
          before: done
            ? '(this was the state before you mined)  Alice’s transaction was in the mempool only; on-chain Alice still owned the whole 6 BTC UTXO; every honest node at height 5.'
            : 'Alice’s transaction is in the mempool only. On-chain, Alice STILL owns the 6 BTC UTXO — she could still broadcast a conflicting spend. Bob has nothing to rely on. Every honest node at height 5.',
          after: done
            ? `Block ${b.height} is mined and broadcast; honest nodes reach height ${b.height} as they validate it. Alice’s input UTXO is destroyed; Bob holds ${scenario.confirmed.payAmount} BTC and Alice holds the change; Miner M holds a coinbase output of ${(3.125 + fee).toFixed(4)} BTC (spendable after 100 blocks). The payment has 1 confirmation — reversible only by a reorg of depth ≥ 1.`
            : 'Once a valid nonce is found: input UTXO destroyed, Bob’s + Alice’s change outputs created, Miner M’s coinbase created, height 5 → 6, 1 confirmation.',
          note: 'Losing miners earned nothing this round — but their acceptance is exactly what makes the block count.',
        }),
      );
    }
  },
};
