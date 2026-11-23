/* ===== App "Purble Place" (três minijogos infantis, no espírito do Vista) =====
   Arte e personagens próprios. Visual "polido + flat + toque de clay" do mockup de revamp:
   cada cena é desenhada numa tela de 1280×800 e escalada para caber na janela.
   Pares (memória), Fábrica de Bolos (esteira) e Loja de Bonecos (adivinhar). */

/* ícone: casinha lilás com um bolinho no telhado (sem gradientes com id) */
const VD_ICON_PURBLE = '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
  '<path d="M8 22L24 9l16 13z" fill="#8a4fd1" stroke="#4d2389" stroke-width="1.2" stroke-linejoin="round"/>' +
  '<rect x="11" y="22" width="26" height="19" rx="2" fill="#ffd2ec" stroke="#b05a92" stroke-width="1.2"/>' +
  '<rect x="20" y="29" width="8" height="12" rx="3" fill="#7a4a2a"/><circle cx="26" cy="35.5" r=".9" fill="#ffd34d"/>' +
  '<rect x="13.5" y="26" width="5" height="5" rx="1" fill="#9be1ff" stroke="#3a7fb8" stroke-width=".8"/><rect x="29.5" y="26" width="5" height="5" rx="1" fill="#9be1ff" stroke="#3a7fb8" stroke-width=".8"/>' +
  '<path d="M19 9.5h10v4H19z" fill="#f6c77a"/><path d="M18.5 9.5q5.5-5 11 0" fill="#ff8fc0"/><circle cx="24" cy="4.6" r="1.6" fill="#e2312a"/>' +
  '<path d="M8 22L24 9l16 13" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1"/></svg>';

const VD_PP_LEVELS = { beg: 'Iniciante', int: 'Intermediário', adv: 'Avançado' };
const VD_PP_W = 1280, VD_PP_H = 800;

/* ---- figuras do jogo da memória (viewBox 0 0 100 100) ---- */
const VD_PP_PICS = {
  sol: '<circle cx="50" cy="50" r="20" fill="#ffd21f" stroke="#e59a00" stroke-width="3"/><g stroke="#ffb000" stroke-width="6" stroke-linecap="round"><path d="M50 12v12M50 76v12M12 50h12M76 50h12M23 23l8 8M69 69l8 8M77 23l-8 8M31 69l-8 8"/></g>',
  maca: '<path d="M50 34c-8-8-30-6-30 16 0 20 14 34 30 30 16 4 30-10 30-30 0-22-22-24-30-16z" fill="#e3342f" stroke="#9e1a14" stroke-width="3"/><path d="M50 34c0-8 2-14 6-18" stroke="#6b3b16" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M56 22c8-8 18-6 20-4-6 8-14 8-20 4z" fill="#4cbf3c"/><ellipse cx="36" cy="46" rx="5" ry="9" fill="#fff" opacity=".45"/>',
  estrela: '<path d="M50 12l11 24 26 3-19 18 5 26-23-13-23 13 5-26-19-18 26-3z" fill="#ffcf24" stroke="#d48a00" stroke-width="3" stroke-linejoin="round"/>',
  peixe: '<path d="M20 50c10-18 40-22 56 0-16 22-46 18-56 0z" fill="#ff8a2a" stroke="#c4510a" stroke-width="3"/><path d="M76 50l16-14v28z" fill="#ff8a2a" stroke="#c4510a" stroke-width="3" stroke-linejoin="round"/><circle cx="34" cy="46" r="4" fill="#222"/><path d="M48 38q6 12 0 24" stroke="#c4510a" stroke-width="3" fill="none"/>',
  bola: '<circle cx="50" cy="50" r="32" fill="#2f8ee8" stroke="#145ea8" stroke-width="3"/><path d="M20 42q30 14 60 0M22 62q28-12 56 0" stroke="#fff" stroke-width="6" fill="none"/>',
  flor: '<path d="M50 60v30" stroke="#3ea83a" stroke-width="5"/><g fill="#ff7fb8" stroke="#d0457f" stroke-width="2"><circle cx="50" cy="26" r="12"/><circle cx="72" cy="42" r="12"/><circle cx="64" cy="66" r="12"/><circle cx="36" cy="66" r="12"/><circle cx="28" cy="42" r="12"/></g><circle cx="50" cy="48" r="10" fill="#ffd21f"/>',
  carro: '<path d="M14 62v-12l12-4 10-14h30l12 14 8 2v14z" fill="#e8402c" stroke="#9a1f10" stroke-width="3" stroke-linejoin="round"/><path d="M40 36h22l8 10H34z" fill="#bfe8ff"/><circle cx="32" cy="64" r="9" fill="#333" stroke="#ddd" stroke-width="3"/><circle cx="70" cy="64" r="9" fill="#333" stroke="#ddd" stroke-width="3"/>',
  casa: '<path d="M18 48L50 20l32 28z" fill="#c0392b" stroke="#7c1d14" stroke-width="3" stroke-linejoin="round"/><rect x="26" y="48" width="48" height="34" fill="#ffe08a" stroke="#b9882a" stroke-width="3"/><rect x="44" y="60" width="13" height="22" fill="#7a4a2a"/><rect x="31" y="56" width="9" height="9" fill="#8fd6ff"/>',
  lua: '<path d="M62 16a34 34 0 1 0 22 52A28 28 0 1 1 62 16z" fill="#ffe27a" stroke="#d2a400" stroke-width="3"/><circle cx="40" cy="44" r="4" fill="#e8c24a"/><circle cx="48" cy="64" r="6" fill="#e8c24a"/>',
  coracao: '<path d="M50 84C24 64 12 50 12 34c0-12 9-20 20-20 8 0 14 5 18 12 4-7 10-12 18-12 11 0 20 8 20 20 0 16-12 30-38 50z" fill="#ff3d6e" stroke="#b0123d" stroke-width="3"/><ellipse cx="30" cy="32" rx="5" ry="8" fill="#fff" opacity=".5"/>',
  chuva: '<path d="M14 52a36 36 0 0 1 72 0z" fill="#8a4fd1" stroke="#4d2389" stroke-width="3"/><path d="M14 52q9-8 18 0 9-8 18 0 9-8 18 0 9-8 18 0" fill="#b88af0" stroke="#4d2389" stroke-width="2"/><path d="M50 52v26q0 8-8 8t-8-6" stroke="#333" stroke-width="5" fill="none" stroke-linecap="round"/>',
  sorvete: '<path d="M34 50l16 40 16-40z" fill="#e8a85a" stroke="#a96a24" stroke-width="3" stroke-linejoin="round"/><path d="M38 58l20 8M36 66l18-6M44 74l10-4" stroke="#a96a24" stroke-width="2"/><circle cx="40" cy="44" r="13" fill="#ffb3d1" stroke="#d0628f" stroke-width="2"/><circle cx="60" cy="44" r="13" fill="#9be7c4" stroke="#3aa877" stroke-width="2"/><circle cx="50" cy="30" r="13" fill="#fff4d6" stroke="#cfa95a" stroke-width="2"/><circle cx="50" cy="16" r="4" fill="#e3342f"/>',
  pipa: '<path d="M50 10l26 30-26 36-26-36z" fill="#2fc0a8" stroke="#137a6a" stroke-width="3" stroke-linejoin="round"/><path d="M50 10v66M24 40h52" stroke="#137a6a" stroke-width="2"/><path d="M50 76q-8 6 0 10t0 10" stroke="#555" stroke-width="2" fill="none"/><path d="M44 86l6 2-4 4zM48 94l6 1-4 4z" fill="#ff5a5a"/>',
  barco: '<path d="M16 64h68l-10 16H26z" fill="#a0522d" stroke="#5e2e12" stroke-width="3" stroke-linejoin="round"/><path d="M50 18v46" stroke="#5e2e12" stroke-width="4"/><path d="M52 20l26 38H52z" fill="#fff" stroke="#8a8a8a" stroke-width="2"/><path d="M48 28L26 58h22z" fill="#ffd21f" stroke="#c99600" stroke-width="2"/><path d="M8 84q10-6 20 0t20 0 20 0 20 0 20 0" stroke="#3a8ee6" stroke-width="4" fill="none"/>',
  bolinho: '<path d="M26 54h48l-6 32H32z" fill="#ff9f43" stroke="#b8620e" stroke-width="3" stroke-linejoin="round"/><path d="M34 56l2 28M44 56v28M56 56v28M66 56l-2 28" stroke="#b8620e" stroke-width="2"/><path d="M22 56c0-22 56-22 56 0z" fill="#ffd6ec" stroke="#d0628f" stroke-width="3"/><circle cx="50" cy="28" r="6" fill="#e3342f"/><g fill="#5ad1ff"><rect x="34" y="44" width="6" height="3" rx="1"/><rect x="56" y="42" width="6" height="3" rx="1"/></g><g fill="#7ee05a"><rect x="46" y="40" width="6" height="3" rx="1"/></g>',
  espiar: '<path d="M10 50q40-40 80 0-40 40-80 0z" fill="#fff" stroke="#4d2389" stroke-width="4"/><circle cx="50" cy="50" r="16" fill="#8a4fd1"/><circle cx="50" cy="50" r="7" fill="#1a0b33"/><circle cx="45" cy="44" r="4" fill="#fff"/>'
};

/* ---- peças desenhadas com blocos posicionados (o "flat + clay" do mockup) ---- */
const VD_PP_STAR = 'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)';
const VD_PP_HEART = "path('M30 42 C30 42 0 26 0 12 C0 4 6 0 14 0 C22 0 28 6 30 10 C32 6 38 0 46 0 C54 0 60 4 60 12 C60 26 30 42 30 42 Z')";
const VD_PP_HEARTPOLY = 'polygon(50% 100%,0 38%,8% 6%,30% 0,50% 22%,70% 0,92% 6%,100% 38%)';
function vdPpBox(l, t, w, h, bg, x) { return Object.assign({ position: 'absolute', left: l, top: t, width: w, height: h, background: bg }, x || {}); }
function vdPpHtml(list) {
  return list.map((o) => '<i style="' + Object.keys(o).map((k) => k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()) + ':' + (typeof o[k] === 'number' ? o[k] + 'px' : o[k])).join(';') + '"></i>').join('');
}

/* bolo da fábrica (caixa 80×56): {shape, batter, frost, deco}; cada parte pode faltar.
   Só com a forma escolhida, aparece a fôrma de metal vazia. */
function vdPpCake(c) {
  const P = vdPpBox, R = '50%', a = [];
  const shape = { red: 'round', qua: 'square', cor: 'heart' }[c.shape];
  const pan = !!shape && !c.batter;
  if (!pan) a.push(P(2, 44, 76, 11, '#fff', { borderRadius: R, boxShadow: '0 3px 0 #ddd5ea,0 6px 10px rgba(90,60,120,.12)' }));
  if (!shape) return '<div class="pp-ck">' + vdPpHtml(a) + '</div>';
  const base = { choc: ['#7b4a34', '#9a6249'], baun: ['#ecc996', '#f8e3bf'], mor: ['#f093b0', '#f9bfd1'] }[c.batter] || ['linear-gradient(90deg,#a3acbc,#e2e6ee 40%,#949db0)', '#c3cad7'];
  const side = base[0], top = base[1];
  const f = { choc: '#5e3424', bran: '#fffaf3', rosa: '#ff86b3' }[c.frost] || null;
  const drips = (y, xs, hs) => xs.forEach((x, i) => a.push(P(x, y, 7, hs[i], f, { borderRadius: '0 0 4px 4px' })));
  let tb;
  if (shape === 'round') {
    a.push(P(8, 20, 64, 28, side, { borderRadius: '0 0 32px 32px / 0 0 10px 10px', boxShadow: 'inset 0 -4px 0 rgba(0,0,0,.1)' }));
    if (f) drips(20, [12, 24, 36, 48, 60], [12, 7, 14, 8, 11]);
    a.push(P(8, 12, 64, 18, f || top, { borderRadius: R, boxShadow: pan ? 'inset 0 4px 0 rgba(0,0,0,.16)' : 'inset 0 -2px 0 rgba(0,0,0,.05)' }));
    tb = { x: 8, y: 12, w: 64, h: 18 };
  } else if (shape === 'square') {
    a.push(P(10, 22, 60, 24, side, { borderRadius: '2px 2px 6px 6px', boxShadow: 'inset 0 -4px 0 rgba(0,0,0,.1)' }));
    if (f) drips(22, [13, 25, 37, 49, 59], [11, 6, 13, 7, 10]);
    a.push(P(10, 12, 60, 14, f || top, { borderRadius: 4, boxShadow: pan ? 'inset 0 3px 0 rgba(0,0,0,.16)' : 'none' }));
    tb = { x: 10, y: 12, w: 60, h: 14 };
  } else {
    a.push(P(10, 12, 60, 42, side, { clipPath: VD_PP_HEART }));
    a.push(P(10, 4, 60, 42, f || top, { clipPath: VD_PP_HEART }));
    tb = { x: 22, y: 10, w: 36, h: 18 };
  }
  const cx = tb.x + tb.w / 2, cy = tb.y + tb.h / 2;
  if (c.deco === 'conf') [[-18, -2, '#ff5c8a', 20], [-8, 3, '#4fb3ff', -30], [2, -4, '#ffd23f', 60], [12, 2, '#5fcf7a', -10], [-2, 4, '#b48cff', 35], [18, -3, '#ff9f43', 80]]
    .forEach((s) => a.push(P(cx + s[0] - 3, cy + s[1] - 1, 6, 2.5, s[2], { borderRadius: 2, transform: 'rotate(' + s[3] + 'deg)' })));
  else if (c.deco === 'cer') [-13, 0, 13].forEach((dx) => a.push(P(cx + dx - 4, cy - 9 - (dx ? 0 : 2), 9, 9, 'radial-gradient(circle at 35% 35%,#ff7a7a,#c8102e)', { borderRadius: R })));
  else if (c.deco === 'est') [-13, 0, 13].forEach((dx) => a.push(P(cx + dx - 5, cy - 8 - (dx ? 0 : 2), 10, 10, '#ffc93c', { clipPath: VD_PP_STAR })));
  return '<div class="pp-ck">' + vdPpHtml(a) + '</div>';
}

/* boneco da loja (caixa 60×88): {hat, eyes, mouth, nose, shirt}; peça sem escolha fica neutra */
function vdPpDoll(f) {
  const P = vdPpBox, R = '50%', hy = 18, sk = '#f8d6bb', dk = '#3a2a3a', a = [];
  const cloth = { ver: '#ef5350', azu: '#3f8ef5', vrd: '#43b05c', ama: '#f7c23a' }[f.shirt] || '#c9b3f5';
  a.push(P(23, 74, 5, 11, '#7a5236', { borderRadius: '0 0 3px 3px' }), P(32, 74, 5, 11, '#7a5236', { borderRadius: '0 0 3px 3px' }));
  a.push(P(12, 51, 5, 17, sk, { borderRadius: 3, transform: 'rotate(22deg)' }), P(43, 51, 5, 17, sk, { borderRadius: 3, transform: 'rotate(-22deg)' }));
  a.push(P(16, 49, 28, 28, 'linear-gradient(90deg,rgba(255,255,255,.18),rgba(0,0,0,0) 40%,rgba(0,0,0,.12)),' + cloth, { clipPath: 'polygon(24% 0,76% 0,100% 100%,0 100%)' }));
  a.push(P(13, hy, 34, 34, 'radial-gradient(circle at 38% 32%,#fde8d6,' + sk + ' 60%,#efc3a2)', { borderRadius: R }));
  a.push(P(16, hy + 19, 6, 4, 'rgba(255,120,140,.45)', { borderRadius: R }), P(38, hy + 19, 6, 4, 'rgba(255,120,140,.45)', { borderRadius: R }));
  const ey = hy + 13;
  if (f.eyes === 'red') a.push(P(21, ey, 4, 4, dk, { borderRadius: R }), P(35, ey, 4, 4, dk, { borderRadius: R }));
  else if (f.eyes === 'fel') a.push(P(20, ey, 6, 4, 'transparent', { borderTop: '2px solid ' + dk, borderRadius: '6px 6px 0 0' }), P(34, ey, 6, 4, 'transparent', { borderTop: '2px solid ' + dk, borderRadius: '6px 6px 0 0' }));
  else if (f.eyes === 'son') a.push(P(20, ey + 1, 6, 2, dk, { borderRadius: 2 }), P(34, ey + 1, 6, 2, dk, { borderRadius: 2 }));
  else if (f.eyes === 'est') a.push(P(19, ey - 2, 7, 7, '#f5b400', { clipPath: VD_PP_STAR }), P(34, ey - 2, 7, 7, '#f5b400', { clipPath: VD_PP_STAR }));
  else a.push(P(22, ey + 1, 3, 3, '#d4b49c', { borderRadius: R }), P(36, ey + 1, 3, 3, '#d4b49c', { borderRadius: R }));
  const ny = hy + 18;
  if (f.nose === 'bot') a.push(P(28, ny, 4, 4, '#e3987a', { borderRadius: R }));
  else if (f.nose === 'cen') a.push(P(29, ny, 9, 4, '#f28a2e', { clipPath: 'polygon(0 0,100% 50%,0 100%)' }));
  else if (f.nose === 'pal') a.push(P(26.5, ny - 1.5, 7, 7, 'radial-gradient(circle at 35% 35%,#ff7a7a,#d8262e)', { borderRadius: R }));
  else if (f.nose === 'cor') a.push(P(27, ny - 1, 7, 6, '#ff5f95', { clipPath: VD_PP_HEARTPOLY }));
  const my = hy + 23;
  if (f.mouth === 'sor') a.push(P(25, my, 10, 5, 'transparent', { borderBottom: '2px solid #9a3b3b', borderRadius: '0 0 10px 10px' }));
  else if (f.mouth === 'abe') a.push(P(27, my, 7, 6, '#9a3b3b', { borderRadius: '40% 40% 50% 50%' }));
  else if (f.mouth === 'lin') a.push(P(25, my, 10, 5, 'transparent', { borderBottom: '2px solid #9a3b3b', borderRadius: '0 0 10px 10px' }), P(29, my + 4, 5, 4, '#ff7a9a', { borderRadius: '0 0 4px 4px' }));
  else if (f.mouth === 'oo') a.push(P(27.5, my, 5, 6, 'transparent', { border: '2px solid #9a3b3b', borderRadius: R }));
  if (f.hat === 'bon') a.push(P(14, hy - 6, 32, 16, 'linear-gradient(180deg,#ff6a5c,#e43f33)', { borderRadius: '16px 16px 3px 3px' }), P(36, hy + 5, 18, 5, '#c7362e', { borderRadius: 3 }), P(28, hy - 8, 4, 4, '#c7362e', { borderRadius: R }));
  else if (f.hat === 'car') a.push(P(12, hy - 2, 36, 5, '#2b2730', { borderRadius: 3 }), P(18, hy - 22, 24, 21, 'linear-gradient(90deg,#4a4452,#2b2730 70%)', { borderRadius: '4px 4px 1px 1px' }), P(18, hy - 8, 24, 5, '#e0453b'));
  else if (f.hat === 'cro') a.push(P(17, hy - 10, 26, 13, 'linear-gradient(180deg,#ffe066,#f2b400)', { clipPath: 'polygon(0 100%,0 15%,25% 60%,50% 0,75% 60%,100% 15%,100% 100%)' }), P(28, hy - 1, 4, 4, '#e9483f', { borderRadius: R }));
  else if (f.hat === 'gor') a.push(P(13, hy - 6, 34, 18, 'linear-gradient(180deg,#5aa2ff,#3f8ef5)', { borderRadius: '17px 17px 4px 4px' }), P(12, hy + 7, 36, 6, '#2f6fd0', { borderRadius: 3 }), P(26, hy - 12, 8, 8, '#fff', { borderRadius: R }));
  return '<div class="pp-dl">' + vdPpHtml(a) + '</div>';
}

/* casinha branca do verso das cartas (caixa 40×40) */
function vdPpHouseIcon() {
  const P = vdPpBox;
  return vdPpHtml([P(3, 5, 34, 16, '#fff', { clipPath: 'polygon(50% 0,100% 100%,0 100%)' }), P(9, 20, 22, 16, '#fff', { borderRadius: '0 0 3px 3px' }), P(17, 26, 6, 10, '#d88a3d', { borderRadius: '3px 3px 0 0' })]);
}

/* ---- praça: céu, colinas, três casas de brinquedo e dois mascotes ---- */
function vdPpTown() {
  const P = vdPpBox, R = '50%', H = vdPpHtml;
  const at = (css, inner) => '<div style="position:absolute;' + css + '">' + (inner || '') + '</div>';
  const cloud = H([P(14, 34, 132, 38, '#fff', { borderRadius: 19, boxShadow: 'inset 0 -7px 0 #dcefff' }), P(26, 16, 56, 56, '#fff', { borderRadius: R }), P(66, 2, 64, 64, '#fff', { borderRadius: R }), P(108, 26, 40, 40, '#fff', { borderRadius: R }), P(20, 52, 124, 18, '#e6f4ff', { borderRadius: '0 0 18px 18px' })]);
  const tree = H([P(14, 90, 42, 10, 'rgba(0,0,0,.12)', { borderRadius: R }), P(30, 60, 10, 34, '#8a5a3a', { borderRadius: 4 }), P(4, 6, 62, 62, 'radial-gradient(circle at 35% 30%,#a8ea80,#4fae3c 72%)', { borderRadius: R, boxShadow: 'inset -6px -8px 0 rgba(0,60,0,.12)' })]);
  const bell = H([P(15, 6, 50, 26, '#c43d31', { clipPath: 'polygon(50% 0,100% 100%,0 100%)' }), P(22, 30, 36, 32, '#ef6a5a', { borderRadius: '2px 2px 0 0', boxShadow: 'inset -5px 0 0 rgba(0,0,0,.1)' }), P(31, 36, 18, 22, '#fff0b8', { borderRadius: '9px 9px 0 0' }), P(34, 40, 12, 12, 'radial-gradient(circle at 35% 35%,#ffe27a,#e0a000)', { borderRadius: '6px 6px 3px 3px' }), P(38, 51, 4, 4, '#c98a00', { borderRadius: R })]);
  const hat = H([P(8, 50, 64, 10, '#2b2730', { borderRadius: R }), P(20, 6, 40, 48, 'linear-gradient(90deg,#55505e,#2b2730 70%)', { borderRadius: '6px 6px 2px 2px' }), P(20, 38, 40, 8, '#e0453b')]);
  const mascotA = H([P(15, 98, 70, 12, 'rgba(0,60,0,.16)', { borderRadius: R }), P(26, 88, 18, 12, '#d9601d', { borderRadius: R }), P(56, 88, 18, 12, '#d9601d', { borderRadius: R }),
    P(49, 6, 3, 12, '#3f8a36', { borderRadius: 2 }), P(32, 2, 20, 10, '#5fc24f', { borderRadius: R, transform: 'rotate(-25deg)' }), P(50, 4, 20, 10, '#4fae3c', { borderRadius: R, transform: 'rotate(25deg)' }),
    P(10, 14, 80, 80, 'radial-gradient(circle at 35% 30%,#ffbf7a,#f07a2a 75%)', { borderRadius: '50% 50% 46% 46% / 55% 55% 45% 45%', boxShadow: 'inset -6px -8px 0 rgba(160,60,0,.15)' }),
    P(28, 40, 16, 18, '#fff', { borderRadius: R }), P(56, 40, 16, 18, '#fff', { borderRadius: R }), P(33, 46, 8, 9, '#2a1f2e', { borderRadius: R }), P(61, 46, 8, 9, '#2a1f2e', { borderRadius: R }), P(35, 47, 3, 3, '#fff', { borderRadius: R }), P(63, 47, 3, 3, '#fff', { borderRadius: R }),
    P(18, 62, 12, 7, 'rgba(255,90,90,.45)', { borderRadius: R }), P(70, 62, 12, 7, 'rgba(255,90,90,.45)', { borderRadius: R }), P(42, 62, 16, 8, 'transparent', { borderBottom: '3px solid #7a2a10', borderRadius: '0 0 12px 12px' })]);
  const mascotB = H([P(15, 98, 70, 12, 'rgba(0,60,0,.16)', { borderRadius: R }), P(26, 88, 18, 12, '#6c52d6', { borderRadius: R }), P(56, 88, 18, 12, '#6c52d6', { borderRadius: R }),
    P(14, 10, 26, 26, '#9b85f6', { borderRadius: R }), P(60, 10, 26, 26, '#9b85f6', { borderRadius: R }), P(20, 16, 14, 14, '#ffb3d4', { borderRadius: R }), P(66, 16, 14, 14, '#ffb3d4', { borderRadius: R }),
    P(8, 18, 84, 76, 'radial-gradient(circle at 35% 30%,#c9baff,#8a70ec 75%)', { borderRadius: '46%', boxShadow: 'inset -6px -8px 0 rgba(60,30,150,.15)' }),
    P(28, 58, 44, 30, 'rgba(255,255,255,.35)', { borderRadius: R }),
    P(32, 42, 9, 11, '#2a1f2e', { borderRadius: R }), P(59, 42, 9, 11, '#2a1f2e', { borderRadius: R }), P(34, 43, 3, 3, '#fff', { borderRadius: R }), P(61, 43, 3, 3, '#fff', { borderRadius: R }),
    P(20, 56, 12, 7, 'rgba(255,110,160,.5)', { borderRadius: R }), P(68, 56, 12, 7, 'rgba(255,110,160,.5)', { borderRadius: R }), P(44, 55, 12, 8, '#5a2350', { borderRadius: '0 0 8px 8px' })]);
  const house = (o) => '<div class="pp-bld" role="button" tabindex="0" data-game="' + o.game + '" aria-label="' + o.label + '" style="left:' + o.x + 'px;--wa:' + o.wa + ';--wb:' + o.wb + ';--ra:' + o.ra + ';--rb:' + o.rb + ';--sb:' + o.sb + ';--sc:' + o.sc + ';--awn:' + o.awn + '">' +
    '<i class="pp-h-shadow"></i><i class="pp-h-wall"></i><i class="pp-h-roof"></i><i class="pp-h-lit"></i><span class="pp-h-icon">' + o.icon + '</span>' +
    '<span class="pp-sign">' + o.name + '</span><i class="pp-h-win" style="left:58px"></i><i class="pp-h-win" style="left:176px"></i><i class="pp-h-awn"></i><i class="pp-h-door"></i></div>';
  let flowers = '';
  [[40, 690, '#fff'], [150, 740, '#ff8fb8'], [230, 660, '#fff'], [330, 760, '#ffd23f'], [880, 700, '#fff'], [990, 750, '#ff8fb8'], [1100, 670, '#fff'], [1210, 730, '#ff8fb8'], [620, 770, '#fff']]
    .forEach((p) => { flowers += '<i class="pp-flower" style="left:' + p[0] + 'px;top:' + p[1] + 'px;box-shadow:0 0 0 4px ' + p[2] + '"></i>'; });
  return at('right:120px;top:56px;width:130px;height:130px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fffbe0 0,#ffeb8a 55%,#ffd94a 100%);box-shadow:0 0 0 18px rgba(255,236,140,.35),0 0 90px 40px rgba(255,240,170,.55)') +
    at('left:90px;top:70px;width:160px;height:80px', cloud) +
    at('left:500px;top:40px;width:160px;height:80px;transform:scale(.8);transform-origin:0 0', cloud) +
    at('left:800px;top:130px;width:160px;height:80px;transform:scale(.55);transform-origin:0 0;opacity:.9', cloud) +
    at('left:-140px;top:470px;width:820px;height:330px;border-radius:50%;background:linear-gradient(180deg,#bfe892,#9fd673)') +
    at('left:580px;top:440px;width:920px;height:360px;border-radius:50%;background:linear-gradient(180deg,#b2e283,#92cf63)') +
    at('left:-200px;top:572px;width:1680px;height:620px;border-radius:50% 50% 0 0 / 110px 110px 0 0;background:linear-gradient(180deg,#8fd65f,#64b83f 420px)') +
    at('left:540px;top:610px;width:200px;height:190px;clip-path:polygon(46% 0,54% 0,100% 100%,0 100%);background:linear-gradient(180deg,#f6e4b8,#e8c88a)') +
    at('left:10px;top:520px;width:70px;height:100px', tree) +
    at('left:405px;top:540px;width:70px;height:100px;transform:scale(.8);transform-origin:50% 100%', tree) +
    at('left:805px;top:540px;width:70px;height:100px;transform:scale(.8);transform-origin:50% 100%', tree) +
    at('left:1200px;top:520px;width:70px;height:100px', tree) +
    house({ game: 'pairs', label: 'Pares', name: 'Pares', x: 90, wa: '#fff0bf', wb: '#ffd36b', ra: '#f06a58', rb: '#c9402f', sb: '#e0a91c', sc: '#8a5a00', awn: '#ffc21a', icon: bell }) +
    house({ game: 'cakes', label: 'Fábrica de Bolos', name: 'Bolos', x: 490, wa: '#ffe6f1', wb: '#ffbcd9', ra: '#9c6a52', rb: '#6b4230', sb: '#e05592', sc: '#b0306a', awn: '#ff86b8', icon: vdPpCake({ shape: 'red', batter: 'mor', frost: 'bran', deco: 'cer' }) }) +
    house({ game: 'shop', label: 'Loja de Bonecos', name: 'Loja', x: 890, wa: '#e6f3ff', wb: '#b8daff', ra: '#9c7cf0', rb: '#6346c4', sb: '#7d5ad8', sc: '#5a3ab0', awn: '#9474ee', icon: hat }) +
    flowers +
    at('left:430px;top:648px;width:100px;height:110px', mascotA) +
    at('left:752px;top:648px;width:100px;height:110px', mascotB) +
    '<div class="pp-hint">Clique numa casa para jogar</div>';
}

const VD_PURBLE_APP = {
  id: 'purble',
  title: 'Purble Place',
  icon: VD_ICON_PURBLE,
  size: { w: 1000, h: 680 },
  render(body, win) {
    const st = { scene: 'hub', level: 'beg', cleanup: null, dlg: null };
    try { const lv = localStorage.getItem('vd-purble-nivel'); if (VD_PP_LEVELS[lv]) st.level = lv; } catch (e) { /* sem armazenamento */ }
    const root = document.createElement('div');
    root.className = 'pp';
    const menu = vdMenuBar([
      { label: 'Jogo', items: [
        { label: 'Novo jogo', shortcut: 'F2', action: () => restart(), disabled: () => st.scene === 'hub' },
        'sep',
        { label: 'Praça', checked: () => st.scene === 'hub', action: () => go('hub') },
        { label: 'Pares', checked: () => st.scene === 'pairs', action: () => go('pairs') },
        { label: 'Fábrica de Bolos', checked: () => st.scene === 'cakes', action: () => go('cakes') },
        { label: 'Loja de Bonecos', checked: () => st.scene === 'shop', action: () => go('shop') },
        'sep',
        { label: 'Iniciante', checked: () => st.level === 'beg', action: () => setLevel('beg') },
        { label: 'Intermediário', checked: () => st.level === 'int', action: () => setLevel('int') },
        { label: 'Avançado', checked: () => st.level === 'adv', action: () => setLevel('adv') },
        'sep',
        { label: 'Sair', action: () => win.close() }
      ] },
      { label: 'Ajuda', items: [{ label: 'Como jogar', action: () => help() }] }
    ]);
    root.appendChild(menu);
    const stage = document.createElement('div');
    stage.className = 'pp-stage';
    const canvas = document.createElement('div');
    canvas.className = 'pp-canvas';
    stage.appendChild(canvas);
    root.appendChild(stage);
    body.appendChild(root);

    // a cena tem 1280×800; escala para caber na janela, centralizada
    const fit = () => {
      const w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      const k = Math.min(w / VD_PP_W, h / VD_PP_H);
      stage.style.setProperty('--k', String(k));
      canvas.style.transform = 'translate(' + ((w - VD_PP_W * k) / 2) + 'px,' + ((h - VD_PP_H * k) / 2) + 'px) scale(' + k + ')';
    };
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(fit) : null;
    if (ro) ro.observe(stage); else window.addEventListener('resize', fit);

    const timers = new Set();
    const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; };
    const clearTimers = () => { timers.forEach((t) => clearTimeout(t)); timers.clear(); };
    let ticker = null;
    const stopTicker = () => { if (ticker) clearInterval(ticker); ticker = null; };

    function setLevel(lv) { st.level = lv; try { localStorage.setItem('vd-purble-nivel', lv); } catch (e) { /* ok */ } if (st.scene !== 'hub') restart(); }
    function restart() { go(st.scene); }
    function go(scene) {
      if (st.dlg) { st.dlg.close(); st.dlg = null; }
      clearTimers(); stopTicker();
      if (st.cleanup) { st.cleanup(); st.cleanup = null; }
      st.scene = scene;
      canvas.innerHTML = '';
      stage.className = 'pp-stage pp-scene-' + scene;
      if (scene === 'hub') hub();
      else if (scene === 'pairs') pairs();
      else if (scene === 'cakes') cakes();
      else shop();
      fit();
    }
    const header = (title) => {
      const h = document.createElement('div');
      h.className = 'pp-head';
      h.innerHTML = '<div class="pp-awning"></div><button type="button" class="pp-back">◀ Praça</button><span class="pp-plaque"><b></b><span class="pp-lvl"></span></span>';
      h.querySelector('b').textContent = title;
      h.querySelector('.pp-lvl').textContent = VD_PP_LEVELS[st.level];
      h.querySelector('.pp-back').addEventListener('click', () => go('hub'));
      canvas.appendChild(h);
      return h;
    };
    const done = (opts) => { st.dlg = vdDialog(root, Object.assign({ icon: 'win', buttons: [{ label: 'Praça', action: () => go('hub') }, { label: 'Jogar novamente', primary: true, action: () => restart() }] }, opts)); };

    // ================= praça =================
    function hub() {
      canvas.innerHTML = vdPpTown();
      canvas.querySelectorAll('.pp-bld').forEach((b) => {
        b.addEventListener('click', () => go(b.dataset.game));
        b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(b.dataset.game); } });
      });
    }

    // ================= Pares (memória) =================
    function pairs() {
      header('Pares');
      const cfg = { beg: [4, 3, false, 140], int: [5, 4, true, 120], adv: [6, 5, true, 100] }[st.level];
      const cols = cfg[0], rows = cfg[1], special = cfg[2], size = cfg[3];
      const nPairs = (cols * rows) / 2;
      const names = Object.keys(VD_PP_PICS).filter((k) => k !== 'espiar').sort(() => Math.random() - 0.5).slice(0, special ? nPairs - 1 : nPairs);
      if (special) names.push('espiar');
      const deck = names.concat(names).sort(() => Math.random() - 0.5);
      const g = { open: [], lock: false, left: nPairs, tries: 0, time: 0, started: false };
      const board = document.createElement('div');
      board.className = 'pp-board';
      const grid = document.createElement('div');
      grid.className = 'pp-grid';
      grid.style.gridTemplateColumns = 'repeat(' + cols + ', var(--c))';
      grid.style.setProperty('--c', size + 'px');
      grid.style.setProperty('--cs', String(size / 100));
      const backIcon = vdPpHouseIcon();
      deck.forEach((name, i) => {
        const c = document.createElement('button');
        c.type = 'button';
        c.className = 'pp-card';
        c.dataset.name = name;
        c.dataset.i = String(i);
        c.setAttribute('aria-label', 'Carta virada');
        c.innerHTML = '<span class="pp-card-in"><span class="pp-back-face"><span class="pp-hico">' + backIcon + '</span></span>' +
          '<span class="pp-front"><svg viewBox="0 0 100 100" aria-hidden="true">' + VD_PP_PICS[name] + '</svg></span></span><span class="pp-ok" aria-hidden="true">✓</span>';
        grid.appendChild(c);
      });
      board.appendChild(grid);
      canvas.appendChild(board);
      const foot = document.createElement('div');
      foot.className = 'pp-foot';
      foot.innerHTML = '<span class="pp-pill">Tentativas <b class="pp-tries">0</b></span><span class="pp-pill">Pares restantes <b class="pp-left">' + nPairs + '</b></span><span class="pp-pill">Tempo <b class="pp-time">0:00</b></span>';
      canvas.appendChild(foot);
      const clock = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
      const paint = () => { foot.querySelector('.pp-tries').textContent = g.tries; foot.querySelector('.pp-left').textContent = g.left; foot.querySelector('.pp-time').textContent = clock(g.time); };
      ticker = setInterval(() => { if (g.started && g.left && !win.isMinimized()) { g.time++; paint(); } }, 1000);
      grid.addEventListener('click', (e) => {
        const c = e.target.closest('.pp-card');
        if (!c || g.lock || c.classList.contains('up') || c.classList.contains('gone')) return;
        g.started = true;
        c.classList.add('up');
        c.setAttribute('aria-label', c.dataset.name);
        g.open.push(c);
        if (g.open.length < 2) return;
        g.tries++;
        const [a, b] = g.open;
        g.open = [];
        g.lock = true;
        if (a.dataset.name === b.dataset.name) {
          later(() => {
            a.classList.add('gone'); b.classList.add('gone');
            g.left--;
            paint();
            if (a.dataset.name === 'espiar') {
              const rest = [...grid.querySelectorAll('.pp-card:not(.gone)')];
              rest.forEach((x) => x.classList.add('up', 'peek'));
              later(() => { rest.forEach((x) => x.classList.remove('up', 'peek')); g.lock = false; }, 1600);
            } else g.lock = false;
            if (!g.left) { g.lock = true; later(() => done({ title: 'Pares', heading: 'Muito bem! Você encontrou todos os pares.', text: 'Tentativas: ' + g.tries + '\nTempo: ' + clock(g.time) }), 500); }
          }, 450);
        } else {
          paint();
          later(() => { a.classList.remove('up'); b.classList.remove('up'); a.setAttribute('aria-label', 'Carta virada'); b.setAttribute('aria-label', 'Carta virada'); g.lock = false; }, 900);
        }
      });
      paint();
      st.game = g;
    }

    // ================= Fábrica de Bolos =================
    function cakes() {
      header('Fábrica de Bolos');
      const cfg = { beg: { dwell: 3400, goal: 5 }, int: { dwell: 2400, goal: 7 }, adv: { dwell: 1700, goal: 10 } }[st.level];
      const STATIONS = [
        { key: 'shape', label: 'Forma', opts: [['red', 'Redonda'], ['qua', 'Quadrada'], ['cor', 'Coração']] },
        { key: 'batter', label: 'Massa', opts: [['choc', 'Chocolate'], ['baun', 'Baunilha'], ['mor', 'Morango']] },
        { key: 'frost', label: 'Cobertura', opts: [['choc', 'Chocolate'], ['bran', 'Chantili'], ['rosa', 'Rosa']] },
        { key: 'deco', label: 'Enfeite', opts: [['conf', 'Confeitos'], ['cer', 'Cerejas'], ['est', 'Estrelas']] }
      ];
      const DISP_X = [60, 250, 440, 630];
      const pickR = (a) => a[Math.floor(Math.random() * a.length)][0];
      const g = { made: 0, miss: 0, order: null, cake: null, at: -1, passed: 0, token: 0, over: false };
      const wrap = document.createElement('div');
      wrap.className = 'pp-factory';
      let disp = '';
      DISP_X.forEach((x, i) => { disp += '<div class="pp-disp" style="left:' + x + 'px"><b>' + (i + 1) + '</b><i class="pp-light"></i><i class="pp-drip"></i></div>'; });
      wrap.innerHTML = '<div class="pp-machine">' + disp + '<div class="pp-belt"></div><div class="pp-cake-on"></div><div class="pp-box">Caixa</div><div class="pp-verdict" aria-live="polite"></div></div>' +
        '<div class="pp-order"><div class="pp-ticket"><b>Pedido</b><div class="pp-order-cake"></div><div class="pp-ostats">' +
        '<div class="pp-orow"><span>Bolos prontos</span><span class="pp-made"></span></div><div class="pp-bar"><i></i></div>' +
        '<div class="pp-orow"><span>Erros</span><span class="pp-miss"><i></i><i></i><i></i></span></div></div></div></div>' +
        '<div class="pp-stations"></div>';
      canvas.appendChild(wrap);
      const cakeEl = wrap.querySelector('.pp-cake-on');
      const verdict = wrap.querySelector('.pp-verdict');
      const stWrap = wrap.querySelector('.pp-stations');
      const disps = [...wrap.querySelectorAll('.pp-disp')];
      // centro do bolo em cada parada: entrada, quatro bicos e a caixa
      const xs = [-70, 110, 300, 490, 680, 832];
      STATIONS.forEach((s, i) => {
        const p = document.createElement('div');
        p.className = 'pp-station';
        p.dataset.i = String(i);
        p.innerHTML = '<div class="pp-st-head"><b>' + (i + 1) + '. ' + s.label + '</b><span class="pp-st-ok" aria-hidden="true">✓</span><span class="pp-st-now">Agora</span></div><div class="pp-opts"></div>';
        s.opts.forEach(([val, name]) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'pp-opt';
          b.setAttribute('aria-label', s.label + ': ' + name);
          const sample = s.key === 'shape' ? { shape: val } : { shape: 'red', batter: s.key === 'batter' ? val : 'baun' };
          if (s.key === 'frost') sample.frost = val;
          if (s.key === 'deco') sample.deco = val;
          b.innerHTML = vdPpCake(sample) + '<span>' + name + '</span>';
          b.addEventListener('click', () => {
            if (g.at !== i || !g.cake || g.over) return;
            g.cake[s.key] = val;
            cakeEl.innerHTML = vdPpCake(g.cake);
            p.querySelectorAll('.pp-opt').forEach((o) => o.classList.toggle('sel', o === b));
          });
          p.querySelector('.pp-opts').appendChild(b);
        });
        stWrap.appendChild(p);
      });
      const paint = () => {
        wrap.querySelector('.pp-made').textContent = g.made + ' de ' + cfg.goal;
        wrap.querySelector('.pp-bar i').style.width = Math.min(100, (g.made / cfg.goal) * 100) + '%';
        wrap.querySelectorAll('.pp-miss i').forEach((d, k) => d.classList.toggle('on', k < g.miss));
      };
      const paintStations = () => {
        stWrap.querySelectorAll('.pp-station').forEach((p, k) => { p.classList.toggle('on', k === g.at); p.classList.toggle('done', k < g.passed && k !== g.at); });
        disps.forEach((d, k) => d.classList.toggle('on', k === g.at));
      };
      const moveTo = (x) => { cakeEl.style.left = (x - 40) + 'px'; };
      function nextCake() {
        if (g.over) return;
        const tok = ++g.token;
        g.order = { shape: pickR(STATIONS[0].opts), batter: pickR(STATIONS[1].opts), frost: pickR(STATIONS[2].opts), deco: pickR(STATIONS[3].opts) };
        wrap.querySelector('.pp-order-cake').innerHTML = vdPpCake(g.order);
        g.cake = { shape: null, batter: null, frost: null, deco: null };
        g.at = -1; g.passed = 0;
        stWrap.querySelectorAll('.pp-opt').forEach((o) => o.classList.remove('sel'));
        paintStations();
        cakeEl.classList.add('instant');
        moveTo(xs[0]);
        cakeEl.innerHTML = vdPpCake(g.cake);
        void cakeEl.offsetWidth;
        cakeEl.classList.remove('instant');
        verdict.className = 'pp-verdict';
        let step = 0;
        const go2 = () => {
          if (tok !== g.token || g.over) return;
          if (step < 4) {
            moveTo(xs[step + 1]);
            later(() => {
              if (tok !== g.token) return;
              g.at = step; paintStations();
              later(() => { if (tok !== g.token) return; g.at = -1; g.passed = step + 1; paintStations(); step++; go2(); }, cfg.dwell);
            }, 900);
          } else {
            moveTo(xs[5]);
            later(() => {
              if (tok !== g.token) return;
              const ok = ['shape', 'batter', 'frost', 'deco'].every((k) => g.cake[k] === g.order[k]);
              if (ok) g.made++; else g.miss++;
              verdict.className = 'pp-verdict show ' + (ok ? 'ok' : 'bad');
              verdict.textContent = ok ? '✓' : '✗';
              paint();
              if (g.made >= cfg.goal) { g.over = true; later(() => done({ title: 'Fábrica de Bolos', heading: 'Parabéns! Todos os pedidos foram entregues.', text: 'Bolos certos: ' + g.made + '\nErros: ' + g.miss }), 700); }
              else if (g.miss >= 3) { g.over = true; later(() => done({ title: 'Fábrica de Bolos', icon: 'lose', heading: 'Ops! Três bolos saíram diferentes do pedido.', text: 'Bolos certos: ' + g.made + ' de ' + cfg.goal }), 700); }
              else later(nextCake, 900);
            }, 900);
          }
        };
        later(go2, 500);
      }
      paint();
      nextCake();
      st.game = g;
    }

    // ================= Loja de Bonecos =================
    function shop() {
      header('Loja de Bonecos');
      const ALL = [
        { key: 'hat', label: 'Chapéu', opts: [['bon', 'Boné'], ['car', 'Cartola'], ['cro', 'Coroa'], ['gor', 'Gorro']] },
        { key: 'eyes', label: 'Olhos', opts: [['red', 'Redondos'], ['fel', 'Felizes'], ['son', 'Sonolentos'], ['est', 'Estrelas']] },
        { key: 'mouth', label: 'Boca', opts: [['sor', 'Sorriso'], ['abe', 'Aberta'], ['lin', 'Língua'], ['oo', 'Surpresa']] },
        { key: 'nose', label: 'Nariz', opts: [['bot', 'Botão'], ['cen', 'Cenoura'], ['pal', 'Palhaço'], ['cor', 'Coração']] },
        { key: 'shirt', label: 'Roupa', opts: [['ver', 'Vermelha'], ['azu', 'Azul'], ['vrd', 'Verde'], ['ama', 'Amarela']] }
      ];
      const feats = ALL.slice(0, { beg: 3, int: 4, adv: 5 }[st.level]);
      const target = {};
      feats.forEach((f) => { target[f.key] = f.opts[Math.floor(Math.random() * f.opts.length)][0]; });
      const g = { guess: {}, tries: 0, won: false, target };
      const wrap = document.createElement('div');
      wrap.className = 'pp-shop';
      wrap.innerHTML = '<div class="pp-mystery"><span>Boneco secreto</span><i class="pp-mq">?</i><i class="pp-msil"></i></div>' +
        '<i class="pp-pedestal"></i><div class="pp-doll"></div>' +
        '<div class="pp-parts"></div><div class="pp-hist"><b>Tentativas</b><ol></ol><div class="pp-legend">peça certa no lugar certo</div></div>';
      canvas.appendChild(wrap);
      const doll = wrap.querySelector('.pp-doll');
      const parts = wrap.querySelector('.pp-parts');
      const hist = wrap.querySelector('.pp-hist ol');
      const paintDoll = () => { doll.innerHTML = vdPpDoll(g.guess); check.disabled = g.won || feats.some((f) => !g.guess[f.key]); };
      const preview = { eyes: 'red', mouth: 'sor', nose: 'bot' };
      feats.forEach((f) => {
        const row = document.createElement('div');
        row.className = 'pp-part';
        row.innerHTML = '<b>' + f.label + '</b><div class="pp-opts"></div>';
        f.opts.forEach(([val, name]) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'pp-opt';
          b.setAttribute('aria-label', f.label + ': ' + name);
          const sample = Object.assign({}, preview); sample[f.key] = val;
          b.innerHTML = '<span class="pp-ov">' + vdPpDoll(sample) + '</span><span>' + name + '</span>';
          b.addEventListener('click', () => {
            if (g.won) return;
            g.guess[f.key] = val;
            row.querySelectorAll('.pp-opt').forEach((o) => o.classList.toggle('sel', o === b));
            paintDoll();
          });
          row.querySelector('.pp-opts').appendChild(b);
        });
        parts.appendChild(row);
      });
      const check = document.createElement('button');
      check.type = 'button';
      check.className = 'pp-check';
      check.textContent = 'Conferir';
      wrap.appendChild(check);
      check.addEventListener('click', () => {
        if (g.won) return;
        g.tries++;
        const right = feats.filter((f) => g.guess[f.key] === target[f.key]).length;
        let pips = '';
        feats.forEach((f, k) => { pips += '<i' + (k < right ? ' class="on"' : '') + '></i>'; });
        const li = document.createElement('li');
        li.innerHTML = '<span class="pp-mini">' + vdPpDoll(Object.assign({}, g.guess)) + '</span><span class="pp-hinfo"><span class="pp-pips">' + pips + '</span><span class="pp-htxt"><b>' + right + '</b> de ' + feats.length + ' certos</span></span>';
        hist.appendChild(li);
        hist.scrollTop = hist.scrollHeight;
        if (right === feats.length) {
          g.won = true;
          wrap.querySelector('.pp-mystery').innerHTML = '<span>Boneco secreto</span><span class="pp-mreveal">' + vdPpDoll(target) + '</span>';
          paintDoll();
          later(() => done({ title: 'Loja de Bonecos', heading: 'Você acertou o boneco secreto!', text: 'Tentativas: ' + g.tries }), 600);
        }
      });
      paintDoll();
      st.game = g;
    }

    function help() {
      const t = {
        hub: ['Bem-vindo à praça!', 'Clique numa das casas para jogar:\nPares: encontre as figuras iguais.\nBolos: monte o bolo do pedido na esteira.\nLoja: descubra como é o boneco secreto.\nA dificuldade fica no menu Jogo.'],
        pairs: ['Encontre os pares de figuras.', 'Clique em duas cartas para virá-las. Figuras iguais ficam marcadas no tabuleiro.\nNos níveis mais difíceis há o par do olho: quando você o encontra, todas as cartas aparecem por um instante.'],
        cakes: ['Monte o bolo do pedido.', 'O bolo anda pela esteira e para debaixo de cada bico: forma, massa, cobertura e enfeite.\nQuando a estação mostrar "Agora", clique na opção que aparece no pedido. Três bolos errados encerram o jogo.'],
        shop: ['Descubra o boneco secreto.', 'Escolha uma peça de cada tipo e clique em Conferir. A loja diz quantas peças estão certas, mas não quais.\nUse as tentativas anteriores para deduzir a resposta.']
      }[st.scene];
      vdDialog(root, { title: 'Como jogar', icon: 'info', heading: t[0], text: t[1], buttons: [{ label: 'OK', primary: true }] });
    }

    const onKey = (e) => { if (e.key === 'F2' && win.isActive() && st.scene !== 'hub') { e.preventDefault(); restart(); } };
    document.addEventListener('keydown', onKey);
    go('hub');
    win.el._game = { st, go, setLevel };
    return {
      destroy() {
        clearTimers(); stopTicker();
        if (ro) ro.disconnect(); else window.removeEventListener('resize', fit);
        document.removeEventListener('keydown', onKey);
        if (menu.closeMenus) menu.closeMenus();
      }
    };
  }
};
