import { el, clear } from './ui.js';

const LEC_COLOR = { 1: '#5f83ab', 2: '#4c9866', 3: '#b0763c', 4: '#7d70bd' };
const LEC_NAME = { 1: 'L1 · primitives', 2: 'L2 · Bitcoin', 3: 'L3 · consensus', 4: 'L4 · Ethereum' };
const SVGNS = 'http://www.w3.org/2000/svg';

let DATA = null;

export function mountConceptMap(container) {
  clear(container);

  const state = {
    threads: new Set(),
    lecs: new Set([1, 2, 3, 4]),
    hover: null,
    sel: null,
  };

  const wrap = el('div');
  container.append(
    el('h2', {}, 'Concept map'),
    el('p', { class: 'step-lede' },
      'How the ideas in Lectures 1–4 build on one another — cryptographic primitives at the base, Bitcoin and consensus above them, Ethereum on top. ',
      'Hover a node to see its links; click for a definition and a jump into the walkthrough.'),
    wrap,
  );

  let onResize = null;

  if (!DATA) {
    fetch(new URL('../data/concepts.json', import.meta.url))
      .then(r => r.json())
      .then(d => { DATA = d; boot(); })
      .catch(err => { wrap.append(el('p', { class: 'stub' }, 'Could not load concepts.json — ', String(err))); });
  } else {
    boot();
  }

  function boot() {
    // deep-link: #/map?focus=<id>
    const m = window.location.hash.match(/focus=([\w-]+)/);
    if (m && DATA.nodes.some(n => n.id === m[1])) state.sel = m[1];
    render();
    onResize = () => render();
    window.addEventListener('resize', onResize);
  }

  function render() {
    clear(wrap);
    const byId = Object.fromEntries(DATA.nodes.map(n => [n.id, n]));

    // ---- controls ----
    const threadRow = el('div', { class: 'controls' },
      el('span', { style: 'font-size:12px;color:var(--ink-faint)' }, 'threads:'),
      ...Object.entries(DATA.threads).map(([id, label]) => el('button', {
        class: 'btn btn--sm' + (state.threads.has(id) ? ' btn--primary' : ''),
        onclick: () => { state.threads.has(id) ? state.threads.delete(id) : state.threads.add(id); render(); },
      }, label)));
    const lecRow = el('div', { class: 'controls' },
      el('span', { style: 'font-size:12px;color:var(--ink-faint)' }, 'lectures:'),
      ...[1, 2, 3, 4].map(l => el('button', {
        class: 'btn btn--sm' + (state.lecs.has(l) ? ' btn--primary' : ''),
        style: `border-color:${LEC_COLOR[l]}`,
        onclick: () => { state.lecs.has(l) ? state.lecs.delete(l) : state.lecs.add(l); render(); },
      }, LEC_NAME[l])));

    // ---- geometry ----
    const cw = Math.max(wrap.clientWidth || container.clientWidth || 900, 760);
    const pxW = Math.max(cw, 900);
    const pxH = pxW * (DATA.space.h / DATA.space.w);
    const sx = pxW / DATA.space.w, sy = pxH / DATA.space.h;

    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${pxW} ${pxH}`);
    svg.setAttribute('width', String(pxW));
    svg.setAttribute('height', String(pxH));
    svg.style.maxWidth = 'none';

    const inThreads = (n) => state.threads.size === 0 || (n.threads || []).some(t => state.threads.has(t));
    const nodeVisible = (n) => state.lecs.has(n.lec);
    const nodeActive = (n) => nodeVisible(n) && inThreads(n);

    const neighbours = new Set();
    if (state.hover) {
      for (const [a, b] of DATA.edges) {
        if (a === state.hover) neighbours.add(b);
        if (b === state.hover) neighbours.add(a);
      }
    }

    function nodeOpacity(n) {
      if (!nodeVisible(n)) return 0.06;
      if (!inThreads(n)) return 0.12;
      if (state.hover && n.id !== state.hover && !neighbours.has(n.id)) return 0.25;
      return 1;
    }

    // ---- edges ----
    for (const [a, b] of DATA.edges) {
      const na = byId[a], nb = byId[b];
      if (!na || !nb) continue;
      const line = document.createElementNS(SVGNS, 'line');
      line.setAttribute('x1', na.x * sx); line.setAttribute('y1', na.y * sy);
      line.setAttribute('x2', nb.x * sx); line.setAttribute('y2', nb.y * sy);
      const hot = state.hover && (a === state.hover || b === state.hover);
      const dim = (state.threads.size && !(inThreads(na) && inThreads(nb)))
        || !(nodeVisible(na) && nodeVisible(nb))
        || (state.hover && !hot);
      line.setAttribute('style',
        `stroke:${hot ? 'var(--accent)' : 'var(--line-strong)'};stroke-width:${hot ? 2 : 1};opacity:${dim ? 0.08 : (hot ? 0.9 : 0.35)}`);
      svg.appendChild(line);
    }

    // ---- nodes ----
    for (const n of DATA.nodes) {
      const g = document.createElementNS(SVGNS, 'g');
      g.setAttribute('transform', `translate(${n.x * sx}, ${n.y * sy})`);
      g.setAttribute('opacity', String(nodeOpacity(n)));
      g.style.cursor = 'pointer';

      const w = 138, h = 34;
      const rect = document.createElementNS(SVGNS, 'rect');
      rect.setAttribute('x', -w / 2); rect.setAttribute('y', -h / 2);
      rect.setAttribute('width', w); rect.setAttribute('height', h);
      rect.setAttribute('rx', 7);
      rect.setAttribute('style',
        `fill:var(--bg-raised);stroke:${n.id === state.sel ? 'var(--accent)' : LEC_COLOR[n.lec]};stroke-width:${n.id === state.sel ? 2.5 : 1.5}`);
      g.appendChild(rect);

      const bar = document.createElementNS(SVGNS, 'rect');
      bar.setAttribute('x', -w / 2); bar.setAttribute('y', -h / 2);
      bar.setAttribute('width', 5); bar.setAttribute('height', h);
      bar.setAttribute('rx', 2);
      bar.setAttribute('style', `fill:${LEC_COLOR[n.lec]}`);
      g.appendChild(bar);

      const label = n.label.length > 22 ? n.label.slice(0, 21) + '…' : n.label;
      const text = document.createElementNS(SVGNS, 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', n.step ? '-1' : '4');
      text.setAttribute('style', 'fill:var(--ink);font-size:10.5px');
      text.textContent = label;
      g.appendChild(text);

      if (n.step) {
        const sub = document.createElementNS(SVGNS, 'text');
        sub.setAttribute('text-anchor', 'middle');
        sub.setAttribute('dy', '11');
        sub.setAttribute('style', 'fill:var(--accent);font-size:8px');
        sub.textContent = `▶ Step ${n.step}`;
        g.appendChild(sub);
      }

      g.addEventListener('mouseenter', () => { state.hover = n.id; render(); });
      g.addEventListener('mouseleave', () => { if (state.hover === n.id) { state.hover = null; render(); } });
      g.addEventListener('click', () => { state.sel = n.id; render(); });
      svg.appendChild(g);
    }

    const scroller = el('div', { style: 'overflow:auto;border:1px solid var(--line);border-radius:var(--radius-sm);background:var(--bg-sunken)' });
    scroller.appendChild(svg);

    // ---- side panel ----
    const panel = el('div', { class: 'panel', style: 'margin-top:12px' });
    const sel = state.sel && byId[state.sel];
    if (sel) {
      panel.append(
        el('div', { style: 'display:flex;align-items:center;gap:8px;flex-wrap:wrap' },
          el('span', { class: 'chip', style: `border-color:${LEC_COLOR[sel.lec]};color:${LEC_COLOR[sel.lec]}` }, LEC_NAME[sel.lec]),
          el('h3', { style: 'margin:0;font-size:17px' }, sel.label)),
        el('p', { style: 'margin:8px 0;color:var(--ink-soft);font-size:14px' }, sel.blurb),
        el('div', { class: 'controls' },
          sel.step ? el('a', { class: 'btn btn--sm btn--primary', href: `#/spine/${sel.step}` }, `Open the demo — Step ${sel.step} →`) : null,
          el('a', { class: 'btn btn--sm', href: `./notes/lecture${sel.lec}-notes.pdf`, target: '_blank', rel: 'noopener' }, `Lecture ${sel.lec} notes (PDF)`),
          el('button', { class: 'btn btn--sm btn--ghost', onclick: () => { state.sel = null; render(); } }, 'Close')),
        el('div', { style: 'margin-top:8px;font-size:12px;color:var(--ink-faint)' },
          'builds on: ',
          DATA.edges.filter(([a, b]) => b === sel.id).map(([a]) => byId[a]?.label).filter(Boolean).join(', ') || '— (a root)',
          ' · feeds: ',
          DATA.edges.filter(([a, b]) => a === sel.id).map(([, b]) => byId[b]?.label).filter(Boolean).join(', ') || '—'),
      );
    } else {
      panel.append(el('p', { class: 'stub', style: 'margin:0' }, 'Click a node for its definition, the concepts it builds on, and a jump into the walkthrough.'));
    }

    wrap.append(threadRow, lecRow, scroller, panel);
  }

  return () => { if (onResize) window.removeEventListener('resize', onResize); };
}
