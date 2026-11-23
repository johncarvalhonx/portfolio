/* ===== App "Chess Titans" (xadrez 3D no estilo do Vista) =====
   3D com three.js (assets/vendor/three.min.js, carregado só quando o jogo abre). Regras/IA em src/apps/xadrez-motor.js. */

/* ícone: rei de vidro azulado (sem gradientes com id, pois aparece várias vezes na página) */
const VD_ICON_CHESS = '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
  '<ellipse cx="24" cy="43" rx="14" ry="3.2" fill="#0d2440" opacity=".35"/>' +
  '<path d="M22.6 4h2.8v3.4h3.2v2.6h-3.2v3.2h-2.8V10h-3.2V7.4h3.2z" fill="#8fc4f2" stroke="#1c4f86" stroke-width=".9"/>' +
  '<path d="M17 21c-1.2-4.4 2.2-8 7-8s8.2 3.6 7 8l-2 3H19z" fill="#9fd0f7" stroke="#1c4f86" stroke-width="1"/>' +
  '<path d="M18.5 24h11l-1.5 11h-8z" fill="#7fb8ec" stroke="#1c4f86" stroke-width="1"/>' +
  '<path d="M15 35h18l2.5 4.5h-23z" fill="#6aa8e2" stroke="#1c4f86" stroke-width="1"/>' +
  '<path d="M12 39.5h24v3H12z" fill="#5a98d6" stroke="#1c4f86" stroke-width="1"/>' +
  '<path d="M19.6 15.4c2.4-1.6 5.6-1.6 7.6.4-2.4-.6-5.2-.6-7.6-.4zM20.4 25.5h2.2l-.9 8.8h-1.2z" fill="#fff" opacity=".75"/></svg>';

/* carrega um script uma única vez (ex.: a three.js) */
const vdScriptCache = {};
function vdLoadScript(src) {
  if (!vdScriptCache[src]) {
    vdScriptCache[src] = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => { delete vdScriptCache[src]; reject(new Error('falha ao carregar ' + src)); };
      document.head.appendChild(s);
    });
  }
  return vdScriptCache[src];
}

const VD_CHESS_NAMES = { P: 'Peão', N: 'Cavalo', B: 'Bispo', R: 'Torre', Q: 'Dama', K: 'Rei' };

const VD_XADREZ_APP = {
  id: 'xadrez',
  title: 'Chess Titans',
  icon: VD_ICON_CHESS,
  size: { w: 780, h: 640, minW: 480, minH: 420 },
  resizable: true,
  render(body, win) {
    const E = vdChessEngine();
    const opt = { mode: 'cpu', human: 'w', level: 3, showMoves: true };
    try { const s = JSON.parse(localStorage.getItem('vd-xadrez-opcoes') || 'null'); if (s) Object.assign(opt, s); } catch (e) { /* sem armazenamento */ }
    const saveOpt = () => { try { localStorage.setItem('vd-xadrez-opcoes', JSON.stringify(opt)); } catch (e) { /* sem armazenamento */ } };

    const root = document.createElement('div');
    root.className = 'ct';
    const menu = vdMenuBar([
      { label: 'Jogo', items: [
        { label: 'Novo jogo', shortcut: 'F2', action: () => newGame() },
        { label: 'Desfazer', shortcut: 'Ctrl+Z', action: () => undo(), disabled: () => !E.historyLength() },
        'sep',
        { label: 'Opções...', action: () => options() },
        'sep',
        { label: 'Sair', action: () => win.close() }
      ] },
      { label: 'Ajuda', items: [{ label: 'Como jogar', action: () => help() }] }
    ]);
    root.appendChild(menu);
    const view = document.createElement('div');
    view.className = 'ct-view';
    view.innerHTML = '<div class="ct-status" aria-live="polite"></div><div class="ct-msg">Carregando o tabuleiro 3D...</div>';
    root.appendChild(view);
    body.appendChild(root);
    const statusEl = view.querySelector('.ct-status');
    const msgEl = view.querySelector('.ct-msg');

    const st = { busy: false, over: false, sel: -1, targets: [], reqId: 0, three: null, dlg: null };
    let destroyed = false;
    const timers = [];

    // ---- IA num Web Worker (não trava a página); se não der, roda no próprio fluxo ----
    let worker = null;
    try {
      const code = vdChessEngine.toString() + '\nvar E = vdChessEngine();\nonmessage = function (e) { E.setState(e.data.state); postMessage({ id: e.data.id, move: E.search(e.data.level) }); };';
      worker = new Worker(URL.createObjectURL(new Blob([code], { type: 'text/javascript' })));
    } catch (e) { worker = null; }
    function askEngine(cb) {
      const id = ++st.reqId;
      const state = E.getState();
      const t0 = Date.now();
      const deliver = (mv) => {
        if (destroyed || id !== st.reqId) return;
        const wait = Math.max(0, 450 - (Date.now() - t0));
        timers.push(setTimeout(() => { if (!destroyed && id === st.reqId) cb(mv); }, wait));
      };
      if (worker) {
        worker.onmessage = (e) => { if (e.data.id === id) deliver(e.data.move); };
        worker.postMessage({ id, state, level: opt.level });
      } else {
        timers.push(setTimeout(() => { const T = vdChessEngine(); T.setState(state); deliver(T.search(opt.level)); }, 30));
      }
    }

    // ---- status e fim de jogo ----
    function paintStatus() {
      const s = E.status();
      let txt;
      if (st.busy && opt.mode === 'cpu' && s.turn !== opt.human) txt = 'O computador está pensando...';
      else if (opt.mode === 'cpu') txt = s.turn === opt.human ? 'Sua vez' : 'Vez do computador';
      else txt = s.turn === 'w' ? 'Vez das brancas' : 'Vez das pretas';
      if (s.check && s.state === 'play') txt += ' — Xeque!';
      statusEl.textContent = txt;
      statusEl.classList.toggle('check', s.check);
    }

    function endIfOver() {
      const s = E.status();
      if (s.state === 'play') return false;
      st.over = true;
      const draws = { stalemate: 'Empate por afogamento.', fifty: 'Empate pela regra dos 50 lances.', repetition: 'Empate por repetição de posição.', material: 'Empate: não há material para dar mate.' };
      let heading, icon = 'info';
      if (s.state === 'mate') {
        const winner = s.turn === 'w' ? 'b' : 'w';
        if (opt.mode === 'cpu') { heading = winner === opt.human ? 'Xeque-mate! Parabéns, você venceu!' : 'Xeque-mate. O computador venceu.'; icon = winner === opt.human ? 'win' : 'lose'; }
        else { heading = 'Xeque-mate! As ' + (winner === 'w' ? 'brancas' : 'pretas') + ' venceram.'; icon = 'win'; }
      } else heading = draws[s.state];
      statusEl.textContent = s.state === 'mate' ? 'Xeque-mate' : 'Empate';
      st.dlg = vdDialog(root, {
        title: 'Fim de jogo', icon, heading,
        text: 'Lances jogados: ' + Math.ceil(E.historyLength() / 2) + (opt.mode === 'cpu' ? '\nDificuldade: ' + opt.level : ''),
        buttons: [{ label: 'Sair', action: () => win.close() }, { label: 'Jogar novamente', primary: true, action: () => newGame() }]
      });
      return true;
    }

    function help() {
      vdDialog(root, {
        title: 'Como jogar', icon: 'info', heading: 'Dê xeque-mate no rei adversário.',
        text: 'Clique numa peça para ver os lances possíveis e clique na casa de destino.\nArraste o fundo para girar o tabuleiro; use a roda do mouse para aproximar.\nEm Opções você escolhe o adversário, a cor e a dificuldade (1 a 10).\nCtrl+Z desfaz; F2 começa um jogo novo.',
        buttons: [{ label: 'OK', primary: true }]
      });
    }

    // ---- fluxo do jogo ----
    function newGame() {
      if (st.dlg) { st.dlg.close(); st.dlg = null; }
      st.reqId++;
      st.busy = false; st.over = false; st.sel = -1; st.targets = [];
      E.reset();
      if (st.three) { st.three.rebuild(); st.three.faceSide(opt.mode === 'cpu' ? opt.human : 'w', true); }
      paintStatus();
      maybeCpu();
    }

    function undo() {
      if (!E.historyLength()) return;
      if (st.dlg) { st.dlg.close(); st.dlg = null; }
      st.reqId++;
      st.busy = false; st.over = false; st.sel = -1; st.targets = [];
      E.undo();
      if (opt.mode === 'cpu' && E.turn() !== opt.human && E.historyLength()) E.undo();
      if (st.three) st.three.rebuild();
      paintStatus();
      maybeCpu();
    }

    function maybeCpu() {
      if (opt.mode !== 'cpu' || st.over || E.turn() === opt.human || !st.three) return;
      st.busy = true;
      paintStatus();
      askEngine((mv) => { st.busy = false; if (mv) play(mv); });
    }

    function play(mv) {
      const m = E.move(mv);
      if (!m) return;
      st.sel = -1; st.targets = [];
      st.busy = true;
      paintStatus();
      st.three.animateMove(m).then(() => {
        if (destroyed) return;
        st.busy = false;
        st.three.marks();
        paintStatus();
        if (endIfOver()) return;
        if (opt.mode === '2p') st.three.faceSide(E.turn(), false);
        maybeCpu();
      });
    }

    function clickSquare(sq) {
      if (st.busy || st.over || sq < 0) return;
      if (opt.mode === 'cpu' && E.turn() !== opt.human) return;
      const board = E.board();
      if (st.sel >= 0 && st.targets.some((m) => m.to === sq)) {
        const cand = st.targets.filter((m) => m.to === sq);
        if (cand[0].promo) choosePromotion((p) => play({ from: st.sel, to: sq, promo: p }));
        else play({ from: st.sel, to: sq });
        return;
      }
      const p = board[sq];
      const mine = p && ((p === p.toUpperCase()) === (E.turn() === 'w'));
      if (mine && st.sel !== sq) {
        st.sel = sq;
        st.targets = E.legal().filter((m) => m.from === sq);
      } else { st.sel = -1; st.targets = []; }
      st.three.marks();
    }

    function choosePromotion(cb) {
      const ov = document.createElement('div');
      ov.className = 'vd-dlg-ov';
      ov.innerHTML = '<div class="vd-dlg" role="dialog" aria-label="Promoção"><div class="vd-dlg-title">Promoção</div><div class="vd-dlg-body"><div class="vd-dlg-txt"><b>Escolha a peça para o peão</b></div></div><div class="vd-dlg-foot"></div></div>';
      const foot = ov.querySelector('.vd-dlg-foot');
      ['Q', 'R', 'B', 'N'].forEach((k) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'vd-btn' + (k === 'Q' ? ' primary' : '');
        btn.textContent = VD_CHESS_NAMES[k];
        btn.addEventListener('click', () => { ov.remove(); cb(k); });
        foot.appendChild(btn);
      });
      root.appendChild(ov);
    }

    function options() {
      const ov = document.createElement('div');
      ov.className = 'vd-dlg-ov';
      ov.innerHTML = '<div class="vd-dlg ct-opt" role="dialog" aria-label="Opções"><div class="vd-dlg-title">Opções</div><div class="vd-dlg-body"><div class="vd-dlg-txt">' +
        '<fieldset><legend>Adversário</legend><label><input type="radio" name="ct-mode" value="cpu"> Computador</label><label><input type="radio" name="ct-mode" value="2p"> Outra pessoa</label></fieldset>' +
        '<fieldset class="ct-cpu"><legend>Contra o computador</legend><label>Jogar com <select name="ct-side"><option value="w">Brancas</option><option value="b">Pretas</option></select></label>' +
        '<label class="ct-lvl">Dificuldade <input type="range" name="ct-level" min="1" max="10" step="1"> <output></output></label></fieldset>' +
        '<label><input type="checkbox" name="ct-show"> Mostrar lances válidos</label>' +
        '<p class="ct-note">Mudar o adversário ou a cor começa um jogo novo.</p></div></div><div class="vd-dlg-foot"></div></div>';
      const q = (sel) => ov.querySelector(sel);
      ov.querySelectorAll('input[name="ct-mode"]').forEach((r) => { r.checked = r.value === opt.mode; });
      q('select[name="ct-side"]').value = opt.human;
      q('input[name="ct-level"]').value = String(opt.level);
      q('output').textContent = String(opt.level);
      q('input[name="ct-show"]').checked = opt.showMoves;
      q('input[name="ct-level"]').addEventListener('input', (e) => { q('output').textContent = e.target.value; });
      const sync = () => { q('.ct-cpu').disabled = q('input[name="ct-mode"]:checked').value !== 'cpu'; };
      ov.querySelectorAll('input[name="ct-mode"]').forEach((r) => r.addEventListener('change', sync));
      sync();
      const foot = q('.vd-dlg-foot');
      const mk = (label, primary, fn) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'vd-btn' + (primary ? ' primary' : ''); b.textContent = label; b.addEventListener('click', fn); foot.appendChild(b); };
      mk('Cancelar', false, () => ov.remove());
      mk('OK', true, () => {
        const mode = q('input[name="ct-mode"]:checked').value, human = q('select[name="ct-side"]').value;
        const restart = mode !== opt.mode || (mode === 'cpu' && human !== opt.human);
        opt.mode = mode; opt.human = human;
        opt.level = Number(q('input[name="ct-level"]').value);
        opt.showMoves = q('input[name="ct-show"]').checked;
        saveOpt();
        ov.remove();
        if (restart) newGame(); else if (st.three) { st.three.marks(); paintStatus(); }
      });
      root.appendChild(ov);
    }

    // ---- teclado ----
    const onKey = (e) => {
      if (!win.isActive()) return;
      if (e.key === 'F2') { e.preventDefault(); newGame(); }
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); undo(); }
    };
    document.addEventListener('keydown', onKey);

    // ---- cena 3D ----
    function hasWebGL() {
      try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; }
    }
    if (!hasWebGL()) msgEl.textContent = 'Este navegador não consegue mostrar gráficos 3D (WebGL).';
    else {
      vdLoadScript('assets/vendor/three.min.js').then(() => {
        if (destroyed) return;
        try { st.three = vdChessScene(view, E, st, opt, win, clickSquare); } catch (e) { msgEl.textContent = 'Não foi possível iniciar o 3D.'; return; }
        msgEl.remove();
        st.three.faceSide(opt.mode === 'cpu' ? opt.human : 'w', true);
        paintStatus();
        maybeCpu();
      }).catch(() => { if (!destroyed) msgEl.textContent = 'Não foi possível carregar o tabuleiro 3D.'; });
    }
    paintStatus();

    win.el._game = { E, opt, st, play, newGame, undo, clickSquare };
    return {
      destroy() {
        destroyed = true;
        st.reqId++;
        timers.forEach((t) => clearTimeout(t));
        document.removeEventListener('keydown', onKey);
        if (worker) worker.terminate();
        if (st.three) st.three.dispose();
        if (menu.closeMenus) menu.closeMenus();
      }
    };
  }
};

/* Monta a cena three.js: tabuleiro de vidro, peças torneadas, câmera giratória, marcas e animações. */
function vdChessScene(view, E, st, opt, win, onSquare) {
  const T = window.THREE;
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.domElement.className = 'ct-canvas';
  view.insertBefore(renderer.domElement, view.firstChild);

  const scene = new T.Scene();
  const disposables = [];
  const keep = (x) => { disposables.push(x); return x; };

  // ambiente para reflexos do vidro: céu azul, faixa clara no horizonte e "janelas" de estúdio
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 512; envCanvas.height = 256;
  const g = envCanvas.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#16294d'); grad.addColorStop(0.4, '#3d63a0'); grad.addColorStop(0.49, '#b9d3f5'); grad.addColorStop(0.53, '#2a4470'); grad.addColorStop(1, '#040912');
  g.fillStyle = grad; g.fillRect(0, 0, 512, 256);
  g.fillStyle = 'rgba(255,255,255,0.95)';
  [[52, 46, 54, 26], [228, 38, 70, 22], [392, 52, 48, 28]].forEach(([x, y, w, h]) => g.fillRect(x, y, w, h));
  const envTex = keep(new T.CanvasTexture(envCanvas));
  envTex.mapping = T.EquirectangularReflectionMapping;
  envTex.encoding = T.sRGBEncoding;
  const pmrem = new T.PMREMGenerator(renderer);
  const envRT = keep(pmrem.fromEquirectangular(envTex));
  scene.environment = envRT.texture;
  pmrem.dispose();

  const camera = new T.PerspectiveCamera(36, 1, 0.1, 100);
  scene.add(new T.HemisphereLight(0xe2efff, 0x1a2a44, 0.55));
  const sun = new T.DirectionalLight(0xffffff, 1.25);
  sun.position.set(4, 12, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 30 });
  sun.shadow.bias = -0.0008;
  scene.add(sun);
  const rim = new T.DirectionalLight(0x9cc8ff, 0.45);
  rim.position.set(-6, 5, -8);
  scene.add(rim);

  // ---- tabuleiro ----
  const boardGroup = new T.Group();
  scene.add(boardGroup);
  const baseMat = keep(new T.MeshPhysicalMaterial({ color: 0x0b1a33, metalness: 0.35, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.2 }));
  const base = new T.Mesh(keep(new T.BoxGeometry(9.3, 0.38, 9.3)), baseMat);
  base.position.y = -0.22;
  base.receiveShadow = true;
  boardGroup.add(base);
  const frameMat = keep(new T.MeshPhysicalMaterial({ color: 0x6c94c4, metalness: 0.5, roughness: 0.2, clearcoat: 1, transparent: true, opacity: 0.55, envMapIntensity: 1.5 }));
  const frameMesh = new T.Mesh(keep(new T.BoxGeometry(8.5, 0.06, 8.5)), frameMat);
  frameMesh.position.y = -0.01;
  boardGroup.add(frameMesh);
  const lightMat = keep(new T.MeshPhysicalMaterial({ color: 0x9ec0e4, metalness: 0.05, roughness: 0.1, clearcoat: 0.7, clearcoatRoughness: 0.06, transparent: true, opacity: 0.72, envMapIntensity: 0.8 }));
  const darkMat = keep(new T.MeshPhysicalMaterial({ color: 0x0c2547, metalness: 0.15, roughness: 0.1, clearcoat: 0.7, clearcoatRoughness: 0.06, transparent: true, opacity: 0.9, envMapIntensity: 0.8 }));
  const sqGeo = keep(new T.BoxGeometry(1, 0.06, 1));
  const squares = [];
  const pos = (sq) => new T.Vector3((sq & 7) - 3.5, 0.03, 3.5 - (sq >> 3));
  for (let sq = 0; sq < 64; sq++) {
    const light = ((sq & 7) + (sq >> 3)) % 2 === 1;
    const m = new T.Mesh(sqGeo, light ? lightMat : darkMat);
    const p = pos(sq);
    m.position.set(p.x, 0.0, p.z);
    m.receiveShadow = true;
    m.userData.sq = sq;
    boardGroup.add(m);
    squares.push(m);
  }

  // marcas: casa selecionada, último lance, xeque, destinos possíveis
  const planeGeo = keep(new T.PlaneGeometry(0.96, 0.96));
  const dotGeo = keep(new T.CircleGeometry(0.16, 32));
  const ringGeo = keep(new T.RingGeometry(0.36, 0.46, 40));
  const overlays = [], dots = [], rings = [];
  for (let sq = 0; sq < 64; sq++) {
    const p = pos(sq);
    const mk = (geo, y) => {
      const mat = keep(new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, depthWrite: false, blending: T.AdditiveBlending }));
      const m = new T.Mesh(geo, mat);
      m.rotation.x = -Math.PI / 2;
      m.position.set(p.x, y, p.z);
      m.visible = false;
      m.renderOrder = 2;
      boardGroup.add(m);
      return m;
    };
    overlays.push(mk(planeGeo, 0.065));
    dots.push(mk(dotGeo, 0.07));
    rings.push(mk(ringGeo, 0.07));
  }

  // ---- peças (perfis torneados) ----
  const V = (r, y) => new T.Vector2(r, y);
  const base0 = (k) => [V(0, 0), V(0.37 * k, 0), V(0.37 * k, 0.05), V(0.34 * k, 0.09), V(0.29 * k, 0.11), V(0.29 * k, 0.14), V(0.23 * k, 0.17)];
  const lathe = (pts) => keep(new T.LatheGeometry(pts, 40));
  const geos = {
    P: [lathe(base0(0.86).concat([V(0.17, 0.22), V(0.12, 0.34), V(0.105, 0.42), V(0.17, 0.45), V(0.17, 0.48), V(0.105, 0.5), V(0.13, 0.53), V(0.15, 0.585), V(0.145, 0.635), V(0.12, 0.68), V(0.07, 0.715), V(0, 0.73)]))],
    R: [lathe(base0(1).concat([V(0.23, 0.21), V(0.2, 0.3), V(0.19, 0.55), V(0.24, 0.58), V(0.265, 0.61), V(0.265, 0.72), V(0.19, 0.72), V(0.19, 0.69), V(0, 0.69)]))],
    N: [lathe(base0(1).concat([V(0.22, 0.21), V(0.2, 0.26), V(0, 0.26)]))],
    B: [lathe(base0(0.95).concat([V(0.2, 0.22), V(0.13, 0.4), V(0.11, 0.52), V(0.19, 0.55), V(0.19, 0.58), V(0.11, 0.6), V(0.15, 0.66), V(0.18, 0.74), V(0.165, 0.82), V(0.11, 0.9), V(0.045, 0.94), V(0.065, 0.965), V(0.06, 1.0), V(0, 1.02)]))],
    Q: [lathe(base0(1.03).concat([V(0.22, 0.22), V(0.15, 0.42), V(0.13, 0.62), V(0.21, 0.66), V(0.21, 0.69), V(0.13, 0.71), V(0.16, 0.8), V(0.245, 0.94), V(0.18, 0.96), V(0.12, 0.985), V(0.06, 1.02), V(0, 1.03)]))],
    K: [lathe(base0(1.05).concat([V(0.23, 0.22), V(0.16, 0.44), V(0.14, 0.68), V(0.22, 0.72), V(0.22, 0.75), V(0.14, 0.77), V(0.17, 0.86), V(0.21, 0.98), V(0.15, 1.02), V(0.08, 1.05), V(0, 1.06)]))]
  };
  // torre: ameias
  const merlon = keep(new T.BoxGeometry(0.11, 0.08, 0.1));
  // dama: coroa de pérolas
  const pearl = keep(new T.SphereGeometry(0.045, 16, 12));
  const topBall = keep(new T.SphereGeometry(0.065, 20, 14));
  // rei: cruz
  const crossV = keep(new T.BoxGeometry(0.065, 0.26, 0.065));
  const crossH = keep(new T.BoxGeometry(0.2, 0.065, 0.065));
  // cavalo: cabeça extrudada a partir de um perfil de lado (focinho para +x)
  const hs = new T.Shape();
  hs.moveTo(-0.2, 0.24); hs.lineTo(0.2, 0.24);
  hs.quadraticCurveTo(0.16, 0.42, 0.06, 0.52);
  hs.quadraticCurveTo(0.2, 0.55, 0.3, 0.61);
  hs.quadraticCurveTo(0.37, 0.68, 0.3, 0.76);
  hs.quadraticCurveTo(0.18, 0.84, 0.08, 0.86);
  hs.lineTo(0.06, 0.96); hs.lineTo(-0.02, 0.86);
  hs.quadraticCurveTo(-0.2, 0.8, -0.24, 0.6);
  hs.quadraticCurveTo(-0.27, 0.4, -0.2, 0.24);
  const headGeo = keep(new T.ExtrudeGeometry(hs, { depth: 0.18, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 3, curveSegments: 12 }));
  headGeo.translate(0, 0, -0.09);
  const eyeGeo = keep(new T.SphereGeometry(0.022, 10, 8));

  const whiteMat = keep(new T.MeshPhysicalMaterial({ color: 0xdfeaf7, metalness: 0, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05, transparent: true, opacity: 0.92, envMapIntensity: 1.0 }));
  const blackMat = keep(new T.MeshPhysicalMaterial({ color: 0x060a12, metalness: 0.35, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.3 }));
  const eyeMat = keep(new T.MeshBasicMaterial({ color: 0x0a0f18 }));

  // cavalos olham para o adversário, virados de três quartos para o centro (o perfil aparece na visão do jogador)
  function knightYaw(white, file) {
    const side = file < 4 ? 0.75 : Math.PI - 0.75;
    return white ? side : -side;
  }
  function makePiece(p) {
    const t = p.toUpperCase();
    const white = p === t;
    const mat = white ? whiteMat : blackMat;
    const grp = new T.Group();
    const add = (geo, x, y, z, m) => { const mesh = new T.Mesh(geo, m || mat); mesh.position.set(x || 0, y || 0, z || 0); mesh.castShadow = true; grp.add(mesh); return mesh; };
    geos[t].forEach((geo) => add(geo));
    if (t === 'R') for (let k = 0; k < 4; k++) { const a = Math.PI / 4 + k * Math.PI / 2; const mm = add(merlon, Math.cos(a) * 0.225, 0.73, Math.sin(a) * 0.225); mm.rotation.y = -a; }
    if (t === 'Q') { for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; add(pearl, Math.cos(a) * 0.225, 0.965, Math.sin(a) * 0.225); } add(topBall, 0, 1.08, 0); }
    if (t === 'K') { add(crossV, 0, 1.18, 0); add(crossH, 0, 1.21, 0); }
    if (t === 'N') { add(headGeo); add(eyeGeo, 0.17, 0.74, 0.115, eyeMat); add(eyeGeo, 0.17, 0.74, -0.115, eyeMat); }
    grp.userData.piece = p;
    return grp;
  }

  const piecesGroup = new T.Group();
  scene.add(piecesGroup);
  let at = new Array(64).fill(null);
  function rebuild() {
    tweens.length = 0;
    piecesGroup.children.slice().forEach((c) => piecesGroup.remove(c));
    at = new Array(64).fill(null);
    E.board().forEach((p, sq) => {
      if (!p) return;
      const grp = makePiece(p);
      grp.position.copy(pos(sq));
      grp.userData.sq = sq;
      if (p.toUpperCase() === 'N') grp.rotation.y = knightYaw(p === 'N', sq & 7);
      piecesGroup.add(grp);
      at[sq] = grp;
    });
    marks();
  }

  function marks() {
    for (let i = 0; i < 64; i++) { overlays[i].visible = false; dots[i].visible = false; rings[i].visible = false; }
    const paint = (sq, color, op) => { overlays[sq].visible = true; overlays[sq].material.color.set(color); overlays[sq].material.opacity = op; };
    const last = E.lastMove();
    if (last) { paint(last.from, 0x6fcf6a, 0.22); paint(last.to, 0x6fcf6a, 0.3); }
    if (E.inCheck()) paint(E.kingSq(), 0xff3a2a, 0.55);
    if (st.sel >= 0) {
      paint(st.sel, 0xffd04a, 0.42);
      if (opt.showMoves) st.targets.forEach((m) => {
        const target = m.captured ? rings[m.to] : dots[m.to];
        target.visible = true;
        target.material.color.set(m.captured ? 0xff9a4a : 0x5fd2ff);
        target.material.opacity = 0.85;
      });
    }
    piecesGroup.children.forEach((g2) => { g2.position.y = g2.userData.sq === st.sel ? 0.16 : 0.03; });
    ask();
  }

  // ---- câmera giratória ----
  const cam = { theta: 0, phi: 0.98, r: 13.2, goal: null };
  function placeCamera() {
    const c = Math.cos(cam.phi);
    camera.position.set(cam.r * c * Math.sin(cam.theta), cam.r * Math.sin(cam.phi), cam.r * c * Math.cos(cam.theta));
    camera.lookAt(0, -0.4, 0);
  }
  function faceSide(side, instant) {
    const target = side === 'w' ? 0 : Math.PI;
    let d = ((target - cam.theta) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
    if (instant || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { cam.theta += d; placeCamera(); ask(); return; }
    cam.goal = { from: cam.theta, to: cam.theta + d, t0: performance.now(), dur: 900 };
    ask();
  }

  // ---- animações ----
  const tweens = [];
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  function tween(obj, to, dur, arc, done) {
    tweens.push({ obj, from: obj.position.clone(), to, t0: performance.now(), dur, arc: arc || 0, done });
    ask();
  }
  function shrink(obj) {
    const t0 = performance.now();
    tweens.push({ obj, shrink: true, t0, dur: 300, done: () => piecesGroup.remove(obj) });
  }
  function animateMove(m) {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return new Promise((resolve) => {
      const g2 = at[m.from];
      const capSq = m.flag === 'e' ? m.to + (m.piece === 'P' ? -8 : 8) : m.to;
      const victim = m.captured ? at[capSq] : null;
      if (!g2 || calm) { rebuild(); resolve(); return; }
      at[m.from] = null;
      if (victim) { at[capSq] = null; shrink(victim); }
      const dest = pos(m.to);
      const knight = m.piece.toUpperCase() === 'N';
      let pending = 1;
      const finish = () => { if (--pending) return; rebuild(); resolve(); };
      tween(g2, dest, knight ? 520 : 420, knight ? 0.7 : 0, finish);
      if (m.flag === 'k' || m.flag === 'q') {
        const rf = m.flag === 'k' ? m.to + 1 : m.to - 2, rt = m.flag === 'k' ? m.to - 1 : m.to + 1;
        const rook = at[rf];
        if (rook) { pending++; at[rf] = null; tween(rook, pos(rt), 420, 0, finish); }
      }
    });
  }

  // ---- laço de desenho sob demanda ----
  let raf = 0, alive = true;
  function ask() { if (!raf && alive) raf = requestAnimationFrame(frame); }
  function frame(now) {
    raf = 0;
    if (!alive) return;
    let moving = false;
    if (cam.goal) {
      const k = Math.min(1, (now - cam.goal.t0) / cam.goal.dur);
      cam.theta = cam.goal.from + (cam.goal.to - cam.goal.from) * ease(k);
      if (k >= 1) cam.goal = null; else moving = true;
    }
    placeCamera();
    for (let i = tweens.length - 1; i >= 0; i--) {
      const tw = tweens[i];
      const k = Math.min(1, (now - tw.t0) / tw.dur);
      if (tw.shrink) {
        const s = 1 - ease(k) * 0.99;
        tw.obj.scale.set(s, s, s);
        tw.obj.position.y = 0.03 - 0.3 * ease(k);
      } else {
        const e2 = ease(k);
        tw.obj.position.lerpVectors(tw.from, tw.to, e2);
        tw.obj.position.y = 0.03 + Math.sin(Math.PI * e2) * (tw.arc || 0.12);
      }
      if (k >= 1) { tweens.splice(i, 1); if (tw.done) tw.done(); } else moving = true;
    }
    if (!win.isMinimized()) renderer.render(scene, camera);
    if (moving || tweens.length) ask();
  }

  // ---- tamanho ----
  function resize() {
    const w = view.clientWidth, h = view.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // em janelas estreitas, afasta a câmera para caber o tabuleiro
    camera.fov = w / h < 1.05 ? 44 : 36;
    camera.updateProjectionMatrix();
    ask();
  }
  const ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(view);
  resize();

  // ---- ponteiro: clique escolhe casas; arrastar gira; roda aproxima ----
  const ray = new T.Raycaster();
  const ndc = new T.Vector2();
  function pick(e) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hitP = ray.intersectObjects(piecesGroup.children, true)[0];
    if (hitP) { let o = hitP.object; while (o && o.userData.sq === undefined) o = o.parent; if (o) return o.userData.sq; }
    const hitS = ray.intersectObjects(squares, false)[0];
    return hitS ? hitS.object.userData.sq : -1;
  }
  let drag = null;
  const cv = renderer.domElement;
  cv.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button > 0 && e.button !== 2) return;
    drag = { x: e.clientX, y: e.clientY, theta: cam.theta, phi: cam.phi, moved: false, id: e.pointerId, right: e.button === 2 };
    try { cv.setPointerCapture(e.pointerId); } catch (err) { /* sem captura */ }
  });
  cv.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 6) return;
    drag.moved = true;
    cam.goal = null;
    cam.theta = drag.theta - dx * 0.008;
    cam.phi = Math.max(0.42, Math.min(1.45, drag.phi + dy * 0.006));
    ask();
  });
  const up = (e) => {
    if (!drag || (e.pointerId !== undefined && e.pointerId !== drag.id)) return;
    const d = drag;
    drag = null;
    if (!d.moved && !d.right && e.type === 'pointerup') onSquare(pick(e));
  };
  cv.addEventListener('pointerup', up);
  cv.addEventListener('pointercancel', up);
  cv.addEventListener('contextmenu', (e) => e.preventDefault());
  cv.addEventListener('wheel', (e) => { e.preventDefault(); cam.r = Math.max(8.5, Math.min(20, cam.r + Math.sign(e.deltaY) * 0.8)); ask(); }, { passive: false });

  rebuild();
  placeCamera();
  ask();

  return {
    rebuild, marks, faceSide, animateMove,
    pickAt: (x, y) => pick({ clientX: x, clientY: y }),
    screenOf: (sq) => { const v = pos(sq).project(camera); const r = cv.getBoundingClientRect(); return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height }; },
    dispose() {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      disposables.forEach((d) => { try { d.dispose(); } catch (e) { /* ignora */ } });
      overlays.concat(dots, rings).forEach((m) => m.material.dispose());
      renderer.dispose();
      cv.remove();
    }
  };
}
