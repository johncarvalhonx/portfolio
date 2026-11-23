// Verificacao dos jogos (Campo Minado e Paciencia). Rodar com:
// python tests/browser_runner.py URL 1440 900 saida.png tests/vista-desktop.games.js
// Cada chave do JSON deve ser true.
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
await sleep(400);
const out = {};
out.icons = ['campo-minado', 'paciencia'].every(id => !!document.querySelector('.vd-icon[data-app="' + id + '"]'));
out.startEntries = ['Campo Minado', 'Paciência'].every(n => [...document.querySelectorAll('.vd-entries .vd-si')].some(b => !b.disabled && b.textContent.includes(n)));
// Campo Minado
d.open('campo-minado'); await sleep(300);
const mw = document.querySelector('.vd-win[data-app="campo-minado"]'); const M = mw._game; const ms = M.state;
out.msBeginner = mw.querySelectorAll('.ms-c').length === 81;
mw.querySelector('.ms-c[data-i="40"]').click();
out.msFirstClickSafe = !ms.cells[40].mine && ms.opened > 0;
const fi = ms.cells.findIndex(c => c.mine);
mw.querySelector('.ms-c[data-i="' + fi + '"]').dispatchEvent(new MouseEvent('contextmenu', {bubbles: true, cancelable: true}));
out.msFlag = ms.cells[fi].flag && mw.querySelector('.ms-left').textContent === '9';
ms.cells.forEach((c, i) => { if (!c.mine && !c.open && !ms.over) M.reveal(i); });
out.msWin = ms.over && /ganhou/.test(mw.querySelector('.vd-dlg-txt b').textContent);
M.setLevel('adv'); await sleep(100);
const r = mw.getBoundingClientRect(), s = document.querySelector('.vd-stage').getBoundingClientRect();
out.msAdvancedFits = mw.querySelectorAll('.ms-c').length === 480 && r.right <= s.right + 1 && r.bottom <= s.bottom + 1;
M.setLevel('beg'); mw.querySelector('.ms-c[data-i="0"]').click();
const mine = ms.cells.findIndex(c => c.mine); M.reveal(mine); await sleep(1100);
out.msLose = ms.over && /perdeu/.test(mw.querySelector('.vd-dlg-txt b').textContent);
d.close('campo-minado');
// Paciencia
d.open('paciencia'); await sleep(500);
const pw = document.querySelector('.vd-win[data-app="paciencia"]'); const P = pw._game; const st = P.state;
out.solDeal = ['t0','t1','t2','t3','t4','t5','t6'].map(p => st.piles[p].length).join() === '1,2,3,4,5,6,7' && st.piles.stock.length === 24;
// menus e dialogos ficam por cima das cartas (regressao: cartas cobriam o menu Jogo e o Como jogar)
const onTop = (el) => { const r = el.getBoundingClientRect(); let ok = 0, n = 0; for (let y = r.top + 4; y < r.bottom - 2; y += 8) for (let x = r.left + 4; x < r.right - 2; x += 16) { n++; if (el.contains(document.elementFromPoint(x, y))) ok++; } return n > 0 && ok === n; };
[...pw.querySelectorAll('.vd-mb-top')].find(b => b.textContent === 'Jogo').click();
out.solMenuOnTop = onTop([...pw.querySelectorAll('.vd-menu')].find(m => !m.hidden));
document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
[...pw.querySelectorAll('.vd-mb-top')].find(b => b.textContent === 'Ajuda').click();
[...pw.querySelectorAll('.vd-mi')].find(b => b.textContent.includes('Como jogar')).click();
out.solDialogOnTop = onTop(pw.querySelector('.vd-dlg'));
pw.querySelector('.vd-dlg .vd-btn').click();
P.drawStock(); out.solDraw = st.piles.waste.length === 1 && st.piles.waste[0].up;
P.undo(); out.solUndo = st.piles.waste.length === 0 && st.piles.stock.length === 24;
const king = P.cards.find(c => c.r === 13), queen = P.cards.find(c => c.r === 12 && c.red !== king.red);
out.solRules = P.canFound(P.cards.find(c => c.r === 1), 'f0') && !P.canFound(P.cards.find(c => c.r === 2), 'f0');
['stock','waste','t0','t1','t2','t3','t4','t5','t6','f0','f1','f2','f3'].forEach(p => st.piles[p] = []);
for (let k = 0; k < 4; k++) st.piles['f' + k] = P.cards.filter(c => c.s === k && c.r < 13).sort((a, b) => a.r - b.r).map(c => { c.up = true; return c; });
const kings = P.cards.filter(c => c.r === 13); kings.forEach((k, i) => { k.up = true; st.piles['t' + i] = [k]; });
P.layout(true); kings.forEach((k, i) => P.move('t' + i, 0, 'f' + k.s));
out.solWin = st.over === true;
d.close('paciencia');
return JSON.stringify(out);
