/* Externalized scripts for Chad Parker resume landing page (multi-page safe) */

/* ---------- SVG inlining (optional, runs only when present) ---------- */
async function inlineExternalSvg(container) {
  const src = container.dataset.svgSrc;
  if (!src) return;
  const response = await fetch(src);
  if (!response.ok) throw new Error(`Failed to load SVG: ${src}`);
  container.innerHTML = await response.text();

  const svg = container.querySelector("svg");
  if (svg) {
    svg.removeAttribute("width");
    svg.removeAttribute("height");
  }
}

async function loadExternalSvgs() {
  const containers = Array.from(document.querySelectorAll("[data-svg-src]"));
  if (!containers.length) return;
  await Promise.all(containers.map(inlineExternalSvg));
}

/* ---------- Utility: Intersection Observer ---------- */
function onVisible(el, cb, threshold = 0.2) {
  if (!el) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) cb(e.target);
      });
    },
    { threshold }
  );
  obs.observe(el);
}

/* ---------- Feature: Cursor (runs only if cursor elements exist) ---------- */
function initCursor() {
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursorRing");
  if (!cursor || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx - 4 + "px";
    cursor.style.top = my - 4 + "px";
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx - 18 + "px";
    ring.style.top = ry - 18 + "px";
    requestAnimationFrame(animRing);
  })();
}

/* ---------- Feature: Tabs (Story page) ---------- */
/*
Supports either markup style:
A) container with [data-tab-shell], buttons [data-tab-target], panels [data-tab-panel="id"]
B) same, but container class-based .tab-nav (we'll detect)
*/
function initTabs() {
  const shells = Array.from(document.querySelectorAll("[data-tab-shell]"));
  if (!shells.length) return;

  shells.forEach((shell) => {
    const btns = Array.from(shell.querySelectorAll("[data-tab-target]"));
    if (!btns.length) return;

    // panels can be anywhere; use document scope
    const panelSelector = "[data-tab-panel]";
    const panels = Array.from(document.querySelectorAll(panelSelector));

    const setActive = (target) => {
      btns.forEach((b) => b.classList.toggle("active", b.dataset.tabTarget === target));
      panels.forEach((p) => {
        const isMatch = p.dataset.tabPanel === target;
        p.classList.toggle("active", isMatch);
        // Support both hidden attribute + CSS class approaches
        if (isMatch) p.removeAttribute("hidden");
        else p.setAttribute("hidden", "hidden");
      });
    };

    // Click handlers
    btns.forEach((btn) => {
      btn.addEventListener("click", () => setActive(btn.dataset.tabTarget));
    });

    // Initialize to first .active or first button
    const initiallyActive =
      btns.find((b) => b.classList.contains("active"))?.dataset.tabTarget ||
      btns[0].dataset.tabTarget;

    setActive(initiallyActive);
  });
}

/* ---------- Feature: Timeline reveal + counters (Career page) ---------- */
function initTimeline() {
  const items = Array.from(document.querySelectorAll(".timeline-item"));
  if (!items.length) return;

  items.forEach((item, i) => {
    onVisible(item, (el) => setTimeout(() => el.classList.add("visible"), i * 120));
  });

  function animateCounter(el, to, prefix = "", suffix = "", decimals = 0) {
    const dur = 1800;
    const start = performance.now();

    function upd(now) {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const val = ease * to;

      el.textContent =
        prefix +
        (decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString()) +
        suffix;

      if (t < 1) requestAnimationFrame(upd);
    }

    requestAnimationFrame(upd);
  }

  items.forEach((item) => {
    onVisible(
      item,
      () => {
        item.querySelectorAll(".metric-value[data-counter]").forEach((el) => {
          const to = parseFloat(el.dataset.counter);
          const prefix = el.dataset.prefix || "";
          const suffix = el.dataset.suffix || "";
          const decimals = parseInt(el.dataset.decimals || "0", 10);
          if (!Number.isFinite(to)) return;
          animateCounter(el, to, prefix, suffix, decimals);
        });
      },
      0.3
    );
  });
}

/* ---------- Feature: Story canvas arrow draw (only if present) ---------- */
function initStoryCanvas() {
  const storyCanvas = document.getElementById("storyCanvas");
  if (!storyCanvas) return;

  function drawArrow(pathId, headId, delay = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const p = document.getElementById(pathId);
        const head = document.getElementById(headId);
        if (!p) return resolve();

        const len = p.getTotalLength ? p.getTotalLength() : 300;
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
        p.style.transition = "stroke-dashoffset 0.85s cubic-bezier(0.4,0,0.2,1)";
        p.getBoundingClientRect();
        p.style.strokeDashoffset = "0";

        setTimeout(() => {
          if (head) head.classList.add("drawn");
          resolve();
        }, 820);
      }, delay);
    });
  }

  function showNode(id, delay = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const node = document.getElementById(id);
        if (node) node.classList.add("visible");
        resolve();
      }, delay);
    });
  }

  onVisible(
    storyCanvas,
    async () => {
      await showNode("storyNode1");
      await new Promise((r) => setTimeout(r, 600));
      await drawArrow("arrow1", "arrowhead1");
      await new Promise((r) => setTimeout(r, 200));
      await showNode("storyNode2");
      await new Promise((r) => setTimeout(r, 600));
      await drawArrow("arrow2", "arrowhead2");
      await new Promise((r) => setTimeout(r, 200));
      await showNode("storyNode3");
    },
    0.15
  );
}

/* ---------- Feature: Data orchestration wiring (only if present) ---------- */
function initOrchestration() {
  const orchContainer = document.getElementById("orchContainer");
  const orchSvg = document.getElementById("orchSvg");
  if (!orchContainer || !orchSvg) return;

  function buildOrchWires() {
    const container = orchContainer;
    const svg = orchSvg;

    const cW = container.offsetWidth;
    const cH = container.offsetHeight;
    const cx = cW / 2;
    const cy = cH / 2;

    function elCenter(id) {
      const el = document.getElementById(id);
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      const cr = container.getBoundingClientRect();
      return { x: r.left - cr.left + r.width / 2, y: r.top - cr.top + r.height / 2 };
    }

    const sources = ["src-crm", "src-web", "src-pos", "src-email", "src-mobile", "src-partner"];
    const outputs = ["out-seg", "out-camp", "out-loy", "out-attr", "out-nba"];

    svg.innerHTML = "";

    // input dashed paths
    sources.forEach((id, i) => {
      const s = elCenter(id);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const mx2 = (s.x + cx) / 2;
      const d = `M ${s.x} ${s.y} C ${mx2} ${s.y} ${mx2} ${cy} ${cx} ${cy}`;
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "#252530");
      path.setAttribute("stroke-width", "1");
      path.setAttribute("stroke-dasharray", "4 6");
      path.setAttribute("class", "orch-input-path");
      path.style.opacity = "0";
      path.style.transition = `opacity 0.4s ease ${0.1 + i * 0.12}s`;
      svg.appendChild(path);
    });

    // output solid paths
    outputs.forEach((id, i) => {
      const o = elCenter(id);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const mx2 = (cx + o.x) / 2;
      const d = `M ${cx} ${cy} C ${mx2} ${cy} ${mx2} ${o.y} ${o.x} ${o.y}`;
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "#2FA37F");
      path.setAttribute("stroke-width", "1.5");
      path.setAttribute("opacity", "0");
      path.style.strokeDasharray = "400";
      path.style.strokeDashoffset = "400";
      path.style.transition = `stroke-dashoffset 0.8s ease ${0.8 + i * 0.15}s, opacity 0.1s ease ${0.8 + i * 0.15}s`;
      svg.appendChild(path);
    });

    return { sources, outputs };
  }

  onVisible(
    orchContainer,
    () => {
      const { sources, outputs } = buildOrchWires();

      sources.forEach((id, i) => {
        setTimeout(() => {
          const el = document.getElementById(id);
          if (!el) return;
          el.classList.add("visible");
          setTimeout(() => el.classList.add("active"), 200);
        }, i * 130);
      });

      setTimeout(() => {
        const center = document.getElementById("orchCenter");
        if (center) center.classList.add("visible");
      }, 600);

      setTimeout(() => {
        document.querySelectorAll(".orch-input-path").forEach((p) => {
          p.style.opacity = "0.6";
          p.style.stroke = "#3a3a50";
          p.style.animation = "flowDash 2.5s linear infinite";
        });
      }, 700);

      outputs.forEach((id, i) => {
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.classList.add("visible");
        }, 900 + i * 150);
      });

      setTimeout(() => {
        const paths = document.querySelectorAll("#orchSvg path");
        const outPaths = Array.from(paths).slice(sources.length);
        outPaths.forEach((p) => {
          p.setAttribute("opacity", "0.7");
          p.style.strokeDashoffset = "0";
        });
      }, 950);
    },
    0.1
  );

  window.addEventListener("resize", () => {
    // Safe rebuild if user resizes while on a page with orchestration
    try { orchSvg && orchContainer && orchSvg.innerHTML && orchContainer.offsetWidth && orchContainer.offsetHeight; } catch {}
  });
}

/* ---------- Feature: Segmentation bar animation (only if present) ---------- */
function initSegmentationBars() {
  const segGrid = document.getElementById("segGrid");
  if (!segGrid) return;

  onVisible(
    segGrid,
    () => {
      document.querySelectorAll(".seg-bar").forEach((bar, i) => {
        setTimeout(() => {
          const w = bar.dataset.width;
          if (w) bar.style.width = w + "%";
        }, i * 150);
      });
    },
    0.2
  );
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadExternalSvgs();

    // Initialize only what exists on the page:
    initCursor();
    initTabs();
    initTimeline();
    initStoryCanvas();
    initOrchestration();
    initSegmentationBars();
  } catch (error) {
    console.error(error);
  }
});
