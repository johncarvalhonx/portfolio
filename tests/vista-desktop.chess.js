// Verificacao do Chess Titans no navegador (precisa de WebGL). Rodar com:
// python tests/browser_runner.py URL 1440 900 saida.png tests/vista-desktop.chess.js
// Cada chave do JSON deve ser true. As regras do motor sao testadas a parte: node tests/xadrez-motor.test.js
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
await sleep(400);
const out = {};
out.icon = !!document.querySelector('.vd-icon[data-app="xadrez"]');
d.open('xadrez');
for (let i = 0; i < 50 && !document.querySelector('.ct-canvas'); i++) await sleep(150);
await sleep(500);
const w = document.querySelector('.vd-win[data-app="xadrez"]'); const G = w._game; const S3 = G.st.three;
out.loaded3D = !!window.THREE && !!w.querySelector('.ct-canvas');
G.opt.mode = 'cpu'; G.opt.human = 'w'; G.opt.level = 3; G.newGame(); await sleep(300);
const sq = (s) => (s.charCodeAt(1) - 49) * 8 + (s.charCodeAt(0) - 97);
const cv = w.querySelector('.ct-canvas');
const clickSq = (s) => { const p = S3.screenOf(sq(s)); cv.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true, pointerId: 9, button: 0, clientX: p.x, clientY: p.y})); cv.dispatchEvent(new PointerEvent('pointerup', {bubbles: true, pointerId: 9, button: 0, clientX: p.x, clientY: p.y})); };
clickSq('e2'); await sleep(200);
out.selectShowsTargets = G.st.sel === sq('e2') && G.st.targets.length === 2;
clickSq('e4');
for (let i = 0; i < 60 && G.E.historyLength() < 2; i++) await sleep(150);
out.computerReplies = G.E.historyLength() === 2 && G.E.turn() === 'w';
G.undo(); out.undoBothMoves = G.E.historyLength() === 0;
const onTop = (el) => { const r = el.getBoundingClientRect(); let ok = 0, n = 0; for (let y = r.top + 4; y < r.bottom - 2; y += 8) for (let x = r.left + 4; x < r.right - 2; x += 16) { n++; if (el.contains(document.elementFromPoint(x, y))) ok++; } return n > 0 && ok === n; };
[...w.querySelectorAll('.vd-mb-top')].find(b => b.textContent === 'Jogo').click();
out.menuOverBoard = onTop([...w.querySelectorAll('.vd-menu')].find(m => !m.hidden));
[...w.querySelectorAll('.vd-mi')].find(b => b.textContent.includes('Opções')).click();
const lvl = w.querySelector('input[name="ct-level"]'); lvl.value = '7';
[...w.querySelectorAll('.ct-opt .vd-btn')].find(b => b.textContent === 'OK').click();
out.optionsApply = G.opt.level === 7;
G.E.fromFEN('4k3/P7/8/8/8/8/8/4K3 w - - 0 1'); S3.rebuild();
G.clickSquare(sq('a7')); G.clickSquare(sq('a8')); await sleep(100);
const promo = w.querySelector('.vd-dlg[aria-label="Promoção"]');
out.promotionDialog = !!promo;
[...promo.querySelectorAll('.vd-btn')].find(b => b.textContent === 'Torre').click();
await sleep(700);
out.promotedRook = G.E.board()[sq('a8')] === 'R';
G.opt.mode = '2p'; G.newGame();
for (const [a, b] of [['f2', 'f3'], ['e7', 'e5'], ['g2', 'g4'], ['d8', 'h4']]) { G.play({from: sq(a), to: sq(b)}); await sleep(900); }
out.mateDialog = G.st.over && /Xeque-mate/.test(w.querySelector('.vd-dlg-txt b').textContent);
G.opt.mode = 'cpu'; G.opt.level = 3;
d.close('xadrez');
return JSON.stringify(out);
