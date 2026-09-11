import { el, clear } from './ui.js';
import { resetScenario } from './state.js';

import step01 from './steps/01-hash.js';
import step02 from './steps/02-keys.js';
import step03 from './steps/03-utxo-tx.js';
import step04 from './steps/04-script.js';
import step05 from './steps/05-sign.js';
import step06 from './steps/06-merkle.js';
import step07 from './steps/07-block.js';
import step08 from './steps/08-mine.js';
import step09 from './steps/09-chain-tamper.js';
import step10 from './steps/10-consensus.js';
import step11 from './steps/11-ethereum.js';

const STEPS = [step01, step02, step03, step04, step05, step06, step07, step08, step09, step10, step11];

const dom = {
  rail: document.getElementById('steprail'),
  stepContainer: document.getElementById('step-container'),
  prev: document.getElementById('prev-step'),
  next: document.getElementById('next-step'),
  progress: document.getElementById('step-progress'),
  viewtabs: [...document.querySelectorAll('.viewtab')],
  reset: document.getElementById('reset-scenario'),
  theme: document.getElementById('theme-toggle'),
};

let cleanup = null;
let firstRender = true;

// ---------- theme ----------
function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') document.documentElement.setAttribute('data-theme', saved);
  dom.theme.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const isDark = cur === 'dark' || (!cur && matchMedia('(prefers-color-scheme: dark)').matches);
    const nextTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  });
}

// ---------- routing ----------
function parseHash() {
  const m = location.hash.match(/^#\/(spine)\/(\d+)/);
  if (m) return { step: clampStep(parseInt(m[2], 10)) };
  return { step: 1 };
}
function clampStep(n) { return Math.min(STEPS.length, Math.max(1, n || 1)); }
function go(step) {
  location.hash = `#/spine/${clampStep(step)}`;
}

function runCleanup() {
  if (typeof cleanup === 'function') { try { cleanup(); } catch (e) { console.error(e); } }
  cleanup = null;
}

function render() {
  const { step } = parseHash();

  dom.viewtabs.forEach(a => a.classList.toggle('is-active', a.dataset.view === 'spine'));

  runCleanup();

  renderRail(step);
  const mod = STEPS[step - 1];
  clear(dom.stepContainer);
  if (!firstRender) dom.stepContainer.scrollIntoView({ block: 'nearest' });
  firstRender = false;
  cleanup = mod.mount(dom.stepContainer) || null;

  dom.progress.textContent = `Step ${step} of ${STEPS.length}`;
  dom.prev.disabled = step === 1;
  dom.next.disabled = step === STEPS.length;
}

function renderRail(active) {
  clear(dom.rail);
  STEPS.forEach((mod, i) => {
    const n = i + 1;
    dom.rail.append(el('li', {
      class: 'steprail__item' + (n === active ? ' is-active' : ''),
      role: 'button',
      tabindex: '0',
      onclick: () => go(n),
      onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(n); } },
    },
      el('span', { class: 'steprail__num' }, String(n)),
      el('span', {}, mod.title),
      el('span', { class: 'steprail__lec' }, mod.lecture),
    ));
  });
}

// ---------- wire up ----------
initTheme();
resetScenario();

dom.prev.addEventListener('click', () => { const { step } = parseHash(); go(step - 1); });
dom.next.addEventListener('click', () => { const { step } = parseHash(); go(step + 1); });
dom.reset.addEventListener('click', () => { resetScenario(); render(); });
window.addEventListener('hashchange', render);

if (!location.hash) location.hash = '#/spine/1';
render();
