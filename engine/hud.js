/* Toolkit for the QIR Orientation Peitho deck (Apple editorial edition).
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
      var mk = S("marker", { id: "hud-arrow", viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "5.5", markerHeight: "5.5", orient: "auto-start-reverse" }, d);
      S("path", { d: "M 0 1.8 L 8.2 5 L 0 8.2 z", style: "fill:var(--axis)" }, mk);
      var mkA = S("marker", { id: "hud-arrow-acc", viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "5.5", markerHeight: "5.5", orient: "auto-start-reverse" }, d);
      S("path", { d: "M 0 1.8 L 8.2 5 L 0 8.2 z", style: "fill:var(--accent-text)" }, mkA);
      var mkB = S("marker", { id: "hud-arrow-bad", viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "5.5", markerHeight: "5.5", orient: "auto-start-reverse" }, d);
      S("path", { d: "M 0 1.8 L 8.2 5 L 0 8.2 z", style: "fill:var(--bad-text)" }, mkB);
      var mkG = S("marker", { id: "hud-arrow-good", viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "5.5", markerHeight: "5.5", orient: "auto-start-reverse" }, d);
      S("path", { d: "M 0 1.8 L 8.2 5 L 0 8.2 z", style: "fill:var(--good-text)" }, mkG);
      var hatch = S("pattern", { id: "hud-hatch", width: 6, height: 6, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, d);
      S("line", { x1: 0, y1: 0, x2: 0, y2: 6, style: "stroke:var(--muted);stroke-width:1.1;opacity:.45" }, hatch);
    }
    return d;
  }
  function pulse(parent, x, y, r, color) {
    var g = S("g", { transform: "translate(" + x + "," + y + ")", style: "color:" + (color || "var(--accent-text)") }, parent);
    var ring = S("circle", { r: r, style: "fill:none;stroke:currentColor;stroke-width:1.4;opacity:.65" }, g);
    S("circle", { r: Math.max(2.4, r * 0.22), style: "fill:currentColor" }, g);
    var lp = { stop: function () {} };
    if (!isStatic()) {
      var t = 0;
      lp = loop(g, function (dt) { t = (t + dt / 2400) % 1; ring.setAttribute("r", r * (0.55 + 0.7 * t)); ring.style.opacity = 0.65 * (1 - t); });
    }
    return { g: g, stop: function () { lp.stop(); } };
  }

  /* ---------- slide decorations ---------- */
  var UNIT_TEXT = "ภาควิชาเวชศาสตร์ชุมชน คณะแพทยศาสตร์โรงพยาบาลรามาธิบดี มหาวิทยาลัยมหิดล";
  HOOKS.afterRender.push(function (slides) {
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
