async function ze(A, e = {}) {
  const t = e.w, i = {
    w: Object.assign(Object.create(t), {
      b52(s) {
        return s = n(s >>> 0), g(t.b52(s)) || c();
      },
      ift(s) {
        return s = E(s >>> 0), g(t.ift(s)) || c();
      }
    }),
    env: Object.assign(Object.create(globalThis), e.env || {}, {
      abort(s, l, I, y) {
        s = n(s >>> 0), l = n(l >>> 0), I = I >>> 0, y = y >>> 0, (() => {
          throw Error(`${s} in ${l}:${I}:${y}`);
        })();
      }
    })
  }, { exports: a } = await WebAssembly.instantiate(A, i), B = a.memory || e.env.memory, r = Object.setPrototypeOf({
    transformBuff(s, l, I, y, C) {
      return s = g(s) || c(), l = l ? 1 : 0, I = I ? 1 : 0, y = y ? 1 : 0, C = C ? 1 : 0, u((k) => o(Uint8Array, b(k)), 2, a.transformBuff(s, l, I, y, C) >>> 0);
    },
    b62u(s, l, I) {
      s = w(g(s) || c()), I = g(I);
      try {
        return u((y) => o(Uint8Array, b(y)), 2, a.b62u(s, l, I) >>> 0);
      } finally {
        Y(s);
      }
    },
    dezip(s) {
      return s = f(s) || c(), n(a.dezip(s) >>> 0);
    }
  }, a);
  function E(s) {
    return s ? B.buffer.slice(s, s + new Uint32Array(B.buffer)[s - 4 >>> 2]) : null;
  }
  function f(s) {
    if (s == null)
      return 0;
    const l = a.__new(s.byteLength, 1) >>> 0;
    return new Uint8Array(B.buffer).set(new Uint8Array(s), l), l;
  }
  function n(s) {
    if (!s)
      return null;
    const l = s + new Uint32Array(B.buffer)[s - 4 >>> 2] >>> 1, I = new Uint16Array(B.buffer);
    let y = s >>> 1, C = "";
    for (; l - y > 1024; )
      C += String.fromCharCode(...I.subarray(y, y += 1024));
    return C + String.fromCharCode(...I.subarray(y, l));
  }
  function g(s) {
    if (s == null)
      return 0;
    const l = s.length, I = a.__new(l << 1, 2) >>> 0, y = new Uint16Array(B.buffer);
    for (let C = 0; C < l; ++C)
      y[(I >>> 1) + C] = s.charCodeAt(C);
    return I;
  }
  function u(s, l, I) {
    if (!I)
      return null;
    const y = b(I + 4), C = h.getUint32(I + 12, !0), k = new Array(C);
    for (let d = 0; d < C; ++d)
      k[d] = s(y + (d << l >>> 0));
    return k;
  }
  function o(s, l) {
    return l ? new s(
      B.buffer,
      b(l + 4),
      h.getUint32(l + 8, !0) / s.BYTES_PER_ELEMENT
    ).slice() : null;
  }
  const Q = /* @__PURE__ */ new Map();
  function w(s) {
    if (s) {
      const l = Q.get(s);
      l ? Q.set(s, l + 1) : Q.set(a.__pin(s), 1);
    }
    return s;
  }
  function Y(s) {
    if (s) {
      const l = Q.get(s);
      if (l === 1)
        a.__unpin(s), Q.delete(s);
      else if (l)
        Q.set(s, l - 1);
      else
        throw Error(`invalid refcount '${l}' for reference '${s}'`);
    }
  }
  function c() {
    throw TypeError("value must not be null");
  }
  let h = new DataView(B.buffer);
  function b(s) {
    try {
      return h.getUint32(s, !0);
    } catch {
      return h = new DataView(B.buffer), h.getUint32(s, !0);
    }
  }
  return r;
}
import Je from "./dha-release.wasm?url"
/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
const Oe = 4, bt = 0, Dt = 1, Ve = 2;
function QA(A) {
  let e = A.length;
  for (; --e >= 0; )
    A[e] = 0;
}
const We = 0, Qe = 1, Pe = 2, Xe = 3, qe = 258, It = 29, kA = 256, _A = kA + 1 + It, nA = 30, wt = 19, le = 2 * _A + 1, q = 15, JA = 16, $e = 7, ht = 256, se = 16, oe = 17, fe = 18, Et = (
  /* extra bits for each length code */
  new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0])
), NA = (
  /* extra bits for each distance code */
  new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13])
), Ai = (
  /* extra bits for each bit length code */
  new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7])
), Ce = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), ti = 512, T = new Array((_A + 2) * 2);
QA(T);
const IA = new Array(nA * 2);
QA(IA);
const cA = new Array(ti);
QA(cA);
const dA = new Array(qe - Xe + 1);
QA(dA);
const _t = new Array(It);
QA(_t);
const KA = new Array(nA);
QA(KA);
function OA(A, e, t, i, a) {
  this.static_tree = A, this.extra_bits = e, this.extra_base = t, this.elems = i, this.max_length = a, this.has_stree = A && A.length;
}
let Ie, we, he;
function VA(A, e) {
  this.dyn_tree = A, this.max_code = 0, this.stat_desc = e;
}
const _e = (A) => A < 256 ? cA[A] : cA[256 + (A >>> 7)], uA = (A, e) => {
  A.pending_buf[A.pending++] = e & 255, A.pending_buf[A.pending++] = e >>> 8 & 255;
}, M = (A, e, t) => {
  A.bi_valid > JA - t ? (A.bi_buf |= e << A.bi_valid & 65535, uA(A, A.bi_buf), A.bi_buf = e >> JA - A.bi_valid, A.bi_valid += t - JA) : (A.bi_buf |= e << A.bi_valid & 65535, A.bi_valid += t);
}, K = (A, e, t) => {
  M(
    A,
    t[e * 2],
    t[e * 2 + 1]
    /*.Len*/
  );
}, ce = (A, e) => {
  let t = 0;
  do
    t |= A & 1, A >>>= 1, t <<= 1;
  while (--e > 0);
  return t >>> 1;
}, ei = (A) => {
  A.bi_valid === 16 ? (uA(A, A.bi_buf), A.bi_buf = 0, A.bi_valid = 0) : A.bi_valid >= 8 && (A.pending_buf[A.pending++] = A.bi_buf & 255, A.bi_buf >>= 8, A.bi_valid -= 8);
}, ii = (A, e) => {
  const t = e.dyn_tree, i = e.max_code, a = e.stat_desc.static_tree, B = e.stat_desc.has_stree, r = e.stat_desc.extra_bits, E = e.stat_desc.extra_base, f = e.stat_desc.max_length;
  let n, g, u, o, Q, w, Y = 0;
  for (o = 0; o <= q; o++)
    A.bl_count[o] = 0;
  for (t[A.heap[A.heap_max] * 2 + 1] = 0, n = A.heap_max + 1; n < le; n++)
    g = A.heap[n], o = t[t[g * 2 + 1] * 2 + 1] + 1, o > f && (o = f, Y++), t[g * 2 + 1] = o, !(g > i) && (A.bl_count[o]++, Q = 0, g >= E && (Q = r[g - E]), w = t[g * 2], A.opt_len += w * (o + Q), B && (A.static_len += w * (a[g * 2 + 1] + Q)));
  if (Y !== 0) {
    do {
      for (o = f - 1; A.bl_count[o] === 0; )
        o--;
      A.bl_count[o]--, A.bl_count[o + 1] += 2, A.bl_count[f]--, Y -= 2;
    } while (Y > 0);
    for (o = f; o !== 0; o--)
      for (g = A.bl_count[o]; g !== 0; )
        u = A.heap[--n], !(u > i) && (t[u * 2 + 1] !== o && (A.opt_len += (o - t[u * 2 + 1]) * t[u * 2], t[u * 2 + 1] = o), g--);
  }
}, de = (A, e, t) => {
  const i = new Array(q + 1);
  let a = 0, B, r;
  for (B = 1; B <= q; B++)
    a = a + t[B - 1] << 1, i[B] = a;
  for (r = 0; r <= e; r++) {
    let E = A[r * 2 + 1];
    E !== 0 && (A[r * 2] = ce(i[E]++, E));
  }
}, Bi = () => {
  let A, e, t, i, a;
  const B = new Array(q + 1);
  for (t = 0, i = 0; i < It - 1; i++)
    for (_t[i] = t, A = 0; A < 1 << Et[i]; A++)
      dA[t++] = i;
  for (dA[t - 1] = i, a = 0, i = 0; i < 16; i++)
    for (KA[i] = a, A = 0; A < 1 << NA[i]; A++)
      cA[a++] = i;
  for (a >>= 7; i < nA; i++)
    for (KA[i] = a << 7, A = 0; A < 1 << NA[i] - 7; A++)
      cA[256 + a++] = i;
  for (e = 0; e <= q; e++)
    B[e] = 0;
  for (A = 0; A <= 143; )
    T[A * 2 + 1] = 8, A++, B[8]++;
  for (; A <= 255; )
    T[A * 2 + 1] = 9, A++, B[9]++;
  for (; A <= 279; )
    T[A * 2 + 1] = 7, A++, B[7]++;
  for (; A <= 287; )
    T[A * 2 + 1] = 8, A++, B[8]++;
  for (de(T, _A + 1, B), A = 0; A < nA; A++)
    IA[A * 2 + 1] = 5, IA[A * 2] = ce(A, 5);
  Ie = new OA(T, Et, kA + 1, _A, q), we = new OA(IA, NA, 0, nA, q), he = new OA(new Array(0), Ai, 0, wt, $e);
}, ue = (A) => {
  let e;
  for (e = 0; e < _A; e++)
    A.dyn_ltree[e * 2] = 0;
  for (e = 0; e < nA; e++)
    A.dyn_dtree[e * 2] = 0;
  for (e = 0; e < wt; e++)
    A.bl_tree[e * 2] = 0;
  A.dyn_ltree[ht * 2] = 1, A.opt_len = A.static_len = 0, A.sym_next = A.matches = 0;
}, ye = (A) => {
  A.bi_valid > 8 ? uA(A, A.bi_buf) : A.bi_valid > 0 && (A.pending_buf[A.pending++] = A.bi_buf), A.bi_buf = 0, A.bi_valid = 0;
}, Gt = (A, e, t, i) => {
  const a = e * 2, B = t * 2;
  return A[a] < A[B] || A[a] === A[B] && i[e] <= i[t];
}, WA = (A, e, t) => {
  const i = A.heap[t];
  let a = t << 1;
  for (; a <= A.heap_len && (a < A.heap_len && Gt(e, A.heap[a + 1], A.heap[a], A.depth) && a++, !Gt(e, i, A.heap[a], A.depth)); )
    A.heap[t] = A.heap[a], t = a, a <<= 1;
  A.heap[t] = i;
}, kt = (A, e, t) => {
  let i, a, B = 0, r, E;
  if (A.sym_next !== 0)
    do
      i = A.pending_buf[A.sym_buf + B++] & 255, i += (A.pending_buf[A.sym_buf + B++] & 255) << 8, a = A.pending_buf[A.sym_buf + B++], i === 0 ? K(A, a, e) : (r = dA[a], K(A, r + kA + 1, e), E = Et[r], E !== 0 && (a -= _t[r], M(A, a, E)), i--, r = _e(i), K(A, r, t), E = NA[r], E !== 0 && (i -= KA[r], M(A, i, E)));
    while (B < A.sym_next);
  K(A, ht, e);
}, gt = (A, e) => {
  const t = e.dyn_tree, i = e.stat_desc.static_tree, a = e.stat_desc.has_stree, B = e.stat_desc.elems;
  let r, E, f = -1, n;
  for (A.heap_len = 0, A.heap_max = le, r = 0; r < B; r++)
    t[r * 2] !== 0 ? (A.heap[++A.heap_len] = f = r, A.depth[r] = 0) : t[r * 2 + 1] = 0;
  for (; A.heap_len < 2; )
    n = A.heap[++A.heap_len] = f < 2 ? ++f : 0, t[n * 2] = 1, A.depth[n] = 0, A.opt_len--, a && (A.static_len -= i[n * 2 + 1]);
  for (e.max_code = f, r = A.heap_len >> 1; r >= 1; r--)
    WA(A, t, r);
  n = B;
  do
    r = A.heap[
      1
      /*SMALLEST*/
    ], A.heap[
      1
      /*SMALLEST*/
    ] = A.heap[A.heap_len--], WA(
      A,
      t,
      1
      /*SMALLEST*/
    ), E = A.heap[
      1
      /*SMALLEST*/
    ], A.heap[--A.heap_max] = r, A.heap[--A.heap_max] = E, t[n * 2] = t[r * 2] + t[E * 2], A.depth[n] = (A.depth[r] >= A.depth[E] ? A.depth[r] : A.depth[E]) + 1, t[r * 2 + 1] = t[E * 2 + 1] = n, A.heap[
      1
      /*SMALLEST*/
    ] = n++, WA(
      A,
      t,
      1
      /*SMALLEST*/
    );
  while (A.heap_len >= 2);
  A.heap[--A.heap_max] = A.heap[
    1
    /*SMALLEST*/
  ], ii(A, e), de(t, f, A.bl_count);
}, xt = (A, e, t) => {
  let i, a = -1, B, r = e[0 * 2 + 1], E = 0, f = 7, n = 4;
  for (r === 0 && (f = 138, n = 3), e[(t + 1) * 2 + 1] = 65535, i = 0; i <= t; i++)
    B = r, r = e[(i + 1) * 2 + 1], !(++E < f && B === r) && (E < n ? A.bl_tree[B * 2] += E : B !== 0 ? (B !== a && A.bl_tree[B * 2]++, A.bl_tree[se * 2]++) : E <= 10 ? A.bl_tree[oe * 2]++ : A.bl_tree[fe * 2]++, E = 0, a = B, r === 0 ? (f = 138, n = 3) : B === r ? (f = 6, n = 3) : (f = 7, n = 4));
}, Yt = (A, e, t) => {
  let i, a = -1, B, r = e[0 * 2 + 1], E = 0, f = 7, n = 4;
  for (r === 0 && (f = 138, n = 3), i = 0; i <= t; i++)
    if (B = r, r = e[(i + 1) * 2 + 1], !(++E < f && B === r)) {
      if (E < n)
        do
          K(A, B, A.bl_tree);
        while (--E !== 0);
      else
        B !== 0 ? (B !== a && (K(A, B, A.bl_tree), E--), K(A, se, A.bl_tree), M(A, E - 3, 2)) : E <= 10 ? (K(A, oe, A.bl_tree), M(A, E - 3, 3)) : (K(A, fe, A.bl_tree), M(A, E - 11, 7));
      E = 0, a = B, r === 0 ? (f = 138, n = 3) : B === r ? (f = 6, n = 3) : (f = 7, n = 4);
    }
}, ai = (A) => {
  let e;
  for (xt(A, A.dyn_ltree, A.l_desc.max_code), xt(A, A.dyn_dtree, A.d_desc.max_code), gt(A, A.bl_desc), e = wt - 1; e >= 3 && A.bl_tree[Ce[e] * 2 + 1] === 0; e--)
    ;
  return A.opt_len += 3 * (e + 1) + 5 + 5 + 4, e;
}, ni = (A, e, t, i) => {
  let a;
  for (M(A, e - 257, 5), M(A, t - 1, 5), M(A, i - 4, 4), a = 0; a < i; a++)
    M(A, A.bl_tree[Ce[a] * 2 + 1], 3);
  Yt(A, A.dyn_ltree, e - 1), Yt(A, A.dyn_dtree, t - 1);
}, Ei = (A) => {
  let e = 4093624447, t;
  for (t = 0; t <= 31; t++, e >>>= 1)
    if (e & 1 && A.dyn_ltree[t * 2] !== 0)
      return bt;
  if (A.dyn_ltree[9 * 2] !== 0 || A.dyn_ltree[10 * 2] !== 0 || A.dyn_ltree[13 * 2] !== 0)
    return Dt;
  for (t = 32; t < kA; t++)
    if (A.dyn_ltree[t * 2] !== 0)
      return Dt;
  return bt;
};
let Lt = !1;
const gi = (A) => {
  Lt || (Bi(), Lt = !0), A.l_desc = new VA(A.dyn_ltree, Ie), A.d_desc = new VA(A.dyn_dtree, we), A.bl_desc = new VA(A.bl_tree, he), A.bi_buf = 0, A.bi_valid = 0, ue(A);
}, be = (A, e, t, i) => {
  M(A, (We << 1) + (i ? 1 : 0), 3), ye(A), uA(A, t), uA(A, ~t), t && A.pending_buf.set(A.window.subarray(e, e + t), A.pending), A.pending += t;
}, ri = (A) => {
  M(A, Qe << 1, 3), K(A, ht, T), ei(A);
}, Qi = (A, e, t, i) => {
  let a, B, r = 0;
  A.level > 0 ? (A.strm.data_type === Ve && (A.strm.data_type = Ei(A)), gt(A, A.l_desc), gt(A, A.d_desc), r = ai(A), a = A.opt_len + 3 + 7 >>> 3, B = A.static_len + 3 + 7 >>> 3, B <= a && (a = B)) : a = B = t + 5, t + 4 <= a && e !== -1 ? be(A, e, t, i) : A.strategy === Oe || B === a ? (M(A, (Qe << 1) + (i ? 1 : 0), 3), kt(A, T, IA)) : (M(A, (Pe << 1) + (i ? 1 : 0), 3), ni(A, A.l_desc.max_code + 1, A.d_desc.max_code + 1, r + 1), kt(A, A.dyn_ltree, A.dyn_dtree)), ue(A), i && ye(A);
}, li = (A, e, t) => (A.pending_buf[A.sym_buf + A.sym_next++] = e, A.pending_buf[A.sym_buf + A.sym_next++] = e >> 8, A.pending_buf[A.sym_buf + A.sym_next++] = t, e === 0 ? A.dyn_ltree[t * 2]++ : (A.matches++, e--, A.dyn_ltree[(dA[t] + kA + 1) * 2]++, A.dyn_dtree[_e(e) * 2]++), A.sym_next === A.sym_end);
var si = gi, oi = be, fi = Qi, Ci = li, Ii = ri, wi = {
  _tr_init: si,
  _tr_stored_block: oi,
  _tr_flush_block: fi,
  _tr_tally: Ci,
  _tr_align: Ii
};
const hi = (A, e, t, i) => {
  let a = A & 65535 | 0, B = A >>> 16 & 65535 | 0, r = 0;
  for (; t !== 0; ) {
    r = t > 2e3 ? 2e3 : t, t -= r;
    do
      a = a + e[i++] | 0, B = B + a | 0;
    while (--r);
    a %= 65521, B %= 65521;
  }
  return a | B << 16 | 0;
};
var yA = hi;
const _i = () => {
  let A, e = [];
  for (var t = 0; t < 256; t++) {
    A = t;
    for (var i = 0; i < 8; i++)
      A = A & 1 ? 3988292384 ^ A >>> 1 : A >>> 1;
    e[t] = A;
  }
  return e;
}, ci = new Uint32Array(_i()), di = (A, e, t, i) => {
  const a = ci, B = i + t;
  A ^= -1;
  for (let r = i; r < B; r++)
    A = A >>> 8 ^ a[(A ^ e[r]) & 255];
  return A ^ -1;
};
var p = di, EA = {
  2: "need dictionary",
  /* Z_NEED_DICT       2  */
  1: "stream end",
  /* Z_STREAM_END      1  */
  0: "",
  /* Z_OK              0  */
  "-1": "file error",
  /* Z_ERRNO         (-1) */
  "-2": "stream error",
  /* Z_STREAM_ERROR  (-2) */
  "-3": "data error",
  /* Z_DATA_ERROR    (-3) */
  "-4": "insufficient memory",
  /* Z_MEM_ERROR     (-4) */
  "-5": "buffer error",
  /* Z_BUF_ERROR     (-5) */
  "-6": "incompatible version"
  /* Z_VERSION_ERROR (-6) */
}, xA = {
  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH: 0,
  Z_PARTIAL_FLUSH: 1,
  Z_SYNC_FLUSH: 2,
  Z_FULL_FLUSH: 3,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_TREES: 6,
  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_ERRNO: -1,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  Z_MEM_ERROR: -4,
  Z_BUF_ERROR: -5,
  //Z_VERSION_ERROR: -6,
  /* compression levels */
  Z_NO_COMPRESSION: 0,
  Z_BEST_SPEED: 1,
  Z_BEST_COMPRESSION: 9,
  Z_DEFAULT_COMPRESSION: -1,
  Z_FILTERED: 1,
  Z_HUFFMAN_ONLY: 2,
  Z_RLE: 3,
  Z_FIXED: 4,
  Z_DEFAULT_STRATEGY: 0,
  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY: 0,
  Z_TEXT: 1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN: 2,
  /* The deflate compression method */
  Z_DEFLATED: 8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};
const { _tr_init: ui, _tr_stored_block: rt, _tr_flush_block: yi, _tr_tally: V, _tr_align: bi } = wi, {
  Z_NO_FLUSH: W,
  Z_PARTIAL_FLUSH: Di,
  Z_FULL_FLUSH: Gi,
  Z_FINISH: S,
  Z_BLOCK: pt,
  Z_OK: R,
  Z_STREAM_END: Rt,
  Z_STREAM_ERROR: m,
  Z_DATA_ERROR: ki,
  Z_BUF_ERROR: PA,
  Z_DEFAULT_COMPRESSION: xi,
  Z_FILTERED: Yi,
  Z_HUFFMAN_ONLY: UA,
  Z_RLE: Li,
  Z_FIXED: pi,
  Z_DEFAULT_STRATEGY: Ri,
  Z_UNKNOWN: Ui,
  Z_DEFLATED: jA
} = xA, Mi = 9, Fi = 15, Hi = 8, Si = 29, Ni = 256, Qt = Ni + 1 + Si, vi = 30, Ki = 19, mi = 2 * Qt + 1, Zi = 15, G = 3, O = 258, Z = O + G + 1, ji = 32, gA = 42, ct = 57, lt = 69, st = 73, ot = 91, ft = 103, $ = 113, fA = 666, U = 1, lA = 2, tA = 3, sA = 4, Ti = 3, AA = (A, e) => (A.msg = EA[e], e), Ut = (A) => A * 2 - (A > 4 ? 9 : 0), J = (A) => {
  let e = A.length;
  for (; --e >= 0; )
    A[e] = 0;
}, zi = (A) => {
  let e, t, i, a = A.w_size;
  e = A.hash_size, i = e;
  do
    t = A.head[--i], A.head[i] = t >= a ? t - a : 0;
  while (--e);
  e = a, i = e;
  do
    t = A.prev[--i], A.prev[i] = t >= a ? t - a : 0;
  while (--e);
};
let Ji = (A, e, t) => (e << A.hash_shift ^ t) & A.hash_mask, P = Ji;
const F = (A) => {
  const e = A.state;
  let t = e.pending;
  t > A.avail_out && (t = A.avail_out), t !== 0 && (A.output.set(e.pending_buf.subarray(e.pending_out, e.pending_out + t), A.next_out), A.next_out += t, e.pending_out += t, A.total_out += t, A.avail_out -= t, e.pending -= t, e.pending === 0 && (e.pending_out = 0));
}, H = (A, e) => {
  yi(A, A.block_start >= 0 ? A.block_start : -1, A.strstart - A.block_start, e), A.block_start = A.strstart, F(A.strm);
}, x = (A, e) => {
  A.pending_buf[A.pending++] = e;
}, oA = (A, e) => {
  A.pending_buf[A.pending++] = e >>> 8 & 255, A.pending_buf[A.pending++] = e & 255;
}, Ct = (A, e, t, i) => {
  let a = A.avail_in;
  return a > i && (a = i), a === 0 ? 0 : (A.avail_in -= a, e.set(A.input.subarray(A.next_in, A.next_in + a), t), A.state.wrap === 1 ? A.adler = yA(A.adler, e, a, t) : A.state.wrap === 2 && (A.adler = p(A.adler, e, a, t)), A.next_in += a, A.total_in += a, a);
}, De = (A, e) => {
  let t = A.max_chain_length, i = A.strstart, a, B, r = A.prev_length, E = A.nice_match;
  const f = A.strstart > A.w_size - Z ? A.strstart - (A.w_size - Z) : 0, n = A.window, g = A.w_mask, u = A.prev, o = A.strstart + O;
  let Q = n[i + r - 1], w = n[i + r];
  A.prev_length >= A.good_match && (t >>= 2), E > A.lookahead && (E = A.lookahead);
  do
    if (a = e, !(n[a + r] !== w || n[a + r - 1] !== Q || n[a] !== n[i] || n[++a] !== n[i + 1])) {
      i += 2, a++;
      do
        ;
      while (n[++i] === n[++a] && n[++i] === n[++a] && n[++i] === n[++a] && n[++i] === n[++a] && n[++i] === n[++a] && n[++i] === n[++a] && n[++i] === n[++a] && n[++i] === n[++a] && i < o);
      if (B = O - (o - i), i = o - O, B > r) {
        if (A.match_start = e, r = B, B >= E)
          break;
        Q = n[i + r - 1], w = n[i + r];
      }
    }
  while ((e = u[e & g]) > f && --t !== 0);
  return r <= A.lookahead ? r : A.lookahead;
}, rA = (A) => {
  const e = A.w_size;
  let t, i, a;
  do {
    if (i = A.window_size - A.lookahead - A.strstart, A.strstart >= e + (e - Z) && (A.window.set(A.window.subarray(e, e + e - i), 0), A.match_start -= e, A.strstart -= e, A.block_start -= e, A.insert > A.strstart && (A.insert = A.strstart), zi(A), i += e), A.strm.avail_in === 0)
      break;
    if (t = Ct(A.strm, A.window, A.strstart + A.lookahead, i), A.lookahead += t, A.lookahead + A.insert >= G)
      for (a = A.strstart - A.insert, A.ins_h = A.window[a], A.ins_h = P(A, A.ins_h, A.window[a + 1]); A.insert && (A.ins_h = P(A, A.ins_h, A.window[a + G - 1]), A.prev[a & A.w_mask] = A.head[A.ins_h], A.head[A.ins_h] = a, a++, A.insert--, !(A.lookahead + A.insert < G)); )
        ;
  } while (A.lookahead < Z && A.strm.avail_in !== 0);
}, Ge = (A, e) => {
  let t = A.pending_buf_size - 5 > A.w_size ? A.w_size : A.pending_buf_size - 5, i, a, B, r = 0, E = A.strm.avail_in;
  do {
    if (i = 65535, B = A.bi_valid + 42 >> 3, A.strm.avail_out < B || (B = A.strm.avail_out - B, a = A.strstart - A.block_start, i > a + A.strm.avail_in && (i = a + A.strm.avail_in), i > B && (i = B), i < t && (i === 0 && e !== S || e === W || i !== a + A.strm.avail_in)))
      break;
    r = e === S && i === a + A.strm.avail_in ? 1 : 0, rt(A, 0, 0, r), A.pending_buf[A.pending - 4] = i, A.pending_buf[A.pending - 3] = i >> 8, A.pending_buf[A.pending - 2] = ~i, A.pending_buf[A.pending - 1] = ~i >> 8, F(A.strm), a && (a > i && (a = i), A.strm.output.set(A.window.subarray(A.block_start, A.block_start + a), A.strm.next_out), A.strm.next_out += a, A.strm.avail_out -= a, A.strm.total_out += a, A.block_start += a, i -= a), i && (Ct(A.strm, A.strm.output, A.strm.next_out, i), A.strm.next_out += i, A.strm.avail_out -= i, A.strm.total_out += i);
  } while (r === 0);
  return E -= A.strm.avail_in, E && (E >= A.w_size ? (A.matches = 2, A.window.set(A.strm.input.subarray(A.strm.next_in - A.w_size, A.strm.next_in), 0), A.strstart = A.w_size, A.insert = A.strstart) : (A.window_size - A.strstart <= E && (A.strstart -= A.w_size, A.window.set(A.window.subarray(A.w_size, A.w_size + A.strstart), 0), A.matches < 2 && A.matches++, A.insert > A.strstart && (A.insert = A.strstart)), A.window.set(A.strm.input.subarray(A.strm.next_in - E, A.strm.next_in), A.strstart), A.strstart += E, A.insert += E > A.w_size - A.insert ? A.w_size - A.insert : E), A.block_start = A.strstart), A.high_water < A.strstart && (A.high_water = A.strstart), r ? sA : e !== W && e !== S && A.strm.avail_in === 0 && A.strstart === A.block_start ? lA : (B = A.window_size - A.strstart, A.strm.avail_in > B && A.block_start >= A.w_size && (A.block_start -= A.w_size, A.strstart -= A.w_size, A.window.set(A.window.subarray(A.w_size, A.w_size + A.strstart), 0), A.matches < 2 && A.matches++, B += A.w_size, A.insert > A.strstart && (A.insert = A.strstart)), B > A.strm.avail_in && (B = A.strm.avail_in), B && (Ct(A.strm, A.window, A.strstart, B), A.strstart += B, A.insert += B > A.w_size - A.insert ? A.w_size - A.insert : B), A.high_water < A.strstart && (A.high_water = A.strstart), B = A.bi_valid + 42 >> 3, B = A.pending_buf_size - B > 65535 ? 65535 : A.pending_buf_size - B, t = B > A.w_size ? A.w_size : B, a = A.strstart - A.block_start, (a >= t || (a || e === S) && e !== W && A.strm.avail_in === 0 && a <= B) && (i = a > B ? B : a, r = e === S && A.strm.avail_in === 0 && i === a ? 1 : 0, rt(A, A.block_start, i, r), A.block_start += i, F(A.strm)), r ? tA : U);
}, XA = (A, e) => {
  let t, i;
  for (; ; ) {
    if (A.lookahead < Z) {
      if (rA(A), A.lookahead < Z && e === W)
        return U;
      if (A.lookahead === 0)
        break;
    }
    if (t = 0, A.lookahead >= G && (A.ins_h = P(A, A.ins_h, A.window[A.strstart + G - 1]), t = A.prev[A.strstart & A.w_mask] = A.head[A.ins_h], A.head[A.ins_h] = A.strstart), t !== 0 && A.strstart - t <= A.w_size - Z && (A.match_length = De(A, t)), A.match_length >= G)
      if (i = V(A, A.strstart - A.match_start, A.match_length - G), A.lookahead -= A.match_length, A.match_length <= A.max_lazy_match && A.lookahead >= G) {
        A.match_length--;
        do
          A.strstart++, A.ins_h = P(A, A.ins_h, A.window[A.strstart + G - 1]), t = A.prev[A.strstart & A.w_mask] = A.head[A.ins_h], A.head[A.ins_h] = A.strstart;
        while (--A.match_length !== 0);
        A.strstart++;
      } else
        A.strstart += A.match_length, A.match_length = 0, A.ins_h = A.window[A.strstart], A.ins_h = P(A, A.ins_h, A.window[A.strstart + 1]);
    else
      i = V(A, 0, A.window[A.strstart]), A.lookahead--, A.strstart++;
    if (i && (H(A, !1), A.strm.avail_out === 0))
      return U;
  }
  return A.insert = A.strstart < G - 1 ? A.strstart : G - 1, e === S ? (H(A, !0), A.strm.avail_out === 0 ? tA : sA) : A.sym_next && (H(A, !1), A.strm.avail_out === 0) ? U : lA;
}, BA = (A, e) => {
  let t, i, a;
  for (; ; ) {
    if (A.lookahead < Z) {
      if (rA(A), A.lookahead < Z && e === W)
        return U;
      if (A.lookahead === 0)
        break;
    }
    if (t = 0, A.lookahead >= G && (A.ins_h = P(A, A.ins_h, A.window[A.strstart + G - 1]), t = A.prev[A.strstart & A.w_mask] = A.head[A.ins_h], A.head[A.ins_h] = A.strstart), A.prev_length = A.match_length, A.prev_match = A.match_start, A.match_length = G - 1, t !== 0 && A.prev_length < A.max_lazy_match && A.strstart - t <= A.w_size - Z && (A.match_length = De(A, t), A.match_length <= 5 && (A.strategy === Yi || A.match_length === G && A.strstart - A.match_start > 4096) && (A.match_length = G - 1)), A.prev_length >= G && A.match_length <= A.prev_length) {
      a = A.strstart + A.lookahead - G, i = V(A, A.strstart - 1 - A.prev_match, A.prev_length - G), A.lookahead -= A.prev_length - 1, A.prev_length -= 2;
      do
        ++A.strstart <= a && (A.ins_h = P(A, A.ins_h, A.window[A.strstart + G - 1]), t = A.prev[A.strstart & A.w_mask] = A.head[A.ins_h], A.head[A.ins_h] = A.strstart);
      while (--A.prev_length !== 0);
      if (A.match_available = 0, A.match_length = G - 1, A.strstart++, i && (H(A, !1), A.strm.avail_out === 0))
        return U;
    } else if (A.match_available) {
      if (i = V(A, 0, A.window[A.strstart - 1]), i && H(A, !1), A.strstart++, A.lookahead--, A.strm.avail_out === 0)
        return U;
    } else
      A.match_available = 1, A.strstart++, A.lookahead--;
  }
  return A.match_available && (i = V(A, 0, A.window[A.strstart - 1]), A.match_available = 0), A.insert = A.strstart < G - 1 ? A.strstart : G - 1, e === S ? (H(A, !0), A.strm.avail_out === 0 ? tA : sA) : A.sym_next && (H(A, !1), A.strm.avail_out === 0) ? U : lA;
}, Oi = (A, e) => {
  let t, i, a, B;
  const r = A.window;
  for (; ; ) {
    if (A.lookahead <= O) {
      if (rA(A), A.lookahead <= O && e === W)
        return U;
      if (A.lookahead === 0)
        break;
    }
    if (A.match_length = 0, A.lookahead >= G && A.strstart > 0 && (a = A.strstart - 1, i = r[a], i === r[++a] && i === r[++a] && i === r[++a])) {
      B = A.strstart + O;
      do
        ;
      while (i === r[++a] && i === r[++a] && i === r[++a] && i === r[++a] && i === r[++a] && i === r[++a] && i === r[++a] && i === r[++a] && a < B);
      A.match_length = O - (B - a), A.match_length > A.lookahead && (A.match_length = A.lookahead);
    }
    if (A.match_length >= G ? (t = V(A, 1, A.match_length - G), A.lookahead -= A.match_length, A.strstart += A.match_length, A.match_length = 0) : (t = V(A, 0, A.window[A.strstart]), A.lookahead--, A.strstart++), t && (H(A, !1), A.strm.avail_out === 0))
      return U;
  }
  return A.insert = 0, e === S ? (H(A, !0), A.strm.avail_out === 0 ? tA : sA) : A.sym_next && (H(A, !1), A.strm.avail_out === 0) ? U : lA;
}, Vi = (A, e) => {
  let t;
  for (; ; ) {
    if (A.lookahead === 0 && (rA(A), A.lookahead === 0)) {
      if (e === W)
        return U;
      break;
    }
    if (A.match_length = 0, t = V(A, 0, A.window[A.strstart]), A.lookahead--, A.strstart++, t && (H(A, !1), A.strm.avail_out === 0))
      return U;
  }
  return A.insert = 0, e === S ? (H(A, !0), A.strm.avail_out === 0 ? tA : sA) : A.sym_next && (H(A, !1), A.strm.avail_out === 0) ? U : lA;
};
function v(A, e, t, i, a) {
  this.good_length = A, this.max_lazy = e, this.nice_length = t, this.max_chain = i, this.func = a;
}
const CA = [
  /*      good lazy nice chain */
  new v(0, 0, 0, 0, Ge),
  /* 0 store only */
  new v(4, 4, 8, 4, XA),
  /* 1 max speed, no lazy matches */
  new v(4, 5, 16, 8, XA),
  /* 2 */
  new v(4, 6, 32, 32, XA),
  /* 3 */
  new v(4, 4, 16, 16, BA),
  /* 4 lazy matches */
  new v(8, 16, 32, 32, BA),
  /* 5 */
  new v(8, 16, 128, 128, BA),
  /* 6 */
  new v(8, 32, 128, 256, BA),
  /* 7 */
  new v(32, 128, 258, 1024, BA),
  /* 8 */
  new v(32, 258, 258, 4096, BA)
  /* 9 max compression */
], Wi = (A) => {
  A.window_size = 2 * A.w_size, J(A.head), A.max_lazy_match = CA[A.level].max_lazy, A.good_match = CA[A.level].good_length, A.nice_match = CA[A.level].nice_length, A.max_chain_length = CA[A.level].max_chain, A.strstart = 0, A.block_start = 0, A.lookahead = 0, A.insert = 0, A.match_length = A.prev_length = G - 1, A.match_available = 0, A.ins_h = 0;
};
function Pi() {
  this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = jA, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Uint16Array(mi * 2), this.dyn_dtree = new Uint16Array((2 * vi + 1) * 2), this.bl_tree = new Uint16Array((2 * Ki + 1) * 2), J(this.dyn_ltree), J(this.dyn_dtree), J(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new Uint16Array(Zi + 1), this.heap = new Uint16Array(2 * Qt + 1), J(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new Uint16Array(2 * Qt + 1), J(this.depth), this.sym_buf = 0, this.lit_bufsize = 0, this.sym_next = 0, this.sym_end = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
}
const YA = (A) => {
  if (!A)
    return 1;
  const e = A.state;
  return !e || e.strm !== A || e.status !== gA && //#ifdef GZIP
  e.status !== ct && //#endif
  e.status !== lt && e.status !== st && e.status !== ot && e.status !== ft && e.status !== $ && e.status !== fA ? 1 : 0;
}, ke = (A) => {
  if (YA(A))
    return AA(A, m);
  A.total_in = A.total_out = 0, A.data_type = Ui;
  const e = A.state;
  return e.pending = 0, e.pending_out = 0, e.wrap < 0 && (e.wrap = -e.wrap), e.status = //#ifdef GZIP
  e.wrap === 2 ? ct : (
    //#endif
    e.wrap ? gA : $
  ), A.adler = e.wrap === 2 ? 0 : 1, e.last_flush = -2, ui(e), R;
}, xe = (A) => {
  const e = ke(A);
  return e === R && Wi(A.state), e;
}, Xi = (A, e) => YA(A) || A.state.wrap !== 2 ? m : (A.state.gzhead = e, R), Ye = (A, e, t, i, a, B) => {
  if (!A)
    return m;
  let r = 1;
  if (e === xi && (e = 6), i < 0 ? (r = 0, i = -i) : i > 15 && (r = 2, i -= 16), a < 1 || a > Mi || t !== jA || i < 8 || i > 15 || e < 0 || e > 9 || B < 0 || B > pi || i === 8 && r !== 1)
    return AA(A, m);
  i === 8 && (i = 9);
  const E = new Pi();
  return A.state = E, E.strm = A, E.status = gA, E.wrap = r, E.gzhead = null, E.w_bits = i, E.w_size = 1 << E.w_bits, E.w_mask = E.w_size - 1, E.hash_bits = a + 7, E.hash_size = 1 << E.hash_bits, E.hash_mask = E.hash_size - 1, E.hash_shift = ~~((E.hash_bits + G - 1) / G), E.window = new Uint8Array(E.w_size * 2), E.head = new Uint16Array(E.hash_size), E.prev = new Uint16Array(E.w_size), E.lit_bufsize = 1 << a + 6, E.pending_buf_size = E.lit_bufsize * 4, E.pending_buf = new Uint8Array(E.pending_buf_size), E.sym_buf = E.lit_bufsize, E.sym_end = (E.lit_bufsize - 1) * 3, E.level = e, E.strategy = B, E.method = t, xe(A);
}, qi = (A, e) => Ye(A, e, jA, Fi, Hi, Ri), $i = (A, e) => {
  if (YA(A) || e > pt || e < 0)
    return A ? AA(A, m) : m;
  const t = A.state;
  if (!A.output || A.avail_in !== 0 && !A.input || t.status === fA && e !== S)
    return AA(A, A.avail_out === 0 ? PA : m);
  const i = t.last_flush;
  if (t.last_flush = e, t.pending !== 0) {
    if (F(A), A.avail_out === 0)
      return t.last_flush = -1, R;
  } else if (A.avail_in === 0 && Ut(e) <= Ut(i) && e !== S)
    return AA(A, PA);
  if (t.status === fA && A.avail_in !== 0)
    return AA(A, PA);
  if (t.status === gA && t.wrap === 0 && (t.status = $), t.status === gA) {
    let a = jA + (t.w_bits - 8 << 4) << 8, B = -1;
    if (t.strategy >= UA || t.level < 2 ? B = 0 : t.level < 6 ? B = 1 : t.level === 6 ? B = 2 : B = 3, a |= B << 6, t.strstart !== 0 && (a |= ji), a += 31 - a % 31, oA(t, a), t.strstart !== 0 && (oA(t, A.adler >>> 16), oA(t, A.adler & 65535)), A.adler = 1, t.status = $, F(A), t.pending !== 0)
      return t.last_flush = -1, R;
  }
  if (t.status === ct) {
    if (A.adler = 0, x(t, 31), x(t, 139), x(t, 8), t.gzhead)
      x(
        t,
        (t.gzhead.text ? 1 : 0) + (t.gzhead.hcrc ? 2 : 0) + (t.gzhead.extra ? 4 : 0) + (t.gzhead.name ? 8 : 0) + (t.gzhead.comment ? 16 : 0)
      ), x(t, t.gzhead.time & 255), x(t, t.gzhead.time >> 8 & 255), x(t, t.gzhead.time >> 16 & 255), x(t, t.gzhead.time >> 24 & 255), x(t, t.level === 9 ? 2 : t.strategy >= UA || t.level < 2 ? 4 : 0), x(t, t.gzhead.os & 255), t.gzhead.extra && t.gzhead.extra.length && (x(t, t.gzhead.extra.length & 255), x(t, t.gzhead.extra.length >> 8 & 255)), t.gzhead.hcrc && (A.adler = p(A.adler, t.pending_buf, t.pending, 0)), t.gzindex = 0, t.status = lt;
    else if (x(t, 0), x(t, 0), x(t, 0), x(t, 0), x(t, 0), x(t, t.level === 9 ? 2 : t.strategy >= UA || t.level < 2 ? 4 : 0), x(t, Ti), t.status = $, F(A), t.pending !== 0)
      return t.last_flush = -1, R;
  }
  if (t.status === lt) {
    if (t.gzhead.extra) {
      let a = t.pending, B = (t.gzhead.extra.length & 65535) - t.gzindex;
      for (; t.pending + B > t.pending_buf_size; ) {
        let E = t.pending_buf_size - t.pending;
        if (t.pending_buf.set(t.gzhead.extra.subarray(t.gzindex, t.gzindex + E), t.pending), t.pending = t.pending_buf_size, t.gzhead.hcrc && t.pending > a && (A.adler = p(A.adler, t.pending_buf, t.pending - a, a)), t.gzindex += E, F(A), t.pending !== 0)
          return t.last_flush = -1, R;
        a = 0, B -= E;
      }
      let r = new Uint8Array(t.gzhead.extra);
      t.pending_buf.set(r.subarray(t.gzindex, t.gzindex + B), t.pending), t.pending += B, t.gzhead.hcrc && t.pending > a && (A.adler = p(A.adler, t.pending_buf, t.pending - a, a)), t.gzindex = 0;
    }
    t.status = st;
  }
  if (t.status === st) {
    if (t.gzhead.name) {
      let a = t.pending, B;
      do {
        if (t.pending === t.pending_buf_size) {
          if (t.gzhead.hcrc && t.pending > a && (A.adler = p(A.adler, t.pending_buf, t.pending - a, a)), F(A), t.pending !== 0)
            return t.last_flush = -1, R;
          a = 0;
        }
        t.gzindex < t.gzhead.name.length ? B = t.gzhead.name.charCodeAt(t.gzindex++) & 255 : B = 0, x(t, B);
      } while (B !== 0);
      t.gzhead.hcrc && t.pending > a && (A.adler = p(A.adler, t.pending_buf, t.pending - a, a)), t.gzindex = 0;
    }
    t.status = ot;
  }
  if (t.status === ot) {
    if (t.gzhead.comment) {
      let a = t.pending, B;
      do {
        if (t.pending === t.pending_buf_size) {
          if (t.gzhead.hcrc && t.pending > a && (A.adler = p(A.adler, t.pending_buf, t.pending - a, a)), F(A), t.pending !== 0)
            return t.last_flush = -1, R;
          a = 0;
        }
        t.gzindex < t.gzhead.comment.length ? B = t.gzhead.comment.charCodeAt(t.gzindex++) & 255 : B = 0, x(t, B);
      } while (B !== 0);
      t.gzhead.hcrc && t.pending > a && (A.adler = p(A.adler, t.pending_buf, t.pending - a, a));
    }
    t.status = ft;
  }
  if (t.status === ft) {
    if (t.gzhead.hcrc) {
      if (t.pending + 2 > t.pending_buf_size && (F(A), t.pending !== 0))
        return t.last_flush = -1, R;
      x(t, A.adler & 255), x(t, A.adler >> 8 & 255), A.adler = 0;
    }
    if (t.status = $, F(A), t.pending !== 0)
      return t.last_flush = -1, R;
  }
  if (A.avail_in !== 0 || t.lookahead !== 0 || e !== W && t.status !== fA) {
    let a = t.level === 0 ? Ge(t, e) : t.strategy === UA ? Vi(t, e) : t.strategy === Li ? Oi(t, e) : CA[t.level].func(t, e);
    if ((a === tA || a === sA) && (t.status = fA), a === U || a === tA)
      return A.avail_out === 0 && (t.last_flush = -1), R;
    if (a === lA && (e === Di ? bi(t) : e !== pt && (rt(t, 0, 0, !1), e === Gi && (J(t.head), t.lookahead === 0 && (t.strstart = 0, t.block_start = 0, t.insert = 0))), F(A), A.avail_out === 0))
      return t.last_flush = -1, R;
  }
  return e !== S ? R : t.wrap <= 0 ? Rt : (t.wrap === 2 ? (x(t, A.adler & 255), x(t, A.adler >> 8 & 255), x(t, A.adler >> 16 & 255), x(t, A.adler >> 24 & 255), x(t, A.total_in & 255), x(t, A.total_in >> 8 & 255), x(t, A.total_in >> 16 & 255), x(t, A.total_in >> 24 & 255)) : (oA(t, A.adler >>> 16), oA(t, A.adler & 65535)), F(A), t.wrap > 0 && (t.wrap = -t.wrap), t.pending !== 0 ? R : Rt);
}, AB = (A) => {
  if (YA(A))
    return m;
  const e = A.state.status;
  return A.state = null, e === $ ? AA(A, ki) : R;
}, tB = (A, e) => {
  let t = e.length;
  if (YA(A))
    return m;
  const i = A.state, a = i.wrap;
  if (a === 2 || a === 1 && i.status !== gA || i.lookahead)
    return m;
  if (a === 1 && (A.adler = yA(A.adler, e, t, 0)), i.wrap = 0, t >= i.w_size) {
    a === 0 && (J(i.head), i.strstart = 0, i.block_start = 0, i.insert = 0);
    let f = new Uint8Array(i.w_size);
    f.set(e.subarray(t - i.w_size, t), 0), e = f, t = i.w_size;
  }
  const B = A.avail_in, r = A.next_in, E = A.input;
  for (A.avail_in = t, A.next_in = 0, A.input = e, rA(i); i.lookahead >= G; ) {
    let f = i.strstart, n = i.lookahead - (G - 1);
    do
      i.ins_h = P(i, i.ins_h, i.window[f + G - 1]), i.prev[f & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = f, f++;
    while (--n);
    i.strstart = f, i.lookahead = G - 1, rA(i);
  }
  return i.strstart += i.lookahead, i.block_start = i.strstart, i.insert = i.lookahead, i.lookahead = 0, i.match_length = i.prev_length = G - 1, i.match_available = 0, A.next_in = r, A.input = E, A.avail_in = B, i.wrap = a, R;
};
var eB = qi, iB = Ye, BB = xe, aB = ke, nB = Xi, EB = $i, gB = AB, rB = tB, QB = "pako deflate (from Nodeca project)", wA = {
  deflateInit: eB,
  deflateInit2: iB,
  deflateReset: BB,
  deflateResetKeep: aB,
  deflateSetHeader: nB,
  deflate: EB,
  deflateEnd: gB,
  deflateSetDictionary: rB,
  deflateInfo: QB
};
const lB = (A, e) => Object.prototype.hasOwnProperty.call(A, e);
var sB = function(A) {
  const e = Array.prototype.slice.call(arguments, 1);
  for (; e.length; ) {
    const t = e.shift();
    if (t) {
      if (typeof t != "object")
        throw new TypeError(t + "must be non-object");
      for (const i in t)
        lB(t, i) && (A[i] = t[i]);
    }
  }
  return A;
}, oB = (A) => {
  let e = 0;
  for (let i = 0, a = A.length; i < a; i++)
    e += A[i].length;
  const t = new Uint8Array(e);
  for (let i = 0, a = 0, B = A.length; i < B; i++) {
    let r = A[i];
    t.set(r, a), a += r.length;
  }
  return t;
}, TA = {
  assign: sB,
  flattenChunks: oB
};
let Le = !0;
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch {
  Le = !1;
}
const bA = new Uint8Array(256);
for (let A = 0; A < 256; A++)
  bA[A] = A >= 252 ? 6 : A >= 248 ? 5 : A >= 240 ? 4 : A >= 224 ? 3 : A >= 192 ? 2 : 1;
bA[254] = bA[254] = 1;
var fB = (A) => {
  if (typeof TextEncoder == "function" && TextEncoder.prototype.encode)
    return new TextEncoder().encode(A);
  let e, t, i, a, B, r = A.length, E = 0;
  for (a = 0; a < r; a++)
    t = A.charCodeAt(a), (t & 64512) === 55296 && a + 1 < r && (i = A.charCodeAt(a + 1), (i & 64512) === 56320 && (t = 65536 + (t - 55296 << 10) + (i - 56320), a++)), E += t < 128 ? 1 : t < 2048 ? 2 : t < 65536 ? 3 : 4;
  for (e = new Uint8Array(E), B = 0, a = 0; B < E; a++)
    t = A.charCodeAt(a), (t & 64512) === 55296 && a + 1 < r && (i = A.charCodeAt(a + 1), (i & 64512) === 56320 && (t = 65536 + (t - 55296 << 10) + (i - 56320), a++)), t < 128 ? e[B++] = t : t < 2048 ? (e[B++] = 192 | t >>> 6, e[B++] = 128 | t & 63) : t < 65536 ? (e[B++] = 224 | t >>> 12, e[B++] = 128 | t >>> 6 & 63, e[B++] = 128 | t & 63) : (e[B++] = 240 | t >>> 18, e[B++] = 128 | t >>> 12 & 63, e[B++] = 128 | t >>> 6 & 63, e[B++] = 128 | t & 63);
  return e;
};
const CB = (A, e) => {
  if (e < 65534 && A.subarray && Le)
    return String.fromCharCode.apply(null, A.length === e ? A : A.subarray(0, e));
  let t = "";
  for (let i = 0; i < e; i++)
    t += String.fromCharCode(A[i]);
  return t;
};
var IB = (A, e) => {
  const t = e || A.length;
  if (typeof TextDecoder == "function" && TextDecoder.prototype.decode)
    return new TextDecoder().decode(A.subarray(0, e));
  let i, a;
  const B = new Array(t * 2);
  for (a = 0, i = 0; i < t; ) {
    let r = A[i++];
    if (r < 128) {
      B[a++] = r;
      continue;
    }
    let E = bA[r];
    if (E > 4) {
      B[a++] = 65533, i += E - 1;
      continue;
    }
    for (r &= E === 2 ? 31 : E === 3 ? 15 : 7; E > 1 && i < t; )
      r = r << 6 | A[i++] & 63, E--;
    if (E > 1) {
      B[a++] = 65533;
      continue;
    }
    r < 65536 ? B[a++] = r : (r -= 65536, B[a++] = 55296 | r >> 10 & 1023, B[a++] = 56320 | r & 1023);
  }
  return CB(B, a);
}, wB = (A, e) => {
  e = e || A.length, e > A.length && (e = A.length);
  let t = e - 1;
  for (; t >= 0 && (A[t] & 192) === 128; )
    t--;
  return t < 0 || t === 0 ? e : t + bA[A[t]] > e ? t : e;
}, DA = {
  string2buf: fB,
  buf2string: IB,
  utf8border: wB
};
function hB() {
  this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
var pe = hB;
const Re = Object.prototype.toString, {
  Z_NO_FLUSH: _B,
  Z_SYNC_FLUSH: cB,
  Z_FULL_FLUSH: dB,
  Z_FINISH: uB,
  Z_OK: mA,
  Z_STREAM_END: yB,
  Z_DEFAULT_COMPRESSION: bB,
  Z_DEFAULT_STRATEGY: DB,
  Z_DEFLATED: GB
} = xA;
function dt(A) {
  this.options = TA.assign({
    level: bB,
    method: GB,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: DB
  }, A || {});
  let e = this.options;
  e.raw && e.windowBits > 0 ? e.windowBits = -e.windowBits : e.gzip && e.windowBits > 0 && e.windowBits < 16 && (e.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new pe(), this.strm.avail_out = 0;
  let t = wA.deflateInit2(
    this.strm,
    e.level,
    e.method,
    e.windowBits,
    e.memLevel,
    e.strategy
  );
  if (t !== mA)
    throw new Error(EA[t]);
  if (e.header && wA.deflateSetHeader(this.strm, e.header), e.dictionary) {
    let i;
    if (typeof e.dictionary == "string" ? i = DA.string2buf(e.dictionary) : Re.call(e.dictionary) === "[object ArrayBuffer]" ? i = new Uint8Array(e.dictionary) : i = e.dictionary, t = wA.deflateSetDictionary(this.strm, i), t !== mA)
      throw new Error(EA[t]);
    this._dict_set = !0;
  }
}
dt.prototype.push = function(A, e) {
  const t = this.strm, i = this.options.chunkSize;
  let a, B;
  if (this.ended)
    return !1;
  for (e === ~~e ? B = e : B = e === !0 ? uB : _B, typeof A == "string" ? t.input = DA.string2buf(A) : Re.call(A) === "[object ArrayBuffer]" ? t.input = new Uint8Array(A) : t.input = A, t.next_in = 0, t.avail_in = t.input.length; ; ) {
    if (t.avail_out === 0 && (t.output = new Uint8Array(i), t.next_out = 0, t.avail_out = i), (B === cB || B === dB) && t.avail_out <= 6) {
      this.onData(t.output.subarray(0, t.next_out)), t.avail_out = 0;
      continue;
    }
    if (a = wA.deflate(t, B), a === yB)
      return t.next_out > 0 && this.onData(t.output.subarray(0, t.next_out)), a = wA.deflateEnd(this.strm), this.onEnd(a), this.ended = !0, a === mA;
    if (t.avail_out === 0) {
      this.onData(t.output);
      continue;
    }
    if (B > 0 && t.next_out > 0) {
      this.onData(t.output.subarray(0, t.next_out)), t.avail_out = 0;
      continue;
    }
    if (t.avail_in === 0)
      break;
  }
  return !0;
};
dt.prototype.onData = function(A) {
  this.chunks.push(A);
};
dt.prototype.onEnd = function(A) {
  A === mA && (this.result = TA.flattenChunks(this.chunks)), this.chunks = [], this.err = A, this.msg = this.strm.msg;
};
const MA = 16209, kB = 16191;
var xB = function(e, t) {
  let i, a, B, r, E, f, n, g, u, o, Q, w, Y, c, h, b, s, l, I, y, C, k, d, _;
  const D = e.state;
  i = e.next_in, d = e.input, a = i + (e.avail_in - 5), B = e.next_out, _ = e.output, r = B - (t - e.avail_out), E = B + (e.avail_out - 257), f = D.dmax, n = D.wsize, g = D.whave, u = D.wnext, o = D.window, Q = D.hold, w = D.bits, Y = D.lencode, c = D.distcode, h = (1 << D.lenbits) - 1, b = (1 << D.distbits) - 1;
  A:
    do {
      w < 15 && (Q += d[i++] << w, w += 8, Q += d[i++] << w, w += 8), s = Y[Q & h];
      t:
        for (; ; ) {
          if (l = s >>> 24, Q >>>= l, w -= l, l = s >>> 16 & 255, l === 0)
            _[B++] = s & 65535;
          else if (l & 16) {
            I = s & 65535, l &= 15, l && (w < l && (Q += d[i++] << w, w += 8), I += Q & (1 << l) - 1, Q >>>= l, w -= l), w < 15 && (Q += d[i++] << w, w += 8, Q += d[i++] << w, w += 8), s = c[Q & b];
            e:
              for (; ; ) {
                if (l = s >>> 24, Q >>>= l, w -= l, l = s >>> 16 & 255, l & 16) {
                  if (y = s & 65535, l &= 15, w < l && (Q += d[i++] << w, w += 8, w < l && (Q += d[i++] << w, w += 8)), y += Q & (1 << l) - 1, y > f) {
                    e.msg = "invalid distance too far back", D.mode = MA;
                    break A;
                  }
                  if (Q >>>= l, w -= l, l = B - r, y > l) {
                    if (l = y - l, l > g && D.sane) {
                      e.msg = "invalid distance too far back", D.mode = MA;
                      break A;
                    }
                    if (C = 0, k = o, u === 0) {
                      if (C += n - l, l < I) {
                        I -= l;
                        do
                          _[B++] = o[C++];
                        while (--l);
                        C = B - y, k = _;
                      }
                    } else if (u < l) {
                      if (C += n + u - l, l -= u, l < I) {
                        I -= l;
                        do
                          _[B++] = o[C++];
                        while (--l);
                        if (C = 0, u < I) {
                          l = u, I -= l;
                          do
                            _[B++] = o[C++];
                          while (--l);
                          C = B - y, k = _;
                        }
                      }
                    } else if (C += u - l, l < I) {
                      I -= l;
                      do
                        _[B++] = o[C++];
                      while (--l);
                      C = B - y, k = _;
                    }
                    for (; I > 2; )
                      _[B++] = k[C++], _[B++] = k[C++], _[B++] = k[C++], I -= 3;
                    I && (_[B++] = k[C++], I > 1 && (_[B++] = k[C++]));
                  } else {
                    C = B - y;
                    do
                      _[B++] = _[C++], _[B++] = _[C++], _[B++] = _[C++], I -= 3;
                    while (I > 2);
                    I && (_[B++] = _[C++], I > 1 && (_[B++] = _[C++]));
                  }
                } else if (l & 64) {
                  e.msg = "invalid distance code", D.mode = MA;
                  break A;
                } else {
                  s = c[(s & 65535) + (Q & (1 << l) - 1)];
                  continue e;
                }
                break;
              }
          } else if (l & 64)
            if (l & 32) {
              D.mode = kB;
              break A;
            } else {
              e.msg = "invalid literal/length code", D.mode = MA;
              break A;
            }
          else {
            s = Y[(s & 65535) + (Q & (1 << l) - 1)];
            continue t;
          }
          break;
        }
    } while (i < a && B < E);
  I = w >> 3, i -= I, w -= I << 3, Q &= (1 << w) - 1, e.next_in = i, e.next_out = B, e.avail_in = i < a ? 5 + (a - i) : 5 - (i - a), e.avail_out = B < E ? 257 + (E - B) : 257 - (B - E), D.hold = Q, D.bits = w;
};
const aA = 15, Mt = 852, Ft = 592, Ht = 0, qA = 1, St = 2, YB = new Uint16Array([
  /* Length codes 257..285 base */
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  13,
  15,
  17,
  19,
  23,
  27,
  31,
  35,
  43,
  51,
  59,
  67,
  83,
  99,
  115,
  131,
  163,
  195,
  227,
  258,
  0,
  0
]), LB = new Uint8Array([
  /* Length codes 257..285 extra */
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  17,
  17,
  17,
  17,
  18,
  18,
  18,
  18,
  19,
  19,
  19,
  19,
  20,
  20,
  20,
  20,
  21,
  21,
  21,
  21,
  16,
  72,
  78
]), pB = new Uint16Array([
  /* Distance codes 0..29 base */
  1,
  2,
  3,
  4,
  5,
  7,
  9,
  13,
  17,
  25,
  33,
  49,
  65,
  97,
  129,
  193,
  257,
  385,
  513,
  769,
  1025,
  1537,
  2049,
  3073,
  4097,
  6145,
  8193,
  12289,
  16385,
  24577,
  0,
  0
]), RB = new Uint8Array([
  /* Distance codes 0..29 extra */
  16,
  16,
  16,
  16,
  17,
  17,
  18,
  18,
  19,
  19,
  20,
  20,
  21,
  21,
  22,
  22,
  23,
  23,
  24,
  24,
  25,
  25,
  26,
  26,
  27,
  27,
  28,
  28,
  29,
  29,
  64,
  64
]), UB = (A, e, t, i, a, B, r, E) => {
  const f = E.bits;
  let n = 0, g = 0, u = 0, o = 0, Q = 0, w = 0, Y = 0, c = 0, h = 0, b = 0, s, l, I, y, C, k = null, d;
  const _ = new Uint16Array(aA + 1), D = new Uint16Array(aA + 1);
  let X = null, yt, pA, RA;
  for (n = 0; n <= aA; n++)
    _[n] = 0;
  for (g = 0; g < i; g++)
    _[e[t + g]]++;
  for (Q = f, o = aA; o >= 1 && _[o] === 0; o--)
    ;
  if (Q > o && (Q = o), o === 0)
    return a[B++] = 1 << 24 | 64 << 16 | 0, a[B++] = 1 << 24 | 64 << 16 | 0, E.bits = 1, 0;
  for (u = 1; u < o && _[u] === 0; u++)
    ;
  for (Q < u && (Q = u), c = 1, n = 1; n <= aA; n++)
    if (c <<= 1, c -= _[n], c < 0)
      return -1;
  if (c > 0 && (A === Ht || o !== 1))
    return -1;
  for (D[1] = 0, n = 1; n < aA; n++)
    D[n + 1] = D[n] + _[n];
  for (g = 0; g < i; g++)
    e[t + g] !== 0 && (r[D[e[t + g]]++] = g);
  if (A === Ht ? (k = X = r, d = 20) : A === qA ? (k = YB, X = LB, d = 257) : (k = pB, X = RB, d = 0), b = 0, g = 0, n = u, C = B, w = Q, Y = 0, I = -1, h = 1 << Q, y = h - 1, A === qA && h > Mt || A === St && h > Ft)
    return 1;
  for (; ; ) {
    yt = n - Y, r[g] + 1 < d ? (pA = 0, RA = r[g]) : r[g] >= d ? (pA = X[r[g] - d], RA = k[r[g] - d]) : (pA = 96, RA = 0), s = 1 << n - Y, l = 1 << w, u = l;
    do
      l -= s, a[C + (b >> Y) + l] = yt << 24 | pA << 16 | RA | 0;
    while (l !== 0);
    for (s = 1 << n - 1; b & s; )
      s >>= 1;
    if (s !== 0 ? (b &= s - 1, b += s) : b = 0, g++, --_[n] === 0) {
      if (n === o)
        break;
      n = e[t + r[g]];
    }
    if (n > Q && (b & y) !== I) {
      for (Y === 0 && (Y = Q), C += u, w = n - Y, c = 1 << w; w + Y < o && (c -= _[w + Y], !(c <= 0)); )
        w++, c <<= 1;
      if (h += 1 << w, A === qA && h > Mt || A === St && h > Ft)
        return 1;
      I = b & y, a[I] = Q << 24 | w << 16 | C - B | 0;
    }
  }
  return b !== 0 && (a[C + b] = n - Y << 24 | 64 << 16 | 0), E.bits = Q, 0;
};
var hA = UB;
const MB = 0, Ue = 1, Me = 2, {
  Z_FINISH: Nt,
  Z_BLOCK: FB,
  Z_TREES: FA,
  Z_OK: eA,
  Z_STREAM_END: HB,
  Z_NEED_DICT: SB,
  Z_STREAM_ERROR: N,
  Z_DATA_ERROR: Fe,
  Z_MEM_ERROR: He,
  Z_BUF_ERROR: NB,
  Z_DEFLATED: vt
} = xA, zA = 16180, Kt = 16181, mt = 16182, Zt = 16183, jt = 16184, Tt = 16185, zt = 16186, Jt = 16187, Ot = 16188, Vt = 16189, ZA = 16190, j = 16191, $A = 16192, Wt = 16193, At = 16194, Pt = 16195, Xt = 16196, qt = 16197, $t = 16198, HA = 16199, SA = 16200, Ae = 16201, te = 16202, ee = 16203, ie = 16204, Be = 16205, tt = 16206, ae = 16207, ne = 16208, L = 16209, Se = 16210, Ne = 16211, vB = 852, KB = 592, mB = 15, ZB = mB, Ee = (A) => (A >>> 24 & 255) + (A >>> 8 & 65280) + ((A & 65280) << 8) + ((A & 255) << 24);
function jB() {
  this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
const iA = (A) => {
  if (!A)
    return 1;
  const e = A.state;
  return !e || e.strm !== A || e.mode < zA || e.mode > Ne ? 1 : 0;
}, ve = (A) => {
  if (iA(A))
    return N;
  const e = A.state;
  return A.total_in = A.total_out = e.total = 0, A.msg = "", e.wrap && (A.adler = e.wrap & 1), e.mode = zA, e.last = 0, e.havedict = 0, e.flags = -1, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = new Int32Array(vB), e.distcode = e.distdyn = new Int32Array(KB), e.sane = 1, e.back = -1, eA;
}, Ke = (A) => {
  if (iA(A))
    return N;
  const e = A.state;
  return e.wsize = 0, e.whave = 0, e.wnext = 0, ve(A);
}, me = (A, e) => {
  let t;
  if (iA(A))
    return N;
  const i = A.state;
  return e < 0 ? (t = 0, e = -e) : (t = (e >> 4) + 5, e < 48 && (e &= 15)), e && (e < 8 || e > 15) ? N : (i.window !== null && i.wbits !== e && (i.window = null), i.wrap = t, i.wbits = e, Ke(A));
}, Ze = (A, e) => {
  if (!A)
    return N;
  const t = new jB();
  A.state = t, t.strm = A, t.window = null, t.mode = zA;
  const i = me(A, e);
  return i !== eA && (A.state = null), i;
}, TB = (A) => Ze(A, ZB);
let ge = !0, et, it;
const zB = (A) => {
  if (ge) {
    et = new Int32Array(512), it = new Int32Array(32);
    let e = 0;
    for (; e < 144; )
      A.lens[e++] = 8;
    for (; e < 256; )
      A.lens[e++] = 9;
    for (; e < 280; )
      A.lens[e++] = 7;
    for (; e < 288; )
      A.lens[e++] = 8;
    for (hA(Ue, A.lens, 0, 288, et, 0, A.work, { bits: 9 }), e = 0; e < 32; )
      A.lens[e++] = 5;
    hA(Me, A.lens, 0, 32, it, 0, A.work, { bits: 5 }), ge = !1;
  }
  A.lencode = et, A.lenbits = 9, A.distcode = it, A.distbits = 5;
}, je = (A, e, t, i) => {
  let a;
  const B = A.state;
  return B.window === null && (B.wsize = 1 << B.wbits, B.wnext = 0, B.whave = 0, B.window = new Uint8Array(B.wsize)), i >= B.wsize ? (B.window.set(e.subarray(t - B.wsize, t), 0), B.wnext = 0, B.whave = B.wsize) : (a = B.wsize - B.wnext, a > i && (a = i), B.window.set(e.subarray(t - i, t - i + a), B.wnext), i -= a, i ? (B.window.set(e.subarray(t - i, t), 0), B.wnext = i, B.whave = B.wsize) : (B.wnext += a, B.wnext === B.wsize && (B.wnext = 0), B.whave < B.wsize && (B.whave += a))), 0;
}, JB = (A, e) => {
  let t, i, a, B, r, E, f, n, g, u, o, Q, w, Y, c = 0, h, b, s, l, I, y, C, k;
  const d = new Uint8Array(4);
  let _, D;
  const X = (
    /* permutation of code lengths */
    new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
  );
  if (iA(A) || !A.output || !A.input && A.avail_in !== 0)
    return N;
  t = A.state, t.mode === j && (t.mode = $A), r = A.next_out, a = A.output, f = A.avail_out, B = A.next_in, i = A.input, E = A.avail_in, n = t.hold, g = t.bits, u = E, o = f, k = eA;
  A:
    for (; ; )
      switch (t.mode) {
        case zA:
          if (t.wrap === 0) {
            t.mode = $A;
            break;
          }
          for (; g < 16; ) {
            if (E === 0)
              break A;
            E--, n += i[B++] << g, g += 8;
          }
          if (t.wrap & 2 && n === 35615) {
            t.wbits === 0 && (t.wbits = 15), t.check = 0, d[0] = n & 255, d[1] = n >>> 8 & 255, t.check = p(t.check, d, 2, 0), n = 0, g = 0, t.mode = Kt;
            break;
          }
          if (t.head && (t.head.done = !1), !(t.wrap & 1) || /* check if zlib header allowed */
          (((n & 255) << 8) + (n >> 8)) % 31) {
            A.msg = "incorrect header check", t.mode = L;
            break;
          }
          if ((n & 15) !== vt) {
            A.msg = "unknown compression method", t.mode = L;
            break;
          }
          if (n >>>= 4, g -= 4, C = (n & 15) + 8, t.wbits === 0 && (t.wbits = C), C > 15 || C > t.wbits) {
            A.msg = "invalid window size", t.mode = L;
            break;
          }
          t.dmax = 1 << t.wbits, t.flags = 0, A.adler = t.check = 1, t.mode = n & 512 ? Vt : j, n = 0, g = 0;
          break;
        case Kt:
          for (; g < 16; ) {
            if (E === 0)
              break A;
            E--, n += i[B++] << g, g += 8;
          }
          if (t.flags = n, (t.flags & 255) !== vt) {
            A.msg = "unknown compression method", t.mode = L;
            break;
          }
          if (t.flags & 57344) {
            A.msg = "unknown header flags set", t.mode = L;
            break;
          }
          t.head && (t.head.text = n >> 8 & 1), t.flags & 512 && t.wrap & 4 && (d[0] = n & 255, d[1] = n >>> 8 & 255, t.check = p(t.check, d, 2, 0)), n = 0, g = 0, t.mode = mt;
        case mt:
          for (; g < 32; ) {
            if (E === 0)
              break A;
            E--, n += i[B++] << g, g += 8;
          }
          t.head && (t.head.time = n), t.flags & 512 && t.wrap & 4 && (d[0] = n & 255, d[1] = n >>> 8 & 255, d[2] = n >>> 16 & 255, d[3] = n >>> 24 & 255, t.check = p(t.check, d, 4, 0)), n = 0, g = 0, t.mode = Zt;
        case Zt:
          for (; g < 16; ) {
            if (E === 0)
              break A;
            E--, n += i[B++] << g, g += 8;
          }
          t.head && (t.head.xflags = n & 255, t.head.os = n >> 8), t.flags & 512 && t.wrap & 4 && (d[0] = n & 255, d[1] = n >>> 8 & 255, t.check = p(t.check, d, 2, 0)), n = 0, g = 0, t.mode = jt;
        case jt:
          if (t.flags & 1024) {
            for (; g < 16; ) {
              if (E === 0)
                break A;
              E--, n += i[B++] << g, g += 8;
            }
            t.length = n, t.head && (t.head.extra_len = n), t.flags & 512 && t.wrap & 4 && (d[0] = n & 255, d[1] = n >>> 8 & 255, t.check = p(t.check, d, 2, 0)), n = 0, g = 0;
          } else
            t.head && (t.head.extra = null);
          t.mode = Tt;
        case Tt:
          if (t.flags & 1024 && (Q = t.length, Q > E && (Q = E), Q && (t.head && (C = t.head.extra_len - t.length, t.head.extra || (t.head.extra = new Uint8Array(t.head.extra_len)), t.head.extra.set(
            i.subarray(
              B,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              B + Q
            ),
            /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
            C
          )), t.flags & 512 && t.wrap & 4 && (t.check = p(t.check, i, Q, B)), E -= Q, B += Q, t.length -= Q), t.length))
            break A;
          t.length = 0, t.mode = zt;
        case zt:
          if (t.flags & 2048) {
            if (E === 0)
              break A;
            Q = 0;
            do
              C = i[B + Q++], t.head && C && t.length < 65536 && (t.head.name += String.fromCharCode(C));
            while (C && Q < E);
            if (t.flags & 512 && t.wrap & 4 && (t.check = p(t.check, i, Q, B)), E -= Q, B += Q, C)
              break A;
          } else
            t.head && (t.head.name = null);
          t.length = 0, t.mode = Jt;
        case Jt:
          if (t.flags & 4096) {
            if (E === 0)
              break A;
            Q = 0;
            do
              C = i[B + Q++], t.head && C && t.length < 65536 && (t.head.comment += String.fromCharCode(C));
            while (C && Q < E);
            if (t.flags & 512 && t.wrap & 4 && (t.check = p(t.check, i, Q, B)), E -= Q, B += Q, C)
              break A;
          } else
            t.head && (t.head.comment = null);
          t.mode = Ot;
        case Ot:
          if (t.flags & 512) {
            for (; g < 16; ) {
              if (E === 0)
                break A;
              E--, n += i[B++] << g, g += 8;
            }
            if (t.wrap & 4 && n !== (t.check & 65535)) {
              A.msg = "header crc mismatch", t.mode = L;
              break;
            }
            n = 0, g = 0;
          }
          t.head && (t.head.hcrc = t.flags >> 9 & 1, t.head.done = !0), A.adler = t.check = 0, t.mode = j;
          break;
        case Vt:
          for (; g < 32; ) {
            if (E === 0)
              break A;
            E--, n += i[B++] << g, g += 8;
          }
          A.adler = t.check = Ee(n), n = 0, g = 0, t.mode = ZA;
        case ZA:
          if (t.havedict === 0)
            return A.next_out = r, A.avail_out = f, A.next_in = B, A.avail_in = E, t.hold = n, t.bits = g, SB;
          A.adler = t.check = 1, t.mode = j;
        case j:
          if (e === FB || e === FA)
            break A;
        case $A:
          if (t.last) {
            n >>>= g & 7, g -= g & 7, t.mode = tt;
            break;
          }
          for (; g < 3; ) {
            if (E === 0)
              break A;
            E--, n += i[B++] << g, g += 8;
          }
          switch (t.last = n & 1, n >>>= 1, g -= 1, n & 3) {
            case 0:
              t.mode = Wt;
              break;
            case 1:
              if (zB(t), t.mode = HA, e === FA) {
                n >>>= 2, g -= 2;
                break A;
              }
              break;
            case 2:
              t.mode = Xt;
              break;
            case 3:
              A.msg = "invalid block type", t.mode = L;
          }
          n >>>= 2, g -= 2;
          break;
        case Wt:
          for (n >>>= g & 7, g -= g & 7; g < 32; ) {
            if (E === 0)
              break A;
            E--, n += i[B++] << g, g += 8;
          }
          if ((n & 65535) !== (n >>> 16 ^ 65535)) {
            A.msg = "invalid stored block lengths", t.mode = L;
            break;
          }
          if (t.length = n & 65535, n = 0, g = 0, t.mode = At, e === FA)
            break A;
        case At:
          t.mode = Pt;
        case Pt:
          if (Q = t.length, Q) {
            if (Q > E && (Q = E), Q > f && (Q = f), Q === 0)
              break A;
            a.set(i.subarray(B, B + Q), r), E -= Q, B += Q, f -= Q, r += Q, t.length -= Q;
            break;
          }
          t.mode = j;
          break;
        case Xt:
          for (; g < 14; ) {
            if (E === 0)
              break A;
            E--, n += i[B++] << g, g += 8;
          }
          if (t.nlen = (n & 31) + 257, n >>>= 5, g -= 5, t.ndist = (n & 31) + 1, n >>>= 5, g -= 5, t.ncode = (n & 15) + 4, n >>>= 4, g -= 4, t.nlen > 286 || t.ndist > 30) {
            A.msg = "too many length or distance symbols", t.mode = L;
            break;
          }
          t.have = 0, t.mode = qt;
        case qt:
          for (; t.have < t.ncode; ) {
            for (; g < 3; ) {
              if (E === 0)
                break A;
              E--, n += i[B++] << g, g += 8;
            }
            t.lens[X[t.have++]] = n & 7, n >>>= 3, g -= 3;
          }
          for (; t.have < 19; )
            t.lens[X[t.have++]] = 0;
          if (t.lencode = t.lendyn, t.lenbits = 7, _ = { bits: t.lenbits }, k = hA(MB, t.lens, 0, 19, t.lencode, 0, t.work, _), t.lenbits = _.bits, k) {
            A.msg = "invalid code lengths set", t.mode = L;
            break;
          }
          t.have = 0, t.mode = $t;
        case $t:
          for (; t.have < t.nlen + t.ndist; ) {
            for (; c = t.lencode[n & (1 << t.lenbits) - 1], h = c >>> 24, b = c >>> 16 & 255, s = c & 65535, !(h <= g); ) {
              if (E === 0)
                break A;
              E--, n += i[B++] << g, g += 8;
            }
            if (s < 16)
              n >>>= h, g -= h, t.lens[t.have++] = s;
            else {
              if (s === 16) {
                for (D = h + 2; g < D; ) {
                  if (E === 0)
                    break A;
                  E--, n += i[B++] << g, g += 8;
                }
                if (n >>>= h, g -= h, t.have === 0) {
                  A.msg = "invalid bit length repeat", t.mode = L;
                  break;
                }
                C = t.lens[t.have - 1], Q = 3 + (n & 3), n >>>= 2, g -= 2;
              } else if (s === 17) {
                for (D = h + 3; g < D; ) {
                  if (E === 0)
                    break A;
                  E--, n += i[B++] << g, g += 8;
                }
                n >>>= h, g -= h, C = 0, Q = 3 + (n & 7), n >>>= 3, g -= 3;
              } else {
                for (D = h + 7; g < D; ) {
                  if (E === 0)
                    break A;
                  E--, n += i[B++] << g, g += 8;
                }
                n >>>= h, g -= h, C = 0, Q = 11 + (n & 127), n >>>= 7, g -= 7;
              }
              if (t.have + Q > t.nlen + t.ndist) {
                A.msg = "invalid bit length repeat", t.mode = L;
                break;
              }
              for (; Q--; )
                t.lens[t.have++] = C;
            }
          }
          if (t.mode === L)
            break;
          if (t.lens[256] === 0) {
            A.msg = "invalid code -- missing end-of-block", t.mode = L;
            break;
          }
          if (t.lenbits = 9, _ = { bits: t.lenbits }, k = hA(Ue, t.lens, 0, t.nlen, t.lencode, 0, t.work, _), t.lenbits = _.bits, k) {
            A.msg = "invalid literal/lengths set", t.mode = L;
            break;
          }
          if (t.distbits = 6, t.distcode = t.distdyn, _ = { bits: t.distbits }, k = hA(Me, t.lens, t.nlen, t.ndist, t.distcode, 0, t.work, _), t.distbits = _.bits, k) {
            A.msg = "invalid distances set", t.mode = L;
            break;
          }
          if (t.mode = HA, e === FA)
            break A;
        case HA:
          t.mode = SA;
        case SA:
          if (E >= 6 && f >= 258) {
            A.next_out = r, A.avail_out = f, A.next_in = B, A.avail_in = E, t.hold = n, t.bits = g, xB(A, o), r = A.next_out, a = A.output, f = A.avail_out, B = A.next_in, i = A.input, E = A.avail_in, n = t.hold, g = t.bits, t.mode === j && (t.back = -1);
            break;
          }
          for (t.back = 0; c = t.lencode[n & (1 << t.lenbits) - 1], h = c >>> 24, b = c >>> 16 & 255, s = c & 65535, !(h <= g); ) {
            if (E === 0)
              break A;
            E--, n += i[B++] << g, g += 8;
          }
          if (b && !(b & 240)) {
            for (l = h, I = b, y = s; c = t.lencode[y + ((n & (1 << l + I) - 1) >> l)], h = c >>> 24, b = c >>> 16 & 255, s = c & 65535, !(l + h <= g); ) {
              if (E === 0)
                break A;
              E--, n += i[B++] << g, g += 8;
            }
            n >>>= l, g -= l, t.back += l;
          }
          if (n >>>= h, g -= h, t.back += h, t.length = s, b === 0) {
            t.mode = Be;
            break;
          }
          if (b & 32) {
            t.back = -1, t.mode = j;
            break;
          }
          if (b & 64) {
            A.msg = "invalid literal/length code", t.mode = L;
            break;
          }
          t.extra = b & 15, t.mode = Ae;
        case Ae:
          if (t.extra) {
            for (D = t.extra; g < D; ) {
              if (E === 0)
                break A;
              E--, n += i[B++] << g, g += 8;
            }
            t.length += n & (1 << t.extra) - 1, n >>>= t.extra, g -= t.extra, t.back += t.extra;
          }
          t.was = t.length, t.mode = te;
        case te:
          for (; c = t.distcode[n & (1 << t.distbits) - 1], h = c >>> 24, b = c >>> 16 & 255, s = c & 65535, !(h <= g); ) {
            if (E === 0)
              break A;
            E--, n += i[B++] << g, g += 8;
          }
          if (!(b & 240)) {
            for (l = h, I = b, y = s; c = t.distcode[y + ((n & (1 << l + I) - 1) >> l)], h = c >>> 24, b = c >>> 16 & 255, s = c & 65535, !(l + h <= g); ) {
              if (E === 0)
                break A;
              E--, n += i[B++] << g, g += 8;
            }
            n >>>= l, g -= l, t.back += l;
          }
          if (n >>>= h, g -= h, t.back += h, b & 64) {
            A.msg = "invalid distance code", t.mode = L;
            break;
          }
          t.offset = s, t.extra = b & 15, t.mode = ee;
        case ee:
          if (t.extra) {
            for (D = t.extra; g < D; ) {
              if (E === 0)
                break A;
              E--, n += i[B++] << g, g += 8;
            }
            t.offset += n & (1 << t.extra) - 1, n >>>= t.extra, g -= t.extra, t.back += t.extra;
          }
          if (t.offset > t.dmax) {
            A.msg = "invalid distance too far back", t.mode = L;
            break;
          }
          t.mode = ie;
        case ie:
          if (f === 0)
            break A;
          if (Q = o - f, t.offset > Q) {
            if (Q = t.offset - Q, Q > t.whave && t.sane) {
              A.msg = "invalid distance too far back", t.mode = L;
              break;
            }
            Q > t.wnext ? (Q -= t.wnext, w = t.wsize - Q) : w = t.wnext - Q, Q > t.length && (Q = t.length), Y = t.window;
          } else
            Y = a, w = r - t.offset, Q = t.length;
          Q > f && (Q = f), f -= Q, t.length -= Q;
          do
            a[r++] = Y[w++];
          while (--Q);
          t.length === 0 && (t.mode = SA);
          break;
        case Be:
          if (f === 0)
            break A;
          a[r++] = t.length, f--, t.mode = SA;
          break;
        case tt:
          if (t.wrap) {
            for (; g < 32; ) {
              if (E === 0)
                break A;
              E--, n |= i[B++] << g, g += 8;
            }
            if (o -= f, A.total_out += o, t.total += o, t.wrap & 4 && o && (A.adler = t.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
            t.flags ? p(t.check, a, o, r - o) : yA(t.check, a, o, r - o)), o = f, t.wrap & 4 && (t.flags ? n : Ee(n)) !== t.check) {
              A.msg = "incorrect data check", t.mode = L;
              break;
            }
            n = 0, g = 0;
          }
          t.mode = ae;
        case ae:
          if (t.wrap && t.flags) {
            for (; g < 32; ) {
              if (E === 0)
                break A;
              E--, n += i[B++] << g, g += 8;
            }
            if (t.wrap & 4 && n !== (t.total & 4294967295)) {
              A.msg = "incorrect length check", t.mode = L;
              break;
            }
            n = 0, g = 0;
          }
          t.mode = ne;
        case ne:
          k = HB;
          break A;
        case L:
          k = Fe;
          break A;
        case Se:
          return He;
        case Ne:
        default:
          return N;
      }
  return A.next_out = r, A.avail_out = f, A.next_in = B, A.avail_in = E, t.hold = n, t.bits = g, (t.wsize || o !== A.avail_out && t.mode < L && (t.mode < tt || e !== Nt)) && je(A, A.output, A.next_out, o - A.avail_out), u -= A.avail_in, o -= A.avail_out, A.total_in += u, A.total_out += o, t.total += o, t.wrap & 4 && o && (A.adler = t.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
  t.flags ? p(t.check, a, o, A.next_out - o) : yA(t.check, a, o, A.next_out - o)), A.data_type = t.bits + (t.last ? 64 : 0) + (t.mode === j ? 128 : 0) + (t.mode === HA || t.mode === At ? 256 : 0), (u === 0 && o === 0 || e === Nt) && k === eA && (k = NB), k;
}, OB = (A) => {
  if (iA(A))
    return N;
  let e = A.state;
  return e.window && (e.window = null), A.state = null, eA;
}, VB = (A, e) => {
  if (iA(A))
    return N;
  const t = A.state;
  return t.wrap & 2 ? (t.head = e, e.done = !1, eA) : N;
}, WB = (A, e) => {
  const t = e.length;
  let i, a, B;
  return iA(A) || (i = A.state, i.wrap !== 0 && i.mode !== ZA) ? N : i.mode === ZA && (a = 1, a = yA(a, e, t, 0), a !== i.check) ? Fe : (B = je(A, e, t, t), B ? (i.mode = Se, He) : (i.havedict = 1, eA));
};
var PB = Ke, XB = me, qB = ve, $B = TB, Aa = Ze, ta = JB, ea = OB, ia = VB, Ba = WB, aa = "pako inflate (from Nodeca project)", z = {
  inflateReset: PB,
  inflateReset2: XB,
  inflateResetKeep: qB,
  inflateInit: $B,
  inflateInit2: Aa,
  inflate: ta,
  inflateEnd: ea,
  inflateGetHeader: ia,
  inflateSetDictionary: Ba,
  inflateInfo: aa
};
function na() {
  this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
}
var Ea = na;
const Te = Object.prototype.toString, {
  Z_NO_FLUSH: ga,
  Z_FINISH: ra,
  Z_OK: GA,
  Z_STREAM_END: Bt,
  Z_NEED_DICT: at,
  Z_STREAM_ERROR: Qa,
  Z_DATA_ERROR: re,
  Z_MEM_ERROR: la
} = xA;
function LA(A) {
  this.options = TA.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ""
  }, A || {});
  const e = this.options;
  e.raw && e.windowBits >= 0 && e.windowBits < 16 && (e.windowBits = -e.windowBits, e.windowBits === 0 && (e.windowBits = -15)), e.windowBits >= 0 && e.windowBits < 16 && !(A && A.windowBits) && (e.windowBits += 32), e.windowBits > 15 && e.windowBits < 48 && (e.windowBits & 15 || (e.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new pe(), this.strm.avail_out = 0;
  let t = z.inflateInit2(
    this.strm,
    e.windowBits
  );
  if (t !== GA)
    throw new Error(EA[t]);
  if (this.header = new Ea(), z.inflateGetHeader(this.strm, this.header), e.dictionary && (typeof e.dictionary == "string" ? e.dictionary = DA.string2buf(e.dictionary) : Te.call(e.dictionary) === "[object ArrayBuffer]" && (e.dictionary = new Uint8Array(e.dictionary)), e.raw && (t = z.inflateSetDictionary(this.strm, e.dictionary), t !== GA)))
    throw new Error(EA[t]);
}
LA.prototype.push = function(A, e) {
  const t = this.strm, i = this.options.chunkSize, a = this.options.dictionary;
  let B, r, E;
  if (this.ended)
    return !1;
  for (e === ~~e ? r = e : r = e === !0 ? ra : ga, Te.call(A) === "[object ArrayBuffer]" ? t.input = new Uint8Array(A) : t.input = A, t.next_in = 0, t.avail_in = t.input.length; ; ) {
    for (t.avail_out === 0 && (t.output = new Uint8Array(i), t.next_out = 0, t.avail_out = i), B = z.inflate(t, r), B === at && a && (B = z.inflateSetDictionary(t, a), B === GA ? B = z.inflate(t, r) : B === re && (B = at)); t.avail_in > 0 && B === Bt && t.state.wrap > 0 && A[t.next_in] !== 0; )
      z.inflateReset(t), B = z.inflate(t, r);
    switch (B) {
      case Qa:
      case re:
      case at:
      case la:
        return this.onEnd(B), this.ended = !0, !1;
    }
    if (E = t.avail_out, t.next_out && (t.avail_out === 0 || B === Bt))
      if (this.options.to === "string") {
        let f = DA.utf8border(t.output, t.next_out), n = t.next_out - f, g = DA.buf2string(t.output, f);
        t.next_out = n, t.avail_out = i - n, n && t.output.set(t.output.subarray(f, f + n), 0), this.onData(g);
      } else
        this.onData(t.output.length === t.next_out ? t.output : t.output.subarray(0, t.next_out));
    if (!(B === GA && E === 0)) {
      if (B === Bt)
        return B = z.inflateEnd(this.strm), this.onEnd(B), this.ended = !0, !0;
      if (t.avail_in === 0)
        break;
    }
  }
  return !0;
};
LA.prototype.onData = function(A) {
  this.chunks.push(A);
};
LA.prototype.onEnd = function(A) {
  A === GA && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = TA.flattenChunks(this.chunks)), this.chunks = [], this.err = A, this.msg = this.strm.msg;
};
function ut(A, e) {
  const t = new LA(e);
  if (t.push(A), t.err)
    throw t.msg || EA[t.err];
  return t.result;
}
function sa(A, e) {
  return e = e || {}, e.raw = !0, ut(A, e);
}
var oa = LA, fa = ut, Ca = sa, Ia = ut, wa = xA, ha = {
  Inflate: oa,
  inflate: fa,
  inflateRaw: Ca,
  ungzip: Ia,
  constants: wa
};
const { Inflate: ua, inflate: ya, inflateRaw: _a, ungzip: ba } = ha;
var ca = _a;
const nt = new TextDecoder();
function da(A, e) {
  return A.split("").map((t) => String.fromCharCode(t.charCodeAt(0) + e)).join("");
}
let vA;
async function Da() {
  vA ?? (vA = await ze(
    await WebAssembly.compileStreaming(fetch(Je)),
    {
      env: {},
      w: {
        location,
        b52: (A) => atob(A),
        ift: (A) => ca(A, { to: "string" })
      }
    }
  ));
}
async function Ga(A, e = !0, t = !1, i = !1, a = !1, B = null) {
  const E = vA.b62u(da(location.hostname, 10), 10, B), f = await crypto.subtle.digest(
    // /* line 598 */,
    nt.decode(E[0]),
    E[1]
  ), n = vA.transformBuff(A, e, t, i, a), g = {
    name: nt.decode(n[2]),
    // line 603
    iv: n[0]
  }, u = await crypto.subtle.importKey("raw", f, g, !1, [
    nt.decode(n[3])
  ]), o = await crypto.subtle.decrypt(g, u, n[1]);
  return vA.dezip(o);
}
export {
  Ga as decryptM3u8,
  Da as init
};
