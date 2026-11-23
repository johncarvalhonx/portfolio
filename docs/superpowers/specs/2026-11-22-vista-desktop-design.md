# Desktop Windows Vista na seção Trajetória — design

Data: 2026-11-22 · Projeto: portfólio de João Carvalho (`src/template.html` → `index.html` via `python build.py`)

## Intenção e porquê

Quem visita o portfólio deve **ficar impressionado, sentir nostalgia e se divertir**.
A seção "Trajetória" deixa de ser uma janela estática e vira uma **área de trabalho do
Windows Vista** funcional. A janela "Trajetória profissional" abre junto com a página;
ao minimizar, a pessoa vê o desktop (Lixeira + pasta) e uma barra de tarefas Aero.

O desktop é a base de algo maior: **depois entram os jogos nativos da época** (Campo
Minado, Paciência, etc.). Por isso o que se constrói agora é um pequeno sistema de
janelas reutilizável, e não uma janela fixa com enfeite.

## Objetivos

1. Seção "Trajetória" = uma "tela" de Vista, largura total, altura de uma tela
   (`min-height: 640px; height: 100svh`, máx. ~900px), papel de parede Aurora recriado em CSS/SVG.
2. Ao carregar: janela "Trajetória profissional" aberta e em foco; botão dela na barra.
3. Minimizar leva a janela (com animação) ao botão da barra; clicar no botão restaura.
   Fechar remove a janela e o botão; duplo clique na pasta do desktop reabre.
4. Desktop com dois ícones: **Lixeira** (seleciona, não faz nada) e **Trajetória profissional**
   (duplo clique abre a janela; Enter com o ícone focado também).
5. Barra de tarefas fiel ao Vista: orbe Iniciar, "Mostrar área de trabalho", um botão por
   janela aberta, bandeja com seta, volume, rede e relógio/data.
6. Janelas arrastáveis, com minimizar/maximizar/fechar, foco e ordem de empilhamento;
   redimensionáveis quando o app permitir.
7. Menu Iniciar básico, com pasta "Jogos" reservada ("em breve").
8. **Extensível:** adicionar Campo Minado depois = registrar um app novo, sem mexer no motor.
9. Parecer Vista: o protótipo `assets/vista-mockup.html` é a referência visual aprovada na conversa.

## Não-objetivos (v1)

- Nenhum jogo ainda; nenhum programa além da pasta Trajetória.
- Sem áudio (nem efeitos nem som de inicialização); o controle de volume é visual.
- Sem arquivos, ícones, sons ou papel de parede da Microsoft: tudo recriado em CSS/SVG.
- Sem menu de contexto, sem arrastar ícones, sem Flip 3D, sem barra lateral/gadgets.
- Sem persistência (posição das janelas não é salva).
- Botão "desligar" do Iniciar é só visual.

## Anti-objetivos (seria falha mesmo funcionando)

- Quebrar as outras seções, o menu de navegação ou o rodapé do site.
- Arrastar janela engasgar (re-renderizar o site inteiro a cada movimento).
- Ficar inutilizável no celular ou sem teclado.
- Copiar ativos protegidos da Microsoft.

## Restrições

- Edita-se só `src/template.html` e se roda `python build.py` (o `index.html` é pacote
  autocontido; `build.py` troca só o bloco do template).
- O site é renderizado em **React** por um runtime próprio; `setState` re-renderiza o template
  inteiro (o relógio do site já faz isso a cada segundo).
- Texto da interface em português (pt-BR); fuso `America/Sao_Paulo`, como o resto do site.
- Respeitar `prefers-reduced-motion`. Mobile ≥ 375px de largura.
- Mover no teclado: ícones e botões focáveis, Esc fecha o menu Iniciar.

## Abordagens consideradas

- **A. Tudo no estado do Component (React).** Consistente com o resto do site; arrastar
  re-renderiza ~140 KB de template a cada movimento e tende a engasgar; jogos viveriam
  presos a esse modelo.
- **B. Motor de desktop em JavaScript puro**, dentro do `Component`, montado numa `div`
  vazia que o React não toca. Fluido, e cada jogo vira uma função que desenha na própria
  janela. Custo: reescrever o conteúdo da Trajetória como função JS (mesmos dados).
- **C. Protótipo só visual (desktop falso, uma janela fixa).** Rápido, mas descarta o
  objetivo dos jogos.

**Escolhida: B** (João aprovou em 2026-11-22). Motivo: arrastar fluido e base para os jogos.

## Design

### Montagem e ciclo de vida
- O template ganha `<div id="vista-desktop"></div>` **sem filhos** dentro de `<section id="trajetoria">`;
  o React nunca reconcilia o interior.
- `componentDidMount` instancia `new VistaDesktop(el, config)`; `componentWillUnmount` chama
  `destroy()` (remove timers e listeners). O motor tem seu próprio `setInterval` de 1s para o relógio
  da bandeja: não usa `setState`.
- O `<h2>` "Trajetória" permanece, **visualmente oculto** (acessibilidade e âncora `#trajetoria`
  do menu). A seção fica de ponta a ponta; sem título visível.
- CSS no `<style>` do template, todas as classes com prefixo `vd-`.

### Registro de apps
```js
desk.registerApp({
  id: 'trajetoria',
  title: 'Trajetória profissional',
  icon: '<svg…>',            // pasta amarela Vista
  size: { w: 840, h: 560, minW: 520, minH: 360 },
  resizable: true,
  render(body, win) { … }    // desenha o conteúdo; pode devolver { destroy() }
});
desk.addDesktopIcon({ label, icon, appId });   // appId null = Lixeira (não abre nada)
desk.open('trajetoria');
```
Jogos futuros: `registerApp({ id:'campo-minado', resizable:false, render })` + um ícone/entrada
no Iniciar. O motor não conhece nenhum app.

### Janelas
Estados: `normal | minimizada | maximizada | fechada`. Cada janela: posição, tamanho, `z`.
- Foco: clicar traz para frente; título "ativo" mais forte, "inativo" esmaecido.
- Arrastar pela barra de título com Pointer Events, via `transform`/`left/top` imperativos
  (sem re-render); limitar para a barra de título não sair da tela. Duplo clique no título
  alterna maximizar. Maximizada ocupa o desktop acima da barra de tarefas.
- Redimensionar: 8 alças (só se `resizable`), respeitando `minW/minH`.
- Minimizar: anima até o botão da barra (origem calculada pelo `getBoundingClientRect` do
  botão) e some; restaurar faz o inverso. Fechar: fade + leve escala. Abrir: escala de .95→1.
- Mostrar área de trabalho minimiza todas; clicar de novo restaura as que estavam abertas.
- Clicar no botão da barra: minimizada → restaura; ativa → minimiza; aberta e inativa → foca.

### Barra de tarefas (40px; orbe 58px sobrepõe 18px acima)
Da esquerda para a direita: orbe Iniciar · Mostrar área de trabalho · botões de janela
(vidro; estados normal/hover/ativo/minimizado, ícone + título, largura 150–170px com ellipsis) ·
bandeja: seta ◂, volume, rede, relógio `HH:MM` + data `dd/mm/aaaa`.
Fluxos: clicar no volume abre mini-painel com controle deslizante (estado visual); clicar no
relógio abre painel com **relógio analógico + calendário do mês**; Iniciar e painéis fecham com clique
fora ou Esc; só um aberto por vez.

### Menu Iniciar
Duas colunas como o Vista: esquerda branca (Internet/E-mail decorativos, **Trajetória profissional**
que abre a janela, Campo Minado/Paciência "em breve" desabilitados, "Todos os Programas");
direita de vidro escuro (nome "João Carvalho", Documentos, Imagens, Músicas, Jogos, Computador,
Painel de Controle — decorativos), caixa "Iniciar pesquisa" e botões de energia decorativos.

### Janela "Trajetória profissional" (conteúdo)
Mesmos dados e textos de hoje (`jobs`, formação, `certs`) no quadro do protótipo: moldura de
vidro Aero, botões de legenda, barra de endereço com breadcrumb `Computador ▸ João Carvalho ▸
Trajetória profissional`, painel esquerdo com **3 atalhos que funcionam** (Experiência, Formação,
Certificações: rolam até a seção), corpo em duas colunas e barra de status. Barra de comandos
e caixa de pesquisa são decorativas (`aria-hidden`).

### Visual
- **Papel de parede Aurora:** base verde-azulada escura com feixes verdes/ciano e traço claro,
  SVG com gradientes e `feGaussianBlur`; na versão final mais vivo que no protótipo.
- **Janela:** vidro `backdrop-filter: blur(10px) saturate(1.4)`, borda escura 1px + brilho
  interno, título com halo branco, botões min/max cinza-vidro e fechar vermelho (hover brilha).
- **Barra:** gradiente escuro com faixa clara no topo, borda superior branca translúcida.
- **Orbe:** esfera azul brilhante com bandeira de quatro cores recriada (não é o logotipo oficial).
- Fonte: `"Segoe UI"` com fallback para as fontes embutidas do site. Ícones em SVG inline.
- Selecionado/hover dos ícones: retângulo azul translúcido com borda clara (como no Vista).

### Mobile (< 768px)
Desktop com `height: 80svh; min-height: 520px`; janelas abrem **maximizadas** (sem arrastar/
redimensionar); toque único em ícone abre; botões da barra viram só ícone; menu Iniciar ocupa
a largura disponível.

### Acessibilidade
Ícones e botões são `<button>`/`role` corretos com rótulos; foco visível; Enter abre; Esc fecha
painéis; `prefers-reduced-motion` desliga animações de janela; contraste do texto das janelas AA.

## Critérios de aceite

1. Página carrega com a janela aberta e o botão ativo na barra; sem erros no console.
2. Minimizar → desktop visível com Lixeira + pasta; botão da barra continua; clicar restaura.
3. Fechar remove janela e botão; duplo clique na pasta reabre.
4. Arrastar, maximizar (duplo clique no título e botão), restaurar e redimensionar funcionam e
   ficam a ~60fps (sem re-render do site).
5. Iniciar, volume, calendário/relógio abrem e fecham (clique fora/Esc); só um por vez.
6. Em 375px: janela maximizada, tudo utilizável; sem rolagem horizontal da página.
7. Menu de navegação, outras seções e rodapé inalterados.
8. `python build.py` gera `index.html`; site abre localmente sem erro.
9. Registrar um app de teste novo (ex.: uma janela vazia) funciona sem mudar o motor.

## Fica a cargo de quem constrói

Estrutura interna do motor (uma classe ou módulo), geometria exata de cada elemento,
valores finos de gradiente/sombra (usar o protótipo como referência), textos do Iniciar,
calendário (implementação própria, sem biblioteca), ordem de implementação.

## Decisões minhas (para você conferir)

- Seção de largura total, altura de uma tela; `h2` oculto em vez de título visível.
- Janela ganha o visual Vista Aero; **o conteúdo continua o mesmo**.
- Painel esquerdo com 3 atalhos funcionais; barra de comandos e busca decorativas.
- Sem som; orbe com bandeira recriada (não o logotipo oficial).
- Relógio com painel analógico + calendário; volume só visual.
- A pasta não versionada `portfolio/` (cópia antiga) fica de fora do commit.
- O rodapé existente continua como navegação do site; a barra Vista é só do desktop.
