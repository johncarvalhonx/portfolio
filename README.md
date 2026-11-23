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

A seção Trajetória é um desktop Windows Vista (janelas, barra de tarefas, menu Iniciar).

| Arquivo | O que faz |
|---|---|
| `src/vista-desktop.js` | Motor (`VistaDesktop`): janelas, arrastar, barra, Iniciar, bandeja |
| `src/vista-desktop.css` | Todo o visual (classes `vd-*`) |
| `src/apps/trajetoria.js` | App "Trajetória profissional" (dados e conteúdo da janela) |

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

(Hoje "Campo Minado" e "Paciência" já existem no Iniciar como entradas desabilitadas "em breve":
troque o `appId: null` delas pelo id do app.)

No console do navegador, `window.vistaDesktop` dá acesso ao motor (`open('id')`, `close('id')`, `getState('id')`…).

### Testes do desktop

Com o site servido (`python -m http.server 5291`) e Chrome instalado (`pip install websockets`):

```
python tests/browser_runner.py http://127.0.0.1:5291/index.html 1440 900 saida.png tests/vista-desktop.behavior.js
```

O script imprime um JSON com o resultado de cada verificação (arrastar, limites, redimensionar, painéis, app de teste…).
