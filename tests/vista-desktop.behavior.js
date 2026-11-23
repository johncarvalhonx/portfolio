// Verificacao de comportamento do desktop. Rodar com: python tests/browser_runner.py URL 1440 900 saida.png tests/vista-desktop.behavior.js
// Retorna um JSON; cada chave deve bater com o valor esperado indicado no comentario ou com o descrito em docs/superpowers/specs.
const out = {};
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const W = () => document.querySelector('.vd-win');
const R = () => W().getBoundingClientRect();
const pe = (el, type, x, y, id) => el.dispatchEvent(new PointerEvent(type, {pointerId: id || 1, clientX: x, clientY: y, bubbles: true, cancelable: true, button: 0, isPrimary: true}));
const stage = document.querySelector('.vd-stage');
const S = () => stage.getBoundingClientRect();
const t = document.querySelector('.vd-title');
// arrastar
let r0 = R();
pe(t, 'pointerdown', r0.left + 100, r0.top + 15); pe(t, 'pointermove', r0.left + 220, r0.top + 75); pe(t, 'pointerup', r0.left + 220, r0.top + 75);
let r1 = R(); out.drag = [Math.round(r1.left - r0.left), Math.round(r1.top - r0.top)];
// arrastar para fora: barra de titulo continua dentro
pe(t, 'pointerdown', r1.left + 100, r1.top + 15); pe(t, 'pointermove', -5000, -5000); pe(t, 'pointerup', -5000, -5000);
let rr = R(); out.clampTL = {top: Math.round(rr.top - S().top), rightVisible: Math.round(rr.right - S().left)};
pe(t, 'pointerdown', rr.left + 100, rr.top + 15); pe(t, 'pointermove', 9000, 9000); pe(t, 'pointerup', 9000, 9000);
rr = R(); out.clampBR = {titleY: Math.round(rr.top - S().top), stageH: Math.round(S().height), leftVisible: Math.round(S().right - rr.left)};
// pointercancel: movimentos seguintes nao deslocam
d.wins.get('trajetoria').x = 100; d.wins.get('trajetoria').y = 20; d._apply(d.wins.get('trajetoria'));
r0 = R();
pe(t, 'pointerdown', r0.left + 100, r0.top + 15); pe(t, 'pointermove', r0.left + 150, r0.top + 15); pe(t, 'pointercancel', r0.left + 150, r0.top + 15); pe(t, 'pointermove', r0.left + 400, r0.top + 15);
out.cancel = Math.round(R().left - r0.left); // 50
// redimensionar pela alca se
r0 = R(); const se = document.querySelector('.vd-rs[data-edge="se"]');
pe(se, 'pointerdown', r0.right, r0.bottom); pe(se, 'pointermove', r0.right + 100, r0.bottom + 20); pe(se, 'pointerup', r0.right + 100, r0.bottom + 20);
r1 = R(); out.resizeGrow = [Math.round(r1.width - r0.width), Math.round(r1.height - r0.height)]; // 100,20
pe(se, 'pointerdown', r1.right, r1.bottom); pe(se, 'pointermove', r1.right - 3000, r1.bottom - 3000); pe(se, 'pointerup', 0, 0);
r1 = R(); out.resizeMin = [Math.round(r1.width), Math.round(r1.height)]; // 520,360 (+/- borda)
// maximizar / restaurar
d.toggleMaximize('trajetoria'); await sleep(50);
let m = R(); out.max = [d.getState('trajetoria'), Math.round(m.width - S().width), Math.round(m.height - S().height)];
t.dispatchEvent(new MouseEvent('dblclick', {bubbles: true})); await sleep(50); out.unmax = d.getState('trajetoria');
// minimizar rapido x11 pela barra: termina minimizada; restaurar -> visivel
const tb = document.querySelector('.vd-tb');
for (let i = 0; i < 11; i++) tb.click();
out.afterOdd = d.getState('trajetoria');
d.restore('trajetoria'); await sleep(500);
out.restoredVisible = [d.getState('trajetoria'), getComputedStyle(W()).visibility, Math.round(R().width) > 100, getComputedStyle(W()).opacity];
// mostrar area de trabalho
d.showDesktop(); await sleep(300); out.showDesk = d.getState('trajetoria'); d.showDesktop(); await sleep(300); out.showDesk2 = d.getState('trajetoria');
// janela maior que o desktop + resize
d.wins.get('trajetoria').w = 5000; d.wins.get('trajetoria').h = 5000; window.dispatchEvent(new Event('resize')); await sleep(50);
out.clampResize = [Math.round(R().width) <= Math.round(S().width), Math.round(R().height) <= Math.round(S().height)];
// popups
d.togglePanel('clock', true);
out.clock = [!document.querySelector('.vd-panel[data-panel="clock"]').hidden, document.querySelectorAll('.vd-cal .today').length, document.querySelectorAll('.vd-cal-grid span:not(.out)').length];
d.toggleStart(true); out.oneAtATime = [document.querySelector('.vd-start').hidden, document.querySelector('.vd-panel[data-panel="clock"]').hidden];
document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true})); out.esc = document.querySelector('.vd-start').hidden;
d.togglePanel('volume', true); pe(document.querySelector('.vd-stage'), 'pointerdown', 300, 300); out.outsideClose = document.querySelector('.vd-panel[data-panel="volume"]').hidden;
// fechar e reabrir
d.close('trajetoria'); await sleep(400);
out.closed = [d.getState('trajetoria'), document.querySelectorAll('.vd-win').length, document.querySelectorAll('.vd-tb').length];
document.querySelector('.vd-icon[data-app="trajetoria"]').dispatchEvent(new MouseEvent('dblclick', {bubbles: true})); await sleep(300);
out.reopened = [d.getState('trajetoria'), document.querySelectorAll('.vd-win').length, document.querySelectorAll('.vd-tb').length];
// app de teste (extensibilidade)
let destroyed = false;
d.registerApp({id: 'teste', title: 'Teste', icon: '<svg viewBox="0 0 24 24"><rect width="24" height="24"/></svg>', size: {w: 300, h: 200}, resizable: false, render(b) { b.textContent = 'ola'; return {destroy() { destroyed = true; }}; }});
d.open('teste'); await sleep(100);
const tw = document.querySelector('.vd-win[data-app="teste"]');
out.testeApp = [d.getState('teste'), tw.textContent.indexOf('ola') >= 0, tw.querySelectorAll('.vd-rs').length, document.querySelectorAll('.vd-tb').length];
d.toggleMaximize('teste'); out.testeNoMax = d.getState('teste');
d.close('teste'); await sleep(300); out.testeClosed = [d.getState('teste'), destroyed, document.querySelectorAll('.vd-tb').length];
// regressoes da revisao
d.open('teste'); d.minimize('teste');
out.openThenMin = [document.querySelector('.vd-win[data-app="teste"]').classList.contains('opening'), d.getState('teste')]; // [false,'min']
d.close('teste'); await sleep(300);
const rec0 = d.wins.get('trajetoria'); const w0 = rec0.w; stage.style.display = 'none'; window.dispatchEvent(new Event('resize')); stage.style.display = '';
out.zeroGuard = rec0.w === w0 && rec0.w > 0;
out.uniqueIds = document.querySelectorAll('#vdf1').length === 1;
out.clockAria = /Data e hora: \d\d:\d\d, \d\d\/\d\d\/\d{4}/.test(document.querySelector('.vd-clock').getAttribute('aria-label'));
// React nao apaga o desktop
const ref = W(); const tabBtn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Mobile' && !b.closest('.vd'));
if (tabBtn) tabBtn.click();
await sleep(3500);
out.reactKeeps = [document.contains(ref), !!document.getElementById('vista-desktop').children.length];
out.noHScroll = document.documentElement.scrollWidth <= innerWidth;
return JSON.stringify(out);
//---shot final
