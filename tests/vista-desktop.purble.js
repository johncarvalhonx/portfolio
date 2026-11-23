// Verificacao do Purble Place no navegador. Rodar com:
// python tests/browser_runner.py URL 1440 900 saida.png tests/vista-desktop.purble.js
// Cada chave do JSON deve ser true.
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
await sleep(400);
const out = {};
out.icon = !!document.querySelector('.vd-icon[data-app="purble"]');
d.open('purble'); await sleep(300);
const w = document.querySelector('.vd-win[data-app="purble"]'); const G = w._game;
out.hubHasThreeHouses = w.querySelectorAll('.pp-bld').length === 3;
// Pares
G.setLevel('beg'); w.querySelector('.pp-bld[data-game="pairs"]').dispatchEvent(new MouseEvent('click', {bubbles: true})); await sleep(200);
out.pairsBeginner12 = w.querySelectorAll('.pp-card').length === 12;
const byName = {}; [...w.querySelectorAll('.pp-card')].forEach(c => (byName[c.dataset.name] = byName[c.dataset.name] || []).push(c));
const names = Object.keys(byName);
byName[names[0]][0].click(); byName[names[1]][0].click(); await sleep(1100);
out.pairsMismatchFlipsBack = w.querySelectorAll('.pp-card.up').length === 0;
for (const k of names) { byName[k][0].click(); byName[k][1].click(); await sleep(600); }
await sleep(700);
out.pairsWin = /pares/.test((w.querySelector('.vd-dlg-txt b') || {}).textContent || '');
G.setLevel('adv'); G.go('pairs'); await sleep(100);
out.pairsAdvanced30WithEye = w.querySelectorAll('.pp-card').length === 30 && w.querySelectorAll('.pp-card[data-name="espiar"]').length === 2;
// Fabrica de Bolos: monta o primeiro pedido certo
G.setLevel('beg'); G.go('cakes');
const st = G.st.game; const order = Object.assign({}, st.order);
const keys = ['shape', 'batter', 'frost', 'deco'];
const vals = { shape: ['red', 'qua', 'cor'], batter: ['choc', 'baun', 'mor'], frost: ['choc', 'bran', 'rosa'], deco: ['conf', 'cer', 'est'] };
for (let i = 0; i < 4; i++) {
  for (let t = 0; t < 60 && st.at !== i; t++) await sleep(100);
  w.querySelectorAll('.pp-station')[i].querySelectorAll('.pp-opt')[vals[keys[i]].indexOf(order[keys[i]])].click();
}
for (let t = 0; t < 60 && st.made + st.miss < 1; t++) await sleep(100);
out.cakeCorrect = st.made === 1 && st.miss === 0;
// Loja de Bonecos
G.setLevel('int'); G.go('shop'); await sleep(100);
const target = G.st.game.target; const tk = Object.keys(target);
const opts = { hat: ['bon', 'car', 'cro', 'gor'], eyes: ['red', 'fel', 'son', 'est'], mouth: ['sor', 'abe', 'lin', 'oo'], nose: ['bot', 'cen', 'pal', 'cor'] };
const rows = [...w.querySelectorAll('.pp-part')];
out.shopIntermediate4Parts = rows.length === 4;
out.checkDisabledUntilComplete = w.querySelector('.pp-check').disabled === true;
tk.forEach((k, i) => rows[i].querySelectorAll('.pp-opt')[(opts[k].indexOf(target[k]) + 1) % 4].click());
w.querySelector('.pp-check').click();
out.shopFeedbackZero = w.querySelector('.pp-hist li b').textContent === '0';
tk.forEach((k, i) => rows[i].querySelectorAll('.pp-opt')[opts[k].indexOf(target[k])].click());
w.querySelector('.pp-check').click(); await sleep(800);
out.shopWin = G.st.game.won && /acertou/.test(w.querySelector('.vd-dlg-txt b').textContent);
const p = w.querySelector('.pp-parts').getBoundingClientRect(), sg = w.querySelector('.pp-stage').getBoundingClientRect();
out.shopFits = p.bottom <= sg.bottom + 1;
G.setLevel('beg');
d.close('purble');
return JSON.stringify(out);
