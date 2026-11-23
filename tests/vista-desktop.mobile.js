// Celular (< 768px): sem desktop, so o conteudo da Trajetoria. Rodar com o argumento "mobile" no runner.
const stat = document.getElementById('vista-static');
const mon = document.querySelector('.vd-monitor');
return JSON.stringify({
  noDesktop: !window.vistaDesktop,                                        // true
  noMonitor: getComputedStyle(mon).display === 'none',                    // true
  staticShown: getComputedStyle(stat).display === 'block',                // true
  hasContent: stat.textContent.includes('Analista de Sistemas S'),        // true
  noTaskbar: document.querySelectorAll('.vd-bar').length === 0,           // true
  titleVisible: getComputedStyle(document.querySelector('#trajetoria h2')).position === 'static', // true
  hscroll: document.documentElement.scrollWidth <= innerWidth             // true
});
//---shot mobile
