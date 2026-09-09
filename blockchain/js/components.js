// Shared step components: the cast bar and the before/after on-chain status panel.
import { el, clear } from './ui.js';
import { ACTORS, ACTOR_ORDER } from './actors.js';

// castBar(activeIds, { caption }) -> element
// activeIds: array of ACTOR keys that are "acting now" in this step.
export function castBar(activeIds = [], opts = {}) {
  const active = new Set(activeIds);
  const bar = el('div', { class: 'castbar' });
  if (opts.caption) bar.append(el('div', { class: 'castbar__caption' }, opts.caption));

  const detail = el('div', { class: 'castbar__detail' });
  detail.hidden = true;
  let openId = null;

  for (const id of ACTOR_ORDER) {
    const a = ACTORS[id];
    const chip = el('button', {
      class: 'who' + (active.has(id) ? ' is-active' : ''),
      style: `--who:${a.color}`,
      type: 'button',
      onclick: () => {
        if (openId === id) { detail.hidden = true; openId = null; return; }
        openId = id;
        clear(detail);
        detail.style.setProperty('--who', a.color);
        detail.append(
          el('h4', {}, `${a.name} — ${a.role}`),
          el('p', {}, el('span', { class: 'lbl' }, 'Can: '), a.can),
          el('p', {}, el('span', { class: 'lbl' }, 'Sees: '), a.sees),
        );
        detail.hidden = false;
      },
    },
      el('span', { class: 'who__badge' }, a.badge),
      el('span', {}, a.name),
      el('span', { class: 'who__role' }, a.role.split(' — ')[0]),
    );
    bar.append(chip);
  }
  bar.append(detail);
  return bar;
}

// ledgerBeforeAfter({ title, before, after, note })
// `before` / `after` are arrays of [key, value] pairs OR a string of prose.
export function ledgerBeforeAfter({ title = 'On-chain status', before, after, note } = {}) {
  const wrap = el('div', { class: 'ba' });
  wrap.append(el('div', { class: 'ba__head' }, title));
  const cols = el('div', { class: 'ba__cols' });
  cols.append(
    column('before', 'Before this step', before),
    column('after', 'After this step', after),
  );
  wrap.append(cols);
  if (note) wrap.append(el('p', { class: 'ba__note', style: 'padding:0 12px 12px' }, note));
  return wrap;

  function column(mod, heading, content) {
    const c = el('div', { class: `ba__col ba__col--${mod}` }, el('h5', {}, heading));
    if (typeof content === 'string') {
      c.append(el('p', { class: 'ba__note', style: 'margin:0' }, content));
    } else if (Array.isArray(content)) {
      for (const [k, v] of content) {
        c.append(el('div', { class: 'ba__row' },
          el('span', { class: 'k' }, k),
          el('span', { class: 'v' }, v)));
      }
    }
    return c;
  }
}
