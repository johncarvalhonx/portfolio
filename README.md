# Portfólio

Site de portfólio publicado em https://johncarvalhonx.github.io/portfolio/

## Editar

O conteúdo fica em `src/template.html`. Depois de editar, gere o site:

```
python build.py
```

Isso atualiza o `index.html`. Para visualizar localmente:

```
python -m http.server 5173
```

O GitHub Pages publica a partir da branch `main`.

## Desktop da Trajetória

A seção Trajetória é um desktop Windows Vista (janelas, barra de tarefas, menu Iniciar) dentro de uma moldura de monitor.
No celular (< 768px) o desktop não aparece: só o conteúdo da Trajetória, num cartão.

| Arquivo | O que faz |
|---|---|
| `src/vista-desktop.js` | Motor (`VistaDesktop`): janelas, arrastar, barra, Iniciar, bandeja |
| `src/vista-desktop.css` | Todo o visual (classes `vd-*`) |
| `src/apps/trajetoria.js` | App "Trajetória profissional" (dados e conteúdo da janela) |
| `src/apps/campo-minado.js` / `.css` | Jogo Campo Minado (visual do Vista) |
| `src/apps/paciencia.js` / `.css` | Jogo Paciência — Klondike (visual do Vista) |
| `assets/wallpaper.webp` | Papel de parede do desktop |

O `build.py` injeta esses arquivos no `src/template.html` onde houver uma linha
`/* @include src/arquivo */` — então edite o arquivo em `src/` e rode `python build.py`.

### Adicionar um app (ex.: um jogo)

1. Crie `src/apps/campo-minado.js` com um objeto de app:

```js
const VD_CAMPO_MINADO = {
  id: 'campo-minado',
  title: 'Campo Minado',
  icon: '<svg viewBox="0 0 24 24">…</svg>',
  size: { w: 300, h: 380 },   // minW/minH só importam se resizable
  resizable: false,            // jogo de tamanho fixo: sem maximizar/redimensionar
  render(body, win) {          // desenhe dentro de `body`; win.close() fecha a janela
    body.textContent = '…';
    return { destroy() {} };   // opcional: limpeza ao fechar
  }
};
```

2. Inclua o arquivo no template (`/* @include src/apps/campo-minado.js */`, junto do da Trajetória)
   e registre no `componentDidMount` do `src/template.html`, ao lado do app da Trajetória:

```js
this.vd.registerApp(VD_CAMPO_MINADO);
this.vd.addDesktopIcon({ label: 'Campo Minado', icon: VD_CAMPO_MINADO.icon, appId: 'campo-minado' });
this.vd.addStartEntry({ label: 'Campo Minado', icon: VD_CAMPO_MINADO.icon, appId: 'campo-minado' });
```

Peças prontas para apps: `vdMenuBar([...])` (barra de menus Jogo/Ajuda) e `vdDialog(host, {...})` (caixa de diálogo).
O `render` recebe `win` com `close()`, `setTitle(t)`, `setSize(w, h)`, `isActive()` e `isMinimized()`.

No console do navegador, `window.vistaDesktop` dá acesso ao motor (`open('id')`, `close('id')`, `getState('id')`…).

### Testes do desktop

Com o site servido (`python -m http.server 5291`) e Chrome instalado (`pip install websockets`):

```
python tests/browser_runner.py http://127.0.0.1:5291/index.html 1440 900 saida.png tests/vista-desktop.behavior.js
```

Os jogos têm `tests/vista-desktop.games.js`. Para o celular use `tests/vista-desktop.mobile.js` com o argumento `mobile` ao final do comando.

O script imprime um JSON com o resultado de cada verificação (arrastar, limites, redimensionar, painéis, app de teste…).
