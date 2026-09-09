// Tiny DOM helpers — no framework.

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (v === true) node.setAttribute(k, '');
    else node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

export function clear(node) {
  while (node && node.firstChild) node.removeChild(node.firstChild);
}

export function stepHead(num, lecture, title) {
  return el('div', { class: 'step-head' },
    el('span', { class: 'step-kicker' }, `Step ${num} · ${lecture}`),
    el('h2', {}, title));
}

// Render bytes as small chips. If `compareTo` is given, chips that differ from it
// are highlighted (used for the avalanche demo).
export function byteChips(bytes, compareTo) {
  const wrap = el('div', { class: 'bytes' });
  for (let i = 0; i < bytes.length; i++) {
    let cls = 'byte';
    if (compareTo) cls += compareTo[i] === bytes[i] ? ' is-same' : ' is-diff';
    wrap.append(el('span', { class: cls }, bytes[i].toString(16).padStart(2, '0')));
  }
  return wrap;
}

export function bitDiffCount(a, b) {
  let bits = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    let x = a[i] ^ b[i];
    while (x) { bits += x & 1; x >>= 1; }
  }
  return bits;
}

export function ethCallout(...children) {
  return el('div', { class: 'callout callout--eth' },
    el('span', { class: 'callout__tag' }, '⟠ Ethereum differs'),
    ...children);
}

export function noteCallout(label, ...children) {
  return el('div', { class: 'callout callout--note' },
    el('span', { class: 'callout__tag' }, label),
    ...children);
}
