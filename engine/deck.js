/* Peitho deck engine (adapted with docked bottom Speaker Note Show/Hide toggle).
 * Slides live in slides.js (window.DECK), vector figures in figures.js (window.FIGS),
 * and 1-to-1 concise speaker scripts in notes.js (window.DECK_NOTES).
 */
(function () {
  "use strict";
  var D = window.DECK, FIGS = window.FIGS || {};
  var NOTES = window.DECK_NOTES || {};
  D.slides.forEach(function (s) {
    var n = s.id && NOTES[s.id];
    if (n) {
      if (!s.notes) s.notes = n.notes || n;
      if (!s.bridge && n.bridge) s.bridge = n.bridge;
    }
  });

  (function () {
    var css = ".btn--primary{background:var(--accent-text,var(--accent));color:var(--inverse,#000);border-color:var(--accent-text,var(--accent))}" +
      ".popup-help{position:fixed;left:50%;bottom:74px;transform:translateX(-50%);z-index:70;display:flex;gap:10px;align-items:center;padding:10px 14px;border-radius:12px;background:var(--surface-3);border:1px solid var(--line-strong);box-shadow:0 8px 24px rgba(0,0,0,.35);color:var(--text-1)}" +
      "html.print .popup-help{display:none}";
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  })();

  var PRINT = /[?&]print\b/.test(location.search);
  if (PRINT) document.documentElement.classList.add("print");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem("peitho:" + D.meta.id + ":" + k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem("peitho:" + D.meta.id + ":" + k, v); } catch (e) { /* storage blocked */ } }
  };

  var S = D.slides;
  var plannedStart = [], total = 0;
  S.forEach(function (s) { plannedStart.push(total); total += s.seconds || 0; });

  var state = { i: 0, step: 1, mode: "present", started: null, notesWin: null, noteFs: 16.5 };
  var figs = [];
  var stepsOf = [];

  function strip(html) { var d = document.createElement("div"); d.innerHTML = (html || "").replace(/<br\s*\/?>/gi, " "); return d.textContent.replace(/\s+/g, " ").trim(); }
  function fmt(sec) { sec = Math.max(0, Math.round(sec)); var m = Math.floor(sec / 60), s = sec % 60; return m + ":" + (s < 10 ? "0" : "") + s; }
  function chapterName(s) { return (D.chapters && D.chapters[s.chapter]) || ""; }
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  var L = {
    step: "ขั้น", plan: "แผน", wait: "เริ่มจับเวลาเมื่อกดครั้งแรก", behind: "ช้ากว่าแผน", ahead: "เร็วกว่าแผน",
    slide: "สไลด์", of: "จาก", thisSlide: "สไลด์นี้", restart: "เริ่มจับเวลาใหม่", nextSlide: "สไลด์ถัดไป", lastSlide: "สไลด์สุดท้าย",
    next: "ส่งต่อสไลด์ถัดไป", planned: "ตามแผน", notes: "บทบรรยายผู้สอน", startsAt: "เริ่มนับเมื่อกดครั้งแรก",
    showNotes: "บทบรรยาย · แสดง", hideNotes: "บทบรรยาย · ซ่อน",
    popupBlocked: "เบราว์เซอร์บล็อกหน้าต่างผู้บรรยายจอที่สอง", openWin: "คลิกเพื่อเปิดหน้าต่างจอที่สอง", cancel: "ปิด"
  };

  var CLAIM = {
    concept: "กรอบแนวคิดหลัก",
    method: "เครื่องมือและวิธีวิทยา",
    case: "กรณีศึกษาโรงพยาบาลชุมชน",
    action: "การสังเคราะห์สู่ปฏิบัติการ"
  };

  /* ---------- tooltip shared with figures ---------- */
  var tipEl = null;
  window.PEITHO = window.PEITHO || {};
  var HOOKS = window.PEITHO.hooks = window.PEITHO.hooks || { afterRender: [], onShow: [] };
  window.PEITHO.isStatic = function () {
    return PRINT || state.mode === "read" || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  };
  window.PEITHO.tip = function (html, x, y) {
    if (!tipEl) { tipEl = document.createElement("div"); tipEl.className = "tooltip"; tipEl.setAttribute("role", "tooltip"); document.body.appendChild(tipEl); }
    if (!html) { tipEl.hidden = true; return; }
    tipEl.innerHTML = html; tipEl.hidden = false;
    var w = tipEl.offsetWidth, h = tipEl.offsetHeight;
    var left = Math.min(x + 14, window.innerWidth - w - 8), top = y - h - 12;
    if (top < 8) top = y + 16;
    tipEl.style.left = left + "px"; tipEl.style.top = top + "px";
  };

  /* ---------- render ---------- */
  function slideHTML(s, i) {
    var h = [];
    var kicker = s.kicker ? '<div class="kicker">' + (s.paper ? '<span class="dot" aria-hidden="true"></span>' : "") + s.kicker + "</div>" : "";
    var titleTag = i === 0 ? "h1" : "h2";
    var title = s.title ? "<" + titleTag + ' class="' + (s.display ? "display" : "title") + '">' + s.title + "</" + titleTag + ">" : "";
    h.push('<div class="slide__text">' + kicker + title + (s.lead ? '<p class="lead">' + s.lead + "</p>" : "") + (s.body ? '<div class="body">' + s.body + "</div>" : "") + (s.html || "") + "</div>");
    if (s.quote) h.push('<div class="slide__quote"' + (s.quote.step ? ' data-step="' + s.quote.step + '"' : "") + '><blockquote class="quote"><p>' + s.quote.text + "</p><cite>" + s.quote.cite + "</cite></blockquote></div>");
    if (s.colA) h.push('<div class="col-a"' + (s.colA.step ? ' data-step="' + s.colA.step + '"' : "") + '><div class="colhead">' + s.colA.head + "</div>" + s.colA.html + "</div>");
    if (s.colB) h.push('<div class="col-b"' + (s.colB.step ? ' data-step="' + s.colB.step + '"' : "") + '><div class="colhead">' + s.colB.head + "</div>" + s.colB.html + "</div>");
    if (s.fig || s.figHtml) h.push('<div class="slide__fig">' + (s.figHtml || '<div class="fig" data-fig="' + s.fig + '"></div>') + "</div>");
    var claims = s.claims || (s.claim ? [s.claim] : []);
    if (s.source || claims.length) h.push('<div class="slide__foot"><div class="slide__source">' + (s.source || "") + "</div>" +
      claims.map(function (c) { return '<span class="badge" data-claim="' + c + '">' + (CLAIM[c] || c) + "</span>"; }).join("") + "</div>");
    return h.join("");
  }
  function notesHTML(s) {
    var ns = s.notes || [];
    var n = ns.map(function (t, idx) {
      var prefix = ns.length > 1 ? '<strong>[' + L.step + ' ' + (idx + 1) + ']</strong> ' : "";
      return "<p>" + prefix + esc(t) + "</p>";
    }).join("");
    if (s.bridge) n += '<p class="note-bridge">' + L.next + ": " + esc(s.bridge) + "</p>";
    return n;
  }

  function render() {
    var deck = $("#deck");
    deck.innerHTML = S.map(function (s, i) {
      return '<div class="slide-wrap"><section class="slide" id="slide-' + (i + 1) + '" data-layout="' + (s.layout || "split") + '"' + (s.partStart ? " data-part-start" : "") +
        (s.paper ? ' data-paper="' + s.paper + '"' : "") + ' aria-label="Slide ' + (i + 1) + ": " + strip(s.title).replace(/"/g, "&quot;") + '">' + slideHTML(s, i) + "</section>" +
        '<details class="read-notes" open><summary>' + L.notes + " · สไลด์ " + (i + 1) + " (" + fmt(s.seconds || 0) + " " + L.planned + ")</summary>" +
        '<div class="read-notes__body">' + notesHTML(s) + "</div></details></div>";
    }).join("");
    $$(".slide", deck).forEach(function (el, i) {
      var figEl = $(".fig[data-fig]", el), api = null;
      if (figEl && FIGS[figEl.dataset.fig]) {
        try { api = FIGS[figEl.dataset.fig](figEl, { slide: S[i] }); } catch (e) { figEl.innerHTML = '<p class="note">Figure error: ' + esc(e.message) + "</p>"; if (window.console) console.error(e); }
      }
      figs[i] = api;
      var max = S[i].steps || 1;
      $$("[data-step]", el).forEach(function (n) { max = Math.max(max, +n.dataset.step || 1); });
      if (api && api.steps) max = Math.max(max, api.steps);
      stepsOf[i] = max;
    });
    HOOKS.afterRender.forEach(function (fn) { try { fn(S); } catch (e) { if (window.console) console.error(e); } });
  }

  /* ---------- show ---------- */
  function applySteps(i, step) {
    var el = $("#slide-" + (i + 1));
    if (!el) return;
    var all = state.mode === "read";
    $$("[data-step]", el).forEach(function (n) { n.classList.toggle("is-pending", !all && +n.dataset.step > step); });
    if (figs[i] && figs[i].setStep) {
      try { figs[i].setStep(all ? stepsOf[i] : step); } catch (e) { if (window.console) console.error("Figure on slide " + (i + 1) + ":", e); }
    }
  }
  function show() {
    var i = state.i, s = S[i];
    $$(".slide").forEach(function (el, k) { el.classList.toggle("is-active", k === i); });
    applySteps(i, state.step);
    $("#chapter-name").textContent = chapterName(s);
    $("#slide-number").textContent = (i + 1) + " / " + S.length;
    $("#pos").textContent = (i + 1) + " / " + S.length + (stepsOf[i] > 1 ? " · " + L.step + " " + state.step + "/" + stepsOf[i] : "");
    var pos = plannedStart[i] + (s.seconds || 0) * (state.step - 1) / stepsOf[i];
    $("#progress").style.width = (total ? Math.min(100, pos / total * 100) : 0) + "%";
    var pb = $(".ribbon__progress"); pb.setAttribute("aria-valuemax", total); pb.setAttribute("aria-valuenow", Math.round(pos));
    document.title = (i ? strip(s.title) + " · " : "") + D.meta.title;
    var h = "#s" + (i + 1);
    if (location.hash !== h) { try { history.replaceState(null, "", h); } catch (e) { /* file:// */ } }
    $("#btn-prev").disabled = i === 0 && state.step === 1;
    $("#btn-next").disabled = i === S.length - 1 && state.step === stepsOf[i];
    drawDrawer(); tick(); post();
    HOOKS.onShow.forEach(function (fn) { try { fn(i, state.step); } catch (e) { if (window.console) console.error(e); } });
  }
  function go(i, step) {
    state.i = Math.max(0, Math.min(S.length - 1, i));
    state.step = step === "last" ? stepsOf[state.i] : Math.max(1, Math.min(stepsOf[state.i], step || 1));
    show();
    if (state.mode === "read") { var el = $("#slide-" + (state.i + 1)); if (el) el.scrollIntoView({ block: "start", behavior: "smooth" }); }
  }
  function move(dir) {
    if (!state.started && state.mode === "present") state.started = Date.now();
    if (dir > 0) {
      if (state.step < stepsOf[state.i]) { state.step++; show(); }
      else if (state.i < S.length - 1) go(state.i + 1, 1);
    } else {
      if (state.step > 1) { state.step--; show(); }
      else if (state.i > 0) go(state.i - 1, "last");
    }
  }

  /* ---------- timer ---------- */
  function paceInfo() {
    var el = state.started ? (Date.now() - state.started) / 1000 : 0;
    var s = S[state.i];
    var due = plannedStart[state.i] + (s.seconds || 0) * (state.step - 1) / stepsOf[state.i];
    return { elapsed: el, diff: el - due, due: due };
  }
  function tick() {
    var t = $("#timer"); if (!t) return;
    if (!state.started) { t.textContent = L.wait + " · " + L.plan + " " + fmt(total); return; }
    var p = paceInfo(), d = Math.round(p.diff);
    var cls = d > 30 ? "late" : d < -30 ? "early" : "";
    t.innerHTML = fmt(p.elapsed) + " / " + fmt(total) + ' · <span class="' + cls + '">' + (d >= 0 ? "+" : "−") + fmt(Math.abs(d)) + " " + (d >= 0 ? L.behind : L.ahead) + "</span>";
  }
  setInterval(function () { tick(); post(); }, 1000);

  /* ---------- bottom speaker-note drawer & second presenter window ---------- */
  function notesBlock(i, step) {
    var s = S[i], ns = s.notes || [];
    var out = ns.map(function (t, k) {
      var cls = k + 1 === step ? "is-now" : k + 1 < step ? "is-past" : "";
      var tag = ns.length > 1 ? '<span class="note-step__tag">' + L.step + " " + (k + 1) + "/" + ns.length + "</span>" : "";
      return '<p class="note-step ' + cls + '">' + tag + esc(t) + "</p>";
    }).join("");
    if (s.bridge) out += '<p class="note-bridge">' + L.next + ": " + esc(s.bridge) + "</p>";
    return out;
  }
  function syncDrawerButtons() {
    var d = $("#notes-drawer"), open = d && !d.hidden;
    document.body.classList.toggle("drawer-open", !!open);
    var b1 = $("#btn-drawer"), b2 = $("#btn-notes"), lbl = $("#btn-drawer-label");
    if (b1) b1.setAttribute("aria-pressed", open ? "true" : "false");
    if (b2) b2.setAttribute("aria-pressed", open ? "true" : "false");
    if (lbl) lbl.textContent = open ? L.hideNotes : L.showNotes;
  }
  function drawDrawer() {
    var d = $("#notes-drawer");
    syncDrawerButtons();
    if (!d || d.hidden) return;
    var s = S[state.i];
    d.innerHTML =
      '<div class="notes-drawer__bar">' +
        '<h3>' + L.notes + " · " + L.slide + " " + (state.i + 1) + "/" + S.length +
        (stepsOf[state.i] > 1 ? " (" + L.step + " " + state.step + "/" + stepsOf[state.i] + ")" : "") +
        " · " + fmt(s.seconds || 0) + " " + L.planned + '</h3>' +
        '<div class="notes-drawer__actions">' +
          '<button type="button" class="btn btn--ghost" data-note-fs="-1" title="ลดขนาดตัวอักษร">A−</button>' +
          '<button type="button" class="btn btn--ghost" data-note-fs="1" title="เพิ่มขนาดตัวอักษร">A+</button>' +
          '<button type="button" class="btn btn--ghost" data-open-win title="เปิดหน้าต่างผู้บรรยายจอที่สอง">จอที่สอง ↗</button>' +
          '<button type="button" class="btn btn--ghost" data-hide-drawer title="ซ่อนบทบรรยาย (B)">ซ่อน ×</button>' +
        '</div>' +
      '</div>' +
      '<div class="notes-drawer__body">' + notesBlock(state.i, state.step) + '</div>';
    var nowEl = $(".note-step.is-now", d);
    if (nowEl && nowEl.scrollIntoView) {
      try { nowEl.scrollIntoView({ block: "nearest" }); } catch (e) { /* ignore */ }
    }
  }
  function setDrawer(open) {
    var d = $("#notes-drawer"); if (!d) return;
    d.hidden = !open;
    store.set("drawer", open ? "1" : "0");
    drawDrawer();
    if (open) chrome(true);
  }
  function toggleDrawer() {
    var d = $("#notes-drawer");
    setDrawer(d ? d.hidden : true);
  }
  function adjustNoteFs(delta) {
    state.noteFs = Math.max(13.5, Math.min(24, state.noteFs + delta * 1.5));
    document.documentElement.style.setProperty("--note-fs", state.noteFs + "px");
    store.set("noteFs", String(state.noteFs));
  }

  function openNotes() {
    var url = location.href.split("#")[0] + "#notes", w = null;
    try { w = window.open(url, "peitho-notes", "width=980,height=720"); } catch (e) { w = null; }
    if (w === window) {
      if (location.hash === "#notes") { try { history.replaceState(null, "", "#s" + (state.i + 1)); } catch (e) { /* ignore */ } }
      toggleDrawer(); return;
    }
    if (!w) { popupHelp(); return; }
    var help = $(".popup-help"); if (help) help.remove();
    state.notesWin = w;
    setTimeout(post, 600);
  }
  function popupHelp() {
    if ($(".popup-help")) return;
    var d = document.createElement("div"); d.className = "popup-help";
    d.innerHTML = "<span>" + L.popupBlocked + '</span><button class="btn btn--primary" type="button">' + L.openWin + '</button><button class="btn btn--ghost" type="button" aria-label="' + L.cancel + '">×</button>';
    $$("button", d)[0].addEventListener("click", function () { d.remove(); openNotes(); });
    $$("button", d)[1].addEventListener("click", function () { d.remove(); });
    document.body.appendChild(d);
  }
  function post() {
    var w = state.notesWin; if (!w || w.closed) return;
    try { w.postMessage({ peitho: D.meta.id, type: "state", i: state.i, step: state.step, steps: stepsOf[state.i], started: state.started }, "*"); } catch (e) { /* closed */ }
  }
  window.addEventListener("message", function (ev) {
    var m = ev.data || {};
    if (m.peitho !== D.meta.id || isNotesView) return;
    if (ev.source && ev.source !== window) state.notesWin = ev.source;
    if (m.type === "nav") move(m.dir);
    if (m.type === "goto") go(m.i, 1);
    if (m.type === "hello") post();
    if (m.type === "reset") { state.started = Date.now(); tick(); post(); }
  });

  /* ---------- notes window view (#notes) ---------- */
  var isNotesView = location.hash === "#notes";
  function notesView() {
    document.body.className = "view-notes";
    var root = document.createElement("div"); root.className = "nw"; document.body.appendChild(root);
    var st = { i: 0, step: 1, steps: 1, started: null };
    function send(m) { m.peitho = D.meta.id; if (window.opener) { try { window.opener.postMessage(m, "*"); } catch (e) { /* opener gone */ } } }
    function draw() {
      var s = S[st.i], nx = S[st.i + 1];
      var el = st.started ? (Date.now() - st.started) / 1000 : 0;
      var due = plannedStart[st.i] + (s.seconds || 0) * (st.step - 1) / st.steps, d = Math.round(el - due);
      var slotEnd = plannedStart[st.i] + (s.seconds || 0);
      root.innerHTML =
        '<div class="nw__main"><div class="nw__meta">' + L.slide + " " + (st.i + 1) + " " + L.of + " " + S.length + " · " + chapterName(s) + " · " + L.step + " " + st.step + "/" + st.steps + "</div>" +
        '<div class="nw__title">' + strip(s.title) + "</div>" +
        notesBlock(st.i, st.step) + "</div>" +
        '<div class="nw__side"><div class="nw__clock">' + (st.started ? fmt(el) : "0:00") + "</div>" +
        '<div class="nw__pace ' + (!st.started ? "" : d > 30 ? "late" : d < -30 ? "early" : "") + '">' + (st.started ? (d >= 0 ? "+" : "−") + fmt(Math.abs(d)) + " " + (d >= 0 ? L.behind : L.ahead) : L.startsAt) + "</div>" +
        '<div class="nw__meta">' + L.thisSlide + ": " + fmt(plannedStart[st.i]) + "–" + fmt(slotEnd) + " " + L.of + " " + fmt(total) + "</div>" +
        '<div class="nw__btns"><button class="btn btn--nav" data-nav="-1" aria-label="Previous">‹</button><button class="btn btn--nav" data-nav="1" aria-label="Next">›</button><button class="btn" data-reset>' + L.restart + '</button></div>' +
        (nx ? '<div class="nw__next">' + L.nextSlide + "<b>" + strip(nx.title) + "</b>" + fmt(nx.seconds || 0) + " " + L.planned + "</div>" : '<div class="nw__next">' + L.lastSlide + "</div>") + "</div>";
    }
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-nav]"); if (b) send({ type: "nav", dir: +b.dataset.nav });
      if (e.target.closest("[data-reset]")) send({ type: "reset" });
    });
    document.addEventListener("keydown", function (e) {
      var k = e.key;
      if (k === "ArrowRight" || k === "PageDown" || k === " ") { e.preventDefault(); send({ type: "nav", dir: 1 }); }
      else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); send({ type: "nav", dir: -1 }); }
    });
    window.addEventListener("message", function (ev) {
      var m = ev.data || {}; if (m.peitho !== D.meta.id || m.type !== "state") return;
      st = m; draw();
    });
    setInterval(draw, 1000);
    draw(); send({ type: "hello" });
    document.title = L.notes + " · " + D.meta.title;
  }

  /* ---------- overview, help, mode, theme ---------- */
  function buildOverview() {
    $("#overview-list").innerHTML = S.map(function (s, i) {
      return '<li><button type="button" data-goto="' + i + '"><span class="o-n"><span><span class="o-dot" style="background:var(--accent)"></span>' + (i + 1) + " · " + chapterName(s) + "</span><span>" + fmt(plannedStart[i]) + "</span></span>" +
        '<span class="o-t">' + strip(s.title) + "</span></button></li>";
    }).join("");
  }
  function openDialog(id) {
    var d = $(id);
    if (id === "#overview") $$("#overview-list button").forEach(function (b) { b.setAttribute("aria-current", +b.dataset.goto === state.i ? "true" : "false"); });
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
  }
  function closeDialogs() { $$("dialog[open]").forEach(function (d) { d.close ? d.close() : d.removeAttribute("open"); }); }

  function setMode(m) {
    state.mode = m;
    document.body.classList.toggle("mode-present", m === "present");
    document.body.classList.toggle("mode-read", m === "read");
    $$(".modes button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.mode === m ? "true" : "false"); });
    store.set("mode", m);
    for (var i = 0; i < S.length; i++) applySteps(i, i === state.i ? state.step : 1);
    show();
    if (m === "read") { var el = $("#slide-" + (state.i + 1)); if (el) el.scrollIntoView({ block: "start" }); }
  }
  function currentTheme() {
    var t = document.documentElement.getAttribute("data-theme");
    if (t) return t;
    return "light";
  }
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    store.set("theme-apple", t);
    var b = $("#btn-theme"); if (b) b.setAttribute("aria-label", t === "dark" ? "สลับเป็นธีมสว่าง" : "สลับเป็นธีมมืด");
  }
  function fullscreen() {
    var de = document.documentElement;
    try {
      if (!document.fullscreenElement) { var p = de.requestFullscreen && de.requestFullscreen(); if (p && p.catch) p.catch(function () {}); }
      else if (document.exitFullscreen) document.exitFullscreen();
    } catch (e) { /* ignore */ }
  }
  document.addEventListener("fullscreenchange", function () {
    var fs = !!document.fullscreenElement;
    document.body.classList.toggle("is-fullscreen", fs);
    chrome(true);
  });

  /* ---------- auto-hide chrome only in Fullscreen when speaker notes are closed ---------- */
  var chromeT = 0, lastXY = null;
  function chrome(on) {
    clearTimeout(chromeT);
    var drawerOpen = $("#notes-drawer") && !$("#notes-drawer").hidden;
    var isFs = !!document.fullscreenElement;
    if (!isFs || drawerOpen) {
      document.body.classList.remove("chrome-off");
      return;
    }
    document.body.classList.toggle("chrome-off", !on);
    if (on) chromeT = setTimeout(function () {
      if (document.querySelector(".topbar:hover, .ribbon:hover, .notes-drawer:hover, dialog[open]") ||
          (document.activeElement && document.activeElement.closest && document.activeElement.closest(".topbar, .ribbon, .notes-drawer"))) {
        chrome(true); return;
      }
      document.body.classList.add("chrome-off");
    }, 3200);
  }
  document.addEventListener("mousemove", function (e) {
    if (lastXY && Math.abs(e.clientX - lastXY[0]) + Math.abs(e.clientY - lastXY[1]) < 4) return;
    lastXY = [e.clientX, e.clientY]; chrome(true);
  }, { passive: true });
  document.addEventListener("focusin", function (e) { if (e.target.closest && e.target.closest(".topbar, .ribbon, .notes-drawer")) chrome(true); });

  function onKey(e) {
    if (e.target.closest && e.target.closest("input, select, textarea, [contenteditable]")) return;
    if ($("dialog[open]")) { if (e.key === "Escape") closeDialogs(); return; }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (k === "ArrowRight" || k === "PageDown" || (k === " " && !(e.target.closest && e.target.closest("button, a, summary")))) { e.preventDefault(); move(1); }
    else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); move(-1); }
    else if (k === "Home") { e.preventDefault(); go(0, 1); }
    else if (k === "End") { e.preventDefault(); go(S.length - 1, 1); }
    else if (k === "b" || k === "B" || k === "N") { e.preventDefault(); toggleDrawer(); }
    else if (k === "n") { e.preventDefault(); openNotes(); }
    else if (k === "o" || k === "O") openDialog("#overview");
    else if (k === "f" || k === "F") fullscreen();
    else if (k === "t" || k === "T") setTheme(currentTheme() === "dark" ? "light" : "dark");
    else if (k === "r" || k === "R") setMode(state.mode === "read" ? "present" : "read");
    else if (k === "0") { state.started = Date.now(); tick(); post(); }
    else if (k === "?") openDialog("#help");
  }

  /* ---------- boot ---------- */
  function boot() {
    if (isNotesView) { notesView(); return; }
    var t = store.get("theme-apple");
    if (t === "light" || t === "dark") setTheme(t);
    else setTheme("light");

    var savedFs = parseFloat(store.get("noteFs") || "");
    if (savedFs >= 13 && savedFs <= 24) {
      state.noteFs = savedFs;
      document.documentElement.style.setProperty("--note-fs", state.noteFs + "px");
    }

    render(); buildOverview();
    if (PRINT) {
      state.mode = "read";
      document.body.className = "mode-print";
      $$(".slide").forEach(function (el) { el.classList.add("is-active"); });
      for (var k = 0; k < S.length; k++) applySteps(k, stepsOf[k]);
      document.documentElement.setAttribute("data-print-ready", "1");
      return;
    }

    var m = /^#s(\d+)$/.exec(location.hash);
    if (m) state.i = Math.max(0, Math.min(S.length - 1, +m[1] - 1));

    var savedDrawer = store.get("drawer");
    if (savedDrawer === "1") setDrawer(true);

    var mode = store.get("mode");
    setMode(mode === "read" ? "read" : "present");
    chrome(true);

    document.addEventListener("keydown", onKey);
    $("#btn-prev").addEventListener("click", function () { move(-1); });
    $("#btn-next").addEventListener("click", function () { move(1); });
    if ($("#btn-drawer")) $("#btn-drawer").addEventListener("click", toggleDrawer);
    if ($("#btn-notes")) $("#btn-notes").addEventListener("click", toggleDrawer);
    if ($("#btn-presenter")) $("#btn-presenter").addEventListener("click", openNotes);
    $("#btn-overview").addEventListener("click", function () { openDialog("#overview"); });
    $("#btn-help").addEventListener("click", function () { openDialog("#help"); });
    $("#btn-theme").addEventListener("click", function () { setTheme(currentTheme() === "dark" ? "light" : "dark"); });
    $("#btn-full").addEventListener("click", fullscreen);
    $$(".modes button").forEach(function (b) { b.addEventListener("click", function () { setMode(b.dataset.mode); }); });
    $$("[data-close]").forEach(function (b) { b.addEventListener("click", closeDialogs); });
    $("#overview-list").addEventListener("click", function (e) { var b = e.target.closest("[data-goto]"); if (b) { closeDialogs(); go(+b.dataset.goto, 1); } });
    $("#notes-drawer").addEventListener("click", function (e) {
      var fsBtn = e.target.closest("[data-note-fs]");
      if (fsBtn) adjustNoteFs(+fsBtn.dataset.noteFs);
      if (e.target.closest("[data-hide-drawer]")) setDrawer(false);
      if (e.target.closest("[data-open-win]")) openNotes();
    });
    window.addEventListener("hashchange", function () { var mm = /^#s(\d+)$/.exec(location.hash); if (mm && +mm[1] - 1 !== state.i) go(+mm[1] - 1, 1); });
    $("#deck").focus({ preventScroll: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
