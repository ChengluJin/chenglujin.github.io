import { el, clear, byteChips, bitDiffCount, stepHead, ethCallout, noteCallout } from '../ui.js';
import { castBar } from '../components.js';
import { sha256, sha256d, hash160, keccak_256, utf8, bytesToHex } from '../lib/hash.js';

const MODES = {
  sha256:  { label: 'SHA-256',     hint: 'the workhorse — used everywhere below',           fn: sha256,   size: 32 },
  sha256d: { label: 'SHA-256d',    hint: 'SHA-256 twice — Bitcoin block & transaction IDs', fn: sha256d,  size: 32 },
  hash160: { label: 'HASH160',     hint: 'RIPEMD-160(SHA-256(x)) — Bitcoin addresses',      fn: hash160,  size: 20 },
  keccak:  { label: 'Keccak-256',  hint: 'Ethereum’s hash — same size, different function', fn: keccak_256, size: 32 },
};

export default {
  id: 'hash', num: 1, lecture: 'L1',
  title: 'The hash function',
  lede: 'Every other part of a blockchain leans on this one tool: a function that turns any input into a fixed-size fingerprint you cannot run backwards.',

  mount(container) {
    let mode = 'sha256';
    let text = 'Blockchains: An Introduction';
    let flipped = null; // { bytes, byteIndex, bitIndex }

    const root = el('div');
    container.append(
      stepHead(this.num, this.lecture, this.title),
      el('p', { class: 'step-lede' }, this.lede),
      castBar([], { caption: 'Hashing is a local tool that every party uses. Nobody has acted on the ledger yet — click a badge to meet the cast.' }),
      root,
    );
    render();

    function currentBytes() { return utf8(text); }

    function render() {
      clear(root);
      const M = MODES[mode];
      const inBytes = currentBytes();
      const digest = M.fn(inBytes);

      // ---- controls -------------------------------------------------
      const modeRow = el('div', { class: 'controls' });
      for (const [key, m] of Object.entries(MODES)) {
        modeRow.append(el('button', {
          class: 'btn btn--sm' + (key === mode ? ' btn--primary' : ''),
          onclick: () => { mode = key; flipped = null; render(); },
          title: m.hint,
        }, m.label));
      }

      const input = el('textarea', { rows: '3', spellcheck: 'false' });
      input.value = text;
      input.addEventListener('input', () => {
        text = input.value;
        flipped = null;
        // light refresh: only the output blocks
        refreshOutput();
      });

      // ---- output -------------------------------------------------
      const outWrap = el('div');
      function refreshOutput() {
        clear(outWrap);
        const b = currentBytes();
        const d = MODES[mode].fn(b);
        outWrap.append(
          el('div', { class: 'hex' },
            el('span', { class: 'hex--label' }, `${MODES[mode].label} · ${MODES[mode].size} bytes · hex`),
            bytesToHex(d)),
          el('div', { style: 'margin-top:8px' }, byteChips(d)),
        );
      }
      refreshOutput();

      // ---- avalanche --------------------------------------------
      const avWrap = el('div');
      function renderAvalanche() {
        clear(avWrap);
        const base = currentBytes();
        const baseDigest = MODES[mode].fn(base);
        const row = el('div', { class: 'controls' },
          el('button', {
            class: 'btn btn--sm',
            onclick: () => {
              const copy = base.slice();
              if (copy.length === 0) return;
              const bi = Math.floor(Math.random() * copy.length);
              const bit = Math.floor(Math.random() * 8);
              copy[bi] ^= (1 << bit);
              flipped = { bytes: copy, byteIndex: bi, bitIndex: bit };
              renderAvalanche();
            },
          }, flipped ? 'Flip another bit' : 'Flip one input bit'),
          flipped ? el('button', { class: 'btn btn--sm btn--ghost', onclick: () => { flipped = null; renderAvalanche(); } }, 'Clear') : null,
        );
        avWrap.append(row);

        if (flipped) {
          const altDigest = MODES[mode].fn(flipped.bytes);
          const changed = bitDiffCount(baseDigest, altDigest);
          const totalBits = baseDigest.length * 8;
          avWrap.append(
            el('p', { class: 'stub', style: 'margin:6px 0' },
              `Changed input byte #${flipped.byteIndex} (one bit). Output: `,
              el('strong', { text: `${changed} of ${totalBits} bits differ` }),
              ` — about half. A one-bit nudge scrambles the whole digest; that is the avalanche effect.`),
            el('div', { class: 'grid2' },
              el('div', { class: 'panel' },
                el('div', { class: 'panel__title' }, 'Original digest'),
                byteChips(baseDigest)),
              el('div', { class: 'panel' },
                el('div', { class: 'panel__title' }, 'After the 1-bit change (differences highlighted)'),
                byteChips(altDigest, baseDigest))),
          );
        }
      }
      renderAvalanche();

      // ---- properties ------------------------------------------
      const props = el('div', { class: 'props' },
        prop('One-way (preimage resistance)',
          'Given a digest, you cannot find an input that produces it — short of trying inputs one by one.',
          'Used for: proof of work (Step 8), commitments, pay-to-hash locks (Step 4).'),
        prop('Collision resistance',
          'You cannot find two different inputs with the same digest.',
          'Used for: Merkle roots (Step 6), the previous-block hash link (Step 9), transaction IDs.'),
        prop('Looks random (avalanche)',
          'Flip one input bit and roughly half the output bits flip, unpredictably.',
          'Used for: mining being a fair lottery (Step 8), addresses spreading evenly.'),
      );

      // ---- assemble ------------------------------------------
      root.append(
        modeRow,
        el('p', { class: 'stub', style: 'margin:-4px 0 10px' }, MODES[mode].label, ' — ', MODES[mode].hint, '.'),
        el('div', { class: 'field' },
          el('label', {}, 'Input (any text)'),
          input),
        el('div', { class: 'panel' },
          el('div', { class: 'panel__title' }, 'Digest'),
          outWrap),
        el('div', { class: 'panel' },
          el('div', { class: 'panel__title' }, 'Avalanche effect'),
          avWrap),
        el('div', { style: 'margin-top:14px' }, props),
        mode === 'keccak'
          ? noteCallout('Note',
              ' Keccak-256 is what Ethereum calls ', el('code', { text: "sha3" }),
              ', but it uses the original Keccak padding, not the final NIST SHA3-256 standard — so their digests differ for the same input.')
          : ethCallout(
              ' Ethereum hashes with Keccak-256 (try the Keccak-256 button): same 32-byte size, different internals. Bitcoin uses SHA-256 (and RIPEMD-160 for addresses).'),
      );
    }

    return () => {};
  },
};

function prop(title, body, link) {
  return el('div', { class: 'prop' },
    el('h4', {}, title),
    el('p', {}, body),
    el('span', { class: 'prop__link' }, link));
}
