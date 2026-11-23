/* ===== Motor de xadrez (regras completas + IA alfa-beta) =====
   Função autocontida: também é convertida em texto para rodar num Web Worker.
   Casas: índice 0..63 = fileira * 8 + coluna (0 = a1, 63 = h8). Peças: 'PNBRQK' brancas, 'pnbrqk' pretas. */
function vdChessEngine() {
  const KN = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
  const KG = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const DIAG = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  const ORTH = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const VAL = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 0 };
  const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  let b, turn, castle, ep, half, full, hist, keys;

  const colorOf = (p) => (!p ? null : (p === p.toUpperCase() ? 'w' : 'b'));
  const at = (f, r) => (f < 0 || f > 7 || r < 0 || r > 7 ? -1 : r * 8 + f);
  const other = (s) => (s === 'w' ? 'b' : 'w');
  const sqIdx = (s) => (s.charCodeAt(1) - 49) * 8 + (s.charCodeAt(0) - 97);
  const sqName = (i) => String.fromCharCode(97 + (i & 7)) + ((i >> 3) + 1);
  const key = () => b.map((p) => p || '.').join('') + turn + castle + ep;

  function fromFEN(fen) {
    const parts = fen.trim().split(/\s+/);
    b = new Array(64).fill('');
    const rows = parts[0].split('/');
    for (let i = 0; i < 8; i++) {
      let file = 0;
      const r = 7 - i;
      for (const ch of rows[i]) {
        if (ch >= '1' && ch <= '8') file += Number(ch);
        else { b[r * 8 + file] = ch; file++; }
      }
    }
    turn = parts[1] || 'w';
    castle = !parts[2] || parts[2] === '-' ? '' : parts[2];
    ep = !parts[3] || parts[3] === '-' ? -1 : sqIdx(parts[3]);
    half = Number(parts[4]) || 0;
    full = Number(parts[5]) || 1;
    hist = [];
    keys = [key()];
  }

  function fen() {
    let s = '';
    for (let r = 7; r >= 0; r--) {
      let empty = 0;
      for (let f = 0; f < 8; f++) {
        const p = b[r * 8 + f];
        if (!p) empty++;
        else { if (empty) { s += empty; empty = 0; } s += p; }
      }
      if (empty) s += empty;
      if (r) s += '/';
    }
    return s + ' ' + turn + ' ' + (castle || '-') + ' ' + (ep < 0 ? '-' : sqName(ep)) + ' ' + half + ' ' + full;
  }

  function attacked(sq, by) {
    const f = sq & 7, r = sq >> 3;
    const pawn = by === 'w' ? 'P' : 'p';
    const pr = r + (by === 'w' ? -1 : 1);
    for (const df of [-1, 1]) { const s = at(f + df, pr); if (s >= 0 && b[s] === pawn) return true; }
    const kn = by === 'w' ? 'N' : 'n', kg = by === 'w' ? 'K' : 'k';
    for (const [df, dr] of KN) { const s = at(f + df, r + dr); if (s >= 0 && b[s] === kn) return true; }
    for (const [df, dr] of KG) { const s = at(f + df, r + dr); if (s >= 0 && b[s] === kg) return true; }
    const B1 = by === 'w' ? 'B' : 'b', R1 = by === 'w' ? 'R' : 'r', Q1 = by === 'w' ? 'Q' : 'q';
    for (const [df, dr] of DIAG) {
      let ff = f + df, rr = r + dr;
      while (ff >= 0 && ff < 8 && rr >= 0 && rr < 8) {
        const p = b[rr * 8 + ff];
        if (p) { if (p === B1 || p === Q1) return true; break; }
        ff += df; rr += dr;
      }
    }
    for (const [df, dr] of ORTH) {
      let ff = f + df, rr = r + dr;
      while (ff >= 0 && ff < 8 && rr >= 0 && rr < 8) {
        const p = b[rr * 8 + ff];
        if (p) { if (p === R1 || p === Q1) return true; break; }
        ff += df; rr += dr;
      }
    }
    return false;
  }

  function kingSq(side) {
    const k = side === 'w' ? 'K' : 'k';
    for (let i = 0; i < 64; i++) if (b[i] === k) return i;
    return -1;
  }
  const inCheck = (side) => { const k = kingSq(side); return k >= 0 && attacked(k, other(side)); };

  function pseudo(side, capturesOnly) {
    const out = [];
    const opp = other(side);
    const add = (from, to, piece, captured, flag) => {
      const last = side === 'w' ? 7 : 0;
      if (piece.toUpperCase() === 'P' && (to >> 3) === last) {
        for (const pr of ['Q', 'R', 'B', 'N']) out.push({ from, to, piece, captured, flag: flag || '', promo: side === 'w' ? pr : pr.toLowerCase() });
      } else out.push({ from, to, piece, captured, flag: flag || '', promo: '' });
    };
    for (let sq = 0; sq < 64; sq++) {
      const p = b[sq];
      if (!p || colorOf(p) !== side) continue;
      const f = sq & 7, r = sq >> 3, t = p.toUpperCase();
      if (t === 'P') {
        const dir = side === 'w' ? 1 : -1, startR = side === 'w' ? 1 : 6;
        const one = at(f, r + dir);
        if (!capturesOnly && one >= 0 && !b[one]) {
          add(sq, one, p, '', '');
          const two = at(f, r + 2 * dir);
          if (r === startR && two >= 0 && !b[two]) out.push({ from: sq, to: two, piece: p, captured: '', flag: 'd', promo: '' });
        }
        for (const df of [-1, 1]) {
          const s = at(f + df, r + dir);
          if (s < 0) continue;
          if (b[s] && colorOf(b[s]) === opp) add(sq, s, p, b[s], '');
          else if (s === ep) out.push({ from: sq, to: s, piece: p, captured: side === 'w' ? 'p' : 'P', flag: 'e', promo: '' });
        }
      } else if (t === 'N' || t === 'K') {
        for (const [df, dr] of (t === 'N' ? KN : KG)) {
          const s = at(f + df, r + dr);
          if (s < 0) continue;
          const q = b[s];
          if (q && colorOf(q) === side) continue;
          if (capturesOnly && !q) continue;
          out.push({ from: sq, to: s, piece: p, captured: q, flag: '', promo: '' });
        }
        if (t === 'K' && !capturesOnly) {
          const base = side === 'w' ? 0 : 56;
          const kc = side === 'w' ? 'K' : 'k', qc = side === 'w' ? 'Q' : 'q', rook = side === 'w' ? 'R' : 'r';
          if (sq === base + 4 && !attacked(sq, opp)) {
            if (castle.indexOf(kc) >= 0 && b[base + 7] === rook && !b[base + 5] && !b[base + 6] && !attacked(base + 5, opp) && !attacked(base + 6, opp)) {
              out.push({ from: sq, to: base + 6, piece: p, captured: '', flag: 'k', promo: '' });
            }
            if (castle.indexOf(qc) >= 0 && b[base] === rook && !b[base + 1] && !b[base + 2] && !b[base + 3] && !attacked(base + 3, opp) && !attacked(base + 2, opp)) {
              out.push({ from: sq, to: base + 2, piece: p, captured: '', flag: 'q', promo: '' });
            }
          }
        }
      } else {
        const dirs = t === 'B' ? DIAG : t === 'R' ? ORTH : DIAG.concat(ORTH);
        for (const [df, dr] of dirs) {
          let ff = f + df, rr = r + dr;
          while (ff >= 0 && ff < 8 && rr >= 0 && rr < 8) {
            const s = rr * 8 + ff, q = b[s];
            if (q) { if (colorOf(q) === opp) out.push({ from: sq, to: s, piece: p, captured: q, flag: '', promo: '' }); break; }
            if (!capturesOnly) out.push({ from: sq, to: s, piece: p, captured: '', flag: '', promo: '' });
            ff += df; rr += dr;
          }
        }
      }
    }
    return out;
  }

  function make(m, fast) {
    hist.push({ m, castle, ep, half, full });
    b[m.to] = m.promo || m.piece;
    b[m.from] = '';
    if (m.flag === 'e') b[m.to + (m.piece === 'P' ? -8 : 8)] = '';
    if (m.flag === 'k') { b[m.to - 1] = b[m.to + 1]; b[m.to + 1] = ''; }
    if (m.flag === 'q') { b[m.to + 1] = b[m.to - 2]; b[m.to - 2] = ''; }
    if (castle) {
      if (m.piece === 'K') castle = castle.replace('K', '').replace('Q', '');
      if (m.piece === 'k') castle = castle.replace('k', '').replace('q', '');
      const strip = { 0: 'Q', 7: 'K', 56: 'q', 63: 'k' };
      if (strip[m.from]) castle = castle.replace(strip[m.from], '');
      if (strip[m.to]) castle = castle.replace(strip[m.to], '');
    }
    ep = m.flag === 'd' ? (m.from + m.to) >> 1 : -1;
    half = (m.piece === 'P' || m.piece === 'p' || m.captured) ? 0 : half + 1;
    if (turn === 'b') full++;
    turn = other(turn);
    if (!fast) keys.push(key());
  }

  function unmake(fast) {
    const h = hist.pop();
    const m = h.m;
    if (!fast) keys.pop();
    turn = other(turn);
    b[m.from] = m.piece;
    b[m.to] = m.flag === 'e' ? '' : (m.captured || '');
    if (m.flag === 'e') b[m.to + (m.piece === 'P' ? -8 : 8)] = m.captured;
    if (m.flag === 'k') { b[m.to + 1] = b[m.to - 1]; b[m.to - 1] = ''; }
    if (m.flag === 'q') { b[m.to - 2] = b[m.to + 1]; b[m.to + 1] = ''; }
    castle = h.castle; ep = h.ep; half = h.half; full = h.full;
    return m;
  }

  function legal(side) {
    side = side || turn;
    const res = [];
    for (const m of pseudo(side, false)) {
      make(m, true);
      if (!inCheck(side)) res.push(m);
      unmake(true);
    }
    return res;
  }

  function insufficient() {
    const rest = [];
    for (let i = 0; i < 64; i++) if (b[i] && b[i].toUpperCase() !== 'K') rest.push(b[i].toUpperCase());
    return rest.length === 0 || (rest.length === 1 && (rest[0] === 'N' || rest[0] === 'B'));
  }

  function status() {
    const moves = legal(turn);
    const check = inCheck(turn);
    let state = 'play';
    if (!moves.length) state = check ? 'mate' : 'stalemate';
    else if (half >= 100) state = 'fifty';
    else if (keys.filter((k) => k === keys[keys.length - 1]).length >= 3) state = 'repetition';
    else if (insufficient()) state = 'material';
    return { state, check, turn };
  }

  function move(mv) {
    const m = legal(turn).find((x) => x.from === mv.from && x.to === mv.to && (!x.promo || x.promo.toUpperCase() === (mv.promo || 'Q').toUpperCase()));
    if (!m) return null;
    make(m, false);
    return m;
  }

  function undo() { return hist.length ? unmake(false) : null; }

  function perft(d) {
    if (d === 0) return 1;
    let n = 0;
    const side = turn;
    for (const m of pseudo(side, false)) {
      make(m, true);
      if (!inCheck(side)) n += perft(d - 1);
      unmake(true);
    }
    return n;
  }

  // ---- avaliação: material + posição (tabelas próprias, simples) ----
  const PST = {};
  (function buildPST() {
    const dist = (f, r) => Math.max(Math.abs(f - 3.5), Math.abs(r - 3.5));
    for (const t of ['P', 'N', 'B', 'R', 'Q', 'K', 'KE']) {
      PST[t] = new Array(64);
      for (let sq = 0; sq < 64; sq++) {
        const f = sq & 7, r = sq >> 3, d = dist(f, r);
        let v = 0;
        if (t === 'P') v = [0, 0, 5, 12, 22, 36, 60, 0][r] + ((f === 3 || f === 4) && (r === 3 || r === 4) ? 12 : 0) - ((f === 3 || f === 4) && r === 1 ? 6 : 0);
        else if (t === 'N') v = 32 - 12 * d;
        else if (t === 'B') v = 16 - 6 * d;
        else if (t === 'R') v = (r === 6 ? 18 : 0) + (f === 3 || f === 4 ? 4 : 0);
        else if (t === 'Q') v = 6 - 3 * d;
        else if (t === 'K') v = r === 0 ? ([20, 26, 12, -6, -6, 8, 28, 20][f]) : -14 * r;
        else v = 26 - 12 * d;
        PST[t][sq] = Math.round(v);
      }
    }
  })();

  function evaluate() {
    let s = 0, heavy = 0;
    for (let i = 0; i < 64; i++) { const p = b[i]; if (p && 'QRqr'.indexOf(p) >= 0) heavy++; }
    const endgame = heavy <= 2;
    for (let i = 0; i < 64; i++) {
      const p = b[i];
      if (!p) continue;
      const t = p.toUpperCase();
      const white = p === t;
      const rel = white ? i : (7 - (i >> 3)) * 8 + (i & 7);
      const tab = t === 'K' ? (endgame ? PST.KE : PST.K) : PST[t];
      const v = VAL[t] + tab[rel];
      s += white ? v : -v;
    }
    return turn === 'w' ? s : -s;
  }

  const orderMoves = (ms) => ms
    .map((m) => [m, (m.captured ? 10 * VAL[m.captured.toUpperCase()] - VAL[m.piece.toUpperCase()] / 10 : 0) + (m.promo ? 800 : 0)])
    .sort((x, y) => y[1] - x[1])
    .map((x) => x[0]);

  let deadline = 0, aborted = false, useQ = true;
  const MATE = 100000;

  function quiesce(alpha, beta, depth) {
    const stand = evaluate();
    if (stand >= beta) return beta;
    if (stand > alpha) alpha = stand;
    if (depth > 6) return alpha;
    const side = turn;
    for (const m of orderMoves(pseudo(side, true))) {
      make(m, true);
      if (inCheck(side)) { unmake(true); continue; }
      const sc = -quiesce(-beta, -alpha, depth + 1);
      unmake(true);
      if (sc >= beta) return beta;
      if (sc > alpha) alpha = sc;
    }
    return alpha;
  }

  let nodes = 0;
  function negamax(depth, alpha, beta, ply) {
    if ((++nodes & 1023) === 0 && Date.now() > deadline) aborted = true;
    if (aborted) return 0;
    if (depth === 0) return useQ ? quiesce(alpha, beta, 0) : evaluate();
    const side = turn;
    let count = 0;
    for (const m of orderMoves(pseudo(side, false))) {
      make(m, true);
      if (inCheck(side)) { unmake(true); continue; }
      count++;
      const sc = -negamax(depth - 1, -beta, -alpha, ply + 1);
      unmake(true);
      if (aborted) return 0;
      if (sc >= beta) return beta;
      if (sc > alpha) alpha = sc;
    }
    if (!count) return inCheck(side) ? -MATE + ply : 0;
    return alpha;
  }

  // nível 1..10: profundidade, "imprecisão" (centipeões) e busca de capturas
  const LEVELS = [
    { depth: 1, noise: 260, q: false, ms: 800 }, { depth: 1, noise: 160, q: true, ms: 800 },
    { depth: 2, noise: 110, q: true, ms: 1000 }, { depth: 2, noise: 60, q: true, ms: 1200 },
    { depth: 3, noise: 40, q: true, ms: 1500 }, { depth: 3, noise: 18, q: true, ms: 1800 },
    { depth: 3, noise: 0, q: true, ms: 2000 }, { depth: 4, noise: 0, q: true, ms: 2500 },
    { depth: 4, noise: 0, q: true, ms: 3200 }, { depth: 5, noise: 0, q: true, ms: 4000 }
  ];

  function search(level) {
    const cfg = LEVELS[Math.max(1, Math.min(10, level || 5)) - 1];
    deadline = Date.now() + cfg.ms;
    useQ = cfg.q;
    nodes = 0;
    let root = orderMoves(legal(turn));
    if (!root.length) return null;
    let scored = root.map((m) => [m, 0]);
    for (let d = 1; d <= cfg.depth; d++) {
      aborted = false;
      const cur = [];
      let alpha = -Infinity;
      for (const m of root) {
        make(m, true);
        const sc = cfg.noise ? -negamax(d - 1, -Infinity, Infinity, 1) : -negamax(d - 1, -Infinity, -alpha, 1);
        unmake(true);
        if (aborted) break;
        cur.push([m, sc]);
        if (sc > alpha) alpha = sc;
      }
      if (aborted && d > 1) break;
      if (cur.length === root.length) scored = cur;
      root = scored.slice().sort((x, y) => y[1] - x[1]).map((x) => x[0]);
      if (aborted) break;
      if (scored.some((x) => x[1] > MATE - 1000)) break; // achou mate
    }
    let best = null, bestV = -Infinity;
    for (const [m, sc] of scored) {
      const v = sc + (cfg.noise && Math.abs(sc) < MATE - 1000 ? (Math.random() * 2 - 1) * cfg.noise : 0);
      if (v > bestV) { bestV = v; best = m; }
    }
    return { from: best.from, to: best.to, promo: best.promo };
  }

  function getState() { return { b: b.slice(), turn, castle, ep, half, full, keys: keys.slice() }; }
  function setState(s) { b = s.b.slice(); turn = s.turn; castle = s.castle; ep = s.ep; half = s.half; full = s.full; keys = s.keys.slice(); hist = []; }

  fromFEN(START);
  return {
    reset: () => fromFEN(START), fromFEN, fen, move, undo, status, perft, search, getState, setState, sqName,
    legal: () => legal(turn),
    board: () => b.slice(),
    turn: () => turn,
    inCheck: () => inCheck(turn),
    kingSq: (side) => kingSq(side || turn),
    historyLength: () => hist.length,
    lastMove: () => (hist.length ? hist[hist.length - 1].m : null)
  };
}
