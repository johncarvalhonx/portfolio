/* ===== Desktop Windows Vista: motor (JS puro, fora do React) =====
   Uso: const d = new VistaDesktop(div); d.registerApp({...}); d.addDesktopIcon({...}); d.open('id');
   Detalhes e exemplo de app novo no README. Classes CSS em src/vista-desktop.css (prefixo vd-). */

const VD_ICON_FOLDER = '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><defs><linearGradient id="vdf1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe58a"/><stop offset="1" stop-color="#f2b53a"/></linearGradient><linearGradient id="vdf2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b8"/><stop offset=".5" stop-color="#ffd35c"/><stop offset="1" stop-color="#eba624"/></linearGradient></defs><path d="M4 10a3 3 0 0 1 3-3h12l4 4h18a3 3 0 0 1 3 3v26a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="url(#vdf1)" stroke="#b27b14" stroke-width="1.2"/><path d="M4 18a3 3 0 0 1 3-3h34a3 3 0 0 1 3 3v21a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="url(#vdf2)" stroke="#b27b14" stroke-width="1.2"/><path d="M6 19h36" stroke="#fff" stroke-opacity=".7"/></svg>';

const VD_ICON_TRASH = '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><defs><linearGradient id="vdt1" x1="0" x2="1"><stop offset="0" stop-color="#b9d0e4"/><stop offset=".5" stop-color="#e9f4fc"/><stop offset="1" stop-color="#9cb6cc"/></linearGradient></defs><path d="M10 12h28l-3 31a3 3 0 0 1-3 2.6H16a3 3 0 0 1-3-2.6z" fill="url(#vdt1)" stroke="#5f7f9a" stroke-width="1.4" fill-opacity=".85"/><path d="M8 11h32" stroke="#5f7f9a" stroke-width="3" stroke-linecap="round"/><path d="M18 8h12v3H18z" fill="#cfe1ef" stroke="#5f7f9a"/><path d="M17 18v22M24 18v22M31 18v22" stroke="#7d9bb4" stroke-width="1.4" opacity=".7"/><path d="M20 4l4 6-6-1z" fill="#44b04a"/></svg>';

const VD_ICON_WEB = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10" fill="#3a9be8" stroke="#1560a8"/><path d="M2.5 12h19M12 2.3c3 3 3 16.4 0 19.4M12 2.3c-3 3-3 16.4 0 19.4" fill="none" stroke="#fff" stroke-opacity=".8"/></svg>';
const VD_ICON_MAIL = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="2.5" y="5" width="19" height="14" rx="1.5" fill="#f4f7fb" stroke="#5a7a96"/><path d="M3 6.5l9 6.5 9-6.5" fill="none" stroke="#5a7a96"/></svg>';
const VD_ICON_GAME = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="3" fill="#8b98a6" stroke="#5a6a7a"/><circle cx="9" cy="9" r="1.6" fill="#fff"/><circle cx="15" cy="15" r="1.6" fill="#fff"/></svg>';

const VD_ORB_FLAG = '<svg viewBox="0 0 30 30" aria-hidden="true" focusable="false"><path d="M3 6.2c3.2-1.7 6-1.4 8.6 0l-1.4 7.2c-2.6-1.4-5.1-1.5-8.200 0z" fill="#ff6a3d"/><path d="M13 7.2c2.6 1.3 5.4 1.5 8.6.2l-1.4 7c-3 1.2-5.8 1.1-8.6-.2z" fill="#6fe04b"/><path d="M2 16.2c3.1-1.5 5.7-1.3 8.2.1l-1.4 7.2c-2.6-1.3-5.1-1.4-8 .1z" fill="#2f9bff"/><path d="M11.4 17.5c2.6 1.3 5.4 1.4 8.4.2l-1.4 7c-3 1.2-5.700 1.100-8.400-.2z" fill="#ffd02a"/></svg>';

/* papel de parede "Aurora" recriado em SVG */
const VD_WALLPAPER = '<svg viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><defs>' +
  '<linearGradient id="vdw-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#02130f"/><stop offset=".5" stop-color="#06352d"/><stop offset="1" stop-color="#0b6350"/></linearGradient>' +
  '<linearGradient id="vdw-g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8dffae" stop-opacity="0"/><stop offset=".5" stop-color="#9affb8" stop-opacity="1"/><stop offset="1" stop-color="#2cd7b0" stop-opacity="0"/></linearGradient>' +
  '<linearGradient id="vdw-g2" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#16b8a4" stop-opacity="0"/><stop offset=".6" stop-color="#5fffd0" stop-opacity=".9"/><stop offset="1" stop-color="#c2fff0" stop-opacity="0"/></linearGradient>' +
  '<radialGradient id="vdw-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#e6fff0" stop-opacity="1"/><stop offset=".35" stop-color="#7cffbc" stop-opacity=".65"/><stop offset="1" stop-color="#2fc8a6" stop-opacity="0"/></radialGradient>' +
  '<filter id="vdw-b1" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter><filter id="vdw-b2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter><filter id="vdw-b3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter></defs>' +
  '<rect width="1280" height="720" fill="url(#vdw-bg)"/>' +
  '<ellipse cx="760" cy="650" rx="640" ry="170" fill="url(#vdw-glow)" filter="url(#vdw-b3)"/>' +
  '<ellipse cx="1020" cy="110" rx="380" ry="160" fill="#22b89f" opacity=".42" filter="url(#vdw-b3)"/>' +
  '<path d="M-40 170 C 160 130 330 320 520 520 S 820 700 1000 710 L 1000 760 L -40 760Z" fill="url(#vdw-g1)" filter="url(#vdw-b1)"/>' +
  '<path d="M-40 240 C 200 220 380 420 560 560 S 900 705 1100 695" fill="none" stroke="#d6ffe2" stroke-width="5" opacity=".95" filter="url(#vdw-b2)"/>' +
  '<path d="M-40 290 C 220 290 420 480 600 600 S 960 712 1180 696" fill="none" stroke="#a8ffcc" stroke-width="24" opacity=".6" filter="url(#vdw-b1)"/>' +
  '<path d="M300 -10 C 420 120 520 280 700 420 S 1040 600 1320 560 L 1320 730 L 560 730Z" fill="url(#vdw-g2)" filter="url(#vdw-b1)" opacity=".7"/>' +
  '<path d="M420 -20 C 520 120 640 230 800 330 S 1100 460 1320 400" fill="none" stroke="#c8fff0" stroke-width="3" opacity=".75" filter="url(#vdw-b2)"/>' +
  '<path d="M640 -20 C 700 90 780 160 900 220 S 1120 300 1320 270" fill="none" stroke="#66f0d2" stroke-width="18" opacity=".45" filter="url(#vdw-b1)"/>' +
  '</svg>';

const VD_SPEAKER = (level) => '<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M2 7h3l4-3.5v11L5 11H2z" fill="#fff"/>' +
  (level === 0 ? '<path d="M11.5 6.5l5 5M16.5 6.5l-5 5" stroke="#ff8a7a" stroke-width="1.6" stroke-linecap="round"/>' :
    '<path d="M11 6.5c1.5 1.4 1.5 3.6 0 5" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>' +
    (level > 1 ? '<path d="M13 4.5c2.6 2.4 2.6 6.6 0 9" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>' : '')) + '</svg>';

class VistaDesktop {
  constructor(root, opts) {
    opts = opts || {};
    this.root = root;
    this.tz = opts.timeZone || 'America/Sao_Paulo';
    this.apps = new Map();
    this.wins = new Map();
    this.icons = new Map();
    this.zTop = 10;
    this.activeId = null;
    this.hiddenByShow = null;
    this.timers = [];
    this.cleanup = [];
    this.volume = 70;
    this.mq = window.matchMedia ? window.matchMedia('(max-width: 767px)') : { matches: false };
    this.calm = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
    try {
      this.tf = new Intl.DateTimeFormat('pt-BR', { timeZone: this.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric', hour12: false });
    } catch (e) {
      this.tf = null;
    }
    this._build();
    this._bindGlobal();
    this._tick();
    this.timers.push(setInterval(() => this._tick(), 1000));
  }

  /* ---------- construção da casca ---------- */
  _build() {
    const r = this.root;
    r.classList.add('vd');
    r.innerHTML =
      '<div class="vd-wall">' + VD_WALLPAPER + '</div>' +
      '<div class="vd-stage"><div class="vd-icons"></div></div>' +
      '<div class="vd-start" role="menu" aria-label="Menu Iniciar" hidden>' +
        '<div class="vd-sl">' +
          '<button class="vd-si" type="button" data-noop>' + VD_ICON_WEB + '<span><b>Internet</b><small>Navegador</small></span></button>' +
          '<button class="vd-si" type="button" data-noop>' + VD_ICON_MAIL + '<span><b>E-mail</b><small>Correio</small></span></button>' +
          '<div class="vd-sep"></div><div class="vd-entries"></div><div style="flex:1"></div><div class="vd-sep"></div>' +
          '<button class="vd-si" type="button" data-noop><b>▶ Todos os Programas</b></button>' +
        '</div>' +
        '<div class="vd-sr"><div class="vd-user">João Carvalho</div>' +
          '<button type="button" data-noop>Documentos</button><button type="button" data-noop>Imagens</button><button type="button" data-noop>Músicas</button>' +
          '<button type="button" data-noop>Jogos</button><button type="button" data-noop>Computador</button><button type="button" data-noop>Painel de Controle</button></div>' +
        '<div class="vd-srch">Iniciar pesquisa</div><div class="vd-pw" aria-hidden="true"><span></span><span></span></div>' +
      '</div>' +
      '<div class="vd-panel" data-panel="volume" hidden><b>Volume</b>' +
        '<input type="range" min="0" max="100" value="70" aria-label="Volume"><span class="vd-vol-val">70%</span></div>' +
      '<div class="vd-panel" data-panel="network" hidden><b>Rede</b><span>Conectado à Internet</span></div>' +
      '<div class="vd-panel" data-panel="clock" hidden>' +
        '<svg class="vd-analog" viewBox="0 0 120 120" aria-hidden="true" focusable="false"><circle cx="60" cy="60" r="56" fill="#f6fbff" stroke="#2a4a68" stroke-width="3"/><circle cx="60" cy="60" r="52" fill="none" stroke="#9fc3e0"/>' +
          this._ticks() +
          '<line class="vd-h" x1="60" y1="60" x2="60" y2="36" stroke="#14283c" stroke-width="4" stroke-linecap="round"/><line class="vd-m" x1="60" y1="60" x2="60" y2="22" stroke="#14283c" stroke-width="3" stroke-linecap="round"/><line class="vd-s" x1="60" y1="66" x2="60" y2="18" stroke="#d23a24" stroke-width="1.6" stroke-linecap="round"/><circle cx="60" cy="60" r="3.5" fill="#d23a24"/></svg>' +
        '<div class="vd-cal"></div></div>' +
      '<div class="vd-bar">' +
        '<button class="vd-orb" type="button" aria-label="Iniciar" aria-haspopup="menu" aria-expanded="false">' + VD_ORB_FLAG + '</button>' +
        '<div class="vd-ql"><button class="vd-q" type="button" data-act="show" aria-label="Mostrar área de trabalho" title="Mostrar área de trabalho"><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="4" width="16" height="11" fill="#7fc4f5" stroke="#fff" stroke-width="1.3"/><path d="M6 17h8" stroke="#fff" stroke-width="1.6"/></svg></button></div>' +
        '<div class="vd-tbs"></div>' +
        '<div class="vd-tray">' +
          '<button class="vd-tray-btn" type="button" aria-label="Mostrar ícones ocultos" data-noop><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M11 4L6 9l5 5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
          '<button class="vd-tray-btn vd-vol" type="button" data-panel="volume" aria-label="Volume" aria-expanded="false">' + VD_SPEAKER(2) + '</button>' +
          '<button class="vd-tray-btn" type="button" data-panel="network" aria-label="Rede" aria-expanded="false"><svg viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="9" rx="1" fill="#79bdf2" stroke="#fff"/><path d="M6 15h6" stroke="#fff" stroke-width="1.6"/></svg></button>' +
          '<button class="vd-tray-btn vd-clock" type="button" data-panel="clock" aria-label="Data e hora" aria-expanded="false"><span class="vd-time">--:--</span><small class="vd-date"></small></button>' +
        '</div>' +
      '</div>';
    this.stage = r.querySelector('.vd-stage');
    this.iconsEl = r.querySelector('.vd-icons');
    this.startEl = r.querySelector('.vd-start');
    this.entriesEl = r.querySelector('.vd-entries');
    this.tbsEl = r.querySelector('.vd-tbs');
    this.orb = r.querySelector('.vd-orb');
    this.panels = {};
    r.querySelectorAll('.vd-panel').forEach((p) => { this.panels[p.dataset.panel] = p; });
    this.timeEl = r.querySelector('.vd-time');
    this.dateEl = r.querySelector('.vd-date');
    this.hands = { h: r.querySelector('.vd-h'), m: r.querySelector('.vd-m'), s: r.querySelector('.vd-s') };
    this.calEl = r.querySelector('.vd-cal');
    this.volInput = r.querySelector('.vd-panel[data-panel="volume"] input');
    this.volVal = r.querySelector('.vd-vol-val');
  }

  _ticks() {
    let out = '';
    for (let i = 0; i < 12; i++) {
      const a = (i * 30) * Math.PI / 180;
      const x1 = 60 + Math.sin(a) * 46, y1 = 60 - Math.cos(a) * 46, x2 = 60 + Math.sin(a) * 51, y2 = 60 - Math.cos(a) * 51;
      out += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="#2a4a68" stroke-width="' + (i % 3 === 0 ? 3 : 1.5) + '"/>';
    }
    return out;
  }

  _bindGlobal() {
    const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); this.cleanup.push(() => t.removeEventListener(ev, fn, o)); };
    // clique no fundo limpa a seleção dos ícones
    on(this.stage, 'pointerdown', (e) => {
      if (e.target === this.stage || e.target === this.iconsEl) this._select(null);
    });
    // clique fora fecha popups
    on(document, 'pointerdown', (e) => {
      if (!this._popupOpen()) return;
      const t = e.target;
      if (this.startEl.contains(t) || this.orb.contains(t)) return;
      for (const k in this.panels) {
        if (this.panels[k].contains(t)) return;
      }
      if (t.closest && t.closest('.vd-tray-btn[data-panel]')) return;
      this._closePopups();
    });
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && this._popupOpen()) { this._closePopups(); }
    });
    on(window, 'resize', () => this._relayout());
    const mqh = () => { if (this.mq.matches) this.wins.forEach((rec) => { if (rec.state === 'normal' && rec.app.resizable !== false) this._setState(rec, 'max'); }); };
    if (this.mq.addEventListener) { this.mq.addEventListener('change', mqh); this.cleanup.push(() => this.mq.removeEventListener('change', mqh)); }
    // barra de tarefas e popups
    this.orb.addEventListener('click', () => this.toggleStart());
    this.root.querySelector('[data-act="show"]').addEventListener('click', () => this.showDesktop());
    this.root.querySelectorAll('.vd-tray-btn[data-panel]').forEach((b) => b.addEventListener('click', () => this.togglePanel(b.dataset.panel)));
    this.root.querySelectorAll('[data-noop]').forEach((b) => b.addEventListener('click', () => this._closePopups()));
    this.volInput.addEventListener('input', () => {
      this.volume = Number(this.volInput.value);
      this.volVal.textContent = this.volume + '%';
      this.root.querySelector('.vd-vol').innerHTML = VD_SPEAKER(this.volume === 0 ? 0 : this.volume < 50 ? 1 : 2);
    });
  }

  /* ---------- registro ---------- */
  registerApp(app) {
    this.apps.set(app.id, app);
  }

  addDesktopIcon(ic) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'vd-icon';
    b.innerHTML = ic.icon + '<span></span>';
    b.querySelector('span').textContent = ic.label;
    if (ic.appId) b.dataset.app = ic.appId;
    b.addEventListener('click', () => {
      this._select(b);
      if (this.mq.matches && ic.appId) this.open(ic.appId);
    });
    b.addEventListener('dblclick', () => { if (ic.appId) this.open(ic.appId); });
    b.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && ic.appId) { e.preventDefault(); this.open(ic.appId); }
    });
    this.iconsEl.appendChild(b);
    this.icons.set(b, ic);
    return b;
  }

  addStartEntry(en) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'vd-si';
    b.innerHTML = (en.icon || VD_ICON_GAME) + '<span></span>' + (en.appId ? '' : '<em>em breve</em>');
    b.querySelector('span').textContent = en.label;
    if (!en.appId) b.disabled = true;
    else b.addEventListener('click', () => { this._closePopups(); this.open(en.appId); });
    this.entriesEl.appendChild(b);
    return b;
  }

  _select(btn) {
    this.iconsEl.querySelectorAll('.vd-icon.sel').forEach((x) => x.classList.remove('sel'));
    if (btn) btn.classList.add('sel');
  }

  /* ---------- janelas ---------- */
  getState(id) {
    const rec = this.wins.get(id);
    return rec ? rec.state : 'closed';
  }

  open(id) {
    const app = this.apps.get(id);
    if (!app) return;
    const have = this.wins.get(id);
    if (have) { this.restore(id); this.focus(id); return; }
    const W = this.stage.clientWidth, H = this.stage.clientHeight;
    const size = app.size || { w: 640, h: 440 };
    const w = Math.max(160, Math.min(size.w, W - 24)), h = Math.max(120, Math.min(size.h, H - 24));
    const off = (this.wins.size % 5) * 26;
    const rec = {
      app, id, state: 'normal', prev: 'normal',
      w, h, x: Math.round((W - w) / 2) + off, y: Math.max(8, Math.round((H - h) / 2) - 10) + off
    };
    const fixed = app.resizable === false;
    const el = document.createElement('div');
    el.className = 'vd-win opening';
    el.dataset.app = id;
    el.dataset.state = 'normal';
    if (fixed) el.dataset.fixed = '';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', app.title);
    el.innerHTML =
      '<div class="vd-title">' + app.icon + '<b></b><div class="vd-caps">' +
      '<button class="vd-cap min" type="button" aria-label="Minimizar"><svg width="12" height="10" viewBox="0 0 12 10" aria-hidden="true"><rect x="1" y="6" width="9" height="3" fill="#fff" stroke="#2a3b4b"/></svg></button>' +
      '<button class="vd-cap max" type="button" aria-label="Maximizar"><svg width="12" height="10" viewBox="0 0 12 10" aria-hidden="true"><rect x="1.5" y="1.5" width="9" height="7" fill="none" stroke="#2a3b4b" stroke-width="1.6"/><rect x="2" y="2" width="8" height="2" fill="#fff" opacity=".8"/></svg></button>' +
      '<button class="vd-cap x" type="button" aria-label="Fechar"><svg width="14" height="12" viewBox="0 0 14 12" aria-hidden="true"><path d="M2.5 1.5l9 9M11.5 1.5l-9 9" stroke="#3a0a02" stroke-width="3.6" stroke-linecap="round"/><path d="M2.5 1.5l9 9M11.5 1.5l-9 9" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg></button>' +
      '</div></div><div class="vd-client"></div>';
    el.querySelector('.vd-title b').textContent = app.title;
    rec.el = el;
    rec.title = el.querySelector('.vd-title');
    rec.client = el.querySelector('.vd-client');
    if (!fixed) {
      ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].forEach((edge) => {
        const hd = document.createElement('div');
        hd.className = 'vd-rs';
        hd.dataset.edge = edge;
        hd.addEventListener('pointerdown', (e) => this._resizeStart(rec, edge, e));
        el.appendChild(hd);
      });
    }
    this.wins.set(id, rec);
    this.stage.appendChild(el);
    this._apply(rec);
    // botões da janela
    el.querySelector('.vd-cap.min').addEventListener('click', () => this.minimize(id));
    el.querySelector('.vd-cap.max').addEventListener('click', () => this.toggleMaximize(id));
    el.querySelector('.vd-cap.x').addEventListener('click', () => this.close(id));
    rec.title.addEventListener('dblclick', (e) => { if (!e.target.closest('.vd-caps')) this.toggleMaximize(id); });
    rec.title.addEventListener('pointerdown', (e) => this._dragStart(rec, e));
    el.addEventListener('pointerdown', () => { if (this.activeId !== id) this.focus(id); }, true);
    // botão na barra de tarefas
    const tb = document.createElement('button');
    tb.type = 'button';
    tb.className = 'vd-tb';
    tb.dataset.app = id;
    tb.innerHTML = app.icon + '<span></span>';
    tb.querySelector('span').textContent = app.title;
    tb.setAttribute('aria-label', app.title);
    tb.addEventListener('click', () => this._taskbarClick(id));
    this.tbsEl.appendChild(tb);
    rec.tb = tb;
    // conteúdo do app
    try { rec.inst = app.render(rec.client, { id, el, close: () => this.close(id), setTitle: (t) => { rec.el.querySelector('.vd-title b').textContent = t; tb.querySelector('span').textContent = t; } }) || null; } catch (e) { rec.client.textContent = 'Erro ao abrir o programa.'; }
    this.timers.push(setTimeout(() => el.classList.remove('opening'), 260));
    if (this.mq.matches && !fixed) this._setState(rec, 'max');
    this._closePopups();
    this.focus(id);
  }

  _taskbarClick(id) {
    const rec = this.wins.get(id);
    if (!rec) return;
    this._closePopups();
    if (rec.state === 'min') { this.restore(id); return; }
    if (this.activeId === id) { this.minimize(id); return; }
    this.focus(id);
  }

  focus(id) {
    const rec = this.wins.get(id);
    if (!rec) return;
    if (rec.state === 'min') { this.restore(id); return; }
    rec.el.style.zIndex = String(++this.zTop);
    this.activeId = id;
    this.wins.forEach((r) => {
      const on = r.id === id;
      r.el.classList.toggle('active', on);
      r.tb.classList.toggle('active', on);
    });
  }

  _setState(rec, state) {
    rec.state = state;
    rec.el.dataset.state = state;
    rec.tb.classList.toggle('min', state === 'min');
    const mx = rec.el.querySelector('.vd-cap.max');
    if (mx) mx.setAttribute('aria-label', state === 'max' ? 'Restaurar' : 'Maximizar');
  }

  minimize(id) {
    const rec = this.wins.get(id);
    if (!rec || rec.state === 'min') return;
    const r = rec.el.getBoundingClientRect();
    const b = rec.tb.getBoundingClientRect();
    rec.el.style.setProperty('--tx', Math.round(b.left + b.width / 2 - (r.left + r.width * 0.05)) + 'px');
    rec.el.style.setProperty('--ty', Math.round(b.top + b.height / 2 - (r.top + r.height * 0.05)) + 'px');
    rec.prev = rec.state === 'max' ? 'max' : 'normal';
    this._setState(rec, 'min');
    rec.el.classList.remove('active');
    rec.tb.classList.remove('active');
    if (this.activeId === id) {
      this.activeId = null;
      let top = null;
      this.wins.forEach((x) => { if (x.state !== 'min' && (!top || Number(x.el.style.zIndex) > Number(top.el.style.zIndex))) top = x; });
      if (top) this.focus(top.id);
    }
  }

  restore(id) {
    const rec = this.wins.get(id);
    if (!rec) return;
    if (rec.state === 'min') {
      this._setState(rec, rec.prev || 'normal');
      this.focus(id);
    }
  }

  toggleMaximize(id) {
    const rec = this.wins.get(id);
    if (!rec || rec.app.resizable === false || rec.state === 'min' || this.mq.matches) return;
    this._setState(rec, rec.state === 'max' ? 'normal' : 'max');
    this.focus(id);
  }

  close(id) {
    const rec = this.wins.get(id);
    if (!rec) return;
    this.wins.delete(id);
    if (rec.inst && typeof rec.inst.destroy === 'function') { try { rec.inst.destroy(); } catch (e) { /* ignora */ } }
    rec.tb.remove();
    rec.el.classList.remove('opening');
    const gone = () => rec.el.remove();
    if (this.calm.matches) gone(); else { rec.el.classList.add('closing'); this.timers.push(setTimeout(gone, 180)); }
    if (this.activeId === id) {
      this.activeId = null;
      let top = null;
      this.wins.forEach((x) => { if (x.state !== 'min' && (!top || Number(x.el.style.zIndex) > Number(top.el.style.zIndex))) top = x; });
      if (top) this.focus(top.id);
    }
  }

  showDesktop() {
    this._closePopups();
    const visible = [];
    this.wins.forEach((r) => { if (r.state !== 'min') visible.push(r.id); });
    if (visible.length) {
      this.hiddenByShow = visible;
      visible.forEach((id) => this.minimize(id));
    } else if (this.hiddenByShow) {
      const ids = this.hiddenByShow;
      this.hiddenByShow = null;
      ids.forEach((id) => this.restore(id));
    }
  }

  /* ---------- geometria ---------- */
  _apply(rec) {
    const s = rec.el.style;
    s.left = rec.x + 'px';
    s.top = rec.y + 'px';
    s.width = rec.w + 'px';
    s.height = rec.h + 'px';
  }

  _clamp(rec) {
    const W = this.stage.clientWidth, H = this.stage.clientHeight;
    rec.w = Math.min(rec.w, W);
    rec.h = Math.min(rec.h, H);
    rec.x = Math.max(100 - rec.w, Math.min(rec.x, W - 100));
    rec.y = Math.max(0, Math.min(rec.y, H - 30));
  }

  _relayout() {
    this.wins.forEach((rec) => { this._clamp(rec); this._apply(rec); });
  }

  _dragStart(rec, e) {
    if (this.mq.matches || (e.button !== undefined && e.button > 0)) return;
    if (e.target.closest && e.target.closest('.vd-caps')) return;
    const stage = this.stage.getBoundingClientRect();
    if (rec.state === 'max') {
      const ratio = Math.max(0, Math.min(1, (e.clientX - stage.left) / stage.width));
      rec.x = Math.round(e.clientX - stage.left - rec.w * ratio);
      rec.y = Math.round(e.clientY - stage.top - 15);
      this._setState(rec, 'normal');
      this._clamp(rec);
      this._apply(rec);
    }
    const sx = e.clientX, sy = e.clientY, ox = rec.x, oy = rec.y, pid = e.pointerId;
    const t = e.currentTarget;
    try { t.setPointerCapture(pid); } catch (err) { /* sem captura */ }
    const move = (ev) => {
      if (ev.pointerId !== pid) return;
      rec.x = ox + ev.clientX - sx;
      rec.y = oy + ev.clientY - sy;
      this._clamp(rec);
      this._apply(rec);
    };
    const end = (ev) => {
      if (ev && ev.pointerId !== undefined && ev.pointerId !== pid) return;
      t.removeEventListener('pointermove', move);
      t.removeEventListener('pointerup', end);
      t.removeEventListener('pointercancel', end);
      t.removeEventListener('lostpointercapture', end);
    };
    t.addEventListener('pointermove', move);
    t.addEventListener('pointerup', end);
    t.addEventListener('pointercancel', end);
    t.addEventListener('lostpointercapture', end);
  }

  _resizeStart(rec, edge, e) {
    if (this.mq.matches || rec.state !== 'normal' || (e.button !== undefined && e.button > 0)) return;
    e.preventDefault();
    const app = rec.app, size = app.size || {};
    const minW = size.minW || 240, minH = size.minH || 160;
    const sx = e.clientX, sy = e.clientY, o = { x: rec.x, y: rec.y, w: rec.w, h: rec.h }, pid = e.pointerId;
    const t = e.currentTarget;
    try { t.setPointerCapture(pid); } catch (err) { /* sem captura */ }
    const move = (ev) => {
      if (ev.pointerId !== pid) return;
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      let { x, y, w, h } = o;
      if (edge.indexOf('e') >= 0) w = Math.max(minW, o.w + dx);
      if (edge.indexOf('s') >= 0) h = Math.max(minH, o.h + dy);
      if (edge.indexOf('w') >= 0) { w = Math.max(minW, o.w - dx); x = o.x + (o.w - w); }
      if (edge.indexOf('n') >= 0) { h = Math.max(minH, o.h - dy); y = o.y + (o.h - h); }
      rec.x = x; rec.y = y; rec.w = w; rec.h = h;
      this._clamp(rec);
      this._apply(rec);
    };
    const end = (ev) => {
      if (ev && ev.pointerId !== undefined && ev.pointerId !== pid) return;
      t.removeEventListener('pointermove', move);
      t.removeEventListener('pointerup', end);
      t.removeEventListener('pointercancel', end);
      t.removeEventListener('lostpointercapture', end);
    };
    t.addEventListener('pointermove', move);
    t.addEventListener('pointerup', end);
    t.addEventListener('pointercancel', end);
    t.addEventListener('lostpointercapture', end);
  }

  /* ---------- popups ---------- */
  _popupOpen() {
    if (!this.startEl.hidden) return true;
    for (const k in this.panels) { if (!this.panels[k].hidden) return true; }
    return false;
  }

  _closePopups() {
    this.startEl.hidden = true;
    this.orb.classList.remove('on');
    this.orb.setAttribute('aria-expanded', 'false');
    for (const k in this.panels) this.panels[k].hidden = true;
    this.root.querySelectorAll('.vd-tray-btn[data-panel]').forEach((b) => { b.classList.remove('on'); b.setAttribute('aria-expanded', 'false'); });
  }

  toggleStart(force) {
    const open = force === undefined ? this.startEl.hidden : !!force;
    this._closePopups();
    if (open) {
      this.startEl.hidden = false;
      this.orb.classList.add('on');
      this.orb.setAttribute('aria-expanded', 'true');
    }
  }

  togglePanel(name, force) {
    const p = this.panels[name];
    if (!p) return;
    const open = force === undefined ? p.hidden : !!force;
    this._closePopups();
    if (open) {
      if (name === 'clock') this._renderCal();
      p.hidden = false;
      const b = this.root.querySelector('.vd-tray-btn[data-panel="' + name + '"]');
      if (b) { b.classList.add('on'); b.setAttribute('aria-expanded', 'true'); }
    }
  }

  /* ---------- relógio ---------- */
  _now() {
    const d = new Date();
    let h = d.getHours(), m = d.getMinutes(), s = d.getSeconds(), day = d.getDate(), mo = d.getMonth() + 1, y = d.getFullYear();
    if (this.tf) {
      try {
        const parts = this.tf.formatToParts(d);
        const get = (t) => Number((parts.find((p) => p.type === t) || {}).value || 0);
        h = get('hour') % 24; m = get('minute'); s = get('second'); day = get('day'); mo = get('month'); y = get('year');
      } catch (e) { /* usa hora local */ }
    }
    return { h, m, s, day, mo, y };
  }

  _tick() {
    const n = this._now();
    const pad = (v) => String(v).padStart(2, '0');
    this.timeEl.textContent = pad(n.h) + ':' + pad(n.m);
    this.dateEl.textContent = pad(n.day) + '/' + pad(n.mo) + '/' + n.y;
    this.hands.h.setAttribute('transform', 'rotate(' + ((n.h % 12) * 30 + n.m * 0.5) + ' 60 60)');
    this.hands.m.setAttribute('transform', 'rotate(' + (n.m * 6 + n.s * 0.1) + ' 60 60)');
    this.hands.s.setAttribute('transform', 'rotate(' + (n.s * 6) + ' 60 60)');
    this.today = n;
    if (!this.panels.clock.hidden && this._calKey !== n.y + '-' + n.mo + '-' + n.day) this._renderCal();
  }

  _renderCal() {
    const n = this.today || this._now();
    this._calKey = n.y + '-' + n.mo + '-' + n.day;
    const first = new Date(n.y, n.mo - 1, 1).getDay();
    const days = new Date(n.y, n.mo, 0).getDate();
    let month = '';
    try { month = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date(n.y, n.mo - 1, 1)); } catch (e) { month = n.mo + '/' + n.y; }
    let html = '<div class="vd-cal-head">' + month + '</div><div class="vd-cal-grid">';
    ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].forEach((d) => { html += '<b>' + d + '</b>'; });
    for (let i = 0; i < first; i++) html += '<span class="out"></span>';
    for (let d = 1; d <= days; d++) html += '<span class="' + (d === n.day ? 'today' : '') + '">' + d + '</span>';
    this.calEl.innerHTML = html + '</div>';
  }

  /* ---------- ciclo de vida ---------- */
  destroy() {
    this.timers.forEach((t) => { clearInterval(t); clearTimeout(t); });
    this.timers = [];
    this.cleanup.forEach((fn) => fn());
    this.cleanup = [];
    this.wins.forEach((rec) => { if (rec.inst && typeof rec.inst.destroy === 'function') { try { rec.inst.destroy(); } catch (e) { /* ignora */ } } });
    this.wins.clear();
    this.root.innerHTML = '';
    this.root.classList.remove('vd');
  }
}
