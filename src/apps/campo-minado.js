/* ===== App "Campo Minado" (visual do Campo Minado do Windows Vista) ===== */

/* ícone: ladrilho azul de vidro com uma mina (sem gradientes com id, pois aparece várias vezes na página) */
const VD_ICON_MINES = '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
  '<rect x="5" y="5" width="38" height="38" rx="6" fill="#2f74d4" stroke="#163f7e" stroke-width="1.4"/>' +
  '<rect x="6.5" y="6.5" width="35" height="17" rx="5" fill="#fff" opacity=".32"/>' +
  '<path d="M24 11v26M11 24h26M14.8 14.8l18.4 18.4M33.2 14.8L14.8 33.2" stroke="#0d0f14" stroke-width="3" stroke-linecap="round"/>' +
  '<circle cx="24" cy="24" r="9" fill="#111419"/><circle cx="24" cy="24" r="9" fill="none" stroke="#56657a" stroke-width="1"/>' +
  '<circle cx="21" cy="21" r="2.8" fill="#fff" opacity=".9"/></svg>';

const VD_MS_MINE = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 1.8v16.4M1.8 10h16.4M4.2 4.2l11.6 11.6M15.8 4.2L4.2 15.8" stroke="#121418" stroke-width="1.9" stroke-linecap="round"/>' +
  '<circle cx="10" cy="10" r="5.8" fill="#121418"/><circle cx="10" cy="10" r="5.8" fill="none" stroke="#56657a" stroke-width=".7"/><circle cx="8.2" cy="8.2" r="1.8" fill="#fff" opacity=".9"/></svg>';
const VD_MS_FLAG = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M8.2 3v12.5" stroke="#2a2a2a" stroke-width="1.6" stroke-linecap="round"/>' +
  '<path d="M8.9 3.1L16.2 6.4 8.9 9.7Z" fill="#e8321c" stroke="#9e1606" stroke-width=".7" stroke-linejoin="round"/><path d="M8.9 3.6L13.4 5.6 8.9 6.6Z" fill="#ff8a6c" opacity=".7"/>' +
  '<path d="M4.4 17.2h8.2l-1.1-1.8H5.5z" fill="#2a2a2a"/></svg>';
const VD_MS_CLOCK = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="10" cy="11" r="7.2" fill="#f7fbff" stroke="#28406a" stroke-width="1.6"/><path d="M8.2 1.8h3.6M10 1.8v2" stroke="#28406a" stroke-width="1.6" stroke-linecap="round"/><path d="M10 11V6.8M10 11l3 1.6" stroke="#d23a24" stroke-width="1.5" stroke-linecap="round"/></svg>';

const VD_MS_LEVELS = {
  beg: { label: 'Iniciante', rows: 9, cols: 9, mines: 10 },
  int: { label: 'Intermediário', rows: 16, cols: 16, mines: 40 },
  adv: { label: 'Avançado', rows: 16, cols: 30, mines: 99 }
};

const VD_MINAS_APP = {
  id: 'campo-minado',
  title: 'Campo Minado',
  icon: VD_ICON_MINES,
  size: { w: 300, h: 400 },
  resizable: false,
  render(body, win) {
    const CELL = 26; // 25px de ladrilho + 1px de junta
    const g = { level: 'beg', cells: [], placed: false, over: false, time: 0, flags: 0, opened: 0 };
    const root = document.createElement('div');
    root.className = 'ms';
    const menu = vdMenuBar([
      { label: 'Jogo', items: [
        { label: 'Novo jogo', shortcut: 'F2', action: () => newGame() },
        'sep',
        { label: 'Iniciante', checked: () => g.level === 'beg', action: () => setLevel('beg') },
        { label: 'Intermediário', checked: () => g.level === 'int', action: () => setLevel('int') },
        { label: 'Avançado', checked: () => g.level === 'adv', action: () => setLevel('adv') },
        'sep',
        { label: 'Sair', action: () => win.close() }
      ] },
      { label: 'Ajuda', items: [
        { label: 'Como jogar', action: () => help() }
      ] }
    ]);
    root.appendChild(menu);
    const field = document.createElement('div');
    field.className = 'ms-field';
    field.innerHTML = '<div class="ms-board" role="grid" aria-label="Campo minado"></div>';
    root.appendChild(field);
    const foot = document.createElement('div');
    foot.className = 'ms-foot';
    foot.innerHTML = '<span class="ms-pill">' + VD_MS_CLOCK + '<b class="ms-time" aria-label="Tempo">0</b></span>' +
      '<span class="ms-pill"><b class="ms-left" aria-label="Minas restantes">10</b>' + VD_MS_MINE + '</span>';
    root.appendChild(foot);
    body.appendChild(root);
    const board = field.querySelector('.ms-board');
    const timeEl = foot.querySelector('.ms-time');
    const leftEl = foot.querySelector('.ms-left');

    const L = () => VD_MS_LEVELS[g.level];
    const neighbors = (i) => {
      const { rows, cols } = L();
      const r = Math.floor(i / cols), c = i % cols, out = [];
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const rr = r + dr, cc = c + dc;
        if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) out.push(rr * cols + cc);
      }
      return out;
    };

    function fitWindow() {
      const { rows, cols } = L();
      const bw = cols * CELL + 1, bh = rows * CELL + 1;
      // moldura da janela (7+7), bordas (2), título (30), menu (24), margem do campo (2*16), rodapé (44)
      win.setSize(Math.max(300, bw + 32 + 16), bh + 32 + 30 + 24 + 44 + 9);
    }

    function build() {
      const { rows, cols } = L();
      board.style.gridTemplateColumns = 'repeat(' + cols + ', ' + (CELL - 1) + 'px)';
      let html = '';
      for (let i = 0; i < rows * cols; i++) html += '<div class="ms-c" data-i="' + i + '"></div>';
      board.innerHTML = html;
      g.cells = [];
      for (let i = 0; i < rows * cols; i++) g.cells.push({ mine: false, open: false, flag: false, n: 0, el: board.children[i] });
    }

    function newGame(keepLayout) {
      if (dlg) { dlg.close(); dlg = null; }
      if (keepLayout && g.placed) {
        g.cells.forEach((c) => { c.open = false; c.flag = false; c.el.className = 'ms-c'; c.el.innerHTML = ''; });
      } else {
        build();
        g.placed = false;
      }
      g.over = false; g.time = 0; g.flags = 0; g.opened = 0; g.running = false;
      board.classList.remove('done');
      paintCounters();
    }

    function setLevel(lv) {
      g.level = lv;
      newGame();
      fitWindow();
    }

    function place(safe) {
      const { mines } = L();
      const banned = new Set([safe].concat(neighbors(safe)));
      const pool = [];
      g.cells.forEach((c, i) => { if (!banned.has(i)) pool.push(i); });
      for (let k = 0; k < mines; k++) {
        const j = k + Math.floor(Math.random() * (pool.length - k));
        const t = pool[k]; pool[k] = pool[j]; pool[j] = t;
        g.cells[pool[k]].mine = true;
      }
      g.cells.forEach((c, i) => { c.n = neighbors(i).filter((j) => g.cells[j].mine).length; });
      g.placed = true;
    }

    function paintCell(c) {
      if (c.open) {
        c.el.className = 'ms-c open' + (c.n ? ' n' + c.n : '');
        c.el.textContent = c.n ? String(c.n) : '';
      } else {
        c.el.className = 'ms-c' + (c.flag ? ' flag' : '');
        c.el.innerHTML = c.flag ? VD_MS_FLAG : '';
      }
    }

    function paintCounters() {
      timeEl.textContent = String(g.time);
      leftEl.textContent = String(L().mines - g.flags);
    }

    function reveal(i) {
      const c = g.cells[i];
      if (g.over || c.open || c.flag) return;
      if (!g.placed) place(i);
      g.running = true;
      if (c.mine) { lose(i); return; }
      const queue = [i];
      while (queue.length) {
        const k = queue.shift();
        const x = g.cells[k];
        if (x.open || x.flag) continue;
        x.open = true;
        g.opened++;
        paintCell(x);
        if (x.n === 0) neighbors(k).forEach((j) => { if (!g.cells[j].open && !g.cells[j].flag) queue.push(j); });
      }
      const { rows, cols, mines } = L();
      if (g.opened === rows * cols - mines) won();
    }

    function chord(i) {
      const c = g.cells[i];
      if (g.over || !c.open || !c.n) return;
      const ns = neighbors(i);
      if (ns.filter((j) => g.cells[j].flag).length !== c.n) return;
      ns.forEach((j) => { if (!g.over) reveal(j); });
    }

    function toggleFlag(i) {
      const c = g.cells[i];
      if (g.over || c.open) return;
      c.flag = !c.flag;
      g.flags += c.flag ? 1 : -1;
      paintCell(c);
      paintCounters();
    }

    let dlg = null;
    function lose(i) {
      g.over = true; g.running = false;
      board.classList.add('done');
      const boom = g.cells[i];
      boom.open = true;
      boom.el.className = 'ms-c open boom';
      boom.el.innerHTML = VD_MS_MINE;
      const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let k = 0;
      g.cells.forEach((c) => {
        if (c === boom) return;
        if (c.mine && !c.flag) {
          const show = () => { c.el.className = 'ms-c open mine'; c.el.innerHTML = VD_MS_MINE; };
          if (calm) show(); else timers.push(setTimeout(show, 40 + (k++ % 40) * 18));
        } else if (!c.mine && c.flag) {
          c.el.className = 'ms-c wrong';
          c.el.innerHTML = VD_MS_FLAG + '<svg class="ms-x" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4l12 12M16 4L4 16" stroke="#d01e0a" stroke-width="2.4" stroke-linecap="round"/></svg>';
        }
      });
      timers.push(setTimeout(() => {
        dlg = vdDialog(root, {
          title: 'Jogo perdido', icon: 'lose',
          heading: 'Desculpe, você perdeu este jogo.',
          text: 'Mais sorte na próxima vez!\nTempo: ' + g.time + (g.time === 1 ? ' segundo' : ' segundos'),
          buttons: [
            { label: 'Sair', action: () => win.close() },
            { label: 'Reiniciar este jogo', action: () => newGame(true) },
            { label: 'Jogar novamente', primary: true, action: () => newGame() }
          ]
        });
      }, calm ? 0 : 900));
    }

    function won() {
      g.over = true; g.running = false;
      board.classList.add('done');
      g.cells.forEach((c) => { if (c.mine && !c.flag) { c.flag = true; paintCell(c); } });
      g.flags = L().mines;
      paintCounters();
      let best = null;
      try {
        const key = 'vd-minas-recorde-' + g.level;
        best = Number(localStorage.getItem(key)) || null;
        if (!best || g.time < best) { localStorage.setItem(key, String(g.time)); best = g.time; }
      } catch (e) { best = null; }
      dlg = vdDialog(root, {
        title: 'Jogo ganho', icon: 'win',
        heading: 'Parabéns, você ganhou o jogo!',
        text: 'Tempo: ' + g.time + (g.time === 1 ? ' segundo' : ' segundos') + (best !== null ? '\nMelhor tempo (' + L().label + '): ' + best : ''),
        buttons: [
          { label: 'Sair', action: () => win.close() },
          { label: 'Jogar novamente', primary: true, action: () => newGame() }
        ]
      });
    }

    function help() {
      vdDialog(root, {
        title: 'Como jogar', icon: 'info', heading: 'Encontre todas as minas sem detoná-las.',
        text: 'Clique para abrir um quadrado. O número mostra quantas minas há ao redor.\nClique com o botão direito (ou segure, no toque) para marcar uma mina com bandeira.\nClique num número com todas as bandeiras ao redor para abrir os vizinhos.',
        buttons: [{ label: 'OK', primary: true }]
      });
    }

    // ---- eventos do tabuleiro ----
    const timers = [];
    let pressed = null, longPress = null, skipClick = false;
    const cellOf = (e) => { const el = e.target.closest && e.target.closest('.ms-c'); return el && board.contains(el) ? Number(el.dataset.i) : -1; };
    const unpress = () => { if (pressed) pressed.classList.remove('press'); pressed = null; if (longPress) { clearTimeout(longPress); longPress = null; } };
    board.addEventListener('pointerdown', (e) => {
      const i = cellOf(e);
      if (i < 0 || g.over || e.button !== 0) return;
      const c = g.cells[i];
      if (!c.open && !c.flag) { pressed = c.el; pressed.classList.add('press'); }
      if (e.pointerType === 'touch') {
        longPress = setTimeout(() => { longPress = null; skipClick = true; unpress(); toggleFlag(i); }, 450);
      }
    });
    board.addEventListener('pointerup', unpress);
    board.addEventListener('pointerleave', unpress);
    board.addEventListener('pointercancel', unpress);
    board.addEventListener('click', (e) => {
      const i = cellOf(e);
      if (i < 0) return;
      if (skipClick) { skipClick = false; return; }
      if (g.cells[i].open) chord(i); else reveal(i);
    });
    board.addEventListener('contextmenu', (e) => { e.preventDefault(); const i = cellOf(e); if (i >= 0) toggleFlag(i); });
    board.addEventListener('auxclick', (e) => { if (e.button === 1) { const i = cellOf(e); if (i >= 0) chord(i); } });
    const onKey = (e) => { if (e.key === 'F2' && win.isActive()) { e.preventDefault(); newGame(); } };
    document.addEventListener('keydown', onKey);
    const tick = setInterval(() => {
      if (g.running && !g.over && !win.isMinimized() && g.time < 999) { g.time++; timeEl.textContent = String(g.time); }
    }, 1000);

    newGame();
    fitWindow();
    win.el._game = { state: g, reveal, toggleFlag, chord, newGame, setLevel };
    return {
      destroy() {
        clearInterval(tick);
        timers.forEach((t) => clearTimeout(t));
        document.removeEventListener('keydown', onKey);
        if (menu.closeMenus) menu.closeMenus();
      }
    };
  }
};
