import { el, clear, stepHead, noteCallout } from '../ui.js';
import { castBar, ledgerBeforeAfter } from '../components.js';
import { scenario, onChange } from '../state.js';

export default {
  id: 'ethereum', num: 11, lecture: 'L4',
  title: 'Where Ethereum goes further',
  lede: 'Same foundation — hashing, signatures, Merkle commitments, consensus — but the ledger stops being a coin ledger and becomes a general-purpose computer.',

  mount(container) {
    let applied = false;       // account-vs-UTXO transfer applied
    let fixed = false;         // reentrancy fix on/off
    let frame = 0;             // reentrancy animation frame
    let playing = null;
    let gasLimit = 30000;
    let ranGas = false;

    const root = el('div');
    container.append(
      stepHead(this.num, this.lecture, this.title),
      el('p', { class: 'step-lede' }, this.lede),
      castBar(['alice', 'bob', 'minerM', 'honest'], { caption: 'Same cast. “Miner M” is now a stake-weighted block proposer; the honest nodes additionally re-execute every contract call to check the resulting state.' }),
      root,
    );

    // ---- reentrancy frames -------------------------------------------
    function reentrancyFrames() {
      if (!fixed) {
        return [
          ['Attacker.attack()', 'bank balance: 300 · attacker deposited 75', []],
          ['→ Bank.withdraw()', 'reads balances[attacker] = 75', ['Bank.withdraw #1']],
          ['   msg.sender.call{value: 75}', 'sends 75 to the attacker contract…', ['Bank.withdraw #1', 'call']],
          ['→ Attacker.receive()', 'bank balance 225 ≥ 75 → re-enter', ['Bank.withdraw #1', 'call', 'receive #1']],
          ['→ Bank.withdraw()', 'reads balances[attacker] = 75  (STILL — never zeroed)', ['Bank.withdraw #1', 'call', 'receive #1', 'Bank.withdraw #2']],
          ['   …call → receive → withdraw …', 'repeats while bank balance ≥ 75', ['…deep call stack…']],
          ['unwind', 'bank drained 300 → 0; each frame finally runs balances[attacker] = 0 (too late)', []],
          ['done', 'attacker deposited 75, withdrew 300. Net theft: 225.', []],
        ];
      }
      return [
        ['Attacker.attack()', 'bank balance: 300 · attacker deposited 75', []],
        ['→ Bank.withdraw()', 'checks: bal = 75 > 0  ✓', ['Bank.withdraw']],
        ['   balances[attacker] = 0', 'EFFECT FIRST — state updated before any external call', ['Bank.withdraw']],
        ['   msg.sender.call{value: 75}', 'sends 75…', ['Bank.withdraw', 'call']],
        ['→ Attacker.receive()', 're-enter → Bank.withdraw()', ['Bank.withdraw', 'call', 'receive']],
        ['→ Bank.withdraw()', 'checks: bal = 0 → require fails → revert', ['Bank.withdraw', 'call', 'receive', 'Bank.withdraw ✗']],
        ['done', 'only the genuine 75 left the bank. Bank keeps 225.', []],
      ];
    }

    function playReentrancy() {
      if (playing) clearInterval(playing);
      frame = 0; render();
      playing = setInterval(() => {
        frame++;
        if (frame >= reentrancyFrames().length - 1) { clearInterval(playing); playing = null; }
        render();
      }, 900);
    }

    // ---- gas program ------------------------------------------------
    const GAS_OPS = [
      ['PUSH1 0x03', 3], ['SLOAD (cold slot)', 2100], ['ADD', 3],
      ['SSTORE (0 → non-zero)', 20000], ['LOG1', 1125], ['RETURN', 0],
    ];
    function runGas() {
      let gas = gasLimit, i = 0, oog = false;
      for (; i < GAS_OPS.length; i++) {
        if (gas < GAS_OPS[i][1]) { oog = true; break; }
        gas -= GAS_OPS[i][1];
      }
      return { used: gasLimit - gas, oog, stoppedAt: i, refund: oog ? 0 : gas };
    }

    function render() {
      clear(root);

      // ---------- A: account vs UTXO ----------
      const utxoCol = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, 'Bitcoin — UTXO model'),
        el('div', { class: 'hex' },
          applied
            ? 'UTXO a1c4… (6 BTC)      → SPENT\nnew: → Bob        2.000\nnew: → Alice      3.999  (change)\nfee                0.001'
            : 'UTXO a1c4… (6 BTC)   owner: Alice'),
        el('p', { class: 'stub', style: 'margin:6px 0 0' }, applied ? '1 output destroyed, 2 created. No balance was edited.' : ''));

      const acctRow = (name, bal, nonce, hl) => el('div', { class: 'ba__row' },
        el('span', { class: 'k' }, name),
        el('span', { class: 'v' }, `balance ${bal}  ·  nonce ${nonce}`, hl ? el('span', { style: 'color:var(--ok);margin-left:6px' }, '◀ changed in place') : null));
      const acctCol = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, 'Ethereum — account model'),
        acctRow('Alice', applied ? '3.999' : '6.000', applied ? '1' : '0', applied),
        acctRow('Bob', applied ? '2.000' : '0.000', '0', applied),
        el('p', { class: 'stub', style: 'margin:6px 0 0' }, applied ? 'Balances mutated directly; Alice’s nonce +1 stops the signed transaction being replayed.' : ''));

      const toggleA = el('div', { class: 'controls' },
        el('button', { class: 'btn btn--sm' + (applied ? '' : ' btn--primary'), onclick: () => { applied = !applied; render(); } },
          applied ? 'Reset' : 'Apply the same “send 2” payment to both'));

      // ---------- B: gas meter ----------
      const g = runGas();
      const gasSlider = el('input', { type: 'range', min: '10000', max: '40000', step: '1000', value: String(gasLimit) });
      gasSlider.addEventListener('input', () => { gasLimit = parseInt(gasSlider.value); ranGas = true; render(); });
      const gasRows = GAS_OPS.map(([name, cost], i) => el('div', {
        class: 'ba__row',
        style: ranGas && g.oog && i === g.stoppedAt ? 'background:var(--bad-soft);color:var(--bad)' : (ranGas && (g.oog ? i < g.stoppedAt : true) ? 'opacity:.55' : ''),
      }, el('span', { class: 'k', style: 'flex:0 0 180px' }, name), el('span', { class: 'v' }, `${cost} gas`)));
      const gasPanel = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, 'The EVM meters every instruction with gas'),
        el('div', { class: 'field' }, el('label', {}, `gasLimit = ${gasLimit.toLocaleString()}`), gasSlider),
        ...gasRows,
        el('div', { style: 'margin-top:8px' },
          ranGas
            ? (g.oog
              ? el('span', { class: 'chip chip--bad' }, `✗ out of gas at “${GAS_OPS[g.stoppedAt][0]}” — all state changes reverted, but ${g.used.toLocaleString()} gas is still charged`)
              : el('span', { class: 'chip chip--ok' }, `✓ completed — used ${g.used.toLocaleString()} gas, ${g.refund.toLocaleString()} refunded`))
            : el('button', { class: 'btn btn--sm btn--primary', onclick: () => { ranGas = true; render(); } }, '▶ Run')),
        el('p', { class: 'stub', style: 'margin:8px 0 0' },
          'EIP-1559: the true price is gasUsed × (base fee + tip). The base-fee part is burned; the tip goes to the proposer; a full block pushes the next base fee up 12.5%.'));

      // ---------- C: reentrancy ----------
      const frames = reentrancyFrames();
      const fr = Math.min(frame, frames.length - 1);
      const stackView = el('div', { class: 'hex' },
        el('span', { class: 'hex--label' }, 'call stack'),
        (frames[fr][2].length ? frames[fr][2] : ['(empty)']).map((s, i) => `${'  '.repeat(i)}${s}`).join('\n'));
      const reentPanel = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, 'Security: reentrancy — the vulnerable Bank'),
        el('div', { class: 'hex' },
          el('span', { class: 'hex--label' }, fixed ? 'withdraw()  — checks / EFFECTS / interactions' : 'withdraw()  — the bug: interaction before effect'),
          fixed
            ? 'uint bal = balances[msg.sender];\nrequire(bal > 0);\nbalances[msg.sender] = 0;              // effect first\n(bool ok,) = msg.sender.call{value: bal}("");   // then interact'
            : 'uint bal = balances[msg.sender];\nrequire(bal > 0);\n(bool ok,) = msg.sender.call{value: bal}("");   // external call…\nbalances[msg.sender] = 0;              // …effect runs too late'),
        el('div', { class: 'controls', style: 'margin:8px 0' },
          el('button', { class: 'btn btn--sm btn--primary', onclick: playReentrancy }, '▶ Run the attack'),
          el('button', { class: 'btn btn--sm' + (fixed ? ' btn--primary' : ''), onclick: () => { fixed = !fixed; frame = 0; render(); } },
            fixed ? 'fix ON: checks-effects-interactions' : 'apply the checks-effects-interactions fix')),
        stackView,
        el('p', { class: 'stub', style: 'margin:8px 0 0' }, `${frames[fr][0]} — ${frames[fr][1]}`),
      );

      root.append(
        el('div', { class: 'grid2' }, utxoCol, acctCol),
        toggleA,
        el('p', { class: 'stub' }, 'The account model is compact and natural for stateful programs, but its transactions must be ordered per sender (the nonce) and the global state only grows.'),
        gasPanel,
        reentPanel,
        noteCallout('The DAO, 2016',
          ' A $150M investment fund written entirely in Solidity had exactly this bug. An attacker drained ~3.6M ETH (about a third of it). Ethereum responded with a contentious ',
          el('strong', { text: 'hard fork' }), ' that reversed the theft; the minority who refused to reverse it are ',
          el('strong', { text: 'Ethereum Classic' }), '. “Checks-effects-interactions” is taught as a rule because of this.'),
        ledgerBeforeAfter({
          before: 'On Bitcoin, Alice’s 6 BTC lived in one output that a transaction consumes whole; a spend condition is a short, loop-free Script.',
          after: 'On Ethereum, Alice and Bob are accounts; the payment edits balances in place and bumps a nonce. Spend conditions are arbitrary contract code, metered by gas, and — as the Bank shows — able to call back into the caller mid-execution.',
        }),
      );
    }

    render();
    const unsub = onChange(render);
    return () => { if (playing) clearInterval(playing); unsub(); };
  },
};
