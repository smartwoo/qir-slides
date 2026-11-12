/* Toolkit for the QIR Orientation Peitho deck (classic script, works offline and on GitHub Pages).
 * Load order: data.js, hud.js, figures.js, slides.js, notes.js, deck.js.
 */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  window.PEITHO = window.PEITHO || {};
  var HOOKS = window.PEITHO.hooks = window.PEITHO.hooks || { afterRender: [], onShow: [] };

  function S(tag, a, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in a) { if (a[k] == null) continue; if (k === "text") e.textContent = a[k]; else e.setAttribute(k, a[k]); }
    if (parent) parent.appendChild(e);
    return e;
  }
  function H(tag, cls, html, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }
  function isStatic() {
    if (window.PEITHO.isStatic) return window.PEITHO.isStatic();
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  var ease = {
    out: function (t) { return 1 - Math.pow(1 - t, 3); },
    inOut: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    lin: function (t) { return t; },
    back: function (t) { var c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  };
  function tween(ms, fn, opt) {
    opt = opt || {};
    if (isStatic() || ms <= 0) { fn(1); if (opt.done) opt.done(); return { stop: function () {} }; }
    var t0 = null, raf = 0, e = opt.ease || ease.out, delay = opt.delay || 0, alive = true;
    function f(ts) {
      if (!alive) return;
      if (t0 === null) t0 = ts + delay;
      var t = Math.min(1, Math.max(0, (ts - t0) / ms));
      fn(e(t));
      if (t < 1) raf = requestAnimationFrame(f); else if (opt.done) opt.done();
    }
    if (delay) fn(0);
    raf = requestAnimationFrame(f);
    return { stop: function () { alive = false; cancelAnimationFrame(raf); } };
  }
  function fmt(v, d) {
    d = d || 0;
    var s = Math.abs(v).toFixed(d), parts = s.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (v < 0 && +s !== 0 ? "-" : "") + parts.join(".");
  }
  function count(el, to, opt) {
    opt = opt || {};
    var target = typeof to === "string" ? +to.replace(/,/g, "") : to;
    var d = opt.d != null ? opt.d : (typeof to === "string" && to.indexOf(".") > -1 ? to.split(".")[1].length : 0);
    var from = opt.from || 0;
    var finalText = (opt.pre || "") + (typeof to === "string" ? to : fmt(target, d)) + (opt.post || "");
    return tween(opt.ms != null ? opt.ms : 1100, function (t) {
      el.textContent = t >= 1 ? finalText : (opt.pre || "") + fmt(from + (target - from) * t, d) + (opt.post || "");
    }, { ease: opt.ease || ease.out, delay: opt.delay });
  }
  function jobs() {
    var list = [];
    return { add: function (j) { list.push(j); return j; }, stop: function () { list.forEach(function (j) { if (j && j.stop) j.stop(); }); list = []; } };
  }
  var lastShown = -1;
  HOOKS.onShow.push(function (i) { lastShown = i; });
  function stepper(host, n, draw) {
    var cur = 0, job = jobs();
    return {
      steps: n,
      setStep: function (k) {
        var slide = host.closest && host.closest(".slide");
        if (!isStatic() && slide && !slide.classList.contains("is-active")) return;
        var idx = slide && slide.id ? +slide.id.replace("slide-", "") - 1 : -1;
        var arriving = idx !== lastShown, backward = arriving && lastShown > idx;
        job.stop();
        var animate = !isStatic() && (arriving ? k === 1 && !backward : k > cur);
        var from = animate && !arriving ? Math.max(1, cur) : 1;
        for (var i = from; i < k; i++) draw(i, false, job);
        draw(k, animate, job);
        cur = k;
      }
    };
  }
  function loop(host, fn) {
    var raf = 0, last = 0, alive = true;
    function f(ts) {
      if (!alive) return;
      var slide = host.closest && host.closest(".slide");
      if (slide && !slide.classList.contains("is-active")) { last = 0; raf = requestAnimationFrame(f); return; }
      var dt = last ? Math.min(48, ts - last) : 16; last = ts;
      fn(dt, ts);
      raf = requestAnimationFrame(f);
    }
    if (!isStatic()) raf = requestAnimationFrame(f);
    return { stop: function () { alive = false; cancelAnimationFrame(raf); } };
  }
  function svgHost(host, vb, label, align) {
    var wrap = H("div", "fig__svg", null, host);
    var svg = S("svg", { viewBox: vb, role: "img", "aria-label": label || "", preserveAspectRatio: align || "xMidYMid meet" });
    wrap.appendChild(svg);
    return svg;
  }
  function sideHost(host, vb, label, align) {
    var slide = host.closest && host.closest(".slide"), col = slide && slide.querySelector(".slide__text");
    var box = H("div", "fig fig-side", null, col || host);
    return svgHost(box, vb, label, align || "xMinYMin meet");
  }
  function defs(svg) {
    var d = svg.querySelector("defs") || S("defs", {}, svg);
    if (!d.querySelector("#hud-arrow")) {
      var mk = S("marker", { id: "hud-arrow", viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse" }, d);
      S("path", { d: "M 0 1.5 L 8.5 5 L 0 8.5 z", style: "fill:var(--axis)" }, mk);
      var mkA = S("marker", { id: "hud-arrow-acc", viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse" }, d);
      S("path", { d: "M 0 1.5 L 8.5 5 L 0 8.5 z", style: "fill:var(--accent-text)" }, mkA);
      var mkB = S("marker", { id: "hud-arrow-bad", viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse" }, d);
      S("path", { d: "M 0 1.5 L 8.5 5 L 0 8.5 z", style: "fill:var(--bad-text)" }, mkB);
      var mkG = S("marker", { id: "hud-arrow-good", viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse" }, d);
      S("path", { d: "M 0 1.5 L 8.5 5 L 0 8.5 z", style: "fill:var(--good-text)" }, mkG);
      var hatch = S("pattern", { id: "hud-hatch", width: 6, height: 6, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, d);
      S("line", { x1: 0, y1: 0, x2: 0, y2: 6, style: "stroke:var(--muted);stroke-width:1.2;opacity:.55" }, hatch);
    }
    return d;
  }
  function pulse(parent, x, y, r, color) {
    var g = S("g", { transform: "translate(" + x + "," + y + ")", style: "color:" + (color || "var(--accent-text)") }, parent);
    var ring = S("circle", { r: r, style: "fill:none;stroke:currentColor;stroke-width:1.8;opacity:.85" }, g);
    S("circle", { r: Math.max(2.4, r * 0.16), style: "fill:currentColor" }, g);
    var lp = { stop: function () {} };
    if (!isStatic()) {
      var t = 0;
      lp = loop(g, function (dt) { t = (t + dt / 1800) % 1; ring.setAttribute("r", r * (0.55 + 0.75 * t)); ring.style.opacity = 0.85 * (1 - t); });
    }
    return { g: g, stop: function () { lp.stop(); } };
  }

  /* ---------- deterministic night sky ---------- */
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function edgeWeight(x, y, W, H) {
    var dx = (x / W - 0.5) / 0.46, dy = (y / H - 0.5) / 0.42, d = Math.sqrt(dx * dx + dy * dy);
    return Math.max(0, Math.min(1, (d - 0.55) / 0.5));
  }
  var WARM = ["255,214,170", "255,190,140", "255,170,190"], COOL = ["236,240,255", "214,224,255", "255,255,255"];
  function makeSky(W, H, seed) {
    var rnd = rng(seed || 20261019), stars = [], glows = [], n = Math.round(W * H / 5800);
    for (var i = 0; i < n; i++) {
      var x = rnd() * W, y = rnd() * H, e = edgeWeight(x, y, W, H), r = rnd();
      var s = r < 0.74 ? 0.45 + rnd() * 0.45 : r < 0.96 ? 0.85 + rnd() * 0.55 : 1.3 + rnd() * 0.65;
      if (s > 1.25 && e < 0.6) s = 0.9;
      var warm = rnd() < 0.16;
      stars.push({ x: x, y: y, s: s, a: (0.26 + rnd() * 0.48) * (0.4 + 0.6 * e), ph: rnd() * 6.283, sp: 0.35 + rnd() * 1.15,
        c: (warm ? WARM : COOL)[Math.floor(rnd() * 3)], vx: (rnd() - 0.5) * 2.0, vy: (rnd() - 0.5) * 1.0 });
    }
    for (var k = 0; k < 40 && glows.length < 6; k++) {
      var gx = rnd() * W, gy = rnd() * H;
      if (edgeWeight(gx, gy, W, H) < 0.75) continue;
      glows.push({ x: gx, y: gy, r: 4 + rnd() * 8, a: 0.20 + rnd() * 0.24, ph: rnd() * 6.283, sp: 0.18 + rnd() * 0.3, c: WARM[Math.floor(rnd() * 2)], vx: (rnd() - 0.5) * 2.6, vy: (rnd() - 0.5) * 1.3 });
    }
    return { stars: stars, glows: glows };
  }
  function starfield() {
    if (document.querySelector(".starfield") || !document.body) return;
    var cv = document.createElement("canvas");
    cv.className = "starfield"; cv.setAttribute("aria-hidden", "true");
    document.body.insertBefore(cv, document.body.firstChild);
    var ctx = cv.getContext("2d"), W = 0, H = 0, dpr = 1, sky = null, last = 0, t = 0;
    function size() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      sky = makeSky(W, H, 20261019);
    }
    function light() { return document.documentElement.getAttribute("data-theme") === "light"; }
    function draw(dt) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var sec = dt / 1000;
      sky.glows.forEach(function (g) {
        g.x = (g.x + g.vx * sec + W) % W; g.y = (g.y + g.vy * sec + H) % H;
        var a = g.a * (0.7 + 0.3 * Math.sin(t * g.sp + g.ph)), R = g.r * 3.2;
        var grd = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, R);
        grd.addColorStop(0, "rgba(" + g.c + "," + a + ")"); grd.addColorStop(0.25, "rgba(" + g.c + "," + (a * 0.55) + ")"); grd.addColorStop(1, "rgba(" + g.c + ",0)");
        ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(g.x, g.y, R, 0, 6.2832); ctx.fill();
      });
      sky.stars.forEach(function (s) {
        s.x = (s.x + s.vx * sec + W) % W; s.y = (s.y + s.vy * sec + H) % H;
        var a = s.a * (0.55 + 0.45 * Math.sin(t * s.sp + s.ph));
        ctx.fillStyle = "rgba(" + s.c + "," + a.toFixed(3) + ")";
        if (s.s < 0.9) ctx.fillRect(s.x, s.y, s.s * 1.4, s.s * 1.4);
        else { ctx.beginPath(); ctx.arc(s.x, s.y, s.s, 0, 6.2832); ctx.fill(); }
      });
    }
    function frame(ts) {
      requestAnimationFrame(frame);
      if (document.hidden || light()) { last = ts; return; }
      var dt = last ? Math.min(64, ts - last) : 16; last = ts; t += dt / 1000;
      if (isStatic()) { if (!frame.still) { draw(0); frame.still = true; } return; }
      frame.still = false;
      draw(dt);
    }
    var rs = 0;
    window.addEventListener("resize", function () { clearTimeout(rs); rs = setTimeout(function () { size(); frame.still = false; }, 150); });
    size(); draw(0);
    requestAnimationFrame(frame);
  }
  function printStars() {
    var W = 1920, H = 1080, sky = makeSky(W, H, 20261019), out = [];
    sky.glows.forEach(function (g) {
      out.push('<circle cx="' + g.x.toFixed(1) + '" cy="' + g.y.toFixed(1) + '" r="' + (g.r * 2.2).toFixed(1) + '" fill="rgb(' + g.c + ')" fill-opacity="' + (g.a * 0.35).toFixed(2) + '"/>');
      out.push('<circle cx="' + g.x.toFixed(1) + '" cy="' + g.y.toFixed(1) + '" r="' + (g.r * 0.5).toFixed(1) + '" fill="rgb(' + g.c + ')" fill-opacity="' + Math.min(0.9, g.a * 2).toFixed(2) + '"/>');
    });
    sky.stars.forEach(function (s, i) {
      if (i % 2) return;
      out.push('<circle cx="' + s.x.toFixed(1) + '" cy="' + s.y.toFixed(1) + '" r="' + (s.s * 0.85).toFixed(2) + '" fill="rgb(' + s.c + ')" fill-opacity="' + (s.a * 0.8).toFixed(2) + '"/>');
    });
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + " " + H + '">' + out.join("") + "</svg>";
    return 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")';
  }

  /* ---------- slide decorations ---------- */
  var UNIT_TEXT = "ภาควิชาเวชศาสตร์ชุมชน คณะแพทยศาสตร์โรงพยาบาลรามาธิบดี มหาวิทยาลัยมหิดล";
  HOOKS.afterRender.push(function (slides) {
    if (document.documentElement.classList.contains("print")) document.documentElement.style.setProperty("--print-stars", printStars());
    else starfield();
    Array.prototype.forEach.call(document.querySelectorAll(".slide"), function (el, i) {
      var meta = H("div", "hud-meta", "<span>" + String(i + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0") + " · COMMED QIR</span>");
      meta.setAttribute("aria-hidden", "true");
      el.insertBefore(meta, el.firstChild);
      var foot = el.querySelector(".slide__foot");
      if (!foot) { foot = H("div", "slide__foot", '<div class="slide__source"></div>', el); }
      var right = H("div", "foot-right");
      var kick = el.querySelector(".kicker"), badges = foot.querySelectorAll(".badge");
      if (badges.length) {
        var bs = H("span", "badges");
        Array.prototype.forEach.call(badges, function (b) { bs.appendChild(b); });
        if (kick) kick.appendChild(bs); else right.appendChild(bs);
      }
      H("span", "funder", '<span class="funder__crest" aria-hidden="true">CM</span><span>' + UNIT_TEXT + "</span>", right);
      foot.appendChild(right);
    });
  });

  window.HUD = { S: S, H: H, NS: NS, isStatic: isStatic, ease: ease, tween: tween, fmt: fmt, count: count, jobs: jobs, loop: loop, stepper: stepper,
    svgHost: svgHost, sideHost: sideHost, defs: defs, pulse: pulse };
})();
