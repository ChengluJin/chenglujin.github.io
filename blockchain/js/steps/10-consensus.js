import { el, clear, stepHead, ethCallout, noteCallout } from '../ui.js';
import { castBar, ledgerBeforeAfter } from '../components.js';
import { scenario, onChange } from '../state.js';

export default {
  id: 'consensus', num: 10, lecture: 'L3',
  title: 'Forks and the longest chain',
  lede: 'Two miners can extend the chain at the same moment. The rule “build on the heaviest chain”, plus a few confirmations, settles honest forks — and prices out dishonest ones.',

  mount(container) {
    let beta = 0.30;   // attacker share of hash power (also α for selfish mining)
    let k = 6;         // confirmations Bob waits for
    let gamma = 0.5;   // fraction of honest miners that build on the selfish block in a race
    let race = null;   // last single-race result
    let anim = null;   // interval id
    let mc = null;     // monte-carlo result

    const root = el('div');
    container.append(
      stepHead(this.num, this.lecture, this.title),
      el('p', { class: 'step-lede' }, this.lede),
      castBar(['minerM', 'honest', 'evil'], { caption: 'Miner M and other honest miners sometimes fork by accident. Node E forks on purpose: it showed “pay Bob” to Bob and a conflicting “pay E” to the miners.' }),
      root,
    );

    function simulate(b, kk, maxRounds = 1500) {
      let h = 0, a = 0, shipped = false, verdict = null;
      const timeline = [];
      for (let r = 0; r < maxRounds; r++) {
        const who = Math.random() < b ? 'A' : 'H';
        if (who === 'A') a++; else h++;
        timeline.push(who);
        if (!shipped && h >= kk) shipped = true;
        if (shipped && a >= h) { verdict = 'attacker'; break; }
      }
      if (!verdict) verdict = shipped ? 'honest' : 'attacker';
      return { h, a, shipped, verdict, timeline };
    }

    function runSingle() {
      if (anim) { clearInterval(anim); anim = null; }
      const full = simulate(beta, k);
      race = { h: 0, a: 0, shipped: false, verdict: null, timeline: [], _full: full, _i: 0 };
      anim = setInterval(() => {
        const f = race._full;
        if (race._i >= f.timeline.length) {
          clearInterval(anim); anim = null;
          race.verdict = f.verdict; render(); return;
        }
        const who = f.timeline[race._i++];
        if (who === 'A') race.a++; else race.h++;
        race.timeline.push(who);
        if (!race.shipped && race.h >= k) race.shipped = true;
        render();
      }, 140);
      render();
    }

    function runMonteCarlo() {
      const N = 600;
      let wins = 0;
      for (let i = 0; i < N; i++) if (simulate(beta, k).verdict === 'attacker') wins++;
      mc = { N, rate: wins / N };
      render();
    }

    // Nakamoto's double-spend probability (Bitcoin whitepaper, §11): the attacker
    // also mines during the k-block wait, so the honest lead when the merchant
    // accepts is only k − (attacker's Poisson progress). This is the curve the
    // simulation should — and does — track.
    function nakamotoBound(q, z) {
      if (q >= 0.5) return 1;
      const p = 1 - q;
      const lambda = z * (q / p);
      let sum = 1;
      let poisson = Math.exp(-lambda); // term for i = 0
      for (let i = 0; i <= z; i++) {
        sum -= poisson * (1 - Math.pow(q / p, z - i));
        poisson *= lambda / (i + 1);
      }
      return Math.max(0, sum);
    }
    // the naive "catch up from exactly k behind" tail, for contrast
    function naiveTail(q, z) { return q >= 0.5 ? 1 : Math.pow(q / (1 - q), z); }

    // Selfish mining (Eyal & Sirer, 2013): a miner of share α withholds blocks
    // to keep a private lead. `g` = fraction of honest miners that end up on the
    // selfish block during a same-height race. Returns the selfish pool's
    // *relative* revenue (share of all blocks that end up on the main chain).
    function selfishRevenue(a, g) {
      if (a <= 0) return 0;
      if (a >= 0.5) return 1;
      const num = a * (1 - a) ** 2 * (4 * a + g * (1 - 2 * a)) - a ** 3;
      const den = 1 - a * (1 + (2 - a) * a);
      return Math.max(0, Math.min(1, num / den));
    }
    // α above which selfish mining beats honest mining
    function selfishThreshold(g) { return (1 - g) / (3 - 2 * g); }

    // ---- block-by-block selfish-mining strategy simulator ----------------
    // sm.pub / sm.priv: honest / selfish blocks in play this epoch.
    // sm.revealed: how many of the selfish blocks are published.
    // Verified (2M steps) to reproduce selfishRevenue(α, γ).
    let sm = null;
    let smTimer = null;
    function smReset() {
      if (smTimer) { clearInterval(smTimer); smTimer = null; }
      sm = {
        pub: 0, priv: 0, revealed: 0, racing: false, steps: 0,
        score: { s: 0, h: 0, orphan: 0 },
        who: null,            // 'selfish' | 'honest' — who found the last block
        settled: false,       // did the last step close an epoch?
        note: 'Press Step. The selfish miner (share α) hides every block it finds and only publishes to orphan honest work.',
      };
    }
    function smStep() {
      if (!sm) smReset();
      const a = Math.min(beta, 0.499), g = gamma;
      sm.steps++;
      sm.settled = false;
      const selfishFinds = Math.random() < a;
      sm.who = selfishFinds ? 'selfish' : 'honest';

      if (sm.racing) {
        if (selfishFinds) {
          sm.priv++; sm.revealed++;
          sm.score.s += sm.priv; sm.score.orphan += sm.pub;
          sm.note = `Selfish found the next block on its hidden branch — its ${sm.priv}-block branch beats the honest 1-block branch. The honest block is orphaned.`;
        } else if (Math.random() < g) {
          sm.score.s += 1; sm.score.h += 1;
          sm.note = `An honest miner (the γ = ${g.toFixed(2)} fraction) built ON the revealed selfish block. Selfish keeps 1, honest keeps the new one — a split.`;
        } else {
          sm.score.h += sm.pub + 1; sm.score.orphan += sm.revealed;
          sm.note = `An honest miner extended the honest block instead. That branch wins the race; the selfish miner’s revealed block is orphaned — it earns nothing this round.`;
        }
        sm.racing = false; sm.settled = true;
        sm.pub = 0; sm.priv = 0; sm.revealed = 0;
        return;
      }

      if (selfishFinds) {
        sm.priv++;
        sm.note = `Selfish miner found a block — keeps it secret. Hidden lead δ = ${sm.priv - sm.pub}.`;
        return;
      }

      // honest finds a block
      if (sm.priv === 0) {
        sm.score.h += 1; sm.settled = true;
        sm.note = `Honest block. The selfish miner has nothing hidden, so it just mines on top. δ stays 0.`;
        return;
      }
      sm.pub++;
      const lead = sm.priv - sm.pub;
      if (lead === 0) {
        sm.revealed = sm.priv; sm.racing = true;
        sm.note = `The honest chain drew level. The selfish miner reveals its hidden block → a same-height RACE. ${Math.round(g * 100)}% of honest hash power now builds on the selfish block.`;
      } else if (lead === 1) {
        sm.revealed = sm.priv;
        sm.score.s += sm.priv; sm.score.orphan += sm.pub;
        sm.note = `δ was 2. An honest block appeared, so the selfish miner dumps its whole ${sm.priv}-block private chain at once — it is longer, so all ${sm.pub} honest block(s) this round are orphaned. Wasted honest work.`;
        sm.settled = true; sm.pub = 0; sm.priv = 0; sm.revealed = 0;
      } else {
        sm.score.s += 1; sm.score.orphan += 1;
        sm.priv -= 1; sm.pub -= 1;
        sm.note = `The selfish lead is comfortable (δ = ${lead}). It publishes just one block to stay ahead of the public chain; the honest block is orphaned, the rest stays hidden.`;
      }
    }
    function smMany(n) { for (let i = 0; i < n; i++) smStep(); }
    function smAuto() {
      if (smTimer) { clearInterval(smTimer); smTimer = null; render(); return; }
      smTimer = setInterval(() => { smStep(); render(); }, 700);
      render();
    }

    function render() {
      clear(root);

      const betaSlider = el('input', { type: 'range', min: '5', max: '55', value: String(Math.round(beta * 100)) });
      betaSlider.addEventListener('input', () => { beta = parseInt(betaSlider.value) / 100; mc = null; render(); });
      const kSlider = el('input', { type: 'range', min: '1', max: '12', value: String(k) });
      kSlider.addEventListener('input', () => { k = parseInt(kSlider.value); mc = null; render(); });

      const controls = el('div', {},
        el('div', { class: 'field' }, el('label', {}, `Attacker hash-power share  β = ${beta.toFixed(2)}  ${beta >= 0.5 ? '  (majority — attack always eventually succeeds)' : ''}`), betaSlider),
        el('div', { class: 'field' }, el('label', {}, `Confirmations Bob waits for  k = ${k}`), kSlider),
        el('div', { class: 'controls' },
          el('button', { class: 'btn btn--primary btn--sm', onclick: runSingle }, '▶ Watch one race'),
          el('button', { class: 'btn btn--sm', onclick: runMonteCarlo }, '▶ Simulate 600 races (measure the odds)'),
        ),
        el('p', { class: 'stub', style: 'margin:6px 0 0' },
          'One race is a coin-flip sequence — with luck the attacker can win even at low β, so a single run tells you nothing about how *risky* accepting the payment is. Simulating hundreds of races measures the actual success rate, which you can then compare to the theory below.'),
      );

      // three rules
      const rules = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, 'Nakamoto consensus in three rules'),
        el('ol', { style: 'margin:0;padding-left:18px;font-size:13px;color:var(--ink-soft)' },
          el('li', {}, el('strong', { text: 'Leader by work: ' }), 'solving the PoW puzzle is the vote; your chance ∝ your hash-power share.'),
          el('li', {}, el('strong', { text: 'Fork choice: ' }), 'always mine on the heaviest (most cumulative work) chain.'),
          el('li', {}, el('strong', { text: 'Confirmation depth: ' }), 'treat a transaction as settled once k blocks sit on top (k ≈ 6).')),
      );

      // race visual
      const raceView = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, 'The race — honest chain vs Node E’s private chain (both fork from block 5)'),
        chainRow('honest (contains Alice → Bob)', race ? race.h : 0, 'var(--who-node)', race && race.shipped, k),
        chainRow('Node E — private (contains “pay E”)', race ? race.a : 0, 'var(--who-evil)', false, null),
        race && race.verdict
          ? el('div', { style: 'margin-top:10px' },
              race.verdict === 'attacker'
                ? el('span', { class: 'chip chip--bad' }, '✗ double-spend succeeded — E revealed a longer chain, Alice→Bob was reorged out, E keeps the coins and the goods')
                : el('span', { class: 'chip chip--ok' }, '✓ honest chain won — Alice→Bob stands, E wasted its work'))
          : race
            ? el('p', { class: 'stub', style: 'margin:8px 0 0' }, race.shipped ? `Bob has shipped (block 6 is ${k} deep). E needs to pull ahead now…` : `Bob waits until block 6 is ${k} deep…`)
            : el('p', { class: 'stub', style: 'margin:8px 0 0' }, 'Press “Run one race”.'),
      );

      // probability
      const p = nakamotoBound(beta, k);
      const fmtP = (x) => x >= 0.1 ? `${(x * 100).toFixed(0)}%` : x >= 1e-4 ? `${(x * 100).toFixed(2)}%` : x.toExponential(1);
      const sweepKs = [1, 2, 3, 4, 6, 8, 10];
      const sweep = el('div', { style: 'display:flex;flex-direction:column;gap:3px;margin-top:8px' },
        ...sweepKs.map((kk) => {
          const pk = nakamotoBound(beta, kk);
          const wPct = Math.max(1.5, Math.min(100, Math.pow(pk, 0.33) * 100)); // gentle compression so small values still read as tiny
          return el('div', { style: 'display:flex;align-items:center;gap:8px;font-size:11px' },
            el('span', { style: `flex:0 0 34px;text-align:right;color:${kk === k ? 'var(--accent)' : 'var(--ink-faint)'};font-weight:${kk === k ? 700 : 400}` }, `k=${kk}`),
            el('span', { style: 'flex:1;height:12px;background:var(--bg-sunken);border-radius:3px;overflow:hidden;display:block' },
              el('span', { style: `display:block;height:100%;width:${wPct}%;background:${kk === k ? 'var(--who-evil)' : 'var(--line-strong)'}` })),
            el('span', { style: `flex:0 0 64px;font-family:var(--mono)` }, fmtP(pk)));
        }),
      );

      const naive = naiveTail(beta, k);
      const probPanel = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, `How safe is waiting for k confirmations? (attacker share β = ${beta.toFixed(2)})`),
        el('div', { class: 'hex' },
          `Nakamoto (whitepaper §11) — the attacker also mines during the wait:\n`,
          `  P(reversal at k = ${k})  ≈  ${p < 1e-4 ? p.toExponential(2) : p.toFixed(4)}   (${fmtP(p)})\n\n`,
          `Naive lower bound  (β/(1−β))^k , assumes the attacker starts k behind\n`,
          `and makes no progress:  ≈  ${naive < 1e-4 ? naive.toExponential(2) : naive.toFixed(4)}   ← much too optimistic`),
        el('p', { class: 'stub', style: 'margin:8px 0 2px' }, `Nakamoto reversal probability vs confirmations (bar = current k):`),
        sweep,
        mc ? el('p', { class: 'stub', style: 'margin:10px 0 0' },
          `Measured: over ${mc.N} simulated races at β = ${beta.toFixed(2)}, k = ${k}, the attacker won `,
          el('strong', { text: `${(mc.rate * 100).toFixed(1)}%` }),
          ` — same ballpark as the Nakamoto formula’s ${fmtP(p)} (both approximate the same block-by-block race; the whitepaper formula rounds the attacker’s progress to a Poisson count). The naive ${fmtP(naive)} is the one that is genuinely wrong here.`) : null,
        el('p', { class: 'stub', style: 'margin:10px 0 0' },
          el('strong', { text: 'Takeaway: ' }),
          beta < 0.5
            ? `with the attacker below 50%, the reversal probability still shrinks exponentially in k (e^(−Ω(k))) — just not as fast as the naive (β/(1−β))^k, because the attacker gets a head start from mining during the wait. Waiting ~6 blocks turns "probably settled" into "settled for all practical purposes". Push β past 0.5 and the bars stop shrinking — no depth is safe.`
            : `at β ≥ 50% the bars do not shrink: the attacker’s chain keeps pace with the honest one, so no number of confirmations is safe. This is the 51% attack.`),
      );

      // ---- selfish mining ----------------------------------------------
      const gammaSlider = el('input', { type: 'range', min: '0', max: '100', value: String(Math.round(gamma * 100)) });
      gammaSlider.addEventListener('input', () => { gamma = parseInt(gammaSlider.value) / 100; render(); });
      const alpha = Math.min(beta, 0.499);
      const rev = selfishRevenue(alpha, gamma);
      const thr = selfishThreshold(gamma);
      const beats = rev > alpha + 1e-4;

      function smView() {
        if (!sm) smReset();
        const running = !!smTimer;
        const blockChip = (kind, hidden, fresh) => el('span', {
          title: hidden ? 'hidden — not broadcast' : kind,
          style: [
            'display:inline-grid;place-items:center;width:24px;height:24px;border-radius:4px;font-size:10px;font-weight:700',
            kind === 'selfish' ? 'color:#fff;background:var(--who-evil)' : 'color:#fff;background:var(--who-node)',
            hidden ? 'opacity:.55;border:2px dashed var(--who-evil);background:transparent;color:var(--who-evil)' : '',
            fresh ? 'outline:2px solid var(--ink);outline-offset:1px' : '',
          ].join(';'),
        }, hidden ? '🔒' : (kind === 'selfish' ? 'S' : 'H'));

        const anchor = el('span', { style: 'display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--bg-sunken);border:1px solid var(--line);font-size:10px;color:var(--ink-faint)' }, '⋯');

        const pubBlocks = [];
        for (let i = 0; i < sm.pub; i++) pubBlocks.push(blockChip('honest', false, sm.who === 'honest' && i === sm.pub - 1 && !sm.settled));
        const privBlocks = [];
        for (let i = 0; i < sm.priv; i++) privBlocks.push(blockChip('selfish', i >= sm.revealed, sm.who === 'selfish' && i === sm.priv - 1 && !sm.settled));

        const lead = sm.priv - sm.pub;
        const leadColor = sm.racing ? 'var(--warn)' : lead <= 0 ? 'var(--ink-faint)' : lead === 1 ? 'var(--warn)' : 'var(--who-evil)';

        const tracks = el('div', { style: 'overflow-x:auto' },
          el('div', { style: 'display:flex;align-items:center;gap:4px;margin:4px 0' },
            el('span', { style: 'flex:0 0 128px;font-size:11px;color:var(--who-node)' }, 'public (everyone sees)'),
            anchor.cloneNode(true),
            ...(pubBlocks.length ? pubBlocks : [el('span', { style: 'font-size:11px;color:var(--ink-faint)' }, '— nothing new —')])),
          el('div', { style: 'display:flex;align-items:center;gap:4px;margin:4px 0' },
            el('span', { style: 'flex:0 0 128px;font-size:11px;color:var(--who-evil)' }, 'selfish (private)'),
            anchor.cloneNode(true),
            ...(privBlocks.length ? privBlocks : [el('span', { style: 'font-size:11px;color:var(--ink-faint)' }, '— nothing hidden —')])),
        );

        const total = sm.score.s + sm.score.h;
        const share = total ? sm.score.s / total : 0;
        const scoreboard = el('div', { style: 'display:flex;gap:10px;flex-wrap:wrap;margin-top:10px' },
          stat('selfish blocks', sm.score.s, 'var(--who-evil)'),
          stat('honest blocks', sm.score.h, 'var(--who-node)'),
          stat('honest blocks orphaned', sm.score.orphan, 'var(--ink-faint)'),
          stat('steps', sm.steps, 'var(--ink-faint)'),
        );

        return el('div', { class: 'panel', style: 'background:var(--bg-raised)' },
          el('div', { style: 'display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:6px' },
            el('span', { style: `font-size:13px;font-weight:700;color:${leadColor}` }, sm.racing ? 'RACE (δ = 0, revealed)' : `hidden lead  δ = ${Math.max(lead, 0)}`),
            el('span', { class: 'chip chip--neutral' }, `α = ${(alpha * 100).toFixed(0)}%`),
          ),
          tracks,
          el('p', { class: 'stub', style: `margin:8px 0 0;padding:8px;border-radius:6px;background:var(--bg-sunken);border-left:3px solid ${sm.who === 'selfish' ? 'var(--who-evil)' : sm.who === 'honest' ? 'var(--who-node)' : 'var(--line-strong)'}` }, sm.note),
          scoreboard,
          total >= 20 ? el('p', { class: 'stub', style: 'margin:8px 0 0' },
            'Selfish share of on-chain blocks so far: ',
            el('strong', { style: `color:${share > alpha ? 'var(--who-evil)' : 'var(--ink)'}` }, `${(share * 100).toFixed(1)}%`),
            `  (its hash power is only ${(alpha * 100).toFixed(0)}%; honest mining would give exactly that). Long-run prediction: ${(rev * 100).toFixed(1)}%.`) : null,
          el('div', { class: 'controls', style: 'margin-top:10px' },
            el('button', { class: 'btn btn--sm btn--primary', onclick: () => { smStep(); render(); } }, '▶ Step'),
            el('button', { class: 'btn btn--sm' + (running ? ' btn--primary' : ''), onclick: smAuto }, running ? '⏸ Pause' : '⏩ Auto'),
            el('button', { class: 'btn btn--sm', onclick: () => { smMany(25); render(); } }, '+25 steps'),
            el('button', { class: 'btn btn--sm', onclick: () => { smMany(1000); render(); } }, '+1000 (converge)'),
            el('button', { class: 'btn btn--sm btn--ghost', onclick: () => { smReset(); render(); } }, '↺ Reset'),
          ),
        );
      }
      function stat(label, val, color) {
        return el('div', { style: 'flex:1 1 96px;min-width:90px;background:var(--bg-sunken);border:1px solid var(--line);border-radius:6px;padding:6px 8px' },
          el('div', { style: `font-size:18px;font-weight:700;color:${color}` }, String(val)),
          el('div', { style: 'font-size:10px;color:var(--ink-faint)' }, label));
      }

      const selfishPanel = el('div', { class: 'panel' },
        el('div', { class: 'panel__title' }, 'A subtler attack: selfish mining (Eyal & Sirer, 2013)'),
        el('p', { class: 'stub', style: 'margin:0 0 8px' },
          'The fork-choice rule assumes miners publish blocks as soon as they find them. A ',
          el('strong', { text: 'selfish' }), ' miner instead ',
          el('strong', { text: 'withholds' }), ' its blocks, keeping a private lead, and releases them only to orphan honest work. It never needs a majority.'),
        smView(),
        el('details', { class: 'disclose' },
          el('summary', {}, 'The full decision rule (state = private lead δ)'),
          el('div', { class: 'disclose__body' },
            el('ul', { style: 'margin:0;padding-left:18px;font-size:12.5px;color:var(--ink-soft)' },
              el('li', {}, 'Selfish finds a block → keep it hidden, δ increases.'),
              el('li', {}, 'δ = 1, honest finds a block → reveal the hidden block: a same-height race; a fraction γ of honest hash power switches to it.'),
              el('li', {}, 'δ = 2, honest finds a block → publish the whole private chain: it is longer, so the honest block is orphaned.'),
              el('li', {}, 'δ ≥ 3, honest finds a block → publish just one block to stay ahead; that honest block is orphaned, the rest stays hidden.'),
              el('li', {}, 'δ = 0 (nothing hidden), honest finds a block → just accept it.'))),
        ),
        el('div', { class: 'field', style: 'margin-top:12px' }, el('label', {}, `Race-winning fraction  γ = ${gamma.toFixed(2)}  (how well-connected the selfish miner is)`), gammaSlider),
        el('p', { class: 'stub', style: 'margin:0 0 6px' }, 'The curve below is the long-run average of this strategy: share of on-chain blocks the selfish miner earns, vs its hash-power share α (= β above).'),
        selfishChart(alpha, gamma, selfishRevenue, thr),
        el('p', { class: 'stub', style: 'margin:10px 0 0' },
          beats
            ? el('span', {}, 'With α = ', el('strong', { text: `${(alpha * 100).toFixed(0)}%` }), ' of the hash power and γ = ', el('strong', { text: gamma.toFixed(2) }),
                ', the selfish miner earns ', el('strong', { style: 'color:var(--who-evil)', text: `≈ ${(rev * 100).toFixed(0)}%` }),
                ' of blocks — ', el('strong', { text: 'more than its fair share' }), '. Honest mining would give exactly ', `${(alpha * 100).toFixed(0)}%`, '.')
            : el('span', {}, 'With α = ', el('strong', { text: `${(alpha * 100).toFixed(0)}%` }), ' and γ = ', el('strong', { text: gamma.toFixed(2) }),
                ', selfish mining earns ≈ ', `${(rev * 100).toFixed(0)}%`, ' — still ≤ its ', `${(alpha * 100).toFixed(0)}%`, ' share. Raise α past ',
                el('strong', { text: `${(thr * 100).toFixed(0)}%` }), ' (or raise γ) and it pulls ahead.')),
        el('p', { class: 'stub', style: 'margin:8px 0 0' },
          el('strong', { text: 'Why it matters: ' }),
          'the honest-majority theorem says a < 50% attacker cannot rewrite history — but it does not say honest mining is the most ',
          el('em', { text: 'profitable' }), ' strategy. Above α ≈ ', `${(selfishThreshold(0) * 100).toFixed(0)}%`,
          ' (γ = 0), or as low as 0% if the miner is perfectly connected (γ = 1), deviating pays — so “most miners are honest” is an economic assumption, not a guarantee. (GHash.IO briefly exceeded 50% in 2014.)'),
      );

      root.append(
        controls, rules, raceView, probPanel, selfishPanel,
        noteCallout('Safety vs liveness',
          ' A reversed payment is a ', el('strong', { text: 'safety' }), ' failure; a transaction that never gets in is a ',
          el('strong', { text: 'liveness' }), ' failure. Nakamoto consensus trades a hard guarantee for a probabilistic one that gets stronger with depth.'),
        ethCallout(
          ' Ethereum adds a BFT ', el('strong', { text: 'finality gadget' }), ' (Casper FFG): every ~13 minutes a checkpoint is finalised, and reverting it needs ≥ 1/3 of staked ETH slashed. ',
          'The cost: you cannot have both instant finality and liveness through a network partition (the availability–finality dilemma) — Ethereum runs an available chain with a finalised prefix nested inside it.'),
        ledgerBeforeAfter({
          before: 'Two valid blocks at height 6 exist at once; nodes briefly disagree. E’s conflicting transactions are both circulating.',
          after: 'Honest nodes converge on the heavier branch. Any transaction that lived only on the abandoned branch vanishes. E’s double-spend succeeds only by out-mining the honest majority for k blocks — probability e^(−Ω(k)).',
        }),
      );
    }

    render();
    const unsub = onChange(render);
    return () => { if (anim) clearInterval(anim); if (smTimer) clearInterval(smTimer); unsub(); };
  },
};

// Selfish-mining revenue curve: relative revenue vs α, honest 45° line, the
// region where selfish beats honest shaded, and the current operating point.
function selfishChart(alpha, gamma, revFn, threshold) {
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (t, a) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); return n; };
  const W = 560, H = 300, L = 46, R = 14, T = 14, B = 36;
  const px = (a) => L + (a / 0.5) * (W - L - R);
  const py = (v) => H - B - v * (H - T - B);

  const svg = mk('svg', { viewBox: `0 0 ${W} ${H}`, style: 'width:100%;height:auto;display:block' });

  // grid + ticks
  for (const a of [0, 0.1, 0.2, 0.3, 0.4, 0.5]) {
    svg.appendChild(mk('line', { x1: px(a), y1: T, x2: px(a), y2: H - B, style: 'stroke:var(--line);stroke-width:1;opacity:.5' }));
    const tx = mk('text', { x: px(a), y: H - B + 14, 'text-anchor': 'middle', style: 'fill:var(--ink-faint);font-size:9px' });
    tx.textContent = `${a * 100}%`; svg.appendChild(tx);
  }
  for (const v of [0, 0.25, 0.5, 0.75, 1]) {
    svg.appendChild(mk('line', { x1: L, y1: py(v), x2: W - R, y2: py(v), style: 'stroke:var(--line);stroke-width:1;opacity:.5' }));
    const tx = mk('text', { x: L - 6, y: py(v) + 3, 'text-anchor': 'end', style: 'fill:var(--ink-faint);font-size:9px' });
    tx.textContent = `${v * 100}%`; svg.appendChild(tx);
  }

  const sample = (fn) => {
    let d = '';
    for (let a = 0; a <= 0.5001; a += 0.005) { const aa = Math.min(a, 0.4999); d += `${d ? 'L' : 'M'}${px(aa).toFixed(1)} ${py(fn(aa)).toFixed(1)} `; }
    return d;
  };

  // shaded "selfish wins" region between the selfish curve and the 45° line
  let area = `M${px(threshold).toFixed(1)} ${py(threshold).toFixed(1)} `;
  for (let a = threshold; a <= 0.5001; a += 0.005) { const aa = Math.min(a, 0.4999); area += `L${px(aa).toFixed(1)} ${py(revFn(aa, gamma)).toFixed(1)} `; }
  for (let a = 0.5; a >= threshold; a -= 0.005) { const aa = Math.min(a, 0.4999); area += `L${px(aa).toFixed(1)} ${py(aa).toFixed(1)} `; }
  area += 'Z';
  svg.appendChild(mk('path', { d: area, style: 'fill:var(--who-evil);opacity:.12' }));

  // reference curves γ=0, γ=1
  svg.appendChild(mk('path', { d: sample((a) => revFn(a, 0)), style: 'fill:none;stroke:var(--who-evil);stroke-width:1;opacity:.3;stroke-dasharray:2 3' }));
  svg.appendChild(mk('path', { d: sample((a) => revFn(a, 1)), style: 'fill:none;stroke:var(--who-evil);stroke-width:1;opacity:.3;stroke-dasharray:2 3' }));
  // honest 45° line
  svg.appendChild(mk('line', { x1: px(0), y1: py(0), x2: px(0.5), y2: py(0.5), style: 'stroke:var(--who-node);stroke-width:1.5;stroke-dasharray:5 4' }));
  // selfish curve, current γ
  svg.appendChild(mk('path', { d: sample((a) => revFn(a, gamma)), style: 'fill:none;stroke:var(--who-evil);stroke-width:2.5' }));

  // threshold marker
  svg.appendChild(mk('line', { x1: px(threshold), y1: T, x2: px(threshold), y2: H - B, style: 'stroke:var(--warn);stroke-width:1.5;stroke-dasharray:3 3' }));
  const thl = mk('text', { x: px(threshold) + 4, y: T + 10, style: 'fill:var(--warn);font-size:9px;font-weight:700' });
  thl.textContent = `profitable above α ≈ ${(threshold * 100).toFixed(0)}%`;
  svg.appendChild(thl);

  // operating point
  svg.appendChild(mk('line', { x1: px(alpha), y1: py(alpha), x2: px(alpha), y2: py(revFn(alpha, gamma)), style: 'stroke:var(--ink);stroke-width:1;opacity:.6' }));
  svg.appendChild(mk('circle', { cx: px(alpha), cy: py(alpha), r: 3.5, style: 'fill:var(--who-node)' }));
  svg.appendChild(mk('circle', { cx: px(alpha), cy: py(revFn(alpha, gamma)), r: 4, style: 'fill:var(--who-evil)' }));

  // axis labels + legend
  const xl = mk('text', { x: (L + W - R) / 2, y: H - 2, 'text-anchor': 'middle', style: 'fill:var(--ink-faint);font-size:10px' });
  xl.textContent = 'selfish miner’s hash-power share  α'; svg.appendChild(xl);
  const yl = mk('text', { x: 12, y: H / 2, 'text-anchor': 'middle', transform: `rotate(-90 12 ${H / 2})`, style: 'fill:var(--ink-faint);font-size:10px' });
  yl.textContent = 'share of on-chain blocks earned'; svg.appendChild(yl);
  const lg1 = mk('text', { x: W - R, y: py(0.5) - 4, 'text-anchor': 'end', style: 'fill:var(--who-node);font-size:9px' });
  lg1.textContent = 'honest (= α)'; svg.appendChild(lg1);
  const lg2 = mk('text', { x: px(0.42), y: py(revFn(0.42, gamma)) - 5, 'text-anchor': 'middle', style: 'fill:var(--who-evil);font-size:9px;font-weight:700' });
  lg2.textContent = `selfish (γ=${gamma.toFixed(1)})`; svg.appendChild(lg2);

  return svg;
}

function chainRow(label, n, color, shipped, k) {
  const blocks = el('div', { style: 'display:flex;gap:3px;flex-wrap:wrap;align-items:center;min-height:24px' });
  for (let i = 1; i <= n; i++) {
    const isShip = shipped && k && i === k;
    blocks.append(el('span', {
      style: `display:inline-grid;place-items:center;width:22px;height:22px;border-radius:4px;font-size:10px;color:#fff;background:${color};${isShip ? 'outline:2px solid var(--ink);outline-offset:1px' : ''}`,
      title: isShip ? 'Bob ships here' : '',
    }, String(i)));
  }
  return el('div', { style: 'margin:6px 0' },
    el('div', { style: 'font-size:11px;color:var(--ink-faint);margin-bottom:3px' }, `${label}  —  ${n} block${n === 1 ? '' : 's'} past the fork`),
    blocks);
}
