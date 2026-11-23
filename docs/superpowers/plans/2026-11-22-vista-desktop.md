# Desktop Windows Vista — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar a janela estática da seção Trajetória por um desktop Windows Vista funcional (janelas, barra de tarefas, Iniciar, bandeja), pronto para receber jogos depois.

**Architecture:** Um motor em JavaScript puro (`VistaDesktop`) monta numa `div` vazia que o React não toca; apps se registram nele (`registerApp`). O código vive em arquivos próprios em `src/` e o `build.py` os injeta no template por marcadores `@include` antes de gerar o `index.html`.

**Tech Stack:** HTML/CSS/JS puro dentro do runtime React do site, Pointer Events, SVG inline, Python 3 (`build.py`). Sem bibliotecas novas.

**Spec:** `docs/superpowers/specs/2026-11-22-vista-desktop-design.md` (protótipo visual: `docs/superpowers/specs/assets/vista-mockup.html`, fonte do CSS e dos SVGs; adaptar classes, não copiar o `<body>` cego).

## Global Constraints

- Editar só `src/` e rodar `python build.py` (o `index.html` é gerado); não tocar na pasta não versionada `portfolio/`.
- Texto da interface em pt-BR; fuso `America/Sao_Paulo`; relógio `HH:MM` e data `dd/mm/aaaa`.
- Todas as classes CSS do desktop com prefixo `vd-`. Sem bibliotecas, sem arquivos/ícones/sons da Microsoft, sem áudio.
- Barra de tarefas 40px; orbe 58px sobrepondo 18px acima. Seção de largura total: `height: 100svh; min-height: 640px; max-height: 900px`. Mobile (< 768px): `height: 80svh; min-height: 520px`, janelas abrem maximizadas.
- Respeitar `prefers-reduced-motion`. Mobile ≥ 375px sem rolagem horizontal.
- Menu de navegação, outras seções e rodapé inalterados; `<h2>` "Trajetória" permanece, visualmente oculto; âncora `#trajetoria` continua funcionando.
- Uma instância por app (`open` de um app já aberto restaura e foca).
- Commits terminam com `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

1. Clique repetido e rápido em minimizar/restaurar/botão da barra durante a animação: estado nunca fica preso nem a janela "some" (não depender de `transitionend`; guardar por estado).
2. Janela maior que o desktop (viewport pequena, ou ao redimensionar a página): clampar ao abrir e no `resize` do `window`; barra de título sempre alcançável.
3. Soltar o mouse/dedo fora da janela ou perder o foco no meio do arrastar/redimensionar: o arraste termina (pointer capture + `pointercancel`).
4. Re-render do React (relógio do site a cada segundo, troca de aba de projetos) não apaga nem recria o desktop: filhos de `#vista-desktop` persistem.
5. Toque no celular: arrastar a barra de título não rola a página (`touch-action: none` só nas barras de título); rolar a página sobre o desktop continua possível fora das janelas.

---

## File Structure

| Arquivo | Responsabilidade |
|---|---|
| `build.py` (modificar) | Expandir marcadores `@include` do template antes de embutir |
| `src/vista-desktop.css` (criar) | Todo o CSS `vd-*` (papel de parede, ícones, janela, barra, Iniciar, painéis) |
| `src/vista-desktop.js` (criar) | Classe `VistaDesktop` (motor): janelas, barra, Iniciar, bandeja |
| `src/apps/trajetoria.js` (criar) | App "Trajetória profissional": dados (`jobs`, formação, `certs`) + `render` |
| `src/template.html` (modificar) | Marcadores `@include`, `<div id="vista-desktop">`, hooks no `Component`, remover janela antiga e `jobs`/`certs` de `renderVals` |
| `README.md` (modificar) | Como adicionar um app ao desktop |

Marcador: linha sozinha `/* @include src/arquivo */` (em JS/CSS) ou `<!-- @include src/arquivo -->` (em HTML).

---

### Task 1: Include no build + casca do desktop (papel de parede, ícones, barra estática)

**Files:**
- Modify: `build.py`, `src/template.html` (seção Trajetória linhas ~1240–1322; `<style>` linha ~414; `Component` linhas ~1390–1430)
- Create: `src/vista-desktop.css`, `src/vista-desktop.js`

**Interfaces:**
- Produces: `class VistaDesktop { constructor(root: HTMLElement); destroy(): void }`. O construtor monta dentro de `root`: `.vd` > `.vd-wall` (SVG Aurora), `.vd-icons` (Lixeira e pasta, ainda sem ação), `.vd-bar` (orbe, atalho Mostrar área de trabalho, bandeja com relógio vivo). Guarda a instância em `window.vistaDesktop`. Também define `DESKTOP_APPS = []` global da página? **Não**: apps entram na Task 2.
- Produces (build): `expand_includes(text: str, root: Path) -> str` em `build.py`.

- [ ] **Step 1: Verificação inicial falhando.** Rodar `python build.py` e abrir `index.html` por `python -m http.server 5173` no navegador do app; `document.querySelector('#vista-desktop')` → `null`. Esperado: `null` (ainda não existe).
- [ ] **Step 2: Implementar `expand_includes(text, root)` em `build.py`** e chamá-lo sobre o `template` logo após a leitura. Regex multilinha `^[ \t]*(?:/\*|<!--)\s*@include\s+(\S+)\s*(?:\*/|-->)[ \t]*$`; substitui pelo conteúdo UTF-8 do arquivo (caminho relativo à raiz); arquivo inexistente → `SystemExit("include nao encontrado: <caminho>")`. Imprimir quantos includes foram expandidos.
- [ ] **Step 3: Criar `src/vista-desktop.css`** com o CSS do protótipo (papel de parede, `.vd`, `.vd-icons/.vd-icon` com estados hover/selecionado, `.vd-bar`, `.vd-orb`, `.vd-q`, `.vd-tray`, `.vd-clock`), mais regras de seção: `#trajetoria` sem `.wrap`, `height: 100svh; min-height: 640px; max-height: 900px`, `.vd { position: relative; width: 100%; height: 100% }`, `.vd-sr-only` para o `h2`. Papel de parede Aurora **mais vivo** que o protótipo (aumentar opacidade/brilho dos feixes verdes e do traço claro). Fonte: `"Segoe UI", Tahoma, <fonte do site>, sans-serif`.
- [ ] **Step 4: Criar `src/vista-desktop.js`** com a classe: monta o DOM da casca (SVG do papel de parede e ícones do protótipo), relógio `HH:MM`/`dd/mm/aaaa` com `Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' })` atualizado por `setInterval` de 1s guardado para `destroy()`.
- [ ] **Step 5: Editar `src/template.html`.** Incluir `/* @include src/vista-desktop.css */` dentro do segundo `<style>`, e `/* @include src/vista-desktop.js */` imediatamente antes de `class Component extends DCLogic`. Substituir o conteúdo da `<section id="trajetoria">` por: `<h2 id="traj-titulo" class="vd-sr-only">Trajetória</h2>` + `<div id="vista-desktop"></div>` (sem filhos, sem classe `wrap`/`reveal`), mantendo `id` e `aria-labelledby`. Em `componentDidMount`: `this.vd = window.vistaDesktop = new VistaDesktop(document.getElementById('vista-desktop'))` (dentro de `setTimeout(…, 0)` como os outros observers); em `componentWillUnmount`: `this.vd && this.vd.destroy()`. Não remover `jobs`/`certs` ainda.
- [ ] **Step 6: Verificar.** `python build.py` imprime includes expandidos; recarregar a página. No navegador do app, em `javascript_tool`: `document.querySelectorAll('#vista-desktop .vd-icon').length` → `2`; esperar 3s e repetir → `2` (React não apagou); `document.querySelector('.vd-clock').textContent` casa `/\d\d:\d\d/`; `read_console_messages` com `onlyErrors` → vazio. Screenshot da seção: papel de parede, ícones, barra com orbe e relógio, comparado ao protótipo. Rolar a página até `#trajetoria` pelo menu "Trajetória" e conferir que a seção aparece sem ficar sob a barra superior fixa (ajustar `scroll-margin-top` se preciso).
- [ ] **Step 7: Commit** `git add build.py src/ index.html && git commit -m "Desktop Vista: casca com papel de parede, icones e barra"`.

---

### Task 2: Motor de janelas + app Trajetória + barra de tarefas viva

**Files:**
- Modify: `src/vista-desktop.js`, `src/vista-desktop.css`, `src/template.html` (include do app; remover `jobs`/`certs`/bindings antigos de `renderVals`)
- Create: `src/apps/trajetoria.js`

**Interfaces:**
- Consumes: casca da Task 1.
- Produces (API pública de `VistaDesktop`):
  - `registerApp(app: App): void` com `App = { id: string, title: string, icon: string /*svg*/, size: { w: number, h: number, minW?: number, minH?: number }, resizable?: boolean, render(body: HTMLElement, win: { id: string, close(): void, setTitle(t: string): void }): { destroy?(): void } | void }`
  - `addDesktopIcon({ label: string, icon: string, appId: string | null }): void` (`appId: null` = Lixeira, não abre nada)
  - `open(appId)`, `focus(appId)`, `minimize(appId)`, `restore(appId)`, `close(appId)`, `toggleMaximize(appId)`, `showDesktop(): void`
  - `getState(appId): 'closed' | 'normal' | 'min' | 'max'`
  - DOM: janela `.vd-win[data-app]` com `data-state="normal|min|max"` e classe `.active` na focada; botão da barra `.vd-tb[data-app]` com `.active`/`.min`; ícone `.vd-icon[data-app]`.
- Produces: `src/apps/trajetoria.js` define `const TRAJETORIA_APP: App` (e os dados `jobs`, `certs` movidos de `renderVals`).

- [ ] **Step 1: Escrever a verificação (falha primeiro).** Roteiro em `javascript_tool` (será reutilizado nas próximas tarefas), sobre a página construída:
  ```js
  const d = window.vistaDesktop;
  [d.getState('trajetoria'),                       // 'normal' ao carregar
   document.querySelectorAll('.vd-win').length,    // 1
   document.querySelector('.vd-tb.active') !== null]
  ```
  Esperado após a tarefa: `['normal', 1, true]`. Hoje: erro (`getState` não existe).
- [ ] **Step 2: Implementar `registerApp`, `addDesktopIcon`, `open/focus/close`** criando o DOM da janela (moldura Aero do protótipo: título com halo, botões min/max/fechar, corpo) dentro de `.vd`; posição inicial centralizada com leve deslocamento; tamanho clampado ao desktop; `z` crescente por foco; título ativo/inativo. Botão da barra criado/removido junto com a janela.
- [ ] **Step 3: Implementar `minimize/restore/toggleMaximize/showDesktop` e cliques da barra** (minimizada → restaura; ativa → minimiza; aberta e inativa → foca). Animação de minimizar/restaurar com `transform` partindo do `getBoundingClientRect()` do botão; fechar = fade + escala; abrir = escala .95→1. Estado guiado por `data-state` e temporizadores (nunca por `transitionend`). Com `prefers-reduced-motion`: sem animação. Duplo clique no título e botão do meio alternam maximizar (ocupa `.vd` menos a barra). Duplo clique/Enter no ícone abre o app; clique no ícone seleciona (um só selecionado); clique no fundo limpa a seleção.
- [ ] **Step 4: Criar `src/apps/trajetoria.js`**: `TRAJETORIA_APP` com `render(body)` desenhando o conteúdo (painel esquerdo com 3 atalhos que rolam até Experiência/Formação/Certificações; corpo em duas colunas com os mesmos textos/dados de hoje; barra de endereço com breadcrumb `Computador ▸ João Carvalho ▸ Trajetória profissional`; barra de comandos e busca decorativas `aria-hidden`; barra de status "N itens"). Dados `jobs`/`certs` copiados de `renderVals` (textos idênticos). Incluir via `/* @include src/apps/trajetoria.js */` antes do motor ou depois, e no `componentDidMount` registrar o app, adicionar os ícones (Lixeira `appId: null`, pasta `appId: 'trajetoria'`) e chamar `open('trajetoria')`. Remover de `renderVals` `jobs`, `certs` e as chaves retornadas.
- [ ] **Step 5: Verificar** com o roteiro do Step 1 → `['normal', 1, true]`. Depois: `d.minimize('trajetoria'); await new Promise(r=>setTimeout(r,500)); [d.getState('trajetoria'), document.querySelector('.vd-win').getBoundingClientRect().height > 0]` → `['min', ...]` com a janela invisível (`opacity` 0 ou `visibility: hidden`); `d.restore('trajetoria')` → `'normal'`; `d.close('trajetoria')` → `getState` `'closed'`, `.vd-win` e `.vd-tb` ausentes; duplo clique no ícone (`dispatchEvent(new MouseEvent('dblclick',{bubbles:true}))`) reabre. **Pin do Review Focus 1:** disparar `minimize`/`restore` 10 vezes em sequência rápida (sem esperar) e ao final `restore` + espera 500ms → `getState` `'normal'` e janela visível. Conferir que só uma janela existe após `open` repetido. Console sem erros. Screenshot: janela de vidro sobre o papel de parede, conteúdo idêntico ao de antes.
- [ ] **Step 6: Commit** `git add -A src index.html && git commit -m "Desktop Vista: motor de janelas, barra de tarefas e app Trajetoria"` (conferir com `git status` que `portfolio/` não entrou).

---

### Task 3: Arrastar, redimensionar, clamp e mobile

**Files:**
- Modify: `src/vista-desktop.js`, `src/vista-desktop.css`

**Interfaces:**
- Consumes: janelas da Task 2 (`.vd-win`, estado `data-state`, `App.resizable`, `App.size.minW/minH`).
- Produces: comportamento de arrastar pela `.vd-title`, 8 alças `.vd-rs[data-edge]` (só `resizable` e `normal`), `clampToDesktop()` chamado ao abrir, ao soltar e no `window` `resize`; modo móvel (`matchMedia('(max-width: 767px)')`): abre maximizada e sem arrastar/redimensionar.

- [ ] **Step 1: Verificação (falha primeiro).** Simular arrasto: `pointerdown` na `.vd-title` → `pointermove` +120,+60 → `pointerup`; ler `getBoundingClientRect().left/top` da janela. Esperado: deslocou +120/+60 (±1). Hoje: não muda.
- [ ] **Step 2: Implementar arrastar** com Pointer Events e `setPointerCapture`, atualizando `left/top` (ou `transform`) imperativamente em `requestAnimationFrame`, sem `setState`; terminar em `pointerup`/`pointercancel`/`lostpointercapture`; título nunca sai do desktop (clamp: pelo menos 80px da barra de título dentro da área e topo ≥ 0). `touch-action: none` apenas em `.vd-title` e alças. Arrastar maximizada restaura e arrasta (como no Vista).
- [ ] **Step 3: Implementar redimensionar** pelas 8 alças respeitando `minW/minH` e os limites do desktop; cursor `*-resize` correto.
- [ ] **Step 4: Implementar `clampToDesktop()`** (tamanho e posição) e ligar a `window.resize` (com `destroy()` removendo o listener) e modo móvel (maximizada, alças/arrasto desativados, botões da barra só com ícone).
- [ ] **Step 5: Verificar.** Arrasto simulado do Step 1 → deslocamento correto; arrastar para fora (-500,-500 e +5000,+5000) → barra de título continua dentro do desktop. Redimensionar pela alça `se` (+100,+80) → tamanho cresce, e para dentro de `minW/minH` não passa. **Pin do Review Focus 2:** `resize_window` para 700×500 → janela cabe no desktop. **Pin do Review Focus 3:** `pointerdown` na barra, `pointermove`, depois `pointercancel` (sem `pointerup`) → movimentos seguintes (`pointermove`) não deslocam mais a janela. **Pin do Review Focus 5:** em viewport 375×800 a janela abre `max`, e `getComputedStyle(title).touchAction === 'none'`; página sem rolagem horizontal (`document.documentElement.scrollWidth <= innerWidth`). Resetar o viewport com `preset: "desktop"` ao final. Verificar fluidez: durante arrasto simulado, o número de re-renders do site não cresce (ex.: `MutationObserver` em `main` fora de `#vista-desktop` sem mutações).
- [ ] **Step 6: Commit** `git commit -am "Desktop Vista: arrastar, redimensionar e modo movel"`.

---

### Task 4: Menu Iniciar e painéis da bandeja (volume, rede, relógio/calendário)

**Files:**
- Modify: `src/vista-desktop.js`, `src/vista-desktop.css`

**Interfaces:**
- Consumes: casca da Task 1 (orbe `.vd-orb`, bandeja `.vd-tray`), `open(appId)` e `registerApp` da Task 2.
- Produces: `toggleStart(force?: boolean): void`, `togglePanel(name: 'volume' | 'network' | 'clock', force?: boolean): void`; no máximo um popup aberto (`.vd-start`, `.vd-panel[data-panel]`); `addStartEntry({ label: string, appId: string | null, group?: 'games' }): void` (entrada com `appId: null` aparece desabilitada com "em breve").

- [ ] **Step 1: Verificação (falha primeiro).** Clicar no orbe e ler `document.querySelector('.vd-start')` → `null` hoje; esperado após: elemento visível; clicar no relógio → `.vd-panel[data-panel="clock"]` visível e `.vd-start` oculto.
- [ ] **Step 2: Implementar o menu Iniciar** com duas colunas como o protótipo (esquerda branca: Internet/E-mail decorativos, "Trajetória profissional" que chama `open('trajetoria')` e fecha o menu, "Campo Minado" e "Paciência" via `addStartEntry(..., appId: null)`, "Todos os Programas"; direita de vidro escuro: "João Carvalho", Documentos, Imagens, Músicas, Jogos, Computador, Painel de Controle decorativos; "Iniciar pesquisa" e botões de energia decorativos). Orbe com estado `.on`.
- [ ] **Step 3: Implementar painéis da bandeja.** Volume: controle deslizante `<input type="range">` com rótulo e ícone que muda (mudo/baixo/alto), só visual. Rede: painel simples "Conectado". Relógio: relógio analógico SVG (ponteiros atualizados pelo mesmo `setInterval` do relógio) + calendário do mês corrente (implementação própria, semana começa no domingo, dia de hoje destacado, mês/ano em pt-BR).
- [ ] **Step 4: Fechamento.** Clique fora, `Esc` e abrir outro popup fecham o atual; clique dentro de um popup não o fecha; cliques na barra de tarefas/janelas fora do popup fecham-no.
- [ ] **Step 5: Verificar.** Orbe abre Iniciar; clicar em "Trajetória profissional" com a janela fechada reabre e fecha o menu; relógio abre painel e fecha o Iniciar (só um por vez); `Esc` fecha; clique fora fecha; painel do relógio contém 28–31 células de dia com exatamente uma marcada como hoje (`document.querySelectorAll('.vd-cal .today').length === 1`). Screenshot de cada popup comparado ao protótipo/referência. Console sem erros.
- [ ] **Step 6: Commit** `git commit -am "Desktop Vista: menu Iniciar e paineis da bandeja"`.

---

### Task 5: Acabamento, acessibilidade, extensibilidade, regressão, README e publicação

**Files:**
- Modify: `src/vista-desktop.js`, `src/vista-desktop.css`, `README.md`, `src/template.html` (se a regressão pedir)

**Interfaces:**
- Consumes: tudo das tarefas 1–4.
- Produces: nada novo na API; garante os critérios de aceite do spec.

- [ ] **Step 1: Acessibilidade.** Ícones e botões como `<button>` (ou `role` correto) com `aria-label`; foco visível (anel claro) em ícones, botões da barra, orbe e botões de legenda; Enter/Espaço abre ícone focado; janela com `role="dialog"` e `aria-label` do título; `Esc` fecha popups; `prefers-reduced-motion: reduce` remove animações de janela e do orbe.
- [ ] **Step 2: Teste de extensibilidade (critério 9).** Em `javascript_tool`, registrar um app de teste sem tocar no motor: `window.vistaDesktop.registerApp({ id:'teste', title:'Teste', icon:'<svg viewBox="0 0 24 24"><rect width="24" height="24"/></svg>', size:{w:300,h:200}, resizable:false, render(b){ b.textContent='ola'; } }); window.vistaDesktop.open('teste')` → aparece janela com "ola", botão na barra, sem alças de resize; `close('teste')` limpa tudo (e chama `destroy` do app, se devolvido).
- [ ] **Step 3: Pin do Review Focus 4.** Guardar a referência do `.vd-win`, esperar 3s (vários re-renders do relógio do site) e clicar numa aba de projetos (`.vd-…`/tabs de Projetos) → o mesmo nó `.vd-win` ainda está no documento (`document.contains(ref) === true`) e `#vista-desktop` mantém os filhos.
- [ ] **Step 4: Regressão completa.** Em 1440×900: rolar a página inteira e conferir Início, Projetos (trocar de aba), Habilidades, Trajetória, Contato, rodapé; menu superior "Trajetória" leva ao desktop; em 375×800 e 768×1024: sem rolagem horizontal, janela maximizada abaixo de 768px, tudo clicável. Console sem erros em todos os estados. Resetar viewport (`preset: "desktop"`).
- [ ] **Step 5: README.** Acrescentar seção "Desktop da Trajetória" com a estrutura de arquivos, a sintaxe `@include` e um exemplo de `registerApp`/`addDesktopIcon`/`addStartEntry` para adicionar um jogo.
- [ ] **Step 6: Revisão de código.** Rodar `/code-review` (ou a skill `superpowers:requesting-code-review`) sobre o diff completo, corrigir o que for confirmado, repetir a verificação dos Steps 3–4 se algo mudar.
- [ ] **Step 7: Build final e publicação.** `python build.py`; `git status` mostra só arquivos do projeto (nunca `portfolio/`); `git add build.py README.md src index.html docs && git commit -m "Desktop Vista na Trajetoria: acabamento, README e documentacao"`; `git push origin main`; conferir `git status -sb` sem divergência e, passados ~1–2 min, abrir `https://johncarvalhonx.github.io/portfolio/` e repetir `getState('trajetoria') === 'normal'`.

---

## Self-review (spec × plano)

- Objetivos 1–2 → T1–T2; 3–4 → T2; 5 → T1/T2/T4; 6 → T2/T3; 7 → T4; 8 → T2 (API) e T5 (teste); 9 → T1 (CSS do protótipo) e comparações por screenshot.
- Mobile, acessibilidade e reduced-motion → T3/T5. Aceite 1–9 → verificações de T2–T5.
- Nomes consistentes: `VistaDesktop`, `registerApp/addDesktopIcon/addStartEntry/open/focus/minimize/restore/close/toggleMaximize/showDesktop/getState/toggleStart/togglePanel`, `window.vistaDesktop`, `TRAJETORIA_APP`, classes `vd-*`.
