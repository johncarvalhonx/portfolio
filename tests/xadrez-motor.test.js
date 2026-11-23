// Testes do motor de xadrez. Rodar com: node tests/xadrez-motor.test.js
// "perft" conta todas as posições alcançáveis em N lances; os valores esperados são os de referência da comunidade de programação de xadrez.
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'apps', 'xadrez-motor.js'), 'utf8');
const vdChessEngine = new Function(src + '\nreturn vdChessEngine;')();

let fails = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fails++;
  console.log((ok ? 'ok   ' : 'FALHA') + ' ' + name + (ok ? '' : ' -> obtido ' + JSON.stringify(got) + ', esperado ' + JSON.stringify(want)));
};

const E = vdChessEngine();
const perft = (fen, depths) => { E.fromFEN(fen); return depths.map((d) => E.perft(d)); };

check('perft inicial 1-4', perft('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', [1, 2, 3, 4]), [20, 400, 8902, 197281]);
check('perft kiwipete 1-3', perft('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1', [1, 2, 3]), [48, 2039, 97862]);
check('perft posição 3 1-4', perft('8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1', [1, 2, 3, 4]), [14, 191, 2812, 43238]);
check('perft posição 4 1-3', perft('r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1', [1, 2, 3]), [6, 264, 9467]);
check('perft posição 5 1-3', perft('rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8', [1, 2, 3]), [44, 1486, 62379]);

// mate do pastor ao contrário (mate do louco)
E.reset();
const sq = (s) => (s.charCodeAt(1) - 49) * 8 + (s.charCodeAt(0) - 97);
[['f2', 'f3'], ['e7', 'e5'], ['g2', 'g4'], ['d8', 'h4']].forEach(([a, c]) => E.move({ from: sq(a), to: sq(c) }));
check('mate do louco', E.status().state, 'mate');

E.fromFEN('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
check('afogamento', E.status().state, 'stalemate');

E.fromFEN('8/8/8/8/8/8/8/K6k w - - 0 1');
check('material insuficiente', E.status().state, 'material');

E.reset();
const knights = [['g1', 'f3'], ['g8', 'f6'], ['f3', 'g1'], ['f6', 'g8']];
for (let i = 0; i < 2; i++) knights.forEach(([a, c]) => E.move({ from: sq(a), to: sq(c) }));
check('repetição tripla', E.status().state, 'repetition');

E.reset();
check('lance ilegal recusado', E.move({ from: sq('e2'), to: sq('e5') }), null);
const m = E.move({ from: sq('e2'), to: sq('e4') });
check('lance legal aceito', !!m && E.turn(), 'b');
E.undo();
check('desfazer volta à inicial', E.fen(), 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

E.fromFEN('6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1');
for (const lvl of [5, 8, 10]) {
  const best = E.search(lvl);
  check('IA nível ' + lvl + ' acha mate em 1 (Ta8#)', best && [best.from, best.to], [sq('a1'), sq('a8')]);
}
E.fromFEN('4k3/P7/8/8/8/8/8/4K3 w - - 0 1');
const pr = E.move({ from: sq('a7'), to: sq('a8'), promo: 'N' });
check('promoção escolhida (cavalo)', E.board()[sq('a8')], 'N');
check('promoção registrada', pr && pr.promo, 'N');

const t0 = Date.now();
E.reset();
const mv = E.search(10);
check('IA nível 10 responde dentro do tempo', !!mv && Date.now() - t0 < 6000, true);

console.log(fails ? '\n' + fails + ' falha(s)' : '\ntodos os testes passaram');
process.exit(fails ? 1 : 0);
