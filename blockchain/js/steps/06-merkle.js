import { el, clear, stepHead, ethCallout, noteCallout } from '../ui.js';
import { castBar, ledgerBeforeAfter } from '../components.js';
import { scenario, buildCandidateBlock, onChange } from '../state.js';
import { buildTree, merkleProof, verifyProof } from '../lib/merkle.js';

export default {
  id: 'merkle', num: 6, lecture: 'L1',
  title: 'Commit to the transactions: the Merkle tree',
  lede: 'Hash the block’s transactions in pairs, all the way up to a single 32-byte root. That one hash goes in the header and stands in for every transaction below it.',

  mount(container) {
    let selected = 1;      // which leaf to prove (Alice → Bob by default)
    let oddCount = false;  // drop the last tx to show the odd-row rule

    buildCandidateBlock(); // refresh from the latest transaction

    const root = el('div');
    container.append(
      stepHead(this.num, this.lecture, this.title),
      el('p', { class: 'step-lede' }, this.lede),
      castBar(['minerM', 'honest'], { caption: 'Miner M builds the tree for its candidate block; honest nodes recompute the root to check M included exactly what it claims.' }),
      root,
    );

    render();
    const unsub = onChange(render);
    return unsub;

    function render() {
      clear(root);
      if (!scenario.block) return; // scenario was reset; main.js will re-mount
      const txs = oddCount ? scenario.block.txs.slice(0, 3) : scenario.block.txs;
      const leaves = txs.map(t => t.txid);
      const { levels, root: mkRoot } = buildTree(leaves);
      const sel = Math.min(selected, leaves.length - 1);
      const proof = merkleProof(leaves, sel);
      const check = verifyProof(leaves[sel], sel, proof, mkRoot);
      const onPath = pathIndices(levels, sel);
      const sibNum = (l, i) => {
        for (let pi = 0; pi < proof.length; pi++) if (samePairSibling(levels, sel, pi, l, i)) return pi + 1;
        return 0;
      };

      const treeEl = el('div', { class: 'panel', style: 'overflow-x:auto' },
        el('div', { class: 'panel__title' }, 'The tree — click a transaction on the bottom row'),
        el('p', { class: 'stub', style: 'margin:0 0 6px' },
          'To convince someone “', el('strong', { text: txs[sel].label }),
          '” is in this block, you hand them the ',
          el('span', { style: 'color:var(--warn);font-weight:700' }, 'yellow'),
          ' hashes (numbered 1…', String(proof.length),
          '). With those plus the transaction, they recompute the ',
          el('span', { style: 'color:var(--accent);font-weight:700' }, 'blue'),
          ' hashes up to the root — and check it equals the real Merkle root. No other transaction is needed.'),
        el('div', { style: 'display:flex;gap:16px;font-size:11px;color:var(--ink-faint);margin-bottom:6px' },
          el('span', {}, el('span', { style: 'color:var(--accent)' }, '■ '), 'the transaction + hashes recomputed from it'),
          el('span', {}, el('span', { style: 'color:var(--warn)' }, '■ '), 'the proof: sibling hashes you are given')),
        treeSVG(levels, txs, sel, onPath, sibNum, (i) => { selected = i; render(); }),
      );

      // the proof
      const proofPanel = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, `The proof for “${txs[sel].label}” — ${proof.length} hash${proof.length === 1 ? '' : 'es'} (≈ log₂ of ${leaves.length}), not the whole block`),
        el('div', { class: 'hex' },
          proof.map((p, i) => `${i + 1}.  sibling on the ${p.side}:  ${p.hash.slice(0, 20)}…`).join('\n')),
        el('p', { class: 'stub', style: 'margin:8px 0 0' },
          'Start from the transaction’s hash; at each step hash it together with sibling ',
          '1, then 2, then 3 … The result should be the Merkle root in the header.'),
        el('div', { style: 'margin-top:8px' },
          check.ok
            ? el('span', { class: 'chip chip--ok' }, '✓ recomputed root matches the header — the transaction is in the block')
            : el('span', { class: 'chip chip--bad' }, '✗ roots differ')),
      );

      root.append(
        el('div', { class: 'controls' },
          el('button', {
            class: 'btn btn--sm' + (oddCount ? ' btn--primary' : ''),
            onclick: () => { oddCount = !oddCount; selected = 1; render(); },
          }, oddCount ? 'Back to an even number of transactions' : 'Make the count odd'),
          el('span', { class: 'chip chip--neutral' }, `${leaves.length} transactions`)),
        oddCount
          ? noteCallout('CVE-2012-2459',
              ' With an odd row, Bitcoin duplicates the last hash to make a pair. For years, a block with N transactions and one with the last transaction repeated produced the ',
              el('strong', { text: 'same Merkle root' }), ' — and so the same block hash. An attacker could send a malformed twin to split the network. Fixed in 2012.')
          : null,
        el('div', { class: 'hex' },
          el('span', { class: 'hex--label' }, 'Merkle root → goes into the 80-byte header (Step 7)'),
          mkRoot),
        treeEl,
        proofPanel,
        ethCallout(
          ' Ethereum keeps this idea but swaps the structure: account state lives in a ',
          el('strong', { text: 'Merkle–Patricia trie' }), ', and each block header also commits to a separate ',
          el('strong', { text: 'receipts root' }), ' over the logs events emit (Step 11).'),
        ledgerBeforeAfter({
          before: 'Alice’s signed transaction is now broadcast and sits in mempools across the network, next to other pending transactions.',
          after: 'Miner M has fixed a set of transactions and reduced them to one root. Change, add, or reorder any transaction and the root changes. Not mined yet — no proof of work.',
        }),
      );
    }
  },
};

// ---- SVG binary-tree drawing --------------------------------------------
const SVGNS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs) {
  const n = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs || {})) n.setAttribute(k, v);
  return n;
}

function treeSVG(levels, txs, sel, onPath, sibNum, onLeafClick) {
  const isSib = (l, i) => sibNum(l, i) > 0;
  const nLeaves = levels[0].length;
  const COL = 170;          // horizontal room per leaf
  const ROWH = 96;          // vertical spacing between levels — the "long arrows"
  const NH = 32;
  const PAD = 18;
  const W = Math.max(nLeaves * COL, 320);
  const H = (levels.length - 1) * ROWH + NH + PAD * 2;

  // x-position of every node, computed bottom-up
  const xs = [];
  xs[0] = levels[0].map((_, i) => i * COL + COL / 2);
  for (let l = 1; l < levels.length; l++) {
    xs[l] = levels[l].map((_, j) => {
      const c0 = 2 * j;
      const c1 = Math.min(2 * j + 1, levels[l - 1].length - 1);
      return (xs[l - 1][c0] + xs[l - 1][c1]) / 2;
    });
  }
  const yAt = (l) => H - PAD - NH / 2 - l * ROWH;

  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, style: 'max-width:none;display:block' });

  // edges first (behind the nodes)
  for (let l = 1; l < levels.length; l++) {
    for (let j = 0; j < levels[l].length; j++) {
      const px = xs[l][j], py = yAt(l);
      const kids = [2 * j, Math.min(2 * j + 1, levels[l - 1].length - 1)];
      [...new Set(kids)].forEach((ci) => {
        const hot = onPath.has(`${l}:${j}`) && onPath.has(`${l - 1}:${ci}`);
        const sib = isSib(l - 1, ci);
        const col = hot ? 'var(--accent)' : sib ? 'var(--warn)' : 'var(--line-strong)';
        svg.appendChild(svgEl('line', {
          x1: px, y1: py + NH / 2, x2: xs[l - 1][ci], y2: yAt(l - 1) - NH / 2,
          style: `stroke:${col};stroke-width:${hot || sib ? 2 : 1};opacity:${hot || sib ? 0.95 : 0.5}`,
        }));
      });
    }
  }

  // nodes
  for (let l = 0; l < levels.length; l++) {
    for (let i = 0; i < levels[l].length; i++) {
      const isLeaf = l === 0;
      const isRoot = l === levels.length - 1;
      const target = isLeaf && i === sel;              // the transaction being proven
      const path = onPath.has(`${l}:${i}`) && !target; // hashes recomputed on the way up
      const n = sibNum(l, i);                          // >0 => a proof sibling, with its step number
      const w = isLeaf ? 150 : isRoot ? 134 : 106;
      const g = svgEl('g', { transform: `translate(${xs[l][i]}, ${yAt(l)})`, style: isLeaf ? 'cursor:pointer' : '' });

      let stroke = 'var(--line-strong)', fill = 'var(--bg-raised)', ink = 'var(--ink)', sw = 1.4;
      if (path) { stroke = 'var(--accent)'; fill = 'var(--accent-soft)'; sw = 1.6; }
      if (n) { stroke = 'var(--warn)'; fill = 'var(--warn-soft)'; sw = 1.8; }
      if (target) { stroke = 'var(--accent)'; fill = 'var(--accent)'; ink = '#fff'; sw = 2.4; }
      if (isRoot) sw = 2.4;

      g.appendChild(svgEl('rect', {
        x: -w / 2, y: -NH / 2, width: w, height: NH, rx: 6,
        style: `fill:${fill};stroke:${stroke};stroke-width:${sw}`,
      }));

      const raw = isLeaf ? txs[i].label : (isRoot ? 'ROOT ' : '') + levels[l][i].slice(0, 10) + '…';
      const label = raw.length > (isLeaf ? 20 : 18) ? raw.slice(0, isLeaf ? 19 : 17) + '…' : raw;
      const text = svgEl('text', {
        'text-anchor': 'middle', dy: isLeaf ? -1 : 4,
        style: `fill:${ink};font-family:var(--mono);font-size:${isLeaf ? 10 : 9.5}px;font-weight:${isRoot || target ? 700 : 400}`,
      });
      text.textContent = label;
      g.appendChild(text);

      if (isLeaf) {
        const sub = svgEl('text', { 'text-anchor': 'middle', dy: 11, style: `fill:${target ? 'rgba(255,255,255,.85)' : 'var(--ink-faint)'};font-family:var(--mono);font-size:8px` });
        sub.textContent = levels[0][i].slice(0, 10) + '…';
        g.appendChild(sub);
        g.appendChild(svgEl('title', {})).textContent = txs[i].label + '  ' + levels[0][i];
        g.addEventListener('click', () => onLeafClick(i));
      } else {
        g.appendChild(svgEl('title', {})).textContent = levels[l][i];
      }

      if (target) {
        const cap = svgEl('text', { 'text-anchor': 'middle', y: -NH / 2 - 6, style: 'fill:var(--accent);font-size:9px;font-weight:700' });
        cap.textContent = '▼ proving this is in the block';
        g.appendChild(cap);
      }
      if (n) {
        g.appendChild(svgEl('circle', { cx: w / 2 - 2, cy: -NH / 2 + 2, r: 8, style: 'fill:var(--warn);stroke:var(--bg-raised);stroke-width:1.5' }));
        const num = svgEl('text', { x: w / 2 - 2, y: -NH / 2 + 5.5, 'text-anchor': 'middle', style: 'fill:#fff;font-size:9px;font-weight:700' });
        num.textContent = String(n);
        g.appendChild(num);
      }
      svg.appendChild(g);
    }
  }

  const cap = svgEl('text', { x: 8, y: 14, style: 'fill:var(--ink-faint);font-size:10px' });
  cap.textContent = 'each parent = SHA-256d(left ‖ right)';
  svg.appendChild(cap);
  return svg;
}

// indices on the path from leaf `sel` up to the root
function pathIndices(levels, sel) {
  const set = new Set();
  let idx = sel;
  for (let l = 0; l < levels.length; l++) {
    set.add(`${l}:${idx}`);
    idx = Math.floor(idx / 2);
  }
  return set;
}
// is (l,i) the sibling consumed at proof step `pi`?
function samePairSibling(levels, sel, pi, l, i) {
  if (l !== pi) return false;
  let idx = sel;
  for (let k = 0; k < pi; k++) idx = Math.floor(idx / 2);
  const sibIdx = idx % 2 === 1 ? idx - 1 : idx + 1;
  const clamped = Math.min(sibIdx, levels[l].length - 1);
  return i === clamped && i !== idx;
}
