/* ===== App "Paciência" (Klondike, visual da Paciência do Windows Vista) ===== */

/* ícone: duas cartas em leque (verso azul atrás, ás de espadas na frente); sem gradientes com id */
const VD_ICON_CARDS = '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
  '<g transform="rotate(-14 18 26)"><rect x="6" y="8" width="24" height="34" rx="3" fill="#fff" stroke="#3a4a5c"/><rect x="8.5" y="10.5" width="19" height="29" rx="1.6" fill="#1f63c6"/>' +
  '<path d="M8.5 16l19 19M8.5 26l13 13.5M14 10.5l13.5 14M21 10.5l6.5 6.8" stroke="#6fb2ff" stroke-width="1.2" opacity=".55"/></g>' +
  '<g transform="rotate(9 30 26)"><rect x="17" y="7" width="25" height="35" rx="3" fill="#fff" stroke="#3a4a5c"/>' +
  '<text x="20" y="15.5" font-family="Times New Roman,Times,serif" font-size="8" font-weight="700" fill="#111">A</text>' +
  '<path d="M29.5 16c2 3 6.8 5.6 6.8 9.4 0 2.4-1.9 3.8-3.8 3.8-1.2 0-2.1-.5-2.6-1.2.2 1.6.8 2.6 1.9 3.3h-4.6c1.1-.7 1.7-1.7 1.9-3.3-.5.7-1.4 1.2-2.6 1.2-1.9 0-3.8-1.4-3.8-3.8 0-3.8 4.8-6.4 6.8-9.4z" fill="#111"/></g></svg>';

const VD_SOL_SUITS = ['sp', 'he', 'di', 'cl'];
const VD_SOL_RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const VD_SOL_DEFS = '<svg class="sol-defs" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute"><defs>' +
  '<symbol id="sol-he" viewBox="0 0 100 100"><path d="M50 92C20 66 4 49 4 30 4 15 15 5 28 5c10 0 18 6 22 15 4-9 12-15 22-15 13 0 24 10 24 25 0 19-16 36-46 62z"/></symbol>' +
  '<symbol id="sol-di" viewBox="0 0 100 100"><path d="M50 3l38 47-38 47-38-47z"/></symbol>' +
  '<symbol id="sol-sp" viewBox="0 0 100 100"><path d="M50 3c13 19 46 36 46 59 0 14-11 22-23 22-9 0-16-4-20-10 1 10 5 18 13 23H34c8-5 12-13 13-23-4 6-11 10-20 10C15 84 4 76 4 62 4 39 37 22 50 3z"/></symbol>' +
  '<symbol id="sol-cl" viewBox="0 0 100 100"><circle cx="50" cy="27" r="21"/><circle cx="26" cy="58" r="21"/><circle cx="74" cy="58" r="21"/><path d="M44 50h12v8H44z"/><path d="M46 60c0 17-4 27-12 34h32c-8-7-12-17-12-34z"/></symbol>' +
  '<linearGradient id="sol-court" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#f4ead2"/></linearGradient>' +
  '</defs></svg>';

function vdSolPipLayout(r) {
  const L = 28, M = 50, R = 72, T = 24, B = 116, C = 70, Q1 = 55.3, Q3 = 84.7;
  const lay = {
    2: [[M, T], [M, B]], 3: [[M, T], [M, C], [M, B]],
    4: [[L, T], [R, T], [L, B], [R, B]], 5: [[L, T], [R, T], [M, C], [L, B], [R, B]],
    6: [[L, T], [R, T], [L, C], [R, C], [L, B], [R, B]],
    7: [[L, T], [R, T], [M, 47], [L, C], [R, C], [L, B], [R, B]],
    8: [[L, T], [R, T], [M, 47], [L, C], [R, C], [M, 93], [L, B], [R, B]],
    9: [[L, T], [L, Q1], [L, Q3], [L, B], [R, T], [R, Q1], [R, Q3], [R, B], [M, C]],
    10: [[L, T], [L, Q1], [L, Q3], [L, B], [R, T], [R, Q1], [R, Q3], [R, B], [M, 39.7], [M, 100.3]]
  };
  return lay[r] || [];
}

function vdSolCourt(r, s, color) {
  const robe = color === 'red' ? '#c41e2f' : '#23468f';
  const alt = color === 'red' ? '#23468f' : '#c41e2f';
  const gold = '#e2b324';
  let hat;
  if (r === 13) hat = '<path d="M37 33l2-11 6 6 5-9 5 9 6-6 2 11z" fill="' + gold + '" stroke="#7d5c05" stroke-width=".8"/><circle cx="50" cy="20" r="1.6" fill="' + alt + '"/>';
  else if (r === 12) hat = '<path d="M39 33q11-13 22 0z" fill="' + gold + '" stroke="#7d5c05" stroke-width=".8"/><circle cx="50" cy="26" r="2" fill="' + alt + '"/><path d="M40 34q-3 9 1 16M60 34q3 9-1 16" stroke="#6b3d14" stroke-width="3" fill="none"/>';
  else hat = '<path d="M38 34q10-14 24-4l-1 4z" fill="' + alt + '" stroke="#1a1a1a" stroke-width=".7"/><path d="M60 29q8-9 13-6-6 2-10 9z" fill="' + gold + '" stroke="#7d5c05" stroke-width=".6"/>';
  const beard = r === 13 ? '<path d="M44 44q6 9 12 0q-2 6-6 6t-6-6z" fill="#7a4a1c"/>' : '';
  // objeto na mão: cetro (Rei), flor (Dama), alabarda (Valete)
  let held;
  if (r === 13) held = '<path d="M66 48l-6 22" stroke="' + gold + '" stroke-width="2.2" stroke-linecap="round"/><circle cx="66.4" cy="46.6" r="3" fill="' + gold + '" stroke="#7d5c05" stroke-width=".7"/>';
  else if (r === 12) held = '<path d="M33 70l3-14" stroke="#2f7a24" stroke-width="1.6"/><circle cx="36.4" cy="54" r="3.4" fill="' + alt + '"/><circle cx="36.4" cy="54" r="1.3" fill="' + gold + '"/>';
  else held = '<path d="M67 36l-5 34" stroke="#6b4a2c" stroke-width="1.8"/><path d="M67.6 31l2.6 6-4.8.6z" fill="#b8c2cc" stroke="#55606b" stroke-width=".6"/>';
  const half = '<g>' +
    '<path d="M25 70l2-11q3-6 12-7.5h22q9 1.5 12 7.5l2 11z" fill="' + robe + '" stroke="#1a1a1a" stroke-width=".8"/>' +
    '<path d="M46.5 51.5h7v18.5h-7z" fill="' + gold + '" stroke="#7d5c05" stroke-width=".5"/>' +
    '<path d="M27.5 63.5q5-2 9 0M63.5 63.5q4.5-2 9 0" stroke="' + alt + '" stroke-width="2" fill="none" opacity=".85"/>' +
    '<circle cx="50" cy="56" r="1" fill="' + alt + '"/><circle cx="50" cy="61" r="1" fill="' + alt + '"/><circle cx="50" cy="66" r="1" fill="' + alt + '"/>' +
    '<path d="M41 51.5q9 6 18 0" fill="#fff" stroke="#1a1a1a" stroke-width=".6"/>' +
    hat + '<circle cx="50" cy="42" r="7.5" fill="#f5d3b3" stroke="#6b4a2c" stroke-width=".8"/>' +
    '<circle cx="47.3" cy="41" r=".9" fill="#222"/><circle cx="52.7" cy="41" r=".9" fill="#222"/>' +
    '<path d="M48 45.2q2 1.2 4 0" stroke="#a2443a" stroke-width=".8" fill="none"/>' + beard + held + '</g>';
  return '<rect x="18" y="18" width="64" height="104" rx="2.5" fill="url(#sol-court)" stroke="' + robe + '" stroke-width="1.4"/>' +
    '<clipPath id="sol-cc-' + r + '-' + s + '"><rect x="18.7" y="18.7" width="62.6" height="102.6"/></clipPath>' +
    '<g clip-path="url(#sol-cc-' + r + '-' + s + ')">' + half + '<g transform="rotate(180 50 70)">' + half + '</g></g>' +
    '<path d="M18.7 70h62.6" stroke="#1a1a1a" stroke-width=".6" opacity=".5"/>' +
    '<use href="#sol-' + VD_SOL_SUITS[s] + '" x="22" y="22" width="11" height="11"/>' +
    '<use href="#sol-' + VD_SOL_SUITS[s] + '" x="67" y="107" width="11" height="11" transform="rotate(180 72.5 112.5)"/>';
}

function vdSolFace(s, r) {
  const color = (s === 1 || s === 2) ? 'red' : 'black';
  const fill = color === 'red' ? '#d0161f' : '#141414';
  const suit = VD_SOL_SUITS[s];
  const rank = VD_SOL_RANKS[r - 1];
  const corner = '<text x="' + (rank === '10' ? 5 : 8) + '" y="19" font-size="16" font-weight="700" font-family="\'Times New Roman\',Times,serif" letter-spacing="' + (rank === '10' ? '-1' : '0') + '">' + rank + '</text>' +
    '<use href="#sol-' + suit + '" x="6" y="23" width="12" height="12"/>';
  let mid = '';
  if (r === 1) {
    const big = s === 0 ? 50 : 38;
    mid = '<use href="#sol-' + suit + '" x="' + (50 - big / 2) + '" y="' + (70 - big / 2) + '" width="' + big + '" height="' + big + '"/>';
  } else if (r > 10) {
    mid = vdSolCourt(r, s, color);
  } else {
    vdSolPipLayout(r).forEach(([x, y]) => {
      const flip = y > 70.5 ? ' transform="rotate(180 ' + x + ' ' + y + ')"' : '';
      mid += '<use href="#sol-' + suit + '" x="' + (x - 9) + '" y="' + (y - 9) + '" width="18" height="18"' + flip + '/>';
    });
  }
  return '<svg viewBox="0 0 100 140" aria-hidden="true" focusable="false" fill="' + fill + '">' + corner +
    '<g transform="rotate(180 50 70)">' + corner + '</g>' + mid + '</svg>';
}

const VD_PACIENCIA_APP = {
  id: 'paciencia',
  title: 'Paciência',
  icon: VD_ICON_CARDS,
  size: { w: 820, h: 600, minW: 560, minH: 430 },
  resizable: true,
  render(body, win) {
    const root = document.createElement('div');
    root.className = 'sol';
    const g = { draw: 1, piles: null, score: 0, time: 0, running: false, over: false, history: [] };
    const menu = vdMenuBar([
      { label: 'Jogo', items: [
        { label: 'Novo jogo', shortcut: 'F2', action: () => newGame() },
        { label: 'Desfazer', shortcut: 'Ctrl+Z', action: () => undo(), disabled: () => !g.history.length || g.over },
        'sep',
        { label: 'Virar 1 carta', checked: () => g.draw === 1, action: () => { g.draw = 1; newGame(); } },
        { label: 'Virar 3 cartas', checked: () => g.draw === 3, action: () => { g.draw = 3; newGame(); } },
        'sep',
        { label: 'Sair', action: () => win.close() }
      ] },
      { label: 'Ajuda', items: [{ label: 'Como jogar', action: () => help() }] }
    ]);
    root.appendChild(menu);
    const table = document.createElement('div');
    table.className = 'sol-table';
    table.innerHTML = VD_SOL_DEFS;
    root.appendChild(table);
    const status = document.createElement('div');
    status.className = 'sol-status';
    status.innerHTML = '<span>Pontuação: <b class="sol-score">0</b></span><span>Tempo: <b class="sol-time">0:00</b></span>';
    root.appendChild(status);
    body.appendChild(root);
    const scoreEl = status.querySelector('.sol-score');
    const timeEl = status.querySelector('.sol-time');

    // espaços vazios (estoque, descarte, 4 fundações, 7 colunas)
    const slots = {};
    const mkSlot = (name, cls) => {
      const d = document.createElement('div');
      d.className = 'sol-slot ' + cls;
      table.appendChild(d);
      slots[name] = d;
    };
    mkSlot('stock', 'stock');
    mkSlot('waste', 'waste');
    for (let i = 0; i < 4; i++) mkSlot('f' + i, 'found');
    for (let i = 0; i < 7; i++) mkSlot('t' + i, 'tab');
    slots.stock.innerHTML = '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="11" fill="none" stroke="#7fe08a" stroke-width="4"/></svg>';

    // as 52 cartas (criadas uma vez)
    const cards = [];
    for (let s = 0; s < 4; s++) for (let r = 1; r <= 13; r++) {
      const el = document.createElement('div');
      el.className = 'sol-card';
      el.innerHTML = '<div class="sol-face">' + vdSolFace(s, r) + '</div><div class="sol-back"></div>';
      const c = { id: s * 13 + r - 1, s, r, red: s === 1 || s === 2, up: false, el };
      el._card = c;
      cards.push(c);
      table.appendChild(el);
    }

    const allPiles = () => ['stock', 'waste', 'f0', 'f1', 'f2', 'f3', 't0', 't1', 't2', 't3', 't4', 't5', 't6'];
    const where = (c) => { for (const p of allPiles()) { const i = g.piles[p].indexOf(c); if (i >= 0) return { p, i }; } return null; };
    const top = (p) => g.piles[p][g.piles[p].length - 1];

    function newGame() {
      if (dlg) { dlg.close(); dlg = null; }
      stopCelebration();
      const deck = cards.slice();
      for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = deck[i]; deck[i] = deck[j]; deck[j] = t; }
      g.piles = {};
      allPiles().forEach((p) => { g.piles[p] = []; });
      deck.forEach((c) => { c.up = false; });
      for (let col = 0; col < 7; col++) {
        for (let k = 0; k <= col; k++) g.piles['t' + col].push(deck.pop());
        top('t' + col).up = true;
      }
      g.piles.stock = deck;
      g.score = 0; g.time = 0; g.running = false; g.over = false; g.history = [];
      paintStatus();
      layout(true);
    }

    // ---- layout ----
    const geo = {};
    function layout(instant) {
      const W = table.clientWidth, H = table.clientHeight;
      if (!W || !H) return;
      const pad = Math.max(10, Math.round(W * 0.022));
      const gap = Math.max(8, Math.round(W * 0.02));
      const cw = Math.round(Math.max(44, Math.min((W - 2 * pad - 6 * gap) / 7, (H - pad) * 0.2, 118)));
      const ch = Math.round(cw * 1.4);
      Object.assign(geo, { W, H, pad, gap, cw, ch, y1: pad + ch + Math.round(gap * 1.4) });
      table.style.setProperty('--cw', cw + 'px');
      table.style.setProperty('--ch', ch + 'px');
      if (instant) table.classList.add('sol-instant');
      const colX = (i) => pad + i * (cw + gap);
      const put = (el, x, y, z) => { el.style.left = x + 'px'; el.style.top = y + 'px'; if (z !== undefined) el.style.zIndex = String(z); };
      put(slots.stock, colX(0), pad); put(slots.waste, colX(1), pad);
      for (let i = 0; i < 4; i++) put(slots['f' + i], colX(3 + i), pad);
      for (let i = 0; i < 7; i++) put(slots['t' + i], colX(i), geo.y1);
      let z = 1;
      g.piles.stock.forEach((c) => { c.up = false; paintCard(c); put(c.el, colX(0), pad, z++); });
      const w = g.piles.waste;
      const fanFrom = g.draw === 3 ? Math.max(0, w.length - 3) : w.length;
      w.forEach((c, i) => { paintCard(c); put(c.el, colX(1) + (i >= fanFrom ? (i - fanFrom) * Math.round(cw * 0.2) : 0), pad, z++); });
      for (let f = 0; f < 4; f++) g.piles['f' + f].forEach((c) => { paintCard(c); put(c.el, colX(3 + f), pad, z++); });
      const avail = H - geo.y1 - pad;
      for (let t = 0; t < 7; t++) {
        const col = g.piles['t' + t];
        let down = Math.round(ch * 0.1), up = Math.round(ch * 0.24);
        const need = col.reduce((a, c, i) => a + (i < col.length - 1 ? (c.up ? up : down) : 0), 0);
        if (need > 0 && need + ch > avail) { const k = Math.max(0.2, (avail - ch) / need); down *= k; up *= k; }
        let y = geo.y1;
        col.forEach((c) => { paintCard(c); put(c.el, colX(t), Math.round(y), z++); y += c.up ? up : down; });
      }
      geo.colX = colX;
      if (instant) { void table.offsetWidth; table.classList.remove('sol-instant'); }
    }

    function paintCard(c) {
      c.el.classList.toggle('up', c.up);
      c.el.setAttribute('aria-label', c.up ? VD_SOL_RANKS[c.r - 1] + ' de ' + ['espadas', 'copas', 'ouros', 'paus'][c.s] : 'Carta virada');
    }

    function paintStatus() {
      scoreEl.textContent = String(g.score);
      timeEl.textContent = Math.floor(g.time / 60) + ':' + String(g.time % 60).padStart(2, '0');
    }

    // ---- regras e jogadas ----
    function snapshot() {
      const p = {};
      allPiles().forEach((k) => { p[k] = g.piles[k].map((c) => [c.id, c.up]); });
      g.history.push({ p, score: g.score });
      if (g.history.length > 200) g.history.shift();
    }
    function undo() {
      if (!g.history.length || g.over) return;
      const h = g.history.pop();
      allPiles().forEach((k) => { g.piles[k] = h.p[k].map(([id, up]) => { const c = cards[id]; c.up = up; return c; }); });
      g.score = h.score;
      paintStatus();
      layout();
    }
    const addScore = (n) => { g.score = Math.max(0, g.score + n); paintStatus(); };
    const start = () => { g.running = true; };

    function canFound(c, f) {
      const t = top(f);
      return t ? (t.s === c.s && c.r === t.r + 1) : c.r === 1;
    }
    function canTab(c, t) {
      const x = top(t);
      return x ? (x.up && x.red !== c.red && c.r === x.r - 1) : c.r === 13;
    }

    function move(from, idx, to) {
      snapshot();
      start();
      const moving = g.piles[from].splice(idx);
      g.piles[to].push.apply(g.piles[to], moving);
      const fromT = from[0] === 't', toF = to[0] === 'f', toT = to[0] === 't';
      if (from === 'waste' && toT) addScore(5);
      if ((from === 'waste' || fromT) && toF) addScore(10);
      if (from[0] === 'f' && toT) addScore(-15);
      if (fromT) { const t = top(from); if (t && !t.up) { t.up = true; addScore(5); } }
      layout();
      checkWin();
    }

    function drawStock() {
      if (g.over) return;
      if (g.piles.stock.length) {
        snapshot(); start();
        for (let k = 0; k < g.draw && g.piles.stock.length; k++) { const c = g.piles.stock.pop(); c.up = true; g.piles.waste.push(c); }
      } else if (g.piles.waste.length) {
        snapshot(); start();
        g.piles.stock = g.piles.waste.reverse().map((c) => { c.up = false; return c; });
        g.piles.waste = [];
        addScore(g.draw === 1 ? -100 : -20);
      }
      layout();
    }

    function autoFound(c) {
      const w = where(c);
      if (!w || g.over) return false;
      if (w.p[0] === 'f' || w.i !== g.piles[w.p].length - 1 || !c.up) return false;
      for (let f = 0; f < 4; f++) if (canFound(c, 'f' + f)) { move(w.p, w.i, 'f' + f); return true; }
      return false;
    }

    // ---- arrastar e soltar ----
    let drag = null;
    table.addEventListener('pointerdown', (e) => {
      if (g.over || (e.button !== undefined && e.button > 0)) return;
      const el = e.target.closest && e.target.closest('.sol-card');
      if (!el) {
        if (e.target === slots.stock || slots.stock.contains(e.target)) drawStock();
        return;
      }
      const c = el._card;
      const w = where(c);
      if (!w) return;
      if (w.p === 'stock') { drawStock(); return; }
      if (!c.up) {
        if (w.p[0] === 't' && w.i === g.piles[w.p].length - 1) { snapshot(); c.up = true; addScore(5); layout(); }
        return;
      }
      if (w.p === 'waste' && w.i !== g.piles.waste.length - 1) return;
      if (w.p[0] === 'f' && w.i !== g.piles[w.p].length - 1) return;
      const stack = g.piles[w.p].slice(w.i);
      drag = { from: w.p, idx: w.i, stack, sx: e.clientX, sy: e.clientY, moved: false, pid: e.pointerId,
        orig: stack.map((x) => ({ x: parseFloat(x.el.style.left), y: parseFloat(x.el.style.top) })) };
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* sem captura */ }
      e.preventDefault();
    });
    table.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.pid) return;
      const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
      if (!drag.moved) { drag.moved = true; drag.stack.forEach((c, k) => { c.el.classList.add('drag'); c.el.style.zIndex = String(500 + k); }); }
      drag.stack.forEach((c, k) => { c.el.style.left = (drag.orig[k].x + dx) + 'px'; c.el.style.top = (drag.orig[k].y + dy) + 'px'; });
    });
    const endDrag = (e) => {
      if (!drag || (e && e.pointerId !== undefined && e.pointerId !== drag.pid)) return;
      const d = drag;
      drag = null;
      d.stack.forEach((c) => c.el.classList.remove('drag'));
      if (!d.moved) return;
      const first = d.stack[0];
      const r1 = { x: parseFloat(first.el.style.left), y: parseFloat(first.el.style.top), w: geo.cw, h: geo.ch };
      let best = null, bestArea = 0;
      const overlap = (r2) => Math.max(0, Math.min(r1.x + r1.w, r2.x + r2.w) - Math.max(r1.x, r2.x)) * Math.max(0, Math.min(r1.y + r1.h, r2.y + r2.h) - Math.max(r1.y, r2.y));
      const targets = [];
      if (d.stack.length === 1) for (let f = 0; f < 4; f++) targets.push({ p: 'f' + f, r: { x: geo.colX(3 + f), y: geo.pad, w: geo.cw, h: geo.ch }, ok: canFound(first, 'f' + f) });
      for (let t = 0; t < 7; t++) {
        const col = g.piles['t' + t];
        const last = col[col.length - 1];
        const y = last ? parseFloat(last.el.style.top) : geo.y1;
        targets.push({ p: 't' + t, r: { x: geo.colX(t), y: geo.y1, w: geo.cw, h: y - geo.y1 + geo.ch }, ok: canTab(first, 't' + t) });
      }
      targets.forEach((t) => { if (t.p === d.from || !t.ok) return; const a = overlap(t.r); if (a > bestArea) { bestArea = a; best = t.p; } });
      if (best) move(d.from, d.idx, best); else layout();
    };
    table.addEventListener('pointerup', endDrag);
    table.addEventListener('pointercancel', endDrag);
    table.addEventListener('dblclick', (e) => {
      const el = e.target.closest && e.target.closest('.sol-card');
      if (el) autoFound(el._card);
    });

    // ---- vitória: cartas pulando, como nas Paciências da época ----
    let dlg = null, celebration = null;
    function stopCelebration() {
      if (celebration) { cancelAnimationFrame(celebration.raf); celebration.clones.forEach((x) => x.el.remove()); celebration = null; }
    }
    function checkWin() {
      if ([0, 1, 2, 3].reduce((a, f) => a + g.piles['f' + f].length, 0) !== 52) return;
      g.over = true; g.running = false;
      const bonus = g.time > 30 ? Math.round(700000 / g.time) : 0;
      addScore(bonus);
      const finish = () => {
        stopCelebration();
        dlg = vdDialog(root, {
          title: 'Jogo ganho', icon: 'win', heading: 'Parabéns, você ganhou!',
          text: 'Pontuação: ' + g.score + (bonus ? ' (bônus de tempo: ' + bonus + ')' : '') + '\nTempo: ' + timeEl.textContent,
          buttons: [{ label: 'Sair', action: () => win.close() }, { label: 'Jogar novamente', primary: true, action: () => newGame() }]
        });
      };
      const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (calm) { finish(); return; }
      const order = [];
      for (let r = 13; r >= 1; r--) for (let f = 0; f < 4; f++) { const c = g.piles['f' + f][r - 1]; if (c) order.push(c); }
      celebration = { clones: [], raf: 0, next: 0, t0: performance.now() };
      const H = geo.H;
      const stepFn = (now) => {
        if (!celebration) return;
        const elapsed = now - celebration.t0;
        while (celebration.next < order.length && elapsed > celebration.next * 90) {
          const c = order[celebration.next++];
          const el = c.el.cloneNode(true);
          el.classList.add('fly');
          table.appendChild(el);
          celebration.clones.push({ el, x: parseFloat(c.el.style.left), y: parseFloat(c.el.style.top), vx: (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 4), vy: -Math.random() * 6 });
        }
        celebration.clones.forEach((k) => {
          k.vy += 0.6; k.x += k.vx; k.y += k.vy;
          if (k.y + geo.ch > H) { k.y = H - geo.ch; k.vy = -k.vy * 0.72; }
          k.el.style.left = k.x + 'px'; k.el.style.top = k.y + 'px';
        });
        if (celebration.next >= order.length && celebration.clones.every((k) => k.x > geo.W + 10 || k.x < -geo.cw - 10)) { finish(); return; }
        if (elapsed > 9000) { finish(); return; }
        celebration.raf = requestAnimationFrame(stepFn);
      };
      celebration.raf = requestAnimationFrame(stepFn);
      table.addEventListener('pointerdown', function skip() { table.removeEventListener('pointerdown', skip); if (celebration) finish(); });
    }

    function help() {
      vdDialog(root, {
        title: 'Como jogar', icon: 'info', heading: 'Monte as quatro pilhas de naipe, do Ás ao Rei.',
        text: 'Nas colunas, empilhe em ordem decrescente alternando vermelho e preto. Só um Rei vai para coluna vazia.\nClique no monte para virar cartas. Dê duplo clique numa carta para mandá-la à pilha do naipe.\nCtrl+Z desfaz; F2 começa um jogo novo.',
        buttons: [{ label: 'OK', primary: true }]
      });
    }

    // ---- tempo, teclado e redimensionamento ----
    const tick = setInterval(() => {
      if (g.running && !g.over && !win.isMinimized()) { g.time++; paintStatus(); }
    }, 1000);
    const onKey = (e) => {
      if (!win.isActive()) return;
      if (e.key === 'F2') { e.preventDefault(); newGame(); }
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); undo(); }
    };
    document.addEventListener('keydown', onKey);
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(() => layout(true)); ro.observe(table); }

    newGame();
    requestAnimationFrame(() => layout(true));
    win.el._game = { state: g, cards, drawStock, newGame, undo, move, autoFound, canFound, canTab, layout };
    return {
      destroy() {
        clearInterval(tick);
        stopCelebration();
        document.removeEventListener('keydown', onKey);
        if (ro) ro.disconnect();
        if (menu.closeMenus) menu.closeMenus();
      }
    };
  }
};
