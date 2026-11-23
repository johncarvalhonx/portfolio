/* ===== App "Purble Place" (três minijogos infantis, no espírito do Vista) =====
   Arte e personagens próprios, desenhados em SVG: Pares (memória), Fábrica de Bolos (esteira) e Loja de Bonecos (adivinhar). */

/* ícone: casinha lilás com um bolinho no telhado (sem gradientes com id) */
const VD_ICON_PURBLE = '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
  '<path d="M8 22L24 9l16 13z" fill="#8a4fd1" stroke="#4d2389" stroke-width="1.2" stroke-linejoin="round"/>' +
  '<rect x="11" y="22" width="26" height="19" rx="2" fill="#ffd2ec" stroke="#b05a92" stroke-width="1.2"/>' +
  '<rect x="20" y="29" width="8" height="12" rx="3" fill="#7a4a2a"/><circle cx="26" cy="35.5" r=".9" fill="#ffd34d"/>' +
  '<rect x="13.5" y="26" width="5" height="5" rx="1" fill="#9be1ff" stroke="#3a7fb8" stroke-width=".8"/><rect x="29.5" y="26" width="5" height="5" rx="1" fill="#9be1ff" stroke="#3a7fb8" stroke-width=".8"/>' +
  '<path d="M19 9.5h10v4H19z" fill="#f6c77a"/><path d="M18.5 9.5q5.5-5 11 0" fill="#ff8fc0"/><circle cx="24" cy="4.6" r="1.6" fill="#e2312a"/>' +
  '<path d="M8 22L24 9l16 13" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1"/></svg>';

const VD_PP_LEVELS = { beg: 'Iniciante', int: 'Intermediário', adv: 'Avançado' };

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

/* ---- bolo da fábrica: {shape, batter, frost, deco}; cada parte pode faltar ---- */
let vdPpUid = 0;
function vdPpCake(c) {
  const id = 'ppck' + (++vdPpUid);
  const batter = { choc: '#7a4a2a', baun: '#f3d9a0', mor: '#f6a6bd' }[c.batter] || null;
  const frost = { choc: '#4a2614', bran: '#fffaf2', rosa: '#ff7fb0' }[c.frost] || null;
  let body = '';
  if (c.shape === 'red') body = 'M20 58q0-10 40-10t40 10v24q0 10-40 10t-40-10z';
  else if (c.shape === 'qua') body = 'M22 48h76v44H22z';
  else if (c.shape === 'cor') body = 'M60 94C34 78 22 66 22 52c0-10 8-17 17-17 9 0 16 5 21 12 5-7 12-12 21-12 9 0 17 7 17 17 0 14-12 26-38 42z';
  let s = '<svg viewBox="0 0 120 100" aria-hidden="true" focusable="false"><ellipse cx="60" cy="93" rx="50" ry="6" fill="#cfd6df"/><ellipse cx="60" cy="92" rx="44" ry="4" fill="#eef2f6"/>';
  if (!body) return s + '</svg>';
  s += '<clipPath id="' + id + '"><path d="' + body + '"/></clipPath>';
  if (!batter) s += '<path d="' + body + '" fill="#c3cad3" stroke="#7d8794" stroke-width="2.5"/><path d="' + body + '" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1" transform="translate(0 -2)"/>';
  else {
    s += '<path d="' + body + '" fill="' + batter + '" stroke="#5a3418" stroke-width="2.5"/>';
    if (c.shape !== 'cor') s += '<path d="M22 70h76" stroke="#fff" stroke-opacity=".35" stroke-width="3" clip-path="url(#' + id + ')"/>';
  }
  if (frost) s += '<g clip-path="url(#' + id + ')"><path d="M10 30h100v32q-8 8-14 0t-14 4-14-4-14 6-14-6-14 4-16-4z" fill="' + frost + '" stroke="rgba(0,0,0,.18)" stroke-width="1.5"/></g>';
  const topY = c.shape === 'red' ? 50 : c.shape === 'qua' ? 48 : 44;
  if (c.deco === 'conf') { const cols = ['#ff4d4d', '#3ac2ff', '#ffd21f', '#6ee05a', '#c77dff']; for (let i = 0; i < 9; i++) s += '<rect x="' + (32 + i * 7) + '" y="' + (topY + 3 + (i % 3) * 3) + '" width="5" height="2.6" rx="1" fill="' + cols[i % 5] + '" transform="rotate(' + (i * 37 % 60 - 30) + ' ' + (34 + i * 7) + ' ' + (topY + 4) + ')"/>'; }
  else if (c.deco === 'cer') [44, 60, 76].forEach((x) => { s += '<path d="M' + x + ' ' + (topY - 4) + 'q3-8 8-10" stroke="#3a7d22" stroke-width="1.6" fill="none"/><circle cx="' + x + '" cy="' + (topY - 1) + '" r="5.5" fill="#d8102a" stroke="#860414" stroke-width="1"/><circle cx="' + (x - 2) + '" cy="' + (topY - 3) + '" r="1.5" fill="#fff" opacity=".7"/>'; });
  else if (c.deco === 'est') [42, 60, 78].forEach((x) => { s += '<path transform="translate(' + (x - 7) + ' ' + (topY - 12) + ') scale(.14)" d="M50 12l11 24 26 3-19 18 5 26-23-13-23 13 5-26-19-18 26-3z" fill="#ffd21f" stroke="#c48a00" stroke-width="6"/>'; });
  return s + '</svg>';
}

/* ---- boneco da loja: {hat, eyes, mouth, nose, shirt} ---- */
function vdPpDoll(f, mystery) {
  const shirt = { ver: '#e8402c', azu: '#2f7fe8', vrd: '#3ab54a', ama: '#ffc21f' }[f.shirt] || '#c9a8ef';
  let s = '<svg viewBox="0 0 160 200" aria-hidden="true" focusable="false">';
  if (mystery) {
    return s + '<path d="M80 22c26 0 44 18 44 42s-18 40-44 40-44-16-44-40 18-42 44-42zM40 112h80l10 70H30z" fill="#5b3d8a" opacity=".85"/><text x="80" y="92" text-anchor="middle" font-size="58" font-weight="700" fill="#fff" font-family="Segoe UI,Tahoma,Arial,sans-serif">?</text></svg>';
  }
  s += '<path d="M36 182l10-74h68l10 74z" fill="' + shirt + '" stroke="rgba(0,0,0,.35)" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<path d="M46 116l-22 40M114 116l22 40" stroke="#f2c49b" stroke-width="12" stroke-linecap="round"/>' +
    '<path d="M62 182v12M98 182v12" stroke="#6b4a2c" stroke-width="10" stroke-linecap="round"/>' +
    '<circle cx="80" cy="66" r="44" fill="#ffdcbf" stroke="#c98d62" stroke-width="2.5"/>' +
    '<circle cx="52" cy="80" r="7" fill="#ff9fb0" opacity=".6"/><circle cx="108" cy="80" r="7" fill="#ff9fb0" opacity=".6"/>';
  // olhos
  const ex = [64, 96], ey = 60;
  if (f.eyes === 'red') ex.forEach((x) => { s += '<circle cx="' + x + '" cy="' + ey + '" r="9" fill="#fff" stroke="#333" stroke-width="2"/><circle cx="' + x + '" cy="' + (ey + 1) + '" r="4.5" fill="#222"/>'; });
  else if (f.eyes === 'fel') ex.forEach((x) => { s += '<path d="M' + (x - 9) + ' ' + (ey + 3) + 'q9-12 18 0" stroke="#222" stroke-width="3.5" fill="none" stroke-linecap="round"/>'; });
  else if (f.eyes === 'son') ex.forEach((x) => { s += '<path d="M' + (x - 9) + ' ' + ey + 'h18" stroke="#222" stroke-width="3.5" stroke-linecap="round"/><path d="M' + (x - 8) + ' ' + ey + 'q8 8 16 0" fill="#222"/>'; });
  else if (f.eyes === 'est') ex.forEach((x) => { s += '<path transform="translate(' + (x - 10) + ' ' + (ey - 10) + ') scale(.2)" d="M50 12l11 24 26 3-19 18 5 26-23-13-23 13 5-26-19-18 26-3z" fill="#ffd21f" stroke="#c48a00" stroke-width="6"/>'; });
  else ex.forEach((x) => { s += '<circle cx="' + x + '" cy="' + ey + '" r="3" fill="#bba48f"/>'; });
  // nariz
  if (f.nose === 'bot') s += '<circle cx="80" cy="74" r="4.5" fill="#d98a5a"/>';
  else if (f.nose === 'cen') s += '<path d="M78 70l18 6-18 4z" fill="#ff8a1f" stroke="#c45a08" stroke-width="1.5" stroke-linejoin="round"/>';
  else if (f.nose === 'pal') s += '<circle cx="80" cy="75" r="8" fill="#ff3b3b" stroke="#a80d0d" stroke-width="1.5"/><circle cx="77" cy="72" r="2.2" fill="#fff" opacity=".7"/>';
  else if (f.nose === 'cor') s += '<path transform="translate(70 66) scale(.2)" d="M50 84C24 64 12 50 12 34c0-12 9-20 20-20 8 0 14 5 18 12 4-7 10-12 18-12 11 0 20 8 20 20 0 16-12 30-38 50z" fill="#ff5a8a"/>';
  // boca
  if (f.mouth === 'sor') s += '<path d="M64 88q16 14 32 0" stroke="#7a2a1a" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
  else if (f.mouth === 'abe') s += '<path d="M64 86q16 22 32 0z" fill="#7a1f12"/><path d="M70 96q10 6 20 0" fill="#ff7f8a"/>';
  else if (f.mouth === 'lin') s += '<path d="M64 88q16 10 32 0" stroke="#7a2a1a" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M80 92q0 10 7 9t3-10z" fill="#ff5a7a" stroke="#b02040" stroke-width="1.2"/>';
  else if (f.mouth === 'oo') s += '<ellipse cx="80" cy="92" rx="6" ry="8" fill="#7a1f12"/>';
  // chapéu
  if (f.hat === 'bon') s += '<path d="M38 50q2-34 42-34t42 34z" fill="#e8402c" stroke="#8e1c10" stroke-width="2.5"/><path d="M110 48q22 0 30 8-20 2-32-2z" fill="#c22e1c" stroke="#8e1c10" stroke-width="2"/><circle cx="80" cy="17" r="4" fill="#8e1c10"/>';
  else if (f.hat === 'car') s += '<rect x="56" y="-4" width="48" height="40" rx="3" fill="#222" stroke="#000" stroke-width="2"/><rect x="56" y="24" width="48" height="8" fill="#c0392b"/><rect x="40" y="34" width="80" height="8" rx="4" fill="#111"/>';
  else if (f.hat === 'cro') s += '<path d="M46 40l4-30 14 16 16-22 16 22 14-16 4 30z" fill="#ffcf24" stroke="#b88400" stroke-width="2.5" stroke-linejoin="round"/><circle cx="80" cy="28" r="4" fill="#e3342f"/><circle cx="62" cy="32" r="3" fill="#2f8ee8"/><circle cx="98" cy="32" r="3" fill="#3ab54a"/>';
  else if (f.hat === 'gor') s += '<path d="M38 52q0-42 42-42t42 42z" fill="#2f7fe8" stroke="#164f9e" stroke-width="2.5"/><rect x="36" y="44" width="88" height="12" rx="6" fill="#8cc3ff" stroke="#164f9e" stroke-width="2"/><circle cx="80" cy="8" r="9" fill="#fff" stroke="#aac" stroke-width="2"/>';
  return s + '</svg>';
}

/* ---- praça com as três casas ---- */
function vdPpTown() {
  const house = (x, wall, roof, label, game, extra) =>
    '<g class="pp-bld" data-game="' + game + '" tabindex="0" role="button" aria-label="' + label + '">' +
    '<rect x="' + (x - 8) + '" y="196" width="196" height="210" rx="18" fill="#fff" opacity="0" class="pp-bld-hit"/>' +
    '<rect x="' + x + '" y="250" width="180" height="150" rx="6" fill="' + wall + '" stroke="rgba(0,0,0,.3)" stroke-width="3"/>' +
    '<path d="M' + (x - 14) + ' 256L' + (x + 90) + ' 176L' + (x + 194) + ' 256z" fill="' + roof + '" stroke="rgba(0,0,0,.35)" stroke-width="3" stroke-linejoin="round"/>' +
    '<rect x="' + (x + 68) + '" y="330" width="44" height="70" rx="20" fill="#8a5a2a" stroke="#5a3414" stroke-width="3"/><circle cx="' + (x + 102) + '" cy="368" r="3.5" fill="#ffd34d"/>' +
    '<rect x="' + (x + 16) + '" y="280" width="38" height="34" rx="4" fill="#bfe9ff" stroke="#3a7fb8" stroke-width="3"/><rect x="' + (x + 126) + '" y="280" width="38" height="34" rx="4" fill="#bfe9ff" stroke="#3a7fb8" stroke-width="3"/>' +
    '<rect x="' + (x + 30) + '" y="214" width="120" height="30" rx="15" fill="#fffbe8" stroke="rgba(0,0,0,.3)" stroke-width="2.5"/>' +
    '<text x="' + (x + 90) + '" y="235" text-anchor="middle" font-size="17" font-weight="700" fill="#4d2389" font-family="Segoe UI,Tahoma,Arial,sans-serif">' + label + '</text>' + extra + '</g>';
  const cloud = (x, y, k) => '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')" fill="#fff"><ellipse cx="0" cy="0" rx="40" ry="18"/><ellipse cx="26" cy="-10" rx="26" ry="18"/><ellipse cx="-24" cy="-6" rx="22" ry="14"/></g>';
  const mascot = (x, y, body, flip) =>
    '<g transform="translate(' + x + ' ' + y + ')' + (flip ? ' scale(-1 1)' : '') + '"><path d="M0 -40q-8-14 2-22" stroke="#3b2a6a" stroke-width="3" fill="none"/><circle cx="2" cy="-64" r="5" fill="#ff7fb8"/>' +
    '<path d="M-24 0c0-30 10-44 24-44s24 14 24 44c0 10-10 14-24 14s-24-4-24-14z" fill="' + body + '" stroke="rgba(0,0,0,.35)" stroke-width="2.5"/>' +
    '<ellipse cx="-8" cy="-22" rx="7" ry="9" fill="#fff"/><ellipse cx="9" cy="-22" rx="7" ry="9" fill="#fff"/><circle cx="-6" cy="-20" r="3.5" fill="#222"/><circle cx="11" cy="-20" r="3.5" fill="#222"/>' +
    '<path d="M-8 -6q9 8 18 0" stroke="#3b2a6a" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M-16 14v6M14 14v6" stroke="#3b2a6a" stroke-width="5" stroke-linecap="round"/></g>';
  return '<svg class="pp-town" viewBox="0 0 784 520" preserveAspectRatio="xMidYMid slice" aria-label="Praça">' +
    '<rect width="784" height="520" fill="#9fdcff"/><rect y="0" width="784" height="300" fill="#7fcfff" opacity=".5"/>' +
    '<circle cx="690" cy="70" r="36" fill="#fff2a8"/><circle cx="690" cy="70" r="26" fill="#ffd94a"/>' +
    cloud(140, 70, 1) + cloud(420, 50, 0.8) + cloud(600, 130, 0.7) +
    '<path d="M0 330q120-60 260-20t280 0 244-20V520H0z" fill="#86d35a"/><path d="M0 400q160-40 400-10t384-20V520H0z" fill="#68bd3e"/>' +
    '<path d="M330 520q30-90 62-120t60-0q30 30 60 120z" fill="#f2d79a" opacity=".85"/>' +
    house(40, '#ffe58a', '#e0453a', 'Pares', 'pairs', '<path d="M118 176v-18h24v18" fill="#c0392b" stroke="#7c1d14" stroke-width="3"/><path d="M130 158l-12-10h24z" fill="#7c1d14"/><circle cx="130" cy="170" r="5" fill="#ffd34d"/>') +
    house(302, '#ffd2ec', '#7a4a2a', 'Bolos', 'cakes', '<g transform="translate(362 120) scale(.5)">' + '<path d="M20 58q0-10 40-10t40 10v24q0 10-40 10t-40-10z" fill="#f3d9a0" stroke="#5a3418" stroke-width="5"/><path d="M20 58q0-10 40-10t40 10v8q-10 8-20 0t-20 6-20-6-20 0z" fill="#ff7fb0"/><circle cx="60" cy="40" r="8" fill="#d8102a"/></g>') +
    house(564, '#c8ecff', '#8a4fd1', 'Loja', 'shop', '<path d="M630 170q24-26 48 0z" fill="#222"/><rect x="636" y="136" width="36" height="34" rx="3" fill="#222"/><rect x="636" y="158" width="36" height="6" fill="#c0392b"/>') +
    mascot(270, 470, '#9be05a', false) + mascot(520, 478, '#ff9fd0', true) + '</svg>';
}

const VD_PURBLE_APP = {
  id: 'purble',
  title: 'Purble Place',
  icon: VD_ICON_PURBLE,
  size: { w: 820, h: 640 },
  resizable: false,
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
    root.appendChild(stage);
    body.appendChild(root);

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
      stage.innerHTML = '';
      stage.className = 'pp-stage pp-scene-' + scene;
      if (scene === 'hub') hub();
      else if (scene === 'pairs') pairs();
      else if (scene === 'cakes') cakes();
      else shop();
    }
    const header = (title) => {
      const h = document.createElement('div');
      h.className = 'pp-head';
      h.innerHTML = '<button type="button" class="pp-back">◀ Praça</button><b></b><span class="pp-lvl"></span>';
      h.querySelector('b').textContent = title;
      h.querySelector('.pp-lvl').textContent = VD_PP_LEVELS[st.level];
      h.querySelector('.pp-back').addEventListener('click', () => go('hub'));
      stage.appendChild(h);
      return h;
    };
    const done = (opts) => { st.dlg = vdDialog(root, Object.assign({ icon: 'win', buttons: [{ label: 'Praça', action: () => go('hub') }, { label: 'Jogar novamente', primary: true, action: () => restart() }] }, opts)); };

    // ================= praça =================
    function hub() {
      stage.innerHTML = vdPpTown() + '<div class="pp-hint">Clique numa casa para jogar</div>';
      stage.querySelectorAll('.pp-bld').forEach((b) => {
        b.addEventListener('click', () => go(b.dataset.game));
        b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(b.dataset.game); } });
      });
    }

    // ================= Pares (memória) =================
    function pairs() {
      header('Pares');
      const cfg = { beg: [4, 3, false], int: [5, 4, true], adv: [6, 5, true] }[st.level];
      const cols = cfg[0], rows = cfg[1], special = cfg[2];
      const nPairs = (cols * rows) / 2;
      const names = Object.keys(VD_PP_PICS).filter((k) => k !== 'espiar').sort(() => Math.random() - 0.5).slice(0, special ? nPairs - 1 : nPairs);
      if (special) names.push('espiar');
      const deck = names.concat(names).sort(() => Math.random() - 0.5);
      const g = { open: [], lock: false, left: nPairs, tries: 0, time: 0, started: false };
      const grid = document.createElement('div');
      grid.className = 'pp-grid';
      grid.style.gridTemplateColumns = 'repeat(' + cols + ', var(--pp-card))';
      grid.style.setProperty('--pp-card', (cols >= 6 ? 84 : cols === 5 ? 92 : 104) + 'px');
      deck.forEach((name, i) => {
        const c = document.createElement('button');
        c.type = 'button';
        c.className = 'pp-card';
        c.dataset.name = name;
        c.dataset.i = String(i);
        c.setAttribute('aria-label', 'Carta virada');
        c.innerHTML = '<span class="pp-card-in"><span class="pp-back-face"></span><span class="pp-front"><svg viewBox="0 0 100 100" aria-hidden="true">' + VD_PP_PICS[name] + '</svg></span></span>';
        grid.appendChild(c);
      });
      stage.appendChild(grid);
      const foot = document.createElement('div');
      foot.className = 'pp-foot';
      foot.innerHTML = '<span>Tentativas: <b class="pp-tries">0</b></span><span>Pares restantes: <b class="pp-left">' + nPairs + '</b></span><span>Tempo: <b class="pp-time">0</b></span>';
      stage.appendChild(foot);
      const paint = () => { foot.querySelector('.pp-tries').textContent = g.tries; foot.querySelector('.pp-left').textContent = g.left; foot.querySelector('.pp-time').textContent = g.time; };
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
            if (!g.left) { g.lock = true; later(() => done({ title: 'Pares', heading: 'Muito bem! Você encontrou todos os pares.', text: 'Tentativas: ' + g.tries + '\nTempo: ' + g.time + ' segundos' }), 500); }
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
      const pickR = (a) => a[Math.floor(Math.random() * a.length)][0];
      const g = { made: 0, miss: 0, order: null, cake: null, at: -1, token: 0, over: false };
      const wrap = document.createElement('div');
      wrap.className = 'pp-factory';
      wrap.innerHTML = '<div class="pp-order"><b>Pedido</b><div class="pp-order-cake"></div><span class="pp-made"></span><span class="pp-miss"></span></div>' +
        '<div class="pp-belt-zone"><div class="pp-belt"></div><div class="pp-box">Caixa</div><div class="pp-cake-on"></div><div class="pp-verdict"></div></div>' +
        '<div class="pp-stations"></div>';
      stage.appendChild(wrap);
      const belt = wrap.querySelector('.pp-belt-zone');
      const cakeEl = wrap.querySelector('.pp-cake-on');
      const verdict = wrap.querySelector('.pp-verdict');
      const stWrap = wrap.querySelector('.pp-stations');
      const xs = [10, 18, 38, 58, 78, 92];
      STATIONS.forEach((s, i) => {
        const p = document.createElement('div');
        p.className = 'pp-station';
        p.dataset.i = String(i);
        p.innerHTML = '<b>' + (i + 1) + '. ' + s.label + '</b><div class="pp-opts"></div>';
        s.opts.forEach(([val, name]) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'pp-opt';
          b.title = name;
          b.setAttribute('aria-label', s.label + ': ' + name);
          const sample = { shape: s.key === 'shape' ? val : 'red', batter: s.key === 'batter' ? val : (s.key === 'shape' ? null : 'baun'), frost: s.key === 'frost' ? val : null, deco: s.key === 'deco' ? val : null };
          if (s.key === 'shape') sample.batter = null;
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
        const mark = document.createElement('div');
        mark.className = 'pp-st-mark';
        mark.style.left = xs[i + 1] + '%';
        mark.textContent = String(i + 1);
        belt.appendChild(mark);
      });
      const paint = () => {
        wrap.querySelector('.pp-made').textContent = 'Bolos prontos: ' + g.made + ' de ' + cfg.goal;
        wrap.querySelector('.pp-miss').textContent = 'Erros: ' + g.miss + ' de 3';
      };
      const activate = (i) => {
        g.at = i;
        stWrap.querySelectorAll('.pp-station').forEach((p) => { p.classList.toggle('on', Number(p.dataset.i) === i); if (Number(p.dataset.i) === i) p.querySelectorAll('.pp-opt').forEach((o) => o.classList.remove('sel')); });
        belt.querySelectorAll('.pp-st-mark').forEach((m, k) => m.classList.toggle('on', k === i));
      };
      const moveTo = (x) => { cakeEl.style.left = x + '%'; };
      function nextCake() {
        if (g.over) return;
        const tok = ++g.token;
        g.order = { shape: pickR(STATIONS[0].opts), batter: pickR(STATIONS[1].opts), frost: pickR(STATIONS[2].opts), deco: pickR(STATIONS[3].opts) };
        wrap.querySelector('.pp-order-cake').innerHTML = vdPpCake(g.order);
        g.cake = { shape: null, batter: null, frost: null, deco: null };
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
              activate(step);
              later(() => { if (tok !== g.token) return; activate(-1); step++; go2(); }, cfg.dwell);
            }, 900);
          } else {
            moveTo(xs[5]);
            later(() => {
              if (tok !== g.token) return;
              const ok = ['shape', 'batter', 'frost', 'deco'].every((k) => g.cake[k] === g.order[k]);
              if (ok) g.made++; else g.miss++;
              verdict.className = 'pp-verdict show ' + (ok ? 'ok' : 'bad');
              verdict.textContent = ok ? '✔' : '✘';
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
      wrap.innerHTML = '<div class="pp-doll-col"><div class="pp-mystery"><span>Boneco secreto</span>' + vdPpDoll({}, true) + '</div><div class="pp-doll"></div></div>' +
        '<div class="pp-parts"></div><div class="pp-hist"><b>Tentativas</b><ol></ol></div>';
      stage.appendChild(wrap);
      const doll = wrap.querySelector('.pp-doll');
      const parts = wrap.querySelector('.pp-parts');
      const paintDoll = () => { doll.innerHTML = vdPpDoll(g.guess); check.disabled = g.won || feats.some((f) => !g.guess[f.key]); };
      feats.forEach((f) => {
        const row = document.createElement('div');
        row.className = 'pp-part';
        row.innerHTML = '<b>' + f.label + '</b><div class="pp-opts"></div>';
        f.opts.forEach(([val, name]) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'pp-opt';
          b.title = name;
          b.setAttribute('aria-label', f.label + ': ' + name);
          const sample = {}; sample[f.key] = val;
          if (f.key !== 'eyes') sample.eyes = 'red';
          b.innerHTML = vdPpDoll(sample) + '<span>' + name + '</span>';
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
      parts.appendChild(check);
      check.addEventListener('click', () => {
        if (g.won) return;
        g.tries++;
        const right = feats.filter((f) => g.guess[f.key] === target[f.key]).length;
        const li = document.createElement('li');
        li.innerHTML = '<span class="pp-mini">' + vdPpDoll(Object.assign({}, g.guess)) + '</span><span><b>' + right + '</b> de ' + feats.length + ' certos</span>';
        wrap.querySelector('.pp-hist ol').prepend(li);
        if (right === feats.length) {
          g.won = true;
          wrap.querySelector('.pp-mystery').innerHTML = '<span>Boneco secreto</span>' + vdPpDoll(target);
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
        pairs: ['Encontre os pares de figuras.', 'Clique em duas cartas para virá-las. Figuras iguais saem do tabuleiro.\nNos níveis mais difíceis há o par do olho: quando você o encontra, todas as cartas aparecem por um instante.'],
        cakes: ['Monte o bolo do pedido.', 'O bolo anda pela esteira e para em cada estação: forma, massa, cobertura e enfeite.\nQuando a estação acender, clique na opção que aparece no pedido. Três bolos errados encerram o jogo.'],
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
        document.removeEventListener('keydown', onKey);
        if (menu.closeMenus) menu.closeMenus();
      }
    };
  }
};
