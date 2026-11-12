/* Interactive multi-step SVG figures for Ramathibodi COMMED QIR Orientation (s01..s25).
 * Relies on window.HUD (engine/hud.js) and window.TALKDATA (data.js).
 */
(function () {
  "use strict";
  var S = HUD.S, H = HUD.H, defs = HUD.defs, stepper = HUD.stepper,
      svgHost = HUD.svgHost, tween = HUD.tween, loop = HUD.loop, pulse = HUD.pulse;
  var HOOKS = window.PEITHO && window.PEITHO.hooks;

  function mainSvg(host, h, label) {
    var svg = svgHost(host, "0 0 640 " + (h || 470), label || "");
    defs(svg);
    return svg;
  }
  function wideSvg(host, h, label) {
    var svg = svgHost(host, "0 0 1200 " + (h || 400), label || "");
    defs(svg);
    return svg;
  }

  function card(p, x, y, w, h, opt) {
    opt = opt || {};
    var sw = opt.dash ? (opt.sw || 1.65) : (opt.sw ? Math.min(1.45, opt.sw * 0.82) : 1.0);
    var g = S("g", {}, p);
    S("rect", {
      x: x, y: y, width: w, height: h, rx: opt.rx != null ? Math.max(10, opt.rx) : 14,
      style: "fill:" + (opt.fill || "var(--card)") + ";stroke:" + (opt.stroke || "var(--line-strong)") +
        ";stroke-width:" + sw.toFixed(2) + (opt.dash ? ";stroke-dasharray:" + opt.dash : "")
    }, g);
    if (opt.bar) {
      S("rect", {
        x: x, y: y + 10, width: 3.2, height: Math.max(8, h - 20), rx: 1.6,
        style: "fill:" + opt.bar
      }, g);
    }
    if (opt.topBar) {
      S("rect", {
        x: x + 14, y: y, width: Math.max(12, w - 28), height: 3, rx: 1.5,
        style: "fill:" + opt.topBar
      }, g);
    }
    return g;
  }

  function txt(p, x, y, str, opt) {
    opt = opt || {};
    var fs = opt.fs || 14;
    var el = S("text", {
      x: x, y: y,
      "text-anchor": opt.anchor || "start",
      style: "font-size:" + fs + "px;font-weight:" + (opt.fw || 400) + ";fill:" + (opt.fill || "var(--text-1)")
    }, p);
    if (opt.cls) el.setAttribute("class", opt.cls);
    el.textContent = str;
    return el;
  }

  function lines(p, x, y, arr, opt) {
    opt = opt || {};
    var fs = opt.fs || 13.5, lh = opt.lh || Math.round(fs * 1.44);
    var el = S("text", {
      x: x, y: y,
      "text-anchor": opt.anchor || "start",
      style: "font-size:" + fs + "px;font-weight:" + (opt.fw || 400) + ";fill:" + (opt.fill || "var(--text-2)")
    }, p);
    arr.forEach(function (line, i) {
      var ts = S("tspan", { x: x, dy: i === 0 ? 0 : lh }, el);
      ts.textContent = line;
    });
    return el;
  }

  function pill(p, cx, cy, w, h, label, opt) {
    opt = opt || {};
    var g = S("g", {}, p);
    S("rect", {
      x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: opt.rx != null ? opt.rx : h / 2,
      style: "fill:" + (opt.fill || "var(--p1-soft)") + ";stroke:" + (opt.stroke || "var(--p1)") + ";stroke-width:" + (opt.sw || 1.0)
    }, g);
    txt(g, cx, cy + (opt.fs || 13) * 0.35, label, {
      anchor: "middle", fs: opt.fs || 13, fw: opt.fw || 600, fill: opt.color || "var(--text-1)"
    });
    return g;
  }

  function arrow(p, x1, y1, x2, y2, opt) {
    opt = opt || {};
    var mk = opt.mk || "hud-arrow";
    return S("line", {
      x1: x1, y1: y1, x2: x2, y2: y2,
      "marker-end": "url(#" + mk + ")",
      style: "stroke:" + (opt.stroke || "var(--axis)") + ";stroke-width:" + (opt.sw ? Math.min(2.0, opt.sw * 0.82) : 1.45) +
        (opt.dash ? ";stroke-dasharray:" + opt.dash : "")
    }, p);
  }

  function pathArrow(p, d, opt) {
    opt = opt || {};
    var mk = opt.mk || "hud-arrow";
    return S("path", {
      d: d,
      "marker-end": opt.noHead ? null : "url(#" + mk + ")",
      style: "fill:none;stroke:" + (opt.stroke || "var(--axis)") + ";stroke-width:" + (opt.sw ? Math.min(2.1, opt.sw * 0.82) : 1.55) +
        (opt.dash ? ";stroke-dasharray:" + opt.dash : "")
    }, p);
  }

  function bindSteps(host, groups, extraFn) {
    groups.forEach(function (g, idx) { if (idx > 0 && g) g.style.opacity = 0; });
    return stepper(host, groups.length, function (k, animate, job) {
      groups.forEach(function (g, idx) {
        if (!g) return;
        var sNum = idx + 1;
        if (sNum < k) {
          g.style.opacity = 1;
        } else if (sNum === k) {
          if (animate) {
            g.style.opacity = 0;
            job.add(tween(420, function (t) { g.style.opacity = t; }));
          } else {
            g.style.opacity = 1;
          }
        } else {
          g.style.opacity = 0;
        }
      });
      if (extraFn) extraFn(k, animate, job);
    });
  }

  var FIGS = window.FIGS = {};

  /* ---------- s01: Title Systems Constellation (1 step) ---------- */
  FIGS.s01 = function (host) {
    var svg = svgHost(host, "0 0 540 480", "วงจรระบบการวิจัยเพื่อพัฒนาคุณภาพบริการสุขภาพ QIR");
    defs(svg);
    var g1 = S("g", {}, svg);
    var cx = 270, cy = 244, R = 166;

    S("circle", { cx: cx, cy: cy, r: R + 28, style: "fill:none;stroke:var(--grid);stroke-width:1" }, g1);
    S("circle", { cx: cx, cy: cy, r: R, style: "fill:none;stroke:var(--line-strong);stroke-width:1.1;stroke-dasharray:4 5" }, g1);
    S("circle", { cx: cx, cy: cy, r: 92, style: "fill:var(--accent-soft);stroke:var(--p1);stroke-width:1.1" }, g1);
    S("circle", { cx: cx, cy: cy, r: 74, style: "fill:var(--card-strong);stroke:var(--line-strong);stroke-width:1.2" }, g1);

    pulse(g1, cx, cy - 38, 11, "var(--accent-text)");
    txt(g1, cx, cy - 8, "COMMED QIR", { anchor: "middle", fs: 16.5, fw: 600, fill: "var(--accent-text)" });
    txt(g1, cx, cy + 15, "วิจัยเพื่อพัฒนาคุณภาพ", { anchor: "middle", fs: 13.5, fw: 600, fill: "var(--text-1)" });
    txt(g1, cx, cy + 35, "โรงพยาบาลชุมชน 4 สัปดาห์", { anchor: "middle", fs: 12, fill: "var(--muted)" });

    var nodes = [
      { a: -90, title: "01 · คลังโอกาสพัฒนา", sub: "OFI Pool & หน้างานจริง" },
      { a: -18, title: "02 · โจทย์ & กรอบแนวคิด", sub: "Implementation Gap" },
      { a: 54,  title: "03 · เก็บข้อมูล & รากเหง้า", sub: "MMR · Fishbone · Swiss Cheese" },
      { a: 126, title: "04 · กลยุทธ์ & Policy Brief", sub: "TOWS 4 ทิศทางเพื่อตัดสินใจ" },
      { a: 198, title: "05 · ร่วมออกแบบกับทีม", sub: "ส่งไม้ต่อสู่ CQI & R2R" }
    ];

    nodes.forEach(function (n, idx) {
      var rad = n.a * Math.PI / 180;
      var nx = cx + Math.cos(rad) * R, ny = cy + Math.sin(rad) * R;
      var nextRad = nodes[(idx + 1) % nodes.length].a * Math.PI / 180;
      var a1 = rad + 0.34, a2 = (idx === nodes.length - 1 ? nextRad + Math.PI * 2 : nextRad) - 0.34;
      var sx = cx + Math.cos(a1) * R, sy = cy + Math.sin(a1) * R;
      var ex = cx + Math.cos(a2) * R, ey = cy + Math.sin(a2) * R;
      pathArrow(g1, "M " + sx.toFixed(1) + " " + sy.toFixed(1) + " A " + R + " " + R + " 0 0 1 " + ex.toFixed(1) + " " + ey.toFixed(1),
        { stroke: "var(--accent-text)", sw: 1.5, mk: "hud-arrow-acc" });

      var bw = 178, bh = 54;
      card(g1, nx - bw / 2, ny - bh / 2, bw, bh, { rx: 14, fill: "var(--card-strong)", stroke: "var(--line-strong)", sw: 1.1 });
      txt(g1, nx, ny - 5, n.title, { anchor: "middle", fs: 13.2, fw: 600, fill: "var(--text-1)" });
      txt(g1, nx, ny + 15, n.sub, { anchor: "middle", fs: 11.8, fill: "var(--muted)" });
    });

    var orb = S("circle", { cx: cx, cy: cy - R, r: 4, style: "fill:var(--accent-text)" }, g1);
    var theta = -Math.PI / 2;
    loop(host, function (dt) {
      theta = (theta + dt * 0.00055) % (Math.PI * 2);
      orb.setAttribute("cx", (cx + Math.cos(theta) * R).toFixed(1));
      orb.setAttribute("cy", (cy + Math.sin(theta) * R).toFixed(1));
    });

    return bindSteps(host, [g1]);
  };

  /* ---------- s02: 4-Week Rotation Architecture (Top 3 Inputs -> Weeks 1-4 -> Bottom 3 Outputs, 2 steps) ---------- */
  FIGS.s02 = function (host) {
    var svg = wideSvg(host, 396, "โครงสร้างการฝึกปฏิบัติ 4 สัปดาห์ เชื่อมคลังปัญหาเดิมสู่การส่งไม้ต่อหลังจบวิชา");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    /* Top-left rotation header */
    txt(g1, 100, 29, "4 week rotation", { anchor: "middle", fs: 17, fw: 600, fill: "var(--text-1)" });
    txt(g1, 100, 50, "โครงสร้างฝึกปฏิบัติ 4 สัปดาห์", { anchor: "middle", fs: 12.2, fill: "var(--muted)" });

    /* Row 0: 3 Input Sources feeding into 1st Week */
    var inputs = [
      { x: 204, w: 286, th: 'คลังโอกาสพัฒนาเดิม ("OFI" Pools)', en: 'Existing "OFI" Pools', dashed: true },
      { x: 502, w: 294, th: "โครงการพัฒนาที่ดำเนินการอยู่เดิม", en: "Ongoing CQI/R2R projects", dashed: true },
      { x: 808, w: 378, th: "ประเด็นที่สังเกตพบขณะขึ้นฝึกทางคลินิก", en: "Exploring personal interests during clinical clerkship", dashed: false }
    ];
    inputs.forEach(function (inp) {
      card(g1, inp.x, 4, inp.w, 56, {
        rx: 10,
        fill: inp.dashed ? "var(--accent-soft)" : "var(--card-strong)",
        stroke: inp.dashed ? "var(--accent)" : "var(--line-strong)",
        sw: inp.dashed ? 1.75 : 1.15,
        dash: inp.dashed ? "7 4" : null
      });
      var cx = inp.x + inp.w / 2;
      txt(g1, cx, 27, inp.th, { anchor: "middle", fs: 13.3, fw: 600, fill: inp.dashed ? "var(--accent-text)" : "var(--text-1)" });
      txt(g1, cx, 47, inp.en, { anchor: "middle", fs: 11.8, fill: inp.dashed ? "var(--text-2)" : "var(--muted)" });
      arrow(g1, cx, 61, cx, 73, { stroke: inp.dashed ? "var(--accent-text)" : "var(--axis)", sw: 1.5, mk: inp.dashed ? "hud-arrow-acc" : "hud-arrow" });
    });

    /* Rows 1–3: Weeks 1 to 3 (Step 1) */
    var weeks13 = [
      {
        th: "สัปดาห์ที่ 1", en: "1st Week", fill: "var(--wk1)", stroke: "var(--line-strong)",
        head: "ระบุและจัดลำดับปัญหา · Problem Identification",
        desc: "เดินตามรอยหน้างาน 3 มุมมอง (Tracer & Gemba) · นิยามช่องว่างผลลัพธ์ที่วัดได้จริง · คัดเลือกด้วยเกณฑ์ SSSFI"
      },
      {
        th: "สัปดาห์ที่ 2", en: "2nd Week", fill: "var(--wk2)", stroke: "var(--line-strong)",
        head: "ทบทวนวรรณกรรมและวางกรอบแนวคิด · Literature Review & Conceptualization",
        desc: "ชี้ช่องว่างการนำความรู้ไปใช้จริง (Implementation Gap) · วาดพิมพ์เขียวกรอบแนวคิด · เลือกวิธีวิจัยตามคำถามวิจัย"
      },
      {
        th: "สัปดาห์ที่ 3", en: "3rd Week", fill: "var(--wk3)", stroke: "var(--p1)",
        head: "เก็บและวิเคราะห์ข้อมูลจริง · Data Collection / Data Analysis",
        desc: "ผสานข้อมูล QUAN / QUAL ร่วมกับทีมสหวิชาชีพ · ขุดรากสาเหตุเชิงระบบด้วย ToC, 5 Whys, Fishbone และ Swiss Cheese"
      }
    ];
    weeks13.forEach(function (w, idx) {
      var y = 76 + idx * 58;
      card(g1, 14, y, 172, 50, { rx: 10, fill: "var(--card)", stroke: "var(--line-strong)" });
      txt(g1, 100, y + 22, w.th, { anchor: "middle", fs: 13.8, fw: 600, fill: "var(--text-1)" });
      txt(g1, 100, y + 40, w.en, { anchor: "middle", fs: 11.6, fill: "var(--muted)" });

      card(g1, 204, y, 982, 50, { rx: 10, fill: w.fill, stroke: w.stroke, sw: 1.15 });
      txt(g1, 695, y + 21, w.head, { anchor: "middle", fs: 14.0, fw: 600, fill: "var(--text-1)" });
      txt(g1, 695, y + 40, w.desc, { anchor: "middle", fs: 12.0, fill: "var(--text-2)" });
    });

    /* Row 4: 4th Week (Step 2) */
    var y4 = 250;
    card(g2, 14, y4, 172, 58, { rx: 10, fill: "var(--accent-soft)", stroke: "var(--accent)", sw: 1.45 });
    txt(g2, 100, y4 + 25, "สัปดาห์ที่ 4", { anchor: "middle", fs: 14.2, fw: 600, fill: "var(--accent-text)" });
    txt(g2, 100, y4 + 44, "4th Week", { anchor: "middle", fs: 11.8, fill: "var(--text-2)" });

    card(g2, 204, y4, 982, 58, { rx: 10, fill: "var(--wk4)", stroke: "var(--accent)", sw: 1.6 });
    txt(g2, 695, y4 + 24, "จากร่างทางแก้สู่แผนที่ทำได้จริง · ขัดเกลาด้วยเสียงสะท้อนของทีมโรงพยาบาล (TOWS & Policy Brief)", {
      anchor: "middle", fs: 14.1, fw: 600, fill: "var(--accent-text)"
    });
    txt(g2, 695, y4 + 45, "From Proposed Solutions to Actionable Plans: Enriching Ideas Through Hospital Team Feedback", {
      anchor: "middle", fs: 12.0, fill: "var(--text-1)"
    });

    /* Row 5: 3 Continuity Hand-off Outputs (Step 2) */
    var outputs = [
      { x: 204, w: 356, th: 'อัปเดตคลังโอกาสพัฒนา ("OFI" Pools) รพ.ชุมชน', en: 'Updating "OFI" Pools at community hospitals' },
      { x: 572, w: 292, th: "ต่อยอดเป็นโครงการ R2R ต่อเนื่อง", en: "Continuing R2R projects" },
      { x: 876, w: 310, th: "นำเสนอในเวทีวิชาการ R2R / CM", en: "Conducting R2R/CM conference" }
    ];
    outputs.forEach(function (out) {
      var cx = out.x + out.w / 2;
      arrow(g2, cx, 310, cx, 324, { stroke: "var(--accent-text)", sw: 1.55, mk: "hud-arrow-acc" });
      card(g2, out.x, 327, out.w, 60, {
        rx: 10,
        fill: "var(--accent-soft)",
        stroke: "var(--accent)",
        sw: 1.75,
        dash: "7 4"
      });
      txt(g2, cx, 352, out.th, { anchor: "middle", fs: 13.2, fw: 600, fill: "var(--accent-text)" });
      txt(g2, cx, 372, out.en, { anchor: "middle", fs: 11.7, fill: "var(--text-2)" });
    });

    /* Legend & Continuity cue in bottom-left corner */
    card(g2, 14, 327, 172, 60, { rx: 10, fill: "var(--card-strong)", stroke: "var(--accent)", sw: 1.4, dash: "6 4" });
    txt(g2, 100, 352, "กรอบเส้นประ", { anchor: "middle", fs: 12.4, fw: 600, fill: "var(--accent-text)" });
    txt(g2, 100, 372, "วงจรงานต่อเนื่องของ รพ.", { anchor: "middle", fs: 11.4, fill: "var(--muted)" });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s03: WHO 6 Building Blocks, 7 Quality Dimensions & Blunt vs Sharp End (2 steps) ---------- */
  FIGS.s03 = function (host) {
    var svg = mainSvg(host, 480, "องค์ประกอบระบบสุขภาพ 7 มิติคุณภาพ และปลายทื่อเทียบกับปลายแหลม");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    card(g1, 14, 14, 210, 212, { topBar: "var(--p1)" });
    txt(g1, 119, 38, "6 องค์ประกอบระบบ (WHO)", { anchor: "middle", fs: 13.5, fw: 600, fill: "var(--p1-text)" });
    ["1. การจัดบริการสุขภาพ", "2. กำลังคนด้านสุขภาพ", "3. ระบบสารสนเทศ", "4. ยาและเทคโนโลยี", "5. การคลังสุขภาพ", "6. ภาวะผู้นำและธรรมาภิบาล"].forEach(function (b, i) {
      txt(g1, 28, 66 + i * 26, b, { fs: 12.8, fill: "var(--text-1)" });
    });

    arrow(g1, 226, 120, 258, 120, { stroke: "var(--accent-text)", sw: 2.2, mk: "hud-arrow-acc" });

    card(g1, 262, 14, 214, 212, { topBar: "var(--accent-text)", fill: "var(--card-strong)" });
    txt(g1, 369, 38, "คุณภาพ 7 มิติ (STEEEP+I)", { anchor: "middle", fs: 13.5, fw: 600, fill: "var(--accent-text)" });
    [
      "Safety · ความปลอดภัย",
      "Timeliness · ทันท่วงที",
      "Effectiveness · ประสิทธิผล",
      "Efficiency · ประสิทธิภาพคุ้มค่า",
      "Equity · ความเสมอภาค",
      "People-centered · ยึดผู้ป่วย",
      "Integration · บูรณาการไร้รอยต่อ"
    ].forEach(function (q, i) {
      txt(g1, 276, 63 + i * 23, q, { fs: 12.5, fill: "var(--text-1)" });
    });

    arrow(g1, 478, 120, 506, 120, { stroke: "var(--good)", sw: 2.2, mk: "hud-arrow-good" });

    card(g1, 510, 44, 116, 152, { fill: "var(--good-soft)", stroke: "var(--good)", sw: 1.5 });
    lines(g1, 568, 92, ["ผลลัพธ์", "สุขภาพดี", "ผู้ป่วยเชื่อมั่น", "ทีมยั่งยืน"], { anchor: "middle", fs: 13.5, fw: 600, lh: 22, fill: "var(--good-text)" });

    /* Step 2: Blunt End vs Sharp End + Carrier analogy */
    card(g2, 14, 246, 290, 218, { fill: "var(--p1-soft)", stroke: "var(--p1)", sw: 1.6 });
    txt(g2, 30, 274, "ปลายทื่อ (Blunt End · หลังบ้าน)", { fs: 14.5, fw: 600, fill: "var(--p1-text)" });
    lines(g2, 30, 300, [
      "• นโยบาย อัตรากำลัง และตารางเวร",
      "• การจัดวางขวดยาและระบบไอที",
      "• กติกาการทำงานข้ามแผนก"
    ], { fs: 12.8, lh: 21, fill: "var(--text-1)" });
    card(g2, 28, 374, 262, 74, { rx: 9, fill: "var(--card-strong)", stroke: "var(--good)", sw: 1.3 });
    txt(g2, 40, 398, "อุปมาเรือบรรทุกเครื่องบิน (ระยะยาว)", { fs: 12.5, fw: 600, fill: "var(--good-text)" });
    lines(g2, 40, 418, ["สร้างทางวิ่งแนวเฉียง + ลวดสลิงชะลอ", "โครงสร้างช่วยเซฟชีวิตแม้นักบินเหนื่อย"], { fs: 12.2, lh: 17, fill: "var(--text-2)" });

    arrow(g2, 306, 336, 336, 336, { stroke: "var(--accent-text)", sw: 2.2, mk: "hud-arrow-acc" });

    card(g2, 340, 246, 286, 218, { fill: "var(--bad-soft)", stroke: "var(--bad)", sw: 1.6 });
    txt(g2, 356, 274, "ปลายแหลม (Sharp End · ด่านหน้า)", { fs: 14.5, fw: 600, fill: "var(--bad-text)" });
    lines(g2, 356, 300, [
      "• แพทย์ พยาบาล เภสัชกรหน้างาน",
      "• สัมผัสผู้ป่วยโดยตรงภายใต้เวลาบีบคั้น",
      "• หลุมพรางที่ 1: เพ่งโทษแต่คนด่านหน้า"
    ], { fs: 12.8, lh: 21, fill: "var(--text-1)" });
    card(g2, 354, 374, 258, 74, { rx: 9, fill: "var(--card-strong)", stroke: "var(--bad)", sw: 1.3 });
    txt(g2, 366, 398, "แก้ระยะสั้น: ใช้คนยืนโบกธง (LSO)", { fs: 12.5, fw: 600, fill: "var(--bad-text)" });
    lines(g2, 366, 418, ["พึ่งความแม่นยำรายบุคคลตลอดเวลา", "เมื่อล้าหรือทัศนวิสัยแย่ ความผิดพลาดจึงซ้ำ"], { fs: 12.2, lh: 17, fill: "var(--text-2)" });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s04: Creative Tension & Core vs Fads of Quality (2 steps) ---------- */
  FIGS.s04 = function (host) {
    var svg = mainSvg(host, 460, "แรงตึงเครียดเชิงสร้างสรรค์ และวิวัฒนาการระบบบริหารคุณภาพ");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    card(g1, 20, 16, 600, 62, { fill: "var(--good-soft)", stroke: "var(--good)", sw: 1.6 });
    txt(g1, 38, 42, "ภาพอุดมคติที่พึงประสงค์ (Vision / Ideal State)", { fs: 14.5, fw: 600, fill: "var(--good-text)" });
    txt(g1, 38, 63, "เช่น ผู้ป่วยความดันโลหิตสูงในชุมชนควบคุมความดันได้ดี ≥ 60% และไร้ภาวะแทรกซ้อน", { fs: 12.6, fill: "var(--text-1)" });

    card(g1, 20, 174, 600, 62, { fill: "var(--p1-soft)", stroke: "var(--p1)", sw: 1.6 });
    txt(g1, 38, 200, "ความจริงหน้างานปัจจุบัน (Current Reality)", { fs: 14.5, fw: 600, fill: "var(--p1-text)" });
    txt(g1, 38, 221, "เช่น ปัจจุบันควบคุมความดันได้จริงเพียง 42% · ผู้ป่วยขาดนัดและปรับยาไม่ทันเวลา", { fs: 12.6, fill: "var(--text-1)" });

    /* Elastic tension pull upward vs lowering vision trap */
    pathArrow(g1, "M 185 170 L 185 84", { stroke: "var(--accent-text)", sw: 3, mk: "hud-arrow-acc" });
    pill(g1, 185, 127, 252, 34, "แรงตึงเครียดเชิงสร้างสรรค์ (ดึงระบบขึ้น)", { fill: "var(--card-strong)", stroke: "var(--accent-text)", color: "var(--accent-text)", fs: 12.8 });

    pathArrow(g1, "M 465 82 L 465 166", { stroke: "var(--bad)", sw: 2, dash: "5 4", mk: "hud-arrow-bad" });
    pill(g1, 465, 127, 236, 34, "✗ กับดักความชินชา: ลดเพดานเป้าหมาย", { fill: "var(--card-strong)", stroke: "var(--bad)", color: "var(--bad-text)", fs: 12.5 });

    /* Step 2: Evolution QC -> QA -> TQM/CQI & Core vs Fads */
    card(g2, 20, 256, 600, 190, { fill: "var(--card)", stroke: "var(--line-strong)" });
    txt(g2, 38, 284, "วิวัฒนาการคุณภาพ: เปลี่ยนชื่อเครื่องมือตามยุค แต่แก่นแท้ไม่เคยเปลี่ยน", { fs: 14.2, fw: 600, fill: "var(--text-1)" });

    var stages = [
      { x: 38,  t: "QC · ควบคุมคุณภาพ", d: "ตรวจคัดของเสียปลายทาง" },
      { x: 232, t: "QA · ประกันคุณภาพ", d: "กำกับกระบวนการตามเกณฑ์" },
      { x: 426, t: "TQM / CQI · พัฒนาต่อเนื่อง", d: "ทั้งองค์กรเรียนรู้ร่วมกัน" }
    ];
    stages.forEach(function (st, idx) {
      card(g2, st.x, 300, 174, 58, { rx: 10, fill: idx === 2 ? "var(--p2-soft)" : "var(--card-strong)", stroke: idx === 2 ? "var(--p2)" : "var(--line-strong)" });
      txt(g2, st.x + 87, 324, st.t, { anchor: "middle", fs: 13, fw: 600, fill: idx === 2 ? "var(--p2-text)" : "var(--text-1)" });
      txt(g2, st.x + 87, 344, st.d, { anchor: "middle", fs: 12, fill: "var(--text-2)" });
      if (idx < 2) arrow(g2, st.x + 176, 329, st.x + 192, 329, { stroke: "var(--axis)" });
    });

    card(g2, 38, 374, 344, 56, { rx: 10, fill: "var(--accent-soft)", stroke: "var(--accent-text)", sw: 1.5 });
    txt(g2, 52, 398, "แก่นแท้ (Core): ยึดคุณค่าผู้ป่วยและเรียนรู้จากข้อมูลจริง", { fs: 12.8, fw: 600, fill: "var(--accent-text)" });
    txt(g2, 52, 418, "สิ่งที่ต้องรักษาไว้ไม่ว่าชื่อย่อเครื่องมือจะเปลี่ยนไปอย่างไร", { fs: 12, fill: "var(--text-1)" });

    card(g2, 396, 374, 204, 56, { rx: 10, fill: "var(--card-strong)", stroke: "var(--neutral)", dash: "4 4" });
    txt(g2, 410, 398, "กระพี้ (Tools / Fads)", { fs: 12.8, fw: 600, fill: "var(--neutral-text)" });
    txt(g2, 410, 418, "แบบฟอร์มหรือชื่อย่อตามสมัย", { fs: 12, fill: "var(--muted)" });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s05: 3P, PDSA, 3C-DALI & QIR Escalation (2 steps) ---------- */
  FIGS.s05 = function (host) {
    var svg = mainSvg(host, 470, "กรอบ 3P วงจร PDSA วงจรซ้อน 3C-DALI และการยกระดับสู่ QIR");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    /* Step 1: 3P + PDSA */
    card(g1, 16, 16, 608, 206, { fill: "var(--card)", stroke: "var(--line-strong)" });
    txt(g1, 34, 42, "กลไกขับเคลื่อนงานคุณภาพประจำวัน: กรอบ 3P ควบคู่วงจร PDSA", { fs: 14.5, fw: 600, fill: "var(--text-1)" });

    var ppp = [
      { x: 34,  k: "Purpose", th: "เป้าหมายชัด", sub: "เพื่อคุณค่าผู้ป่วยรายกลุ่ม", c: "var(--p1)", tc: "var(--p1-text)", bg: "var(--p1-soft)" },
      { x: 228, k: "Process", th: "ออกแบบกระบวนการ", sub: "เชื่อมงานสหวิชาชีพให้ลื่นไหล", c: "var(--p2)", tc: "var(--p2-text)", bg: "var(--p2-soft)" },
      { x: 422, k: "Performance", th: "วัดผลและเรียนรู้", sub: "ติดตามตัวชี้วัดเพื่อพัฒนาต่อ", c: "var(--good)", tc: "var(--good-text)", bg: "var(--good-soft)" }
    ];
    ppp.forEach(function (p, i) {
      card(g1, p.x, 58, 182, 82, { rx: 11, fill: p.bg, stroke: p.c, sw: 1.4 });
      txt(g1, p.x + 91, 83, p.k, { anchor: "middle", fs: 15, fw: 600, fill: p.tc });
      txt(g1, p.x + 91, 104, p.th, { anchor: "middle", fs: 13, fw: 500, fill: "var(--text-1)" });
      txt(g1, p.x + 91, 124, p.sub, { anchor: "middle", fs: 12, fill: "var(--text-2)" });
      if (i < 2) arrow(g1, p.x + 184, 99, p.x + 192, 99, { stroke: "var(--axis)" });
    });

    card(g1, 34, 154, 570, 52, { rx: 10, fill: "var(--card-strong)", stroke: "var(--accent-text)" });
    txt(g1, 319, 177, "วงจร PDSA (Plan → Do → Study → Act)", { anchor: "middle", fs: 13.8, fw: 600, fill: "var(--accent-text)" });
    txt(g1, 319, 196, "ทดลองปรับระบบขนาดเล็กในหน้างานจริง วัดผลเร็ว และเรียนรู้ต่อเนื่องทุกรอบ", { anchor: "middle", fs: 12.4, fill: "var(--text-2)" });

    /* Step 2: 3C + DALI escalating to QIR */
    card(g2, 16, 240, 286, 212, { fill: "var(--card-strong)", stroke: "var(--p1)", sw: 1.5 });
    txt(g2, 34, 268, "วงจรซ้อนในงานประจำ (3C × DALI)", { fs: 14, fw: 600, fill: "var(--p1-text)" });
    lines(g2, 34, 294, [
      "• 3C: รู้โจทย์ (Context) · รู้เกณฑ์ (Criteria)",
      "  และรู้หลักวิชาการ (Core)",
      "• DALI: Design → Action → Learning",
      "  → Improve หมุนวนในหน่วยงาน"
    ], { fs: 12.8, lh: 21, fill: "var(--text-1)" });
    pill(g2, 159, 416, 242, 30, "แก้ปัญหาเฉพาะจุดได้รวดเร็ว", { fill: "var(--p1-soft)", stroke: "var(--p1)", color: "var(--p1-text)", fs: 12.5 });

    arrow(g2, 304, 346, 338, 346, { stroke: "var(--accent-text)", sw: 2.4, mk: "hud-arrow-acc" });
    txt(g2, 321, 326, "ซับซ้อน", { anchor: "middle", fs: 12, fw: 600, fill: "var(--accent-text)" });

    card(g2, 342, 240, 282, 212, { fill: "var(--accent-soft)", stroke: "var(--accent-text)", sw: 1.8 });
    txt(g2, 360, 268, "ยกระดับสู่โครงการ QIR & IR", { fs: 14.5, fw: 600, fill: "var(--accent-text)" });
    lines(g2, 360, 294, [
      "• เมื่อปัญหาข้ามหลายแผนกหรือแก้ซ้ำไม่หาย",
      "• ใช้กรอบแนวคิดทฤษฎีชี้ตัวแปรเป็นระบบ",
      "• เก็บข้อมูล QUAN / QUAL พิสูจน์รากสาเหตุ",
      "• สร้างหลักฐานเชิงประจักษ์เพื่อตัดสินใจ"
    ], { fs: 12.8, lh: 21, fill: "var(--text-1)" });
    pill(g2, 483, 416, 244, 30, "ทลายคอขวดระดับโครงสร้างระบบ", { fill: "var(--good-soft)", stroke: "var(--good)", color: "var(--good-text)", fs: 12.5 });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s06: Problem Statement Traps vs Good Definition (2 steps) ---------- */
  FIGS.s06 = function (host) {
    var svg = mainSvg(host, 460, "เปรียบเทียบหลุมพรางการเขียนปัญหากับคำกล่าวปัญหาที่วัดได้จริง");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    card(g1, 16, 14, 608, 198, { fill: "var(--bad-soft)", stroke: "var(--bad)", sw: 1.6 });
    txt(g1, 34, 42, "✗ หลุมพรางที่ต้องเลี่ยง: เอาคำตอบล่วงหน้าหรือข้อกล่าวหาคนมาเขียนเป็นปัญหา", { fs: 14.2, fw: 600, fill: "var(--bad-text)" });

    var traps = [
      { bad: '✗ "คลินิกขาดแผ่นพับความรู้เรื่องลดเค็ม"', why: "ด่วนสรุปคำตอบล่วงหน้า (บังคับให้ทำแค่แผ่นพับ)" },
      { bad: '✗ "ผู้ป่วยไม่ใส่ใจกินยา และพยาบาลไม่ย้ำเตือน"', why: "กล่าวโทษตัวบุคคล ปิดกั้นการมองโครงสร้างระบบ" },
      { bad: '✗ "หน่วยซ่อมบำรุงทำงานล่าช้าไม่ทันใจหอผู้ป่วย"', why: "ใช้ความรู้สึกตัดสิน ยังไม่มีตัวเลขเทียบเกณฑ์" }
    ];
    traps.forEach(function (t, i) {
      var y = 56 + i * 48;
      card(g1, 32, y, 576, 40, { rx: 8, fill: "var(--card-strong)", stroke: "var(--bad)" });
      txt(g1, 44, y + 25, t.bad, { fs: 12.8, fw: 600, fill: "var(--bad-text)" });
      txt(g1, 600, y + 25, t.why, { anchor: "end", fs: 12.2, fill: "var(--text-2)" });
    });

    card(g2, 16, 228, 608, 218, { fill: "var(--good-soft)", stroke: "var(--good)", sw: 1.8 });
    txt(g2, 34, 256, "✓ คำกล่าวปัญหาที่ดี: ระบุช่องว่างผลลัพธ์ที่วัดได้ + กลุ่มเป้าหมาย + พื้นที่ + เวลา", { fs: 14.2, fw: 600, fill: "var(--good-text)" });

    card(g2, 32, 272, 576, 74, { rx: 10, fill: "var(--card-strong)", stroke: "var(--good)", sw: 1.4 });
    txt(g2, 48, 296, "ตัวอย่างที่ 1 · ด้านคลินิก (คลินิกโรคความดันโลหิตสูง)", { fs: 13.2, fw: 600, fill: "var(--good-text)" });
    lines(g2, 48, 317, [
      "ผู้ป่วยความดันโลหิตสูงที่ขึ้นทะเบียน รพ.ชุมชน ก. ไตรมาสล่าสุด ควบคุมความดัน <140/90 mmHg",
      "ได้เพียงร้อยละ 42 ซึ่งต่ำกว่าเกณฑ์เป้าหมายของโรงพยาบาลที่กำหนดไว้ร้อยละ 60"
    ], { fs: 12.5, lh: 18, fill: "var(--text-1)" });

    card(g2, 32, 358, 576, 74, { rx: 10, fill: "var(--card-strong)", stroke: "var(--p1)", sw: 1.4 });
    txt(g2, 48, 382, "ตัวอย่างที่ 2 · ด้านระบบสนับสนุนบริการ (ระบบเครื่องมือแพทย์)", { fs: 13.2, fw: 600, fill: "var(--p1-text)" });
    lines(g2, 48, 403, [
      "เครื่องมือแพทย์สำคัญของหอผู้ป่วยในที่ส่งซ่อมในช่วง 6 เดือนที่ผ่านมา ได้รับคืนเกินเกณฑ์ 7 วัน",
      "สูงถึงร้อยละ 38 ของใบแจ้งซ่อมทั้งหมด ส่งผลให้ต้องยืมเครื่องข้ามหอผู้ป่วยในเวรดึก"
    ], { fs: 12.5, lh: 18, fill: "var(--text-1)" });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s07: 4 Concentric HA Circles & 3-Way Tracer Triangulation (2 steps) ---------- */
  FIGS.s07 = function (host) {
    var svg = mainSvg(host, 470, "พื้นที่การพัฒนาคุณภาพ 4 วง และการตามรอย 3 มุมมอง");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    /* Step 1: 4 Concentric ellipses/rings */
    var cy = 128, cx = 320;
    var rings = [
      { rx: 294, ry: 108, fill: "var(--card)", stroke: "var(--neutral)", label: "วงที่ 1 · ภาพรวมระดับองค์กรและธรรมาภิบาล", ly: 39, tc: "var(--text-2)" },
      { rx: 238, ry: 84,  fill: "var(--p1-soft)", stroke: "var(--p1)", label: "วงที่ 2 · ระบบงานสำคัญ (ยา, ป้องกันติดเชื้อ, เครื่องมือ, ข้อมูล)", ly: 66, tc: "var(--p1-text)" },
      { rx: 178, ry: 60,  fill: "var(--p2-soft)", stroke: "var(--p2)", label: "วงที่ 3 · ระดับหน่วยงานและหอผู้ป่วย", ly: 94, tc: "var(--p2-text)" },
      { rx: 118, ry: 36,  fill: "var(--accent-soft)", stroke: "var(--accent-text)", label: "วงที่ 4 · ผู้ป่วยเฉพาะกลุ่มโรค (CLT)", ly: 132, tc: "var(--accent-text)" }
    ];
    rings.forEach(function (r) {
      S("ellipse", { cx: cx, cy: cy, rx: r.rx, ry: r.ry, style: "fill:" + r.fill + ";stroke:" + r.stroke + ";stroke-width:1.5" }, g1);
      txt(g1, cx, r.ly, r.label, { anchor: "middle", fs: 12.8, fw: 600, fill: r.tc });
    });

    /* Step 2: 3-way Tracer Triangulation */
    card(g2, 16, 252, 608, 204, { fill: "var(--card)", stroke: "var(--line-strong)" });
    txt(g2, 320, 278, "การตามรอยคุณภาพบริการ (Tracer) ผสาน 3 มุมมองเพื่อเห็นความจริงหน้างาน", { anchor: "middle", fs: 14.2, fw: 600, fill: "var(--text-1)" });

    var tri = [
      { x: 30,  t: "1. ตรวจเอกสาร & ตัวชี้วัด", d: "ดู CPG, เวชระเบียน, สถิติอุบัติการณ์", c: "var(--p1)", tc: "var(--p1-text)" },
      { x: 228, t: "2. รับฟังคนทำงาน & ผู้ป่วย", d: "ถามด้วยความเข้าใจ ไม่จับผิด", c: "var(--p2)", tc: "var(--p2-text)" },
      { x: 426, t: "3. เดินดูหน้างานจริง (Gemba)", d: "สังเกตขั้นตอนจริงขณะปฏิบัติงาน", c: "var(--good)", tc: "var(--good-text)" }
    ];
    tri.forEach(function (v) {
      card(g2, v.x, 294, 184, 68, { rx: 10, fill: "var(--card-strong)", stroke: v.c, sw: 1.5 });
      txt(g2, v.x + 92, 319, v.t, { anchor: "middle", fs: 13, fw: 600, fill: v.tc });
      txt(g2, v.x + 92, 342, v.d, { anchor: "middle", fs: 12, fill: "var(--text-2)" });
      arrow(g2, v.x + 92, 364, 320, 386, { stroke: "var(--accent-text)", sw: 1.6, mk: "hud-arrow-acc" });
    });

    card(g2, 54, 388, 532, 54, { rx: 10, fill: "var(--accent-soft)", stroke: "var(--accent-text)", sw: 1.6 });
    txt(g2, 320, 411, "เผยช่องว่างสำคัญ: งานในคู่มือ (Work-as-Imagined) ≠ งานที่ทำได้จริงหน้างาน (Work-as-Done)", { anchor: "middle", fs: 13.2, fw: 600, fill: "var(--accent-text)" });
    txt(g2, 320, 431, "จุดที่คนหน้างานต้องปรับตัวเฉพาะหน้าเพื่อเอาตัวรอด คือเบาะแสทองคำของโจทย์ QIR", { anchor: "middle", fs: 12.2, fill: "var(--text-1)" });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s08: SSSFI Scoring Table + Action Priority Matrix (wide, 2 steps) ---------- */
  FIGS.s08 = function (host) {
    var svg = wideSvg(host, 400, "ตารางจัดลำดับความสำคัญด้วยเกณฑ์ SSSFI และตารางผลกระทบต่อความพยายาม");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    /* Left: SSSFI Table (Step 1) */
    card(g1, 16, 14, 624, 372, { fill: "var(--card)", stroke: "var(--line-strong)" });
    txt(g1, 36, 44, "ขั้นที่ 1 · ให้คะแนนโปร่งใสร่วมกับทีมด้วยเกณฑ์ 5 มิติ (SSSFI · เต็มด้านละ 5)", { fs: 15, fw: 600, fill: "var(--text-1)" });

    var cols = [
      { x: 36,  label: "รายการปัญหาที่พบจากหน้างาน", anchor: "start" },
      { x: 312, label: "Size", anchor: "middle" },
      { x: 368, label: "Sev", anchor: "middle" },
      { x: 424, label: "Stake", anchor: "middle" },
      { x: 480, label: "Feas", anchor: "middle" },
      { x: 536, label: "Imp", anchor: "middle" },
      { x: 596, label: "รวม", anchor: "middle" }
    ];
    S("rect", { x: 28, y: 60, width: 600, height: 34, rx: 8, style: "fill:var(--surface-2)" }, g1);
    cols.forEach(function (c) {
      txt(g1, c.x, 82, c.label, { anchor: c.anchor, fs: 12.8, fw: 600, fill: "var(--accent-text)" });
    });

    var rows = [
      { name: "1. ผู้ป่วยถอนสุรา (AWS) ชัก/รุนแรงในวอร์ด", sc: [4, 5, 5, 4, 5], sum: "23 ★", hi: true },
      { name: "2. เครื่องมือแพทย์ส่งซ่อมได้คืนเกิน 7 วัน", sc: [4, 4, 4, 4, 4], sum: "20", hi: false },
      { name: "3. รื้อโปรแกรมเวชระเบียนไอทีใหม่ทั้ง รพ.", sc: [5, 3, 3, 1, 4], sum: "16", hi: false }
    ];
    rows.forEach(function (r, idx) {
      var y = 106 + idx * 62;
      card(g1, 28, y, 600, 52, {
        rx: 9,
        fill: r.hi ? "var(--good-soft)" : "var(--card-strong)",
        stroke: r.hi ? "var(--good)" : "var(--line)"
      });
      txt(g1, 40, y + 31, r.name, { fs: 13, fw: r.hi ? 600 : 400, fill: "var(--text-1)" });
      r.sc.forEach(function (v, k) {
        txt(g1, cols[k + 1].x, y + 31, String(v), { anchor: "middle", fs: 14, fw: 500, fill: v <= 1 ? "var(--bad-text)" : "var(--text-1)" });
      });
      txt(g1, 596, y + 31, r.sum, { anchor: "middle", fs: 14.5, fw: 600, fill: r.hi ? "var(--good-text)" : "var(--text-2)" });
    });

    card(g1, 28, 302, 600, 68, { rx: 10, fill: "var(--p1-soft)", stroke: "var(--p1)" });
    txt(g1, 44, 327, "เสริมมุมมองกลุ่มผู้ป่วยสำคัญของทีมนำทางคลินิก (CLT / PCT Clinical Priority)", { fs: 13.2, fw: 600, fill: "var(--p1-text)" });
    txt(g1, 44, 350, "High Risk (เสี่ยงสูง) · High Volume (พบบ่อย) · High Cost (ต้นทุนสูง) · Complex Care (ซับซ้อนหลายวิชาชีพ)", { fs: 12.3, fill: "var(--text-1)" });

    /* Right: Action Priority Matrix (Step 2) */
    card(g2, 660, 14, 524, 372, { fill: "var(--card)", stroke: "var(--line-strong)" });
    txt(g2, 680, 44, "ขั้นที่ 2 · จัดวางบน Action Priority Matrix (กรอบ 4 สัปดาห์)", { fs: 15, fw: 600, fill: "var(--text-1)" });

    /* Axes */
    arrow(g2, 706, 344, 706, 68, { stroke: "var(--axis)", sw: 1.8 });
    arrow(g2, 706, 344, 1164, 344, { stroke: "var(--axis)", sw: 1.8 });
    txt(g2, 684, 206, "ผลกระทบสูง ↑", { anchor: "middle", fs: 12.5, fw: 600, fill: "var(--text-2)" }).setAttribute("transform", "rotate(-90 684 206)");
    txt(g2, 935, 372, "ความพยายาม / เวลาที่ใช้มากขึ้น →", { anchor: "middle", fs: 12.5, fw: 600, fill: "var(--text-2)" });

    /* 4 Quadrants */
    card(g2, 718, 72, 214, 124, { rx: 10, fill: "var(--good-soft)", stroke: "var(--good)", sw: 1.8 });
    txt(g2, 732, 97, "★ เห็นผลชัด ทำได้จริง (Quick Wins)", { fs: 13, fw: 600, fill: "var(--good-text)" });
    lines(g2, 732, 120, ["• ระบบคัดกรองและดูแล AWS", "• ปรับจุดคอขวดส่งซ่อมเฟส 1", "→ เหมาะที่สุดสำหรับ 4 สัปดาห์"], { fs: 12.2, lh: 19, fill: "var(--text-1)" });

    card(g2, 944, 72, 218, 124, { rx: 10, fill: "var(--p1-soft)", stroke: "var(--p1)" });
    txt(g2, 958, 97, "โครงการสำคัญระยะยาว (Major)", { fs: 13, fw: 600, fill: "var(--p1-text)" });
    lines(g2, 958, 120, ["• งานข้ามเครือข่ายอำเภอ", "• ตัดแบ่งเฉพาะเฟสวิเคราะห์", "  รากสาเหตุเพื่อส่งไม้ต่อ"], { fs: 12.2, lh: 19, fill: "var(--text-1)" });

    card(g2, 718, 208, 214, 122, { rx: 10, fill: "var(--card-strong)", stroke: "var(--neutral)" });
    txt(g2, 732, 234, "งานเสริมขนาดเล็ก (Fill-ins)", { fs: 13, fw: 600, fill: "var(--neutral-text)" });
    lines(g2, 732, 258, ["• ปรับป้ายบอกทางเฉพาะจุด", "• ใช้แรงน้อยแต่ผลกระทบจำกัด"], { fs: 12.2, lh: 19, fill: "var(--text-2)" });

    card(g2, 944, 208, 218, 122, { rx: 10, fill: "var(--bad-soft)", stroke: "var(--bad)" });
    txt(g2, 958, 234, "✗ เลี่ยงใน 4 สัปดาห์ (Hard Slogs)", { fs: 13, fw: 600, fill: "var(--bad-text)" });
    lines(g2, 958, 258, ["• รื้อระบบ HIS ใหม่ทั้งองค์กร", "• ต้องรอจัดซื้อข้ามปีงบประมาณ"], { fs: 12.2, lh: 19, fill: "var(--text-1)" });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s09: 6-Step Staircase to RQ & Efficacy vs Implementation Knowledge (2 steps) ---------- */
  FIGS.s09 = function (host) {
    var svg = mainSvg(host, 470, "เส้นทาง 6 ขั้นจากปัญหาหน้างานสู่คำถามวิจัย และความรู้เพื่อการดำเนินงาน");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    var steps6 = [
      { n: "1", t: "ระบุปัญหาหน้างาน", d: "เริ่มจากจุดสะดุดหรือตัวชี้วัดตกเกณฑ์", x: 18,  y: 16,  c: "var(--p1)" },
      { n: "2", t: "นิยามสภาพอุดมคติ", d: "มาตรฐาน CPG หรือเป้าหมายที่ควรเป็น", x: 226, y: 16,  c: "var(--p1)" },
      { n: "3", t: "ชี้ช่องว่างปฏิบัติจริง", d: "ขนาดความต่างระหว่างอุดมคติกับหน้างาน", x: 434, y: 16,  c: "var(--p2)" },
      { n: "4", t: "ระบุช่องว่างความรู้", d: "สิ่งที่ทีมยังไม่รู้คำตอบในบริบทพื้นที่", x: 18,  y: 136, c: "var(--p2)" },
      { n: "5", t: "สำรวจรากสาเหตุเป็นไปได้", d: "ตั้งสมมติฐานกลไกระบบที่ทำให้ติดขัด", x: 226, y: 136, c: "var(--accent-text)" },
      { n: "6", t: "กลั่นเป็นคำถามวิจัย", d: "คมชัด ตอบได้ด้วยข้อมูลจริงใน 4 สัปดาห์", x: 434, y: 136, c: "var(--good)" }
    ];

    steps6.forEach(function (st, idx) {
      card(g1, st.x, st.y, 188, 96, { rx: 11, fill: idx === 5 ? "var(--good-soft)" : "var(--card-strong)", stroke: st.c, sw: 1.5 });
      pill(g1, st.x + 28, st.y + 26, 30, 24, st.n, { fill: "var(--surface-2)", stroke: st.c, color: "var(--text-1)", fs: 12.5 });
      txt(g1, st.x + 50, st.y + 31, st.t, { fs: 13.4, fw: 600, fill: idx === 5 ? "var(--good-text)" : "var(--text-1)" });
      lines(g1, st.x + 16, st.y + 58, [st.d], { fs: 12.2, lh: 17, fill: "var(--text-2)" });
    });
    arrow(g1, 208, 64, 224, 64, { stroke: "var(--axis)" });
    arrow(g1, 416, 64, 432, 64, { stroke: "var(--axis)" });
    pathArrow(g1, "M 528 114 C 528 126, 112 122, 112 134", { stroke: "var(--accent-text)", sw: 1.6, mk: "hud-arrow-acc" });
    arrow(g1, 208, 184, 224, 184, { stroke: "var(--axis)" });
    arrow(g1, 416, 184, 432, 184, { stroke: "var(--good)", mk: "hud-arrow-good" });

    /* Step 2: Efficacy vs Implementation Knowledge */
    card(g2, 18, 256, 286, 198, { fill: "var(--card-strong)", stroke: "var(--neutral)", sw: 1.4 });
    txt(g2, 34, 284, "ความรู้เชิงหลักการ (Efficacy)", { fs: 14.2, fw: 600, fill: "var(--p1-text)" });
    txt(g2, 34, 306, '"ยาหรือหัตถการใดออกฤทธิ์ได้ผล?"', { fs: 13, fw: 500, fill: "var(--text-1)" });
    lines(g2, 34, 334, [
      "• พิสูจน์ชัดแล้วใน RCT และ CPG ระดับชาติ",
      "• เช่น ยา Diazepam ป้องกันชักจากถอนสุราได้",
      "• ยาลดความดันลดโรคหลอดเลือดสมองได้",
      "→ ไม่ต้องทำวิจัยซ้ำในเวลา 4 สัปดาห์"
    ], { fs: 12.4, lh: 21, fill: "var(--text-2)" });

    card(g2, 320, 256, 302, 198, { fill: "var(--accent-soft)", stroke: "var(--accent-text)", sw: 1.8 });
    txt(g2, 336, 284, "ความรู้เพื่อการดำเนินงาน (Implementation)", { fs: 14.2, fw: 600, fill: "var(--accent-text)" });
    txt(g2, 336, 306, '"ทำอย่างไรจึงนำแนวทางดีไปใช้ได้จริง?"', { fs: 13, fw: 500, fill: "var(--text-1)" });
    lines(g2, 336, 334, [
      "• ทำไม CPG ที่มีอยู่จึงใช้จริงติดขัดในเวรดึก?",
      "• ขั้นตอนใดไม่สอดคล้องกับภาระงานจริง?",
      "• ต้องปรับเวิร์กโฟลว์อย่างไรให้ทีมทำได้ง่าย?",
      "★ จุดโฟกัสแท้จริงของโครงการ QIR"
    ], { fs: 12.4, lh: 21, fill: "var(--text-1)" });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s10: Implementation Gap Lenses & Proctor Outcomes (2 steps) ---------- */
  FIGS.s10 = function (host) {
    var svg = mainSvg(host, 470, "มิติช่องว่างความรู้เพื่อการดำเนินงาน และผลลัพธ์การนำสู่การปฏิบัติของ Proctor");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    txt(g1, 20, 32, "3 เลนส์สำรวจช่องว่างการนำแนวทางไปใช้จริงอย่างเป็นวิทยาศาสตร์", { fs: 14.5, fw: 600, fill: "var(--text-1)" });

    var lenses = [
      { y: 46,  t: "1. บริบทภายในและภายนอก (CFIR Context)", d: "การสื่อสารข้ามแผนก · ภาระงานเวรดึก · ข้อจำกัดครอบครัวและชุมชนผู้ป่วย", c: "var(--p1)", tc: "var(--p1-text)", bg: "var(--p1-soft)" },
      { y: 116, t: "2. กลยุทธ์หลายองค์ประกอบ (Multi-faceted Strategy)", d: "ลำพังจัดอบรมไม่พอ ต้องผสานปรับขั้นตอนงาน + เตือนจุดเสี่ยง + พี่เลี้ยงหน้างาน", c: "var(--p2)", tc: "var(--p2-text)", bg: "var(--p2-soft)" },
      { y: 186, t: "3. แกนหลักทางคลินิก vs ส่วนยืดหยุ่นตามบริบท", d: "รักษา Core เวชปฏิบัติที่ห้ามตัดทอน แต่ปรับรูปแบบการทำงานให้เข้ากับกำลังคน รพ.", c: "var(--accent-text)", tc: "var(--accent-text)", bg: "var(--accent-soft)" }
    ];
    lenses.forEach(function (l) {
      card(g1, 20, l.y, 600, 60, { bar: l.c, fill: "var(--card-strong)", stroke: l.c, sw: 1.3 });
      txt(g1, 38, l.y + 25, l.t, { fs: 13.6, fw: 600, fill: l.tc });
      txt(g1, 38, l.y + 46, l.d, { fs: 12.4, fill: "var(--text-2)" });
    });

    /* Step 2: Proctor's Implementation Outcomes */
    card(g2, 20, 266, 600, 188, { fill: "var(--card)", stroke: "var(--good)", sw: 1.6 });
    txt(g2, 38, 294, "ผลลัพธ์ระยะต้นที่วัดได้จริงใน 4 สัปดาห์ (Implementation Outcomes · Proctor et al.)", { fs: 13.8, fw: 600, fill: "var(--good-text)" });

    var outs = [
      { t: "การยอมรับ", en: "Acceptability", d: "ทีมเห็นว่าดีน่าใช้" },
      { t: "ความเหมาะสม", en: "Appropriateness", d: "เข้ากับบริบท รพ." },
      { t: "ความเป็นไปได้", en: "Feasibility", d: "ทำทันจริงในเวร" },
      { t: "ความเที่ยงตรง", en: "Fidelity", d: "ครบตามแกนหลัก" },
      { t: "ความยั่งยืน", en: "Sustainability", d: "ทำต่อได้ระยะยาว" }
    ];
    outs.forEach(function (o, i) {
      var x = 34 + i * 116;
      card(g2, x, 312, 106, 86, { rx: 10, fill: "var(--card-strong)", stroke: i === 2 || i === 3 ? "var(--accent-text)" : "var(--good)" });
      txt(g2, x + 53, 337, o.t, { anchor: "middle", fs: 13, fw: 600, fill: "var(--text-1)" });
      txt(g2, x + 53, 355, o.en, { anchor: "middle", fs: 11.5, fill: "var(--good-text)" });
      txt(g2, x + 53, 378, o.d, { anchor: "middle", fs: 11.8, fill: "var(--text-2)" });
      if (i < 4) arrow(g2, x + 107, 355, x + 115, 355, { stroke: "var(--good)", sw: 1.5, mk: "hud-arrow-good" });
    });
    txt(g2, 320, 430, "เมื่อ Implementation Outcomes แข็งแรง → จึงนำไปสู่ความปลอดภัยและผลลัพธ์คลินิกของผู้ป่วย", { anchor: "middle", fs: 12.8, fw: 500, fill: "var(--accent-text)" });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s11: Funnel & Hourglass Literature Review + Scoping/Rapid Scope (2 steps) ---------- */
  FIGS.s11 = function (host) {
    var svg = mainSvg(host, 470, "โครงสร้างกรวยและนาฬิกาทรายของการทบทวนวรรณกรรม");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    var tiers = [
      { w: 560, y: 16,  h: 54, fill: "var(--p1-soft)", stroke: "var(--p1)", t: "1. ปูพื้นความสำคัญระดับประเทศและเขตสุขภาพ", s: "เช่น อัตราคุมความดันระดับชาติ (HDC 35.6%) เทียบกับข้อมูลจริงของอำเภอเรา (42%)", tc: "var(--p1-text)" },
      { w: 468, y: 80,  h: 54, fill: "var(--p2-soft)", stroke: "var(--p2)", t: "2. สังเคราะห์สิ่งที่วรรณกรรมและ CPG รู้แล้ว", s: "มาตรการมาตรฐานและปัจจัยที่งานวิจัยก่อนหน้าพบว่าส่งผลต่อปัญหา", tc: "var(--p2-text)" },
      { w: 376, y: 144, h: 54, fill: "var(--bad-soft)", stroke: "var(--bad)", t: "3. ชี้ช่องว่างความรู้ในบริบทหน้างานจริง", s: "สิ่งที่ยังไม่มีคำตอบชัดในระบบงานของโรงพยาบาลชุมชนแห่งนี้", tc: "var(--bad-text)" },
      { w: 296, y: 208, h: 52, fill: "var(--accent-soft)", stroke: "var(--accent-text)", t: "4. คำถามวิจัย & วัตถุประสงค์โครงการ", s: "เฉพาะเจาะจง วัดผลและเก็บข้อมูลตอบได้จริง", tc: "var(--accent-text)" },
      { w: 492, y: 272, h: 56, fill: "var(--good-soft)", stroke: "var(--good)", t: "5. ฐานนาฬิกาทราย (บทอภิปรายผลท้ายเล่ม)", s: "เชื่อมข้อค้นพบของเราขยายกลับไปอธิบายคุณค่าต่อระบบบริการสุขภาพ", tc: "var(--good-text)" }
    ];

    tiers.forEach(function (tr, i) {
      var x = 320 - tr.w / 2;
      card(g1, x, tr.y, tr.w, tr.h, { rx: 10, fill: tr.fill, stroke: tr.stroke, sw: 1.5 });
      txt(g1, 320, tr.y + 22, tr.t, { anchor: "middle", fs: 13.4, fw: 600, fill: tr.tc });
      txt(g1, 320, tr.y + 42, tr.s, { anchor: "middle", fs: 12, fill: "var(--text-1)" });
      if (i < 4) arrow(g1, 320, tr.y + tr.h, 320, tiers[i + 1].y, { stroke: "var(--axis)", sw: 1.6 });
    });

    /* Step 2: Epistemic Humility Callout */
    card(g2, 20, 348, 600, 106, { rx: 12, fill: "var(--card-strong)", stroke: "var(--accent-text)", sw: 1.7 });
    txt(g2, 38, 376, "ความถ่อมตนทางวิชาการภายใต้กรอบเวลา 4 สัปดาห์", { fs: 14.2, fw: 600, fill: "var(--accent-text)" });
    lines(g2, 38, 400, [
      "✓ ระบุขอบเขตตามจริงว่าเป็น Scoping & Rapid Review (คัดแนวทางหลัก + วรรณกรรมบริบทใกล้เคียง)",
      "✗ ไม่เขียนอ้างเกินจริงว่าเป็น Systematic Review เต็มรูปแบบซึ่งต้องคัดกรองงานวิจัยหลายเดือน"
    ], { fs: 12.6, lh: 21, fill: "var(--text-1)" });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s12: Conceptual Framework Blueprint & Theoretical Anchors (2 steps) ---------- */
  FIGS.s12 = function (host) {
    var svg = mainSvg(host, 470, "พิมพ์เขียวกรอบแนวคิดการวิจัยและตัวแบบทฤษฎีมาตรฐาน");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    /* Step 1: 3-domain dynamic framework */
    var boxes = [
      { y: 18,  t: "ปัจจัยระดับบุคคล (ผู้ป่วย/บุคลากร)", d: "ความรู้ ความตระหนัก ทักษะการดูแลตนเอง ความเหนื่อยล้า", c: "var(--p1)", tc: "var(--p1-text)" },
      { y: 104, t: "บริบทครอบครัวและชุมชน", d: "ผู้ดูแลหลัก ค่านิยมท้องถิ่น ระยะทางและค่าใช้จ่ายเดินทาง", c: "var(--p2)", tc: "var(--p2-text)" },
      { y: 190, t: "การจัดระบบบริการของโรงพยาบาล", d: "ขั้นตอนคัดกรอง แนวทางเวร ระบบนัดหมาย และการเชื่อม รพ.สต.", c: "var(--accent-text)", tc: "var(--accent-text)" }
    ];
    boxes.forEach(function (b) {
      card(g1, 18, b.y, 336, 72, { bar: b.c, fill: "var(--card-strong)", stroke: b.c, sw: 1.4 });
      txt(g1, 36, b.y + 27, b.t, { fs: 13.5, fw: 600, fill: b.tc });
      txt(g1, 36, b.y + 50, b.d, { fs: 12.2, fill: "var(--text-2)" });
      arrow(g1, 356, b.y + 36, 404, 140, { stroke: "var(--axis)", sw: 1.7 });
    });

    card(g1, 408, 64, 214, 152, { rx: 14, fill: "var(--good-soft)", stroke: "var(--good)", sw: 1.8 });
    txt(g1, 515, 98, "กระบวนการดูแลจริง", { anchor: "middle", fs: 14, fw: 600, fill: "var(--good-text)" });
    arrow(g1, 515, 110, 515, 138, { stroke: "var(--good)", sw: 1.8, mk: "hud-arrow-good" });
    txt(g1, 515, 162, "ผลลัพธ์คุณภาพบริการ", { anchor: "middle", fs: 14.2, fw: 600, fill: "var(--text-1)" });
    lines(g1, 515, 184, ["ความปลอดภัย · การคุมโรค", "ความพึงพอใจของทีม"], { anchor: "middle", fs: 12.2, lh: 18, fill: "var(--text-2)" });

    /* Step 2: 3 Theoretical Anchors */
    txt(g2, 20, 294, "ต่อยอดจากทฤษฎีมาตรฐานให้เหมาะกับธรรมชาติของโจทย์", { fs: 14.2, fw: 600, fill: "var(--text-1)" });
    var models = [
      { x: 18,  t: "Andersen Model", s: "การเข้าถึงและใช้บริการ", d: "ปัจจัยโน้มนำ · ปัจจัยเอื้อ · ความจำเป็นทางสุขภาพ", c: "var(--p1)", tc: "var(--p1-text)" },
      { x: 226, t: "HBM / TPB", s: "พฤติกรรมและการตัดสินใจ", d: "การรับรู้ความเสี่ยง อุปสรรค บรรทัดฐาน และการควบคุมได้", c: "var(--p2)", tc: "var(--p2-text)" },
      { x: 434, t: "สามเหลี่ยมเขยื้อนภูเขา", s: "งานชุมชนข้ามภาคส่วน", d: "สร้างความรู้วิชาการ + ขับเคลื่อนสังคม + นโยบายท้องถิ่น", c: "var(--accent-text)", tc: "var(--accent-text)" }
    ];
    models.forEach(function (m) {
      card(g2, m.x, 310, 188, 142, { topBar: m.c, fill: "var(--card-strong)", stroke: m.c, sw: 1.4 });
      txt(g2, m.x + 94, 340, m.t, { anchor: "middle", fs: 13.8, fw: 600, fill: m.tc });
      txt(g2, m.x + 94, 361, m.s, { anchor: "middle", fs: 12.4, fw: 500, fill: "var(--text-1)" });
      lines(g2, m.x + 94, 388, m.d.split(" · ").length > 1 ? m.d.split(" · ") : [m.d.slice(0, 24), m.d.slice(24)], { anchor: "middle", fs: 12, lh: 19, fill: "var(--text-2)" });
    });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s13: Research Question Drives Methods & Chronic Pain Diary Case (2 steps) ---------- */
  FIGS.s13 = function (host) {
    var svg = mainSvg(host, 460, "คำถามวิจัยกำหนดวิธีวิทยา และตัวอย่างสมุดบันทึกอาการปวดเรื้อรัง");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    pill(g1, 320, 34, 380, 38, "คำถามวิจัยเป็นตัวกำหนดสูงสุด (Research Question First)", {
      fill: "var(--accent-soft)", stroke: "var(--accent-text)", color: "var(--accent-text)", fs: 13.8
    });
    arrow(g1, 220, 54, 156, 82, { stroke: "var(--p1)", sw: 2 });
    arrow(g1, 420, 54, 484, 82, { stroke: "var(--p2)", sw: 2 });

    card(g1, 18, 86, 286, 108, { fill: "var(--p1-soft)", stroke: "var(--p1)", sw: 1.5 });
    txt(g1, 34, 113, "ถาม What / How many / ประสิทธิผล", { fs: 13.8, fw: 600, fill: "var(--p1-text)" });
    lines(g1, 34, 136, [
      "→ วิจัยเชิงปริมาณ (Quantitative · นิรนัย)",
      "วัดขนาดปัญหา ความถี่ เปรียบเทียบตัวเลข"
    ], { fs: 12.5, lh: 20, fill: "var(--text-1)" });

    card(g1, 336, 86, 286, 108, { fill: "var(--p2-soft)", stroke: "var(--p2)", sw: 1.5 });
    txt(g1, 352, 113, "ถาม How / Why / กลไกและบริบท", { fs: 13.8, fw: 600, fill: "var(--p2-text)" });
    lines(g1, 352, 136, [
      "→ วิจัยเชิงคุณภาพ (Qualitative · อุปนัย)",
      "เข้าใจประสบการณ์ เหตุผล และข้อติดขัดจริง"
    ], { fs: 12.5, lh: 20, fill: "var(--text-1)" });

    /* Step 2: Chronic Pain Diary Q1-Q5 */
    card(g2, 18, 212, 604, 234, { fill: "var(--card)", stroke: "var(--line-strong)" });
    txt(g2, 36, 240, "กรณีศึกษาเรื่องเดียวกัน: โครงการสมุดบันทึกอาการปวดเรื้อรังในคลินิกผู้ป่วยนอก", { fs: 13.8, fw: 600, fill: "var(--text-1)" });

    var qs = [
      { q: "คำถาม 1–2: ใช้สมุดแล้วคะแนนปวดลดลงกี่คะแนน และคุ้มค่าต้นทุนหรือไม่?", m: "เชิงปริมาณ (QUAN)", c: "var(--p1)", tc: "var(--p1-text)", bg: "var(--p1-soft)" },
      { q: "คำถาม 3–4: ผู้ป่วยใช้งานจริงอย่างไร และทำไมผู้สูงอายุบางรายจึงเลิกจดกลางคัน?", m: "เชิงคุณภาพ (QUAL)", c: "var(--p2)", tc: "var(--p2-text)", bg: "var(--p2-soft)" },
      { q: "คำถาม 5: ควรออกแบบสมุดและขั้นตอนคลินิกใหม่อย่างไรให้ใช้ได้จริงและลดปวดได้?", m: "ผสมผสาน (MMR)", c: "var(--good)", tc: "var(--good-text)", bg: "var(--good-soft)" }
    ];
    qs.forEach(function (item, idx) {
      var y = 256 + idx * 58;
      card(g2, 34, y, 572, 48, { rx: 9, fill: "var(--card-strong)", stroke: item.c });
      txt(g2, 48, y + 29, item.q, { fs: 12.4, fill: "var(--text-1)" });
      pill(g2, 532, y + 24, 128, 28, item.m, { fill: item.bg, stroke: item.c, color: item.tc, fs: 12 });
    });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s14: 3 Core Mixed Methods Designs (wide, 3 steps) ---------- */
  FIGS.s14 = function (host) {
    var svg = wideSvg(host, 400, "รูปแบบการวิจัยแบบผสมผสาน 3 รูปแบบหลัก");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg), g3 = S("g", {}, svg);

    /* Step 1: Convergent Parallel */
    card(g1, 18, 12, 1164, 112, { rx: 12, fill: "var(--good-soft)", stroke: "var(--good)", sw: 1.8 });
    txt(g1, 38, 40, "1. แบบคู่ขนานมาบรรจบกัน (Convergent Parallel Design) ★ เหมาะที่สุดกับกรอบเวลา 4 สัปดาห์", { fs: 14.8, fw: 600, fill: "var(--good-text)" });
    card(g1, 38, 54, 290, 56, { rx: 9, fill: "var(--card-strong)", stroke: "var(--p1)" });
    txt(g1, 183, 78, "เก็บข้อมูลเชิงปริมาณ (QUAN)", { anchor: "middle", fs: 13, fw: 600, fill: "var(--p1-text)" });
    txt(g1, 183, 98, "ทบทวนเวชระเบียน / นับสถิติหน้างาน", { anchor: "middle", fs: 12, fill: "var(--text-2)" });

    txt(g1, 350, 86, "+", { anchor: "middle", fs: 20, fw: 600, fill: "var(--good-text)" });

    card(g1, 372, 54, 290, 56, { rx: 9, fill: "var(--card-strong)", stroke: "var(--p2)" });
    txt(g1, 517, 78, "เก็บข้อมูลเชิงคุณภาพ (QUAL)", { anchor: "middle", fs: 13, fw: 600, fill: "var(--p2-text)" });
    txt(g1, 517, 98, "สัมภาษณ์ผู้ปฏิบัติงานและผู้ป่วยคู่ขนานกัน", { anchor: "middle", fs: 12, fill: "var(--text-2)" });

    arrow(g1, 668, 82, 720, 82, { stroke: "var(--good)", sw: 2.2, mk: "hud-arrow-good" });
    card(g1, 726, 54, 434, 56, { rx: 9, fill: "var(--card-strong)", stroke: "var(--good)", sw: 1.5 });
    txt(g1, 943, 78, "ผสานและเทียบเคียงผลลัพธ์ (Merge & Triangulate)", { anchor: "middle", fs: 13.2, fw: 600, fill: "var(--good-text)" });
    txt(g1, 943, 98, "เห็นทั้งขนาดความรุนแรงและเหตุผลเชิงลึกพร้อมกันภายในสัปดาห์ที่ 3", { anchor: "middle", fs: 12, fill: "var(--text-1)" });

    /* Step 2: Explanatory Sequential */
    card(g2, 18, 136, 1164, 102, { rx: 12, fill: "var(--card)", stroke: "var(--p1)", sw: 1.5 });
    txt(g2, 38, 163, "2. แบบต่อเนื่องเชิงอธิบาย (Explanatory Sequential · QUAN → qual)", { fs: 14.5, fw: 600, fill: "var(--p1-text)" });
    card(g2, 38, 176, 320, 50, { rx: 9, fill: "var(--card-strong)", stroke: "var(--p1)" });
    txt(g2, 198, 206, "1) วิเคราะห์ตัวเลข QUAN พบ 2 วอร์ดส่งซ่อมช้าผิดปกติ", { anchor: "middle", fs: 12.6, fill: "var(--text-1)" });
    arrow(g2, 362, 201, 412, 201, { stroke: "var(--axis)", sw: 2 });
    card(g2, 418, 176, 300, 50, { rx: 9, fill: "var(--card-strong)", stroke: "var(--accent-text)" });
    txt(g2, 568, 206, "2) เลือกกลุ่มเป้าหมายจำเพาะตามผลตัวเลข", { anchor: "middle", fs: 12.6, fill: "var(--accent-text)" });
    arrow(g2, 722, 201, 772, 201, { stroke: "var(--axis)", sw: 2 });
    card(g2, 778, 176, 382, 50, { rx: 9, fill: "var(--card-strong)", stroke: "var(--p2)" });
    txt(g2, 969, 206, "3) สัมภาษณ์เจาะลึก qual เพื่ออธิบายว่าทำไมจึงล่าช้า", { anchor: "middle", fs: 12.6, fill: "var(--p2-text)" });

    /* Step 3: Exploratory Sequential + Caution */
    card(g3, 18, 250, 1164, 96, { rx: 12, fill: "var(--card)", stroke: "var(--p2)", sw: 1.5 });
    txt(g3, 38, 276, "3. แบบต่อเนื่องเชิงสำรวจ (Exploratory Sequential · QUAL → quan)", { fs: 14.5, fw: 600, fill: "var(--p2-text)" });
    card(g3, 38, 288, 320, 46, { rx: 9, fill: "var(--card-strong)", stroke: "var(--p2)" });
    txt(g3, 198, 316, "1) สัมภาษณ์ QUAL ค้นหาประเด็นในภาษาท้องถิ่น", { anchor: "middle", fs: 12.6, fill: "var(--text-1)" });
    arrow(g3, 362, 311, 412, 311, { stroke: "var(--axis)", sw: 2 });
    card(g3, 418, 288, 300, 46, { rx: 9, fill: "var(--card-strong)", stroke: "var(--accent-text)" });
    txt(g3, 568, 316, "2) พัฒนาแบบสำรวจหรือเกณฑ์วัดที่ตรงบริบท", { anchor: "middle", fs: 12.6, fill: "var(--accent-text)" });
    arrow(g3, 722, 311, 772, 311, { stroke: "var(--axis)", sw: 2 });
    card(g3, 778, 288, 382, 46, { rx: 9, fill: "var(--card-strong)", stroke: "var(--p1)" });
    txt(g3, 969, 316, "3) เก็บตัวเลข quan วัดขนาดของประเด็นในวงกว้าง", { anchor: "middle", fs: 12.6, fill: "var(--p1-text)" });

    card(g3, 18, 356, 1164, 36, { rx: 8, fill: "var(--accent-soft)", stroke: "var(--accent-text)" });
    txt(g3, 600, 379, "ข้อพึงระวังสำคัญ: ข้อมูลตัดขวางกลุ่มตัวอย่างขนาดเล็กใน รพ. สะท้อนความสัมพันธ์และกลไกเชิงบริบท (Association) ไม่สรุปอ้างเกินจริงเป็นเหตุและผลเดี่ยว (Causation)", {
      anchor: "middle", fs: 12.6, fw: 600, fill: "var(--accent-text)"
    });

    return bindSteps(host, [g1, g2, g3]);
  };

  /* ---------- s15: Result Chain vs Theory of Change & Stocks/Flows (2 steps) ---------- */
  FIGS.s15 = function (host) {
    var svg = mainSvg(host, 470, "ห่วงโซ่ผลลัพธ์ ทฤษฎีการเปลี่ยนแปลง และภาระสะสมคงค้างเทียบกับกระแสไหล");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    /* Step 1: Linear Result Chain */
    card(g1, 16, 14, 608, 122, { fill: "var(--card)", stroke: "var(--line-strong)" });
    txt(g1, 34, 40, "ห่วงโซ่ผลลัพธ์เส้นตรง (Result Chain): มักเผลอทึกทักว่าได้ผลผลิตแล้วจะเกิดผลลัพธ์เอง", { fs: 13.5, fw: 600, fill: "var(--text-1)" });

    var rc = [
      { t: "ปัจจัยนำเข้า", e: "Inputs" },
      { t: "กิจกรรม", e: "Activities" },
      { t: "ผลผลิต", e: "Outputs" },
      { t: "ผลลัพธ์", e: "Outcomes" },
      { t: "ผลกระทบ", e: "Impact" }
    ];
    rc.forEach(function (r, i) {
      var x = 30 + i * 118;
      card(g1, x, 56, 102, 62, { rx: 9, fill: i >= 3 ? "var(--p1-soft)" : "var(--card-strong)", stroke: i === 2 ? "var(--accent-text)" : "var(--line-strong)" });
      txt(g1, x + 51, 82, r.t, { anchor: "middle", fs: 13, fw: 600, fill: "var(--text-1)" });
      txt(g1, x + 51, 102, r.e, { anchor: "middle", fs: 11.5, fill: "var(--muted)" });
      if (i < 4) arrow(g1, x + 103, 87, x + 117, 87, { stroke: i === 2 ? "var(--bad)" : "var(--axis)", dash: i === 2 ? "3 3" : null });
    });

    /* Step 2: Non-linear ToC + Stocks & Flows */
    card(g2, 16, 150, 608, 148, { fill: "var(--card-strong)", stroke: "var(--good)", sw: 1.5 });
    txt(g2, 34, 176, "ทฤษฎีการเปลี่ยนแปลง (Theory of Change): ต้องระบุเงื่อนไขและความเสี่ยงตรงรอยต่อ", { fs: 13.8, fw: 600, fill: "var(--good-text)" });

    card(g2, 34, 192, 274, 90, { rx: 9, fill: "var(--good-soft)", stroke: "var(--good)" });
    txt(g2, 48, 216, "✓ เงื่อนไขจำเป็น (Necessary Conditions)", { fs: 12.8, fw: 600, fill: "var(--good-text)" });
    lines(g2, 48, 238, ["• แบบประเมินสั้นใช้เวลา < 2 นาทีในเวร", "• มียาและอุปกรณ์พร้อมที่หอผู้ป่วยทันที"], { fs: 12.2, lh: 19, fill: "var(--text-1)" });

    card(g2, 326, 192, 282, 90, { rx: 9, fill: "var(--bad-soft)", stroke: "var(--bad)" });
    txt(g2, 340, 216, "⚠ ความเสี่ยงสกัดกั้น (Contextual Risks)", { fs: 12.8, fw: 600, fill: "var(--bad-text)" });
    lines(g2, 340, 238, ["• แพทย์เพิ่มพูนทักษะหมุนเวียนเปลี่ยนทุกเดือน", "• เคสฉุกเฉินล้นเวรดึกจนข้ามขั้นตอนทวนสอบ"], { fs: 12.2, lh: 19, fill: "var(--text-1)" });

    /* Stocks & Flows */
    card(g2, 16, 312, 608, 144, { fill: "var(--card)", stroke: "var(--p1)", sw: 1.5 });
    txt(g2, 34, 338, "มองพลวัตภาระสะสมคงค้าง vs กระแสไหลเข้า–ออก (Stocks & Flows)", { fs: 13.8, fw: 600, fill: "var(--p1-text)" });

    pill(g2, 106, 398, 144, 44, "กระแสไหลเข้า (Inflow)", { fill: "var(--bad-soft)", stroke: "var(--bad)", color: "var(--bad-text)", fs: 12.5 });
    arrow(g2, 180, 398, 218, 398, { stroke: "var(--bad)", sw: 2.2, mk: "hud-arrow-bad" });

    card(g2, 222, 360, 196, 76, { rx: 11, fill: "var(--p1-soft)", stroke: "var(--p1)", sw: 1.8 });
    txt(g2, 320, 392, "ภาระงาน/ผู้ป่วยค้างสะสม", { anchor: "middle", fs: 13.5, fw: 600, fill: "var(--p1-text)" });
    txt(g2, 320, 414, "(Stock ในระบบหอผู้ป่วย)", { anchor: "middle", fs: 12, fill: "var(--text-1)" });

    arrow(g2, 420, 398, 458, 398, { stroke: "var(--good)", sw: 2.2, mk: "hud-arrow-good" });
    pill(g2, 534, 398, 144, 44, "กระแสไหลออก (Outflow)", { fill: "var(--good-soft)", stroke: "var(--good)", color: "var(--good-text)", fs: 12.5 });
    txt(g2, 320, 448, "ลดภาระสะสมอย่างยั่งยืน ต้องชะลอเคสเสี่ยงไหลเข้าที่ต้นน้ำ ควบคู่กับการระบายที่ปลายน้ำ", { anchor: "middle", fs: 12, fill: "var(--accent-text)" });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s16: 4-Level Iceberg Model (2 steps) ---------- */
  FIGS.s16 = function (host) {
    var svg = mainSvg(host, 480, "กรอบการวิเคราะห์ปัญหาเชิงลึก 4 ระดับ ภูเขาน้ำแข็ง");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    /* Level 1: Events */
    S("polygon", { points: "170,18 470,18 504,108 136,108", style: "fill:var(--bad-soft);stroke:var(--bad);stroke-width:1.6" }, g1);
    txt(g1, 320, 46, "1. เหตุการณ์เฉพาะหน้า (Events) → ตอบสนองรายเวร (React)", { anchor: "middle", fs: 13.8, fw: 600, fill: "var(--bad-text)" });
    txt(g1, 320, 72, 'เช่น "คืนนี้ผู้ป่วยภาวะถอนสุราชักและสับสนรุนแรงในหอผู้ป่วยใน"', { anchor: "middle", fs: 12.5, fill: "var(--text-1)" });
    txt(g1, 320, 94, "ส่วนยอดพ้นน้ำที่มองเห็นง่ายที่สุด แต่แก้แค่ตรงนี้ปัญหาจะเกิดซ้ำ", { anchor: "middle", fs: 11.8, fill: "var(--text-2)" });

    /* Waterline */
    S("line", { x1: 16, y1: 124, x2: 624, y2: 124, style: "stroke:var(--p1-text);stroke-width:2;stroke-dasharray:8 5" }, g1);
    pill(g1, 548, 124, 136, 24, "ผิวน้ำการมองเห็น", { fill: "var(--card-strong)", stroke: "var(--p1-text)", color: "var(--p1-text)", fs: 11.8 });

    /* Level 2: Patterns */
    S("polygon", { points: "126,140 514,140 546,232 94,232", style: "fill:var(--p1-soft);stroke:var(--p1);stroke-width:1.6" }, g1);
    txt(g1, 320, 170, "2. แนวโน้มและแบบแผนตามเวลา (Patterns) → คาดการณ์ (Anticipate)", { anchor: "middle", fs: 13.8, fw: 600, fill: "var(--p1-text)" });
    lines(g1, 320, 196, [
      "ข้อมูลย้อนหลังชี้ว่าเกิดซ้ำบ่อยในเวรดึก วันหยุดยาว และผู้ป่วยแอดมิตด้วยโรคอื่นแต่มีประวัติดื่มสุรา"
    ], { anchor: "middle", fs: 12.4, lh: 18, fill: "var(--text-1)" });

    /* Step 2: Levels 3 & 4 */
    S("polygon", { points: "88,246 552,246 586,348 54,348", style: "fill:var(--p2-soft);stroke:var(--p2);stroke-width:1.6" }, g2);
    txt(g2, 320, 276, "3. โครงสร้างระบบงานและกติกา (Structures) → ออกแบบใหม่ (Design)", { anchor: "middle", fs: 13.8, fw: 600, fill: "var(--p2-text)" });
    lines(g2, 320, 300, [
      "ห้องฉุกเฉินยังไม่มีคำถามคัดกรองความเสี่ยงสุราแรกรับ · หอผู้ป่วยขาดใบประเมิน CIWA-Ar มาตรฐาน",
      "ทำให้การปรับขนาดยาขึ้นกับความคุ้นเคยของแพทย์เวรแต่ละคน และไม่มีระบบส่งต่อ รพ.สต."
    ], { anchor: "middle", fs: 12.2, lh: 19, fill: "var(--text-1)" });

    S("polygon", { points: "48,362 592,362 618,462 22,462", style: "fill:var(--accent-soft);stroke:var(--accent-text);stroke-width:1.8" }, g2);
    txt(g2, 320, 392, "4. แบบแผนความคิดและความเชื่อฝังใจ (Mental Models) → แปรเปลี่ยน (Transform)", { anchor: "middle", fs: 13.8, fw: 600, fill: "var(--accent-text)" });
    lines(g2, 320, 416, [
      'ความเชื่อเดิมที่มองว่า "ผู้ป่วยดื่มสุราทำตัวเองและไม่ร่วมมือ" จึงเน้นผูกยึดให้สงบพ้นเวร',
      "เปลี่ยนสู่มุมมองใหม่: ภาวะถอนสุราคือภาวะฉุกเฉินที่ป้องกันและดูแลต่อเนื่องร่วมกับครอบครัวได้"
    ], { anchor: "middle", fs: 12.2, lh: 19, fill: "var(--text-1)" });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s17: Gemba + Multi-Branch 5 Whys & Fishbone Diagram (2 steps) ---------- */
  FIGS.s17 = function (host) {
    var svg = mainSvg(host, 480, "การถามทำไมแบบแตกแขนงสาเหตุร่วม และแผนภูมิกระดูกปลา 6 หมวด");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    /* Step 1: Multi-branch 5 Whys */
    card(g1, 16, 14, 608, 206, { fill: "var(--card)", stroke: "var(--line-strong)" });
    txt(g1, 34, 40, "เดินดูหน้างานจริง (Gemba) + ถามทำไมแบบแตกแขนงสาเหตุร่วม (Multi-branch 5 Whys)", { fs: 13.6, fw: 600, fill: "var(--text-1)" });

    card(g1, 32, 92, 142, 62, { rx: 9, fill: "var(--bad-soft)", stroke: "var(--bad)" });
    lines(g1, 103, 118, ["เหตุการณ์:", "เติมน้ำมันผิดชนิด", "(หรือหยิบยาผิด)"], { anchor: "middle", fs: 12.2, fw: 600, lh: 16, fill: "var(--bad-text)" });

    arrow(g1, 176, 108, 218, 78, { stroke: "var(--p1)", sw: 1.8 });
    arrow(g1, 176, 138, 218, 166, { stroke: "var(--p2)", sw: 1.8 });

    card(g1, 222, 54, 184, 52, { rx: 8, fill: "var(--card-strong)", stroke: "var(--p1)" });
    lines(g1, 314, 76, ["ทำไมแขนง ก: หยิบหัวจ่ายสลับ", "→ สีหัวจ่ายคล้ายกัน วางสลับฝั่ง"], { anchor: "middle", fs: 11.8, lh: 17, fill: "var(--text-1)" });

    card(g1, 222, 140, 184, 52, { rx: 8, fill: "var(--card-strong)", stroke: "var(--p2)" });
    lines(g1, 314, 162, ["ทำไมแขนง ข: ไม่ทันทวนซ้ำ", "→ รถคิวยาวช่วงเปลี่ยนกะ ไม่มีป้ายย้ำ"], { anchor: "middle", fs: 11.8, lh: 17, fill: "var(--text-1)" });

    arrow(g1, 408, 80, 438, 106, { stroke: "var(--good)", sw: 1.8, mk: "hud-arrow-good" });
    arrow(g1, 408, 166, 438, 140, { stroke: "var(--good)", sw: 1.8, mk: "hud-arrow-good" });

    card(g1, 442, 74, 166, 98, { rx: 10, fill: "var(--good-soft)", stroke: "var(--good)", sw: 1.5 });
    lines(g1, 525, 102, ["รากเหง้าเชิงระบบ:", "ออกแบบสี/ตำแหน่งใหม่", "+ ระบบทวนสอบสั้นๆ", "(ไม่ใช่แค่ตัดเงินคน!)"], { anchor: "middle", fs: 12, fw: 600, lh: 18, fill: "var(--good-text)" });

    /* Step 2: Fishbone Diagram */
    card(g2, 16, 236, 608, 230, { fill: "var(--card-strong)", stroke: "var(--accent-text)", sw: 1.5 });
    txt(g2, 34, 262, "แผนภูมิกระดูกปลา (Fishbone Diagram): กางปัจจัย 6 หมวดก่อนเก็บข้อมูลพิสูจน์", { fs: 13.6, fw: 600, fill: "var(--accent-text)" });

    /* Central spine & fish head */
    arrow(g2, 46, 356, 476, 356, { stroke: "var(--accent-text)", sw: 2.6, mk: "hud-arrow-acc" });
    card(g2, 482, 322, 128, 68, { rx: 12, fill: "var(--accent-soft)", stroke: "var(--accent-text)", sw: 1.8 });
    lines(g2, 546, 350, ["ปัญหาคุณภาพ", "ที่วัดช่องว่างชัด"], { anchor: "middle", fs: 12.8, fw: 600, lh: 19, fill: "var(--accent-text)" });

    var topBones = [
      { x: 110, tx: 148, label: "1. บุคลากร", sub: "ความล้า / หมุนเวียนเวร", c: "var(--p1-text)" },
      { x: 250, tx: 288, label: "2. กระบวนการ", sub: "ขั้นตอนซับซ้อน / รอคอย", c: "var(--p2-text)" },
      { x: 390, tx: 428, label: "3. เครื่องมือและยา", sub: "ไม่พร้อมใช้ / หน้าตาคล้าย", c: "var(--good-text)" }
    ];
    topBones.forEach(function (b) {
      S("line", { x1: b.x, y1: 298, x2: b.tx, y2: 356, style: "stroke:var(--axis);stroke-width:1.8" }, g2);
      txt(g2, b.x, 286, b.label, { anchor: "middle", fs: 12.8, fw: 600, fill: b.c });
      txt(g2, b.x, 314, b.sub, { anchor: "middle", fs: 11.6, fill: "var(--text-2)" });
    });

    var botBones = [
      { x: 110, tx: 148, label: "4. สิ่งแวดล้อม", sub: "แออัด / เสียงดังเวรดึก", c: "var(--p1-text)" },
      { x: 250, tx: 288, label: "5. ระบบสารสนเทศ", sub: "ข้อมูลไม่เชื่อม รพ.สต.", c: "var(--p2-text)" },
      { x: 390, tx: 428, label: "6. การบริหารจัดการ", sub: "อัตรากำลัง / กติกางบ", c: "var(--good-text)" }
    ];
    botBones.forEach(function (b) {
      S("line", { x1: b.x, y1: 416, x2: b.tx, y2: 356, style: "stroke:var(--axis);stroke-width:1.8" }, g2);
      txt(g2, b.x, 434, b.label, { anchor: "middle", fs: 12.8, fw: 600, fill: b.c });
      txt(g2, b.x, 452, b.sub, { anchor: "middle", fs: 11.6, fill: "var(--text-2)" });
    });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s18: Two-Axis Swiss Cheese Defense Model (2 steps) ---------- */
  FIGS.s18 = function (host) {
    var svg = mainSvg(host, 470, "ตัวแบบเนยแข็งสวิสและการเสริมปราการป้องกันสองแกน");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    card(g1, 16, 14, 608, 228, { fill: "var(--card)", stroke: "var(--line-strong)" });
    txt(g1, 34, 40, "เมื่อรูโหว่เชิงระบบ (Latent) เรียงตรงกับความพลั้งเผลอหน้างาน (Active) อันตรายจึงทะลุถึงผู้ป่วย", { fs: 13.2, fw: 600, fill: "var(--text-1)" });

    var slices = [
      { x: 96,  t: "นโยบาย & เวร", hy: 136, c: "var(--p1)" },
      { x: 212, t: "ระบบยา & ไอที", hy: 136, c: "var(--p2)" },
      { x: 328, t: "แนวทางทีม", hy: 136, c: "var(--accent-text)" },
      { x: 444, t: "ทวนสอบด่านหน้า", hy: 136, c: "var(--bad)" }
    ];

    pill(g1, 52, 136, 62, 30, "ความเสี่ยง", { fill: "var(--bad-soft)", stroke: "var(--bad)", color: "var(--bad-text)", fs: 12 });

    slices.forEach(function (sl, idx) {
      card(g1, sl.x, 62, 86, 146, { rx: 10, fill: "var(--card-strong)", stroke: sl.c, sw: 1.6 });
      txt(g1, sl.x + 43, 84, sl.t, { anchor: "middle", fs: 11.8, fw: 600, fill: "var(--text-1)" });
      /* Unaligned harmless holes */
      S("circle", { cx: sl.x + 28 + (idx % 2) * 30, cy: idx % 2 ? 106 : 182, r: 9, style: "fill:var(--bg);stroke:var(--line)" }, g1);
      /* Aligned hazard hole */
      S("circle", { cx: sl.x + 43, cy: sl.hy, r: 13, style: "fill:var(--bg);stroke:var(--bad);stroke-width:1.5;stroke-dasharray:3 2" }, g1);
    });

    arrow(g1, 84, 136, 544, 136, { stroke: "var(--bad)", sw: 2.8, mk: "hud-arrow-bad" });
    card(g1, 548, 106, 66, 60, { rx: 9, fill: "var(--bad-soft)", stroke: "var(--bad)" });
    lines(g1, 581, 132, ["อันตราย", "ถึงผู้ป่วย"], { anchor: "middle", fs: 12, fw: 600, lh: 16, fill: "var(--bad-text)" });

    txt(g1, 200, 226, "← รูโหว่แฝงเชิงโครงสร้าง (Latent Conditions)", { anchor: "middle", fs: 12, fill: "var(--p1-text)" });
    txt(g1, 466, 226, "ความพลั้งเผลอด่านหน้า (Active Failures) →", { anchor: "middle", fs: 12, fill: "var(--bad-text)" });

    /* Step 2: Two-Axis Defense Closing the Holes */
    card(g2, 16, 258, 608, 198, { fill: "var(--good-soft)", stroke: "var(--good)", sw: 1.7 });
    txt(g2, 34, 286, "การเสริมปราการป้องกัน 2 แกนพร้อมกัน (Two-Axis Risk Prevention)", { fs: 14.2, fw: 600, fill: "var(--good-text)" });

    card(g2, 32, 302, 280, 138, { rx: 10, fill: "var(--card-strong)", stroke: "var(--good)", sw: 1.5 });
    txt(g2, 48, 328, "แกนที่ 1 · ปฏิบัติการคลินิกด่านหน้า", { fs: 13.5, fw: 600, fill: "var(--good-text)" });
    lines(g2, 48, 352, [
      "• แบบประเมินและเช็กลิสต์ที่สั้นกระชับ",
      "• ระบบทวนสอบอิสระจุดเสี่ยงสูง (Double-check)",
      "• การสื่อสารส่งเวรแบบมีโครงสร้างชัดเจน"
    ], { fs: 12.3, lh: 21, fill: "var(--text-1)" });

    card(g2, 328, 302, 280, 138, { rx: 10, fill: "var(--card-strong)", stroke: "var(--p1)", sw: 1.5 });
    txt(g2, 344, 328, "แกนที่ 2 · โครงสร้างบริหารสนับสนุน", { fs: 13.5, fw: 600, fill: "var(--p1-text)" });
    lines(g2, 344, 352, [
      "• ออกแบบบังคับกันพลาด (Forcing Functions)",
      "• แยกสี/ตำแหน่งยาเสี่ยงสูง (LASA) ให้ชัดเจน",
      "• จัดอัตรากำลังและซ่อมบำรุงเครื่องมือเชิงรุก"
    ], { fs: 12.3, lh: 21, fill: "var(--text-1)" });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s19: Shifting the Burden vs Chumphuang AWS Redesign (wide, 2 steps) ---------- */
  FIGS.s19 = function (host) {
    var svg = wideSvg(host, 400, "กับดักแก้ปัญหาเฉพาะหน้าเทียบกับการออกแบบระบบดูแลผู้ป่วยภาวะถอนสุรา");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    /* Left: Shifting the Burden ("ลิงแก้แห") */
    card(g1, 16, 14, 556, 372, { fill: "var(--bad-soft)", stroke: "var(--bad)", sw: 1.6 });
    txt(g1, 36, 44, 'กับดัก "ลิงแก้แห" (Shifting the Burden): แก้เฉพาะหน้าจนพอกภาระระยะยาว', { fs: 14.5, fw: 600, fill: "var(--bad-text)" });

    card(g1, 146, 66, 296, 56, { rx: 10, fill: "var(--card-strong)", stroke: "var(--bad)", sw: 1.5 });
    txt(g1, 294, 91, "อาการหน้างาน: ผู้ป่วยถอนสุรากระสับกระส่าย/ชัก", { anchor: "middle", fs: 13.2, fw: 600, fill: "var(--text-1)" });
    txt(g1, 294, 111, "เกิดกลางเวรดึกที่มีผู้ป่วยหนักหลายเตียง", { anchor: "middle", fs: 12, fill: "var(--text-2)" });

    arrow(g1, 294, 124, 294, 154, { stroke: "var(--bad)", sw: 2, mk: "hud-arrow-bad" });

    card(g1, 116, 158, 356, 62, { rx: 10, fill: "var(--card-strong)", stroke: "var(--accent-text)" });
    txt(g1, 294, 184, "ทางแก้เฉพาะหน้า: ผูกยึด + ฉีดยาสงบประสาทขนาดสูง", { anchor: "middle", fs: 13.2, fw: 600, fill: "var(--accent-text)" });
    txt(g1, 294, 206, "อาการโวยวายสงบลงชั่วคราวในเวรนั้น (ลดความตึงเครียดเฉพาะหน้า)", { anchor: "middle", fs: 12, fill: "var(--text-2)" });

    arrow(g1, 294, 222, 294, 254, { stroke: "var(--bad)", sw: 2, mk: "hud-arrow-bad" });

    card(g1, 56, 258, 476, 108, { rx: 10, fill: "var(--card-strong)", stroke: "var(--bad)", sw: 1.6 });
    txt(g1, 294, 284, "ผลข้างเคียงไม่พึงประสงค์ (Unintended Consequences)", { anchor: "middle", fs: 13.4, fw: 600, fill: "var(--bad-text)" });
    lines(g1, 294, 308, [
      "• เสี่ยงกดการหายใจ ปอดอักเสบสำลัก บาดเจ็บจากการผูกยึด นอน รพ. นานขึ้น",
      "• จำหน่ายกลับบ้านโดยไม่เชื่อมการบำบัดสุรา → กลับมาแอดมิตซ้ำวนลูปเดิม"
    ], { anchor: "middle", fs: 12.3, lh: 20, fill: "var(--text-1)" });

    pathArrow(g1, "M 56 312 C 24 312, 24 94, 142 94", { stroke: "var(--bad)", sw: 2, dash: "5 4", mk: "hud-arrow-bad" });

    /* Right: Chumphuang Structural Redesign */
    card(g2, 594, 14, 590, 372, { fill: "var(--good-soft)", stroke: "var(--good)", sw: 1.8 });
    txt(g2, 614, 44, "ทางออกเชิงโครงสร้าง: ออกแบบระบบดูแล AWS ไร้รอยต่อ (บทเรียน รพ.ชุมชน)", { fs: 14.5, fw: 600, fill: "var(--good-text)" });

    var aws = [
      { n: "ต้นน้ำ · ห้องฉุกเฉิน & OPD", d: "ซักประวัติคัดกรองความเสี่ยงดื่มสุราทุกราย แจ้งเตือนเฝ้าระวังตั้งแต่แรกรับก่อนเริ่มชัก", c: "var(--p1)", tc: "var(--p1-text)" },
      { n: "กลางน้ำ · หอผู้ป่วยใน (CIWA-Ar)", d: "ใช้แบบประเมินอาการมาตรฐานร่วมกัน ปรับขนาดยาตามคะแนนอาการจริงอย่างปลอดภัย", c: "var(--p2)", tc: "var(--p2-text)" },
      { n: "สิ่งแวดล้อมปลอดภัยของทีม", d: "จัดเตียงใกล้จุดสังเกตการณ์ เสริมวิตามินบี 1 ลดการผูกยึดและลดภาวะแทรกซ้อน", c: "var(--accent-text)", tc: "var(--accent-text)" },
      { n: "ปลายน้ำ · ชุมชน & รพ.สต.", d: "ให้คำปรึกษาครอบครัวก่อนจำหน่าย ส่งต่อข้อมูลให้ รพ.สต. ติดตามต่อเนื่องลดการดื่มซ้ำ", c: "var(--good)", tc: "var(--good-text)" }
    ];
    aws.forEach(function (st, i) {
      var y = 62 + i * 78;
      card(g2, 614, y, 550, 64, { bar: st.c, fill: "var(--card-strong)", stroke: st.c, sw: 1.4 });
      txt(g2, 632, y + 25, st.n, { fs: 13.5, fw: 600, fill: st.tc });
      txt(g2, 632, y + 47, st.d, { fs: 12.2, fill: "var(--text-1)" });
      if (i < 3) arrow(g2, 889, y + 64, 889, y + 78, { stroke: "var(--good)", sw: 1.8, mk: "hud-arrow-good" });
    });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s20: McKinsey 7S + PESTEL Environmental Scan (2 steps) ---------- */
  FIGS.s20 = function (host) {
    var svg = mainSvg(host, 470, "การวิเคราะห์ภายในด้วย McKinsey 7S และภายนอกด้วย PESTEL");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    /* Step 1: McKinsey 7S */
    card(g1, 16, 14, 608, 224, { fill: "var(--card)", stroke: "var(--p1)", sw: 1.5 });
    txt(g1, 34, 40, "สำรวจภายในองค์กรด้วย McKinsey 7S → สกัดจุดแข็ง (S) และจุดอ่อน (W)", { fs: 14, fw: 600, fill: "var(--p1-text)" });

    var cx = 230, cy = 138;
    var sNodes = [
      { x: 100, y: 78,  t: "Strategy (กลยุทธ์)", c: "var(--p1)" },
      { x: 360, y: 78,  t: "Structure (โครงสร้าง)", c: "var(--p1)" },
      { x: 404, y: 138, t: "Systems (ระบบงาน)", c: "var(--p1)" },
      { x: 360, y: 198, t: "Skills (ทักษะ)", c: "var(--p2)" },
      { x: 100, y: 198, t: "Staff (กำลังคน)", c: "var(--p2)" },
      { x: 56,  y: 138, t: "Style (ภาวะผู้นำ)", c: "var(--p2)" }
    ];
    sNodes.forEach(function (n) {
      S("line", { x1: cx, y1: cy, x2: n.x, y2: n.y, style: "stroke:var(--line-strong);stroke-width:1.2" }, g1);
    });
    pill(g1, cx, cy, 148, 38, "Shared Values (คุณค่าร่วม)", { fill: "var(--accent-soft)", stroke: "var(--accent-text)", color: "var(--accent-text)", fs: 12.2 });
    sNodes.forEach(function (n) {
      pill(g1, n.x, n.y, 128, 28, n.t, { fill: "var(--card-strong)", stroke: n.c, color: "var(--text-1)", fs: 11.8 });
    });

    card(g1, 476, 66, 132, 150, { rx: 10, fill: "var(--card-strong)", stroke: "var(--line-strong)" });
    txt(g1, 542, 94, "ผลที่ได้ภายใน", { anchor: "middle", fs: 13, fw: 600, fill: "var(--text-1)" });
    pill(g1, 542, 132, 108, 30, "จุดแข็ง (S)", { fill: "var(--good-soft)", stroke: "var(--good)", color: "var(--good-text)", fs: 12.8 });
    pill(g1, 542, 174, 108, 30, "จุดอ่อน (W)", { fill: "var(--bad-soft)", stroke: "var(--bad)", color: "var(--bad-text)", fs: 12.8 });

    /* Step 2: PESTEL */
    card(g2, 16, 254, 608, 202, { fill: "var(--card)", stroke: "var(--p2)", sw: 1.5 });
    txt(g2, 34, 280, "สำรวจบริบทภายนอกด้วย PESTEL → สกัดโอกาส (O) และอุปสรรค (T)", { fs: 14, fw: 600, fill: "var(--p2-text)" });

    var pestel = [
      { k: "P · Political", d: "นโยบายกระทรวง / ตัวชี้วัดเขต", x: 32,  y: 298 },
      { k: "E · Economic", d: "งบกองทุนตำบล (กปท.) / สิทธิ UC", x: 226, y: 298 },
      { k: "S · Social", d: "สังคมสูงวัย / ค่านิยมครอบครัว", x: 420, y: 298 },
      { k: "T · Technological", d: "ระบบหมอพร้อม / Telemedicine", x: 32,  y: 358 },
      { k: "E · Environmental", d: "พื้นที่ห่างไกล / ฤดูกาลเกษตร", x: 226, y: 358 },
      { k: "L · Legal", d: "ระเบียบพัสดุ / กฎหมายวิชาชีพ", x: 420, y: 358 }
    ];
    pestel.forEach(function (p) {
      card(g2, p.x, p.y, 182, 48, { rx: 8, fill: "var(--card-strong)", stroke: "var(--p2)" });
      txt(g2, p.x + 12, p.y + 20, p.k, { fs: 12.4, fw: 600, fill: "var(--p2-text)" });
      txt(g2, p.x + 12, p.y + 38, p.d, { fs: 11.6, fill: "var(--text-2)" });
    });

    txt(g2, 320, 434, "ได้ครบ S · W · O · T อย่างมีหลักฐานรองรับ → พร้อมนำไปจับคู่สร้างกลยุทธ์ในตาราง TOWS", { anchor: "middle", fs: 12.8, fw: 600, fill: "var(--accent-text)" });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s21: TOWS 4-Direction Matrix & Hospital Team Co-Design (wide, 2 steps) ---------- */
  FIGS.s21 = function (host) {
    var svg = wideSvg(host, 400, "ตารางจับคู่กลยุทธ์โทวส์ 4 ทิศทาง และการขัดเกลาร่วมกับทีมหน้างาน");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    /* Left: 2x2 TOWS Matrix */
    card(g1, 16, 14, 804, 372, { fill: "var(--card)", stroke: "var(--line-strong)" });
    txt(g1, 36, 44, "ตารางจับคู่ทางเลือกกลยุทธ์โทวส์ (TOWS Matrix · แปลง SWOT สู่แผนปฏิบัติการ)", { fs: 15, fw: 600, fill: "var(--text-1)" });

    var cells = [
      { x: 34,  y: 62, t: "SO · กลยุทธ์เชิงรุก (จุดแข็ง × โอกาส)", d1: "ใช้ทีมสหวิชาชีพที่เหนียวแน่นเชื่อมกับ รพ.สต.", d2: "ดึงงบกองทุนสุขภาพตำบลหนุนเยี่ยมบ้านต่อเนื่อง", c: "var(--good)", tc: "var(--good-text)", bg: "var(--good-soft)" },
      { x: 422, y: 62, t: "WO · กลยุทธ์เชิงแก้ไข (จุดอ่อน × โอกาส)", d1: "ดึงระบบแจ้งเตือนดิจิทัลของเขตสุขภาพมาช่วย", d2: "ทดแทนการตามงานซ่อม/นัดหมายด้วยกระดาษที่คนไม่พอ", c: "var(--p1)", tc: "var(--p1-text)", bg: "var(--p1-soft)" },
      { x: 34,  y: 218, t: "ST · กลยุทธ์เชิงป้องกัน (จุดแข็ง × อุปสรรค)", d1: "ใช้เครือข่าย อสม. คัดกรองและเตือนกลุ่มเสี่ยงล่วงหน้า", d2: "รับมือช่วงเทศกาลที่เคสฉุกเฉินและถอนสุราพุ่งสูง", c: "var(--p2)", tc: "var(--p2-text)", bg: "var(--p2-soft)" },
      { x: 422, y: 218, t: "WT · กลยุทธ์เชิงรับ (จุดอ่อน × อุปสรรค)", d1: "ตัดขั้นตอนบันทึกซ้ำซ้อนและกำหนดเกณฑ์ส่งต่อชัดเจน", d2: "เพื่อคุ้มครองความปลอดภัยผู้ป่วยในเวรดึกที่กำลังคนจำกัด", c: "var(--accent-text)", tc: "var(--accent-text)", bg: "var(--accent-soft)" }
    ];
    cells.forEach(function (c) {
      card(g1, c.x, c.y, 376, 144, { rx: 11, fill: c.bg, stroke: c.c, sw: 1.6 });
      txt(g1, c.x + 18, c.y + 30, c.t, { fs: 13.8, fw: 600, fill: c.tc });
      lines(g1, c.x + 18, c.y + 62, ["• " + c.d1, "• " + c.d2], { fs: 12.6, lh: 24, fill: "var(--text-1)" });
    });

    /* Right: Week 4 Co-design Loop */
    arrow(g2, 824, 200, 854, 200, { stroke: "var(--accent-text)", sw: 2.4, mk: "hud-arrow-acc" });
    card(g2, 858, 14, 326, 372, { fill: "var(--card-strong)", stroke: "var(--accent-text)", sw: 1.8 });
    txt(g2, 878, 44, "สัปดาห์ที่ 4 · ขัดเกลากับคนหน้างาน", { fs: 14.8, fw: 600, fill: "var(--accent-text)" });

    var co = [
      { t: "1. เปิดวงรับฟังอย่างถ่อมตน", d: "นำร่าง TOWS แลกเปลี่ยนกับพยาบาล เภสัชกร ช่าง และผู้บริหาร", c: "var(--p1)" },
      { t: "2. ปรับให้เข้ากับชีวิตหน้างานจริง", d: "ตรวจสอบความเป็นไปได้ในเวรจริง ตัดสิ่งที่เป็นภาระเกินจำเป็น", c: "var(--p2)" },
      { t: "3. สร้างความเป็นเจ้าของร่วม", d: "ส่งมอบเข้าคลัง OFI Pool และต่อยอดเป็น CQI / R2R ของ รพ.", c: "var(--good)" }
    ];
    co.forEach(function (step, idx) {
      var y = 66 + idx * 102;
      card(g2, 876, y, 290, 84, { bar: step.c, fill: "var(--card)", stroke: step.c });
      txt(g2, 894, y + 28, step.t, { fs: 13.4, fw: 600, fill: "var(--text-1)" });
      lines(g2, 894, y + 50, [step.d.slice(0, 32), step.d.slice(32)], { fs: 12, lh: 17, fill: "var(--text-2)" });
      if (idx < 2) arrow(g2, 1021, y + 84, 1021, y + 102, { stroke: "var(--axis)" });
    });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s22: 5-Block Policy Brief Blueprint (2 steps) ---------- */
  FIGS.s22 = function (host) {
    var svg = mainSvg(host, 460, "โครงสร้างเอกสารสังเคราะห์เชิงนโยบาย 5 องค์ประกอบ");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    card(g1, 24, 12, 592, 304, { rx: 14, fill: "var(--card)", stroke: "var(--line-strong)" });
    txt(g1, 44, 40, "พิมพ์เขียว Policy Brief (2–4 หน้า): สื่อสารให้ผู้บริหารตัดสินใจได้ทันที", { fs: 14.2, fw: 600, fill: "var(--text-1)" });

    var blocks = [
      { y: 54,  t: "1. ประเด็นหลัก 1 นาที (Key Message)", d: "เกิดปัญหาอะไร สำคัญอย่างไร และเสนอให้ตัดสินใจทำอะไรใน 3–4 บรรทัดแรก", c: "var(--accent-text)", tc: "var(--accent-text)" },
      { y: 116, t: "2. ขนาดและผลกระทบในโรงพยาบาลของเรา", d: "แสดงตัวเลขจริงของพื้นที่เทียบเกณฑ์ ผสานกรณีศึกษาและเสียงสะท้อนหน้างาน", c: "var(--p1)", tc: "var(--p1-text)" },
      { y: 178, t: "3. รากสาเหตุเชิงระบบที่ค้นพบจากข้อมูล", d: "ชี้จุดคอขวดของกระบวนการและโครงสร้างอย่างเป็นกลาง ไม่กล่าวโทษตัวบุคคล", c: "var(--p2)", tc: "var(--p2-text)" },
      { y: 240, t: "4. ทางเลือกปฏิบัติการและตารางเทียบข้อดี–ข้อเสีย", d: "เสนอ 2–3 ทางเลือก ระบุผู้รับผิดชอบ ทรัพยากรที่ใช้ และผลที่คาดว่าจะได้รับ", c: "var(--good)", tc: "var(--good-text)" }
    ];
    blocks.forEach(function (b) {
      card(g1, 42, b.y, 556, 52, { bar: b.c, fill: "var(--card-strong)", stroke: b.c });
      txt(g1, 60, b.y + 22, b.t, { fs: 13.2, fw: 600, fill: b.tc });
      txt(g1, 60, b.y + 41, b.d, { fs: 12, fill: "var(--text-2)" });
    });

    /* Step 2: Block 5 Epistemic Integrity & PDSA Follow-up */
    card(g2, 24, 330, 592, 116, { rx: 14, fill: "var(--accent-soft)", stroke: "var(--accent-text)", sw: 1.8 });
    txt(g2, 44, 358, "5. ความซื่อสัตย์ต่อขอบเขตข้อมูล & แผนวงจร PDSA รอบถัดไป (สร้างความน่าเชื่อถือจริง)", { fs: 13.8, fw: 600, fill: "var(--accent-text)" });
    lines(g2, 44, 384, [
      "• ระบุขนาดตัวอย่างและข้อจำกัดของการเก็บข้อมูลระยะสั้น 4 สัปดาห์อย่างตรงไปตรงมา",
      "• เสนอตัวชี้วัดติดตามผลระยะสั้น เพื่อให้ทีมโรงพยาบาลหมุนวงจร PDSA ทดสอบและปรับปรุงต่อได้ทันที"
    ], { fs: 12.5, lh: 22, fill: "var(--text-1)" });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s23: What / So What / Now What + Stay·Stop·Start & Kolb Cycle (2 steps) ---------- */
  FIGS.s23 = function (host) {
    var svg = mainSvg(host, 460, "การสะท้อนคิด 3 คำถาม Stay Stop Start และวงจรการเรียนรู้ของ Kolb");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg);

    var wsn = [
      { x: 18,  t: "1. What?", sub: "เห็นและเกิดอะไรขึ้นจริง", d: "ข้อเท็จจริง ตัวเลข และเหตุการณ์หน้างานที่สังเกตพบโดยไม่ด่วนตัดสิน", c: "var(--p1)", tc: "var(--p1-text)" },
      { x: 226, t: "2. So What?", sub: "มีความหมายอย่างไร", d: "สิ่งนี้เปลี่ยนมุมมองเดิมของเราต่อผู้ป่วย ทีม และระบบสุขภาพอย่างไร", c: "var(--p2)", tc: "var(--p2-text)" },
      { x: 434, t: "3. Now What?", sub: "จะลงมือทำอะไรต่อ", d: "แปลงบทเรียนเป็นการกระทำจริงทั้งต่อโรงพยาบาลและวิชาชีพแพทย์", c: "var(--accent-text)", tc: "var(--accent-text)" }
    ];
    wsn.forEach(function (w, i) {
      card(g1, w.x, 18, 188, 174, { topBar: w.c, fill: "var(--card-strong)", stroke: w.c, sw: 1.5 });
      txt(g1, w.x + 94, 52, w.t, { anchor: "middle", fs: 18, fw: 600, fill: w.tc });
      txt(g1, w.x + 94, 76, w.sub, { anchor: "middle", fs: 13, fw: 600, fill: "var(--text-1)" });
      lines(g1, w.x + 94, 108, [w.d.slice(0, 22), w.d.slice(22, 46), w.d.slice(46)], { anchor: "middle", fs: 12, lh: 19, fill: "var(--text-2)" });
      if (i < 2) arrow(g1, w.x + 190, 105, w.x + 206, 105, { stroke: "var(--axis)", sw: 1.8 });
    });

    /* Step 2: Stay / Stop / Start + Kolb Cycle */
    card(g2, 18, 214, 304, 232, { fill: "var(--card)", stroke: "var(--line-strong)" });
    txt(g2, 36, 242, "สรุปปฏิบัติการชัดเจน: Stay · Stop · Start", { fs: 13.8, fw: 600, fill: "var(--text-1)" });

    var sss = [
      { k: "Stay · รักษาไว้", d: "จุดแข็งและแนวปฏิบัติที่ดีอยู่แล้ว", c: "var(--good)", tc: "var(--good-text)", bg: "var(--good-soft)" },
      { k: "Stop · หยุดทำ", d: "งานซ้ำซ้อนหรือการกล่าวโทษรายบุคคล", c: "var(--bad)", tc: "var(--bad-text)", bg: "var(--bad-soft)" },
      { k: "Start · เริ่มทำใหม่", d: "นิสัยคิดเชิงระบบและฟังเสียงหน้างาน", c: "var(--accent-text)", tc: "var(--accent-text)", bg: "var(--accent-soft)" }
    ];
    sss.forEach(function (s, i) {
      var y = 258 + i * 58;
      card(g2, 34, y, 272, 48, { rx: 9, fill: s.bg, stroke: s.c });
      txt(g2, 48, y + 20, s.k, { fs: 12.8, fw: 600, fill: s.tc });
      txt(g2, 48, y + 38, s.d, { fs: 11.8, fill: "var(--text-1)" });
    });

    /* Kolb Cycle on Right */
    card(g2, 338, 214, 284, 232, { fill: "var(--card)", stroke: "var(--p1)", sw: 1.4 });
    txt(g2, 480, 242, "วงจรการเรียนรู้จากประสบการณ์ (Kolb)", { anchor: "middle", fs: 13.5, fw: 600, fill: "var(--p1-text)" });
    S("circle", { cx: 480, cy: 344, r: 66, style: "fill:none;stroke:var(--p1);stroke-width:1.6;stroke-dasharray:5 4" }, g2);
    pill(g2, 480, 274, 134, 28, "1. ประสบการณ์จริง", { fill: "var(--card-strong)", stroke: "var(--p1)", color: "var(--text-1)", fs: 11.8 });
    pill(g2, 554, 344, 114, 28, "2. สะท้อนคิด", { fill: "var(--card-strong)", stroke: "var(--p2)", color: "var(--text-1)", fs: 11.8 });
    pill(g2, 480, 414, 134, 28, "3. ตกผลึกแนวคิด", { fill: "var(--card-strong)", stroke: "var(--accent-text)", color: "var(--text-1)", fs: 11.8 });
    pill(g2, 406, 344, 114, 28, "4. ทดลองทำใหม่", { fill: "var(--card-strong)", stroke: "var(--good)", color: "var(--text-1)", fs: 11.8 });

    return bindSteps(host, [g1, g2]);
  };

  /* ---------- s24: Single, Double, Triple-Loop Learning & WHO LHS (wide, 3 steps) ---------- */
  FIGS.s24 = function (host) {
    var svg = wideSvg(host, 410, "การเรียนรู้สามวงจร และระบบสุขภาพแห่งการเรียนรู้ขององค์การอนามัยโลก");
    var g1 = S("g", {}, svg), g2 = S("g", {}, svg), g3 = S("g", {}, svg);

    /* Forward Causal Chain across top-left (always visible from Step 1) */
    var chain = [
      { x: 24,  w: 184, t: "คุณค่าหลัก & บริบท", s: "Core Values & Context", c: "var(--accent-text)" },
      { x: 234, w: 196, t: "สมมติฐาน & นโยบาย", s: "Governing Assumptions", c: "var(--p2)" },
      { x: 456, w: 176, t: "การกระทำ & ขั้นตอน", s: "Actions & Routines", c: "var(--p1)" },
      { x: 658, w: 156, t: "ผลลัพธ์ที่เกิดขึ้น", s: "System Results", c: "var(--good)" }
    ];
    chain.forEach(function (b, i) {
      card(g1, b.x, 32, b.w, 76, { rx: 12, fill: "var(--card-strong)", stroke: b.c, sw: 1.6 });
      txt(g1, b.x + b.w / 2, 62, b.t, { anchor: "middle", fs: 14, fw: 600, fill: "var(--text-1)" });
      txt(g1, b.x + b.w / 2, 84, b.s, { anchor: "middle", fs: 11.8, fill: "var(--muted)" });
      if (i < 3) arrow(g1, b.x + b.w + 2, 70, chain[i + 1].x - 2, 70, { stroke: "var(--axis)", sw: 2 });
    });

    /* Step 1: Single-Loop Learning (Results -> Actions) */
    pathArrow(g1, "M 720 110 C 720 186, 544 186, 544 112", { stroke: "var(--p1)", sw: 2.4 });
    card(g1, 474, 156, 338, 62, { rx: 10, fill: "var(--p1-soft)", stroke: "var(--p1)", sw: 1.5 });
    txt(g1, 643, 181, "วงจรที่ 1 · Single-Loop (React · ปรับขั้นตอน)", { anchor: "middle", fs: 13.4, fw: 600, fill: "var(--p1-text)" });
    txt(g1, 643, 202, '"ทำตามวิธีเดิมได้ถูกต้องหรือยัง?" (เช่น จัดตะกร้ายาใหม่)', { anchor: "middle", fs: 12, fill: "var(--text-1)" });

    /* Step 2: Double-Loop Learning (Results -> Assumptions) */
    pathArrow(g2, "M 748 110 C 748 278, 332 278, 332 112", { stroke: "var(--p2)", sw: 2.5 });
    card(g2, 266, 240, 488, 64, { rx: 10, fill: "var(--p2-soft)", stroke: "var(--p2)", sw: 1.6 });
    txt(g2, 510, 266, "วงจรที่ 2 · Double-Loop (Rethink · ทบทวนสมมติฐานและนโยบาย)", { anchor: "middle", fs: 13.5, fw: 600, fill: "var(--p2-text)" });
    txt(g2, 510, 288, '"กติกาเดิมยังใช่สิ่งที่ถูกต้องไหม?" (เช่น เปลี่ยนเป็นระบบรับยาใกล้บ้าน รพ.สต.)', { anchor: "middle", fs: 12.2, fill: "var(--text-1)" });

    /* Step 3: Triple-Loop Learning (Results -> Core Values) + WHO LHS Panel */
    pathArrow(g3, "M 780 110 C 780 370, 116 370, 116 112", { stroke: "var(--accent-text)", sw: 2.6, mk: "hud-arrow-acc" });
    card(g3, 56, 326, 706, 66, { rx: 10, fill: "var(--accent-soft)", stroke: "var(--accent-text)", sw: 1.8 });
    txt(g3, 409, 352, "วงจรที่ 3 · Triple-Loop (Transform · หล่อหลอมคุณค่าหลักและตัวตนวิชาชีพ)", { anchor: "middle", fs: 13.6, fw: 600, fill: "var(--accent-text)" });
    txt(g3, 409, 374, '"เราใช้หลักคุณค่าใดตัดสินว่าอะไรคือเป้าหมายแท้จริง?" (คืนศักดิ์ศรีความเป็นมนุษย์และออกแบบระบบร่วมกับชุมชน)', { anchor: "middle", fs: 12.2, fill: "var(--text-1)" });

    /* Right panel: WHO Learning Health Systems */
    card(g3, 840, 32, 342, 360, { rx: 14, fill: "var(--card-strong)", stroke: "var(--good)", sw: 1.8 });
    txt(g3, 860, 62, "ระบบสุขภาพแห่งการเรียนรู้ (WHO LHS)", { fs: 14.5, fw: 600, fill: "var(--good-text)" });
    lines(g3, 860, 88, [
      "เชื่อม 3 พันธกิจหมุนวนไม่แยกส่วน:",
      "1) ข้อมูลข่าวสารหน้างาน (Information)",
      "2) การไตร่ตรองร่วมกัน (Deliberation)",
      "3) การลงมือปรับระบบจริง (Action)"
    ], { fs: 12.6, lh: 22, fill: "var(--text-1)" });

    card(g3, 858, 192, 306, 108, { rx: 10, fill: "var(--good-soft)", stroke: "var(--good)" });
    txt(g3, 874, 218, "เกิดการเรียนรู้เชื่อมกันทั้ง 4 ระดับ", { fs: 13, fw: 600, fill: "var(--good-text)" });
    lines(g3, 874, 242, [
      "• ระดับบุคคล (แพทย์/พยาบาล) ↔ ระดับทีม",
      "• ระดับองค์กร รพ. ↔ ระดับเครือข่ายชุมชน"
    ], { fs: 12.2, lh: 21, fill: "var(--text-1)" });

    txt(g3, 1011, 334, "เลือกใช้วงจรการเรียนรู้ให้เหมาะกับ", { anchor: "middle", fs: 12.5, fw: 600, fill: "var(--accent-text)" });
    txt(g3, 1011, 356, "ระดับความซับซ้อนของโจทย์หน้างาน", { anchor: "middle", fs: 12.5, fw: 600, fill: "var(--accent-text)" });

    return bindSteps(host, [g1, g2, g3]);
  };

  /* ---------- Populate #s25-qr closing card after deck render ---------- */
  if (HOOKS && HOOKS.afterRender) {
    HOOKS.afterRender.push(function () {
      var box = document.getElementById("s25-qr");
      if (!box) return;
      var td = window.TALKDATA || {};
      var siteUrl = td.siteUrl || "https://smartwoo.github.io/qir-slides/";
      var guideUrl = td.guideUrl || "guide.html";
      var repoUrl = td.repoUrl || "https://github.com/smartwoo/qir-slides";
      var qr = td.qrSvg || "";
      box.innerHTML =
        '<div class="qr">' + qr + '</div>' +
        '<p><b>สแกนเปิดสไลด์ &amp; เอกสารคำสอน</b><br>อ่านบทบรรยายรายสไลด์และตำราแบบ Guided Learning ฉบับเต็ม</p>' +
        '<a class="url" href="' + siteUrl + '" target="_blank" rel="noopener">' + siteUrl.replace(/^https?:\/\//, "") + '</a>' +
        '<a class="back-site" href="' + guideUrl + '" style="justify-content:center;margin-top:4px">เปิดอ่านเอกสารคำสอน →</a>' +
        '<a class="url" href="' + repoUrl + '" target="_blank" rel="noopener" style="font-size:12px;opacity:.85">github.com/smartwoo/qir-slides</a>';
    });
  }
})();
