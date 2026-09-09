import { el, clear, stepHead, ethCallout } from '../ui.js';
import { castBar, ledgerBeforeAfter } from '../components.js';
import { scenario, onChange } from '../state.js';
import { headerHash } from '../lib/chain.js';
import { merkleRoot } from '../lib/merkle.js';
import { sha256d, utf8, bytesToHex } from '../lib/hash.js';
import { expectedAttempts } from '../lib/pow.js';

const txidFor = (label) => bytesToHex(sha256d(utf8(label)));

export default {
  id: 'chain-tamper', num: 9, lecture: 'L1 · L3',
  title: 'Chain it — and try to tamper',
  lede: 'Each header names the hash of the block before it. Change one old transaction and every block after it breaks.',

  mount(container) {
    // Local working chain: the confirmed prefix + a few honest blocks on top.
    const bits = scenario.miner.bits;
    let payAmount = scenario.confirmed ? scenario.confirmed.payAmount
      : (scenario.tx ? scenario.tx.outputs[0].value : 1.5);
    const originalPay = payAmount;

    const seed = scenario.chain.filter(b => b.height <= 5);
    const template = [
      { height: 6, author: 'minerM', txLabels: (pay) => ['coinbase@6', `alice→bob ${pay} BTC`, 'other payment 6a', 'other payment 6b'] },
      { height: 7, author: 'honest', txLabels: () => ['coinbase@7', 'other payment 7a', 'other payment 7b'] },
      { height: 8, author: 'honest', txLabels: () => ['coinbase@8', 'other payment 8a'] },
    ];
    let showRemine = false;

    // The canonical chain — mined once by the honest network. Its hash links are
    // now fixed on-chain and never change; only the *contents* of block 6 can be
    // edited after the fact.
    const canonical = buildChain(originalPay);
    function buildChain(pay) {
      const out = [];
      let prevHash = seed[seed.length - 1].hash;
      for (const t of template) {
        const txids = t.txLabels(pay).map(txidFor);
        const merkle = merkleRoot(txids);
        const header = { version: 1, prevHash, merkleRoot: merkle, time: 1231006505 + t.height * 600, bits, nonce: 500000 + t.height };
        const hash = headerHash(header);
        out.push({ height: t.height, author: t.author, header, hash, txids });
        prevHash = hash;
      }
      return out;
    }

    const root = el('div');
    container.append(
      stepHead(this.num, this.lecture, this.title),
      el('p', { class: 'step-lede' }, this.lede),
      castBar(['honest', 'evil'], { caption: 'Node E edits an old block; the honest nodes catch it because the hash links stop matching.' }),
      root,
    );

    render();
    const unsub = onChange(render);
    return unsub;

    function buildWorking() {
      const tamper = payAmount !== originalPay;
      // block 6 is recomputed with the (possibly edited) amount; blocks 7 and 8
      // keep their canonical headers — their recorded "previous hash" cannot be
      // rewritten without re-mining.
      const edited6 = tamper ? buildChain(payAmount)[0] : canonical[0];
      const working = [
        { ...edited6, tampered: tamper, recordedPrev: seed[seed.length - 1].hash },
        { ...canonical[1], recordedPrev: canonical[1].header.prevHash },
        { ...canonical[2], recordedPrev: canonical[2].header.prevHash },
      ];
      const blocks = [
        ...seed.map(b => ({ ...b, linkOk: true })),
        ...working.map(b => ({ ...b, linkOk: true })),
      ];
      let broken = false;
      for (let i = 1; i < blocks.length; i++) {
        const b = blocks[i], prev = blocks[i - 1];
        if (broken) { b.linkOk = false; continue; }
        b.linkOk = (b.recordedPrev ?? b.header?.prevHash) === prev.hash;
        if (!b.linkOk) broken = true;
      }
      return blocks;
    }

    function render() {
      clear(root);
      const blocks = buildWorking();
      const firstBroken = blocks.find(b => b.header && !b.linkOk);

      const strip = el('div', { style: 'display:flex;gap:8px;overflow-x:auto;padding:4px 0' });
      blocks.forEach((b, i) => {
        const isEditable = b.height === 6;
        const broke = b.header && !b.linkOk;
        const card = el('div', {
          class: 'panel',
          style: [
            'flex:0 0 190px;font-size:11px',
            broke ? 'border-color:var(--bad);background:var(--bad-soft)' : '',
            b.tampered ? 'box-shadow:inset 0 0 0 2px var(--who-evil)' : '',
          ].join(';'),
        },
          el('div', { class: 'panel__title', style: 'display:flex;justify-content:space-between' },
            el('span', {}, `block ${b.height}`),
            el('span', { style: `color:var(--who-${b.author === 'minerM' ? 'miner' : b.author === 'honest' ? 'node' : 'node'})` },
              b.height === 0 ? 'genesis' : b.author === 'minerM' ? '⛏ Miner M' : 'honest')),
          row('prev', b.header ? b.header.prevHash : '—'),
          row('mkroot', b.header ? b.header.merkleRoot : '—'),
          row('hash', b.hash || '—'),
          b.header ? el('div', { style: 'margin-top:6px' },
            broke
              ? el('span', { class: 'chip chip--bad' }, '✗ broken link')
              : el('span', { class: 'chip chip--ok' }, '✓ links to prev')) : null,
          isEditable ? el('div', { class: 'field', style: 'margin-top:8px' },
            el('label', { style: 'font-size:11px' }, 'edit Alice→Bob amount'),
            amountInput()) : null,
        );
        strip.append(card);
        if (i < blocks.length - 1) strip.append(el('div', { style: 'align-self:center;color:var(--ink-faint)' }, '→'));
      });

      const prevOfBroken = firstBroken ? blocks[blocks.indexOf(firstBroken) - 1] : null;
      const explanation = firstBroken
        ? el('div', { class: 'callout callout--note' },
            el('span', { class: 'callout__tag' }, 'Chain broken'),
            ` You changed a transaction in block 6. Its Merkle root changed → its hash changed to ${prevOfBroken.hash.slice(0, 12)}… . But block ${firstBroken.height}’s recorded “previous hash” is still ${firstBroken.recordedPrev.slice(0, 12)}… — the old value, which cannot be rewritten without re-mining. The links no longer match, and every honest node rejects this branch.`)
        : el('p', { class: 'stub' }, 'Every block’s recorded “previous hash” equals the actual hash of the block before it. Edit block 6’s Alice→Bob amount to see what breaks.');

      const remineBtn = el('button', { class: 'btn btn--sm' + (showRemine ? ' btn--primary' : ''), onclick: () => { showRemine = !showRemine; render(); } },
        showRemine ? 'Hide' : 'What would it take to fix the chain?');
      const reminePanel = showRemine ? el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, 'Re-mining from block 6'),
        el('p', { class: 'stub', style: 'margin:0' },
          `To make the edited branch valid again, Node E must redo proof of work for blocks 6, 7 and 8 — about `,
          el('strong', { text: `${(3 * expectedAttempts(bits)).toLocaleString()} hashes` }),
          ` — and then keep producing blocks faster than the entire honest network, forever, to stay ahead. With less than half the world’s hash power, the gap only grows. This is the tamper-evidence claim from Lecture 1, made concrete.`)) : null;

      root.append(
        el('div', { class: 'panel', style: 'overflow-x:auto' },
          el('div', { class: 'panel__title' }, 'The chain (each block points back by hash)'),
          strip),
        explanation,
        payAmount !== originalPay
          ? el('div', { class: 'controls' }, el('button', { class: 'btn btn--sm btn--ghost', onclick: () => { payAmount = originalPay; render(); } }, 'Undo the edit'), remineBtn)
          : el('div', { class: 'controls' }, remineBtn),
        reminePanel,
        ethCallout(
          ' Same hash-linking. Ethereum adds finalised checkpoints (Casper FFG): once a block is finalised, reverting it requires ≥ 1/3 of all staked ETH to be provably slashed — deep reorgs are not just expensive but attributable.'),
        ledgerBeforeAfter({
          before: 'Block 6 accepted; every honest node at height 6; Alice→Bob has 1 confirmation. Honest blocks 7, 8 land on top.',
          after: 'Each new block commits to the previous block’s hash. Any edit to a buried transaction invalidates that block and every block after it — the chain is append-only in practice, not by decree.',
        }),
      );

      function amountInput() {
        const inp = el('input', { type: 'number', step: '0.1', min: '0', value: String(payAmount) });
        inp.addEventListener('change', () => { const n = parseFloat(inp.value); if (!Number.isNaN(n)) { payAmount = n; render(); } });
        return inp;
      }
    }
  },
};

function row(k, v) {
  return el('div', { class: 'ba__row', style: 'padding:2px 0;border:0' },
    el('span', { class: 'k', style: 'flex:0 0 46px' }, k),
    el('span', { class: 'v', style: 'font-size:10px' }, v ? v.slice(0, 14) + '…' : '—'));
}
