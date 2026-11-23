/* ===== App "Trajetória profissional" (janela estilo Explorer do Vista) ===== */

const VD_TRAJETORIA_DATA = {
  jobs: [
    { period: 'out 2025 – atual', role: 'Analista de Sistemas Sênior', org: 'Claro Brasil', desc: 'Backend, APIs e integrações; sustentação de serviços em produção; instrumentação de logging e alertas.', dot: 'radial-gradient(circle at 35% 30%, #d9ffb8, #3fbf2a 60%, #1f7a12)', ring: '#2f9a1f' },
    { period: 'jan 2023 – atual', role: 'Desenvolvedor Backend', org: 'Autônomo', desc: 'APIs e ferramentas em Python; integrações com serviços externos.', dot: 'radial-gradient(circle at 35% 30%, #d6f2ff, #3aa0ea 60%, #0d5fb8)', ring: '#1478cc' },
    { period: 'ago – out 2025', role: 'Analista de Sistemas', org: 'Polícia Civil (DIPOL/DTI)', desc: 'Suporte e análise de sistemas internos.', dot: 'radial-gradient(circle at 35% 30%, #d6f2ff, #3aa0ea 60%, #0d5fb8)', ring: '#1478cc' },
    { period: 'mai 2024 – jul 2025', role: 'Digitador', org: 'PRODESP', desc: 'Tratamento e estruturação de dados.', dot: 'radial-gradient(circle at 35% 30%, #d6f2ff, #3aa0ea 60%, #0d5fb8)', ring: '#1478cc' }
  ],
  degree: { title: 'Bacharelado em Ciência da Computação', school: 'UNIP, São Paulo' },
  certs: [
    'Programação concorrente e assíncrona com Python',
    'Python do básico ao avançado',
    'React com TypeScript',
    'Desenvolvimento web completo (HTML, CSS e JavaScript)',
    'Java e Spring Boot com MySQL e MongoDB'
  ]
};

const VD_TRAJETORIA_APP = {
  id: 'trajetoria',
  title: 'Trajetória profissional',
  icon: VD_ICON_FOLDER,
  size: { w: 860, h: 580, minW: 520, minH: 360 },
  resizable: true,
  render(body) {
    const D = VD_TRAJETORIA_DATA;
    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const chev = '<i>▶</i>';
    const jobs = D.jobs.map((j, i) =>
      '<div class="vd-job"><div class="vd-job-rail" aria-hidden="true"><span class="vd-job-dot" style="background:' + j.dot + ';box-shadow:0 0 0 1px ' + j.ring + ',0 2px 6px rgba(0,50,120,.35)"></span>' +
      '<span class="vd-job-line"></span></div><div class="vd-job-txt"><span class="vd-job-per">' + esc(j.period) + '</span><span class="vd-job-role">' + esc(j.role) + '</span>' +
      '<span class="vd-job-org">' + esc(j.org) + '</span><span class="vd-job-desc">' + esc(j.desc) + '</span></div></div>').join('');
    const certs = D.certs.map((c) =>
      '<div class="vd-cert"><i aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></i><span>' + esc(c) + '</span></div>').join('');
    body.innerHTML =
      '<div class="vd-ex-chrome" aria-hidden="true"><div class="vd-ex-nav">' +
        '<span class="vd-ex-orb"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
        '<span class="vd-ex-orb off"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="#8fa3b5" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>' +
        '<div class="vd-ex-addr">Computador ' + chev + ' João Carvalho ' + chev + ' <b>Trajetória profissional</b> ' + chev + '</div>' +
        '<div class="vd-ex-search">Pesquisar</div></div>' +
      '<div class="vd-ex-cmd" aria-hidden="true"><span>Organizar ▾</span><span>Exibições ▾</span></div>' +
      '<div class="vd-ex-body"><nav class="vd-ex-side" aria-label="Seções"><h4>Links Favoritos</h4>' +
        '<button type="button" class="vd-ex-link on" data-go="exp">Experiência</button>' +
        '<button type="button" class="vd-ex-link" data-go="edu">Formação</button>' +
        '<button type="button" class="vd-ex-link" data-go="cert">Certificações</button></nav>' +
        '<div class="vd-ex-main"><div class="vd-ex-col exp"><h3 data-sec="exp">Experiência</h3>' + jobs + '</div>' +
        '<div class="vd-ex-col edu"><h3 data-sec="edu">Formação</h3><div class="vd-edu"><span class="vd-edu-ico" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/></svg></span>' +
          '<div><b>' + esc(D.degree.title) + '</b><span>' + esc(D.degree.school) + '</span></div></div>' +
          '<h3 data-sec="cert">Certificações na Udemy</h3>' + certs + '</div></div></div>' +
      '<div class="vd-ex-status" aria-hidden="true">' + (D.jobs.length + 1 + D.certs.length) + ' itens</div>';

    const main = body.querySelector('.vd-ex-main');
    const links = body.querySelectorAll('.vd-ex-link');
    const go = (key) => {
      const h = body.querySelector('[data-sec="' + key + '"]');
      if (!h) return;
      const top = h.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - 12;
      main.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      links.forEach((l) => l.classList.toggle('on', l.dataset.go === key));
    };
    links.forEach((l) => l.addEventListener('click', () => go(l.dataset.go)));
    return {};
  }
};
