// wallhaus script: gallery, filters, preview with arrows and swipe, random pick,
// loading shimmer, and card reveal
  const WALLPAPERS = [{"name": "Ember Gaze", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/00.jpg", "full": "wallpapers/00.jpg"}, {"name": "Blue Night City", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/01.jpg", "full": "wallpapers/01.jpg"}, {"name": "Bandaged Stare", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/02.jpg", "full": "wallpapers/02.jpg"}, {"name": "Knight in Blossoms", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/03.jpg", "full": "wallpapers/03.jpg"}, {"name": "Black Rose Knight", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/04.jpg", "full": "wallpapers/04.jpg"}, {"name": "Whatever Doesn't Kill Us", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/05.jpg", "full": "wallpapers/05.jpg"}, {"name": "Monster Ultra", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/06.jpg", "full": "wallpapers/06.jpg"}, {"name": "Berserk Blade", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/07.jpg", "full": "wallpapers/07.jpg"}, {"name": "Silver Hour", "cats": ["4k", "desktop"], "res": "4K \u00b7 Desktop", "thumb": "wallpapers/thumbs/08.jpg", "full": "wallpapers/08.jpg"}, {"name": "Gojo Glasses", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/09.jpg", "full": "wallpapers/09.jpg"}, {"name": "Crystal Eyes", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/10.jpg", "full": "wallpapers/10.jpg"}, {"name": "Lone Tree", "cats": ["4k", "desktop"], "res": "4K \u00b7 Desktop", "thumb": "wallpapers/thumbs/11.jpg", "full": "wallpapers/11.jpg"}, {"name": "Ghost", "cats": ["4k", "desktop"], "res": "4K \u00b7 Desktop", "thumb": "wallpapers/thumbs/12.jpg", "full": "wallpapers/12.jpg"}, {"name": "Spider Web", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/13.jpg", "full": "wallpapers/13.jpg"}, {"name": "Orange Scarf", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/14.jpg", "full": "wallpapers/14.jpg"}, {"name": "Ice Veil", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/15.jpg", "full": "wallpapers/15.jpg"}, {"name": "Asta Shadow", "cats": ["phone"], "res": "Phone", "thumb": "wallpapers/thumbs/16.jpg", "full": "wallpapers/16.jpg"}, {"name": "Fourth Flame", "cats": ["phone"], "res": "Phone", "thumb": "wallpapers/thumbs/17.jpg", "full": "wallpapers/17.jpg"}, {"name": "Manga Panels", "cats": ["phone"], "res": "Phone", "thumb": "wallpapers/thumbs/18.jpg", "full": "wallpapers/18.jpg"}, {"name": "Berserk Eyes", "cats": ["phone"], "res": "Phone", "thumb": "wallpapers/thumbs/19.jpg", "full": "wallpapers/19.jpg"}, {"name": "Ronin Silhouette", "cats": ["phone"], "res": "Phone", "thumb": "wallpapers/thumbs/20.jpg", "full": "wallpapers/20.jpg"}, {"name": "Steel Chain", "cats": ["phone"], "res": "Phone", "thumb": "wallpapers/thumbs/21.jpg", "full": "wallpapers/21.jpg"}, {"name": "Monochrome Bill", "cats": ["phone"], "res": "Phone", "thumb": "wallpapers/thumbs/22.jpg", "full": "wallpapers/22.jpg"}, {"name": "Katana Reflection", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/23.jpg", "full": "wallpapers/23.jpg"}, {"name": "Noir Panels", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/24.jpg", "full": "wallpapers/24.jpg"}];

const grid = document.getElementById("grid");
const viewer = document.getElementById("viewer");
let current = -1; // index into WALLPAPERS of the open wallpaper

function render() {
  grid.innerHTML = "";
  WALLPAPERS.forEach((w, i) => {
    const el = document.createElement("article");
    el.className = "card";
    el.dataset.index = i;
    el.dataset.cats = w.cats.join(" ");
    el.innerHTML = `<div class="thumb shimmer" style="background:url('${w.thumb}') center/cover"></div>
      <div class="meta"><span>${w.name}</span><small>${w.res}</small></div>`;
    const thumb = el.querySelector(".thumb");
    const pre = new Image();
    pre.onload = () => thumb.classList.remove("shimmer");
    pre.src = w.thumb;
    el.addEventListener("click", () => openViewer(i));
    grid.appendChild(el);
  });
}

// Indexes of the wallpapers currently shown (respects the active filter)
function visibleIndexes() {
  return [...document.querySelectorAll(".card:not(.hidden)")].map(c => Number(c.dataset.index));
}

function openViewer(i) {
  current = i;
  const w = WALLPAPERS[i];
  viewer.style.background = `#000 url('${w.full}') center/contain no-repeat`;
  document.getElementById("caption").textContent = `${w.name} · ${w.res}`;
  const dl = document.getElementById("download");
  dl.href = w.full;
  dl.download = w.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".jpg";
  viewer.classList.add("open");
}

function step(dir) {
  const list = visibleIndexes();
  if (!list.length) return;
  const pos = list.indexOf(current);
  const next = pos === -1 ? list[0] : list[(pos + dir + list.length) % list.length];
  openViewer(next);
}

document.getElementById("close").onclick = () => viewer.classList.remove("open");
document.getElementById("prev").onclick = () => step(-1);
document.getElementById("next").onclick = () => step(1);
document.addEventListener("keydown", e => {
  if (!viewer.classList.contains("open")) return;
  if (e.key === "Escape") viewer.classList.remove("open");
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

// Swipe left or right on phones
let touchX = null;
viewer.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
viewer.addEventListener("touchend", e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  touchX = null;
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
});

// Random wallpaper from whatever is currently shown
document.getElementById("random").addEventListener("click", () => {
  const list = visibleIndexes();
  if (list.length) openViewer(list[Math.floor(Math.random() * list.length)]);
});

document.getElementById("filters").addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === chip));
  const f = chip.dataset.f;
  let n = 0;
  document.querySelectorAll(".card").forEach(card => {
    const show = f === "all" || card.dataset.cats.split(" ").includes(f);
    card.classList.toggle("hidden", !show);
    if (show) {
      // Re-run a small staggered pop-in on the cards that are now visible
      card.classList.remove("pop");
      void card.offsetWidth;
      card.style.animationDelay = (n++ * 30) + "ms";
      card.classList.add("pop");
    }
  });
});

render();

// Fade cards in as they scroll into view
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".card").forEach(c => io.observe(c));

// Dot network background: drifts to the right, leans toward the mouse
(() => {
  const canvas = document.getElementById("bg");
  if (!canvas) return;
  const BRAND = { line: "238,240,244", dot: "238,240,244" };  // white-grey, matches the site
  const OPACITY = 0.6;
  const DOTS = 180;          // fewer dots = lighter on phones
  const SPEED = 0.0015;      // automatic turning speed
  const DRIFT = 0.0012;      // steady drift to the right
  const g = canvas.getContext("2d");
  let W, H;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  addEventListener("resize", resize);

  const dots = Array.from({ length: DOTS }, () => {
    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u), r = Math.cbrt(Math.random());
    return { x: r * s * Math.cos(th), y: r * u, z: r * s * Math.sin(th) };
  });

  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let angle = 0, leanX = 0, leanY = 0, mx = -1e4, my = -1e4;
  addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener("pointerleave", () => { mx = my = -1e4; });

  function frame() {
    g.clearRect(0, 0, W, H);
    if (!still) {
      angle += SPEED;
      for (const d of dots) {
        d.x += DRIFT;
        if (d.x > 1.2) d.x -= 2.4;   // re-enter on the left
      }
    }

    const tx = mx > -1e3 ? (mx / W - 0.5) * 0.6 : 0;
    const ty = mx > -1e3 ? (my / H - 0.5) * 0.4 : 0;
    leanX += (tx - leanX) * 0.05;
    leanY += (ty - leanY) * 0.05;

    const a = angle + leanX, t = 0.35 + leanY;
    const R = Math.hypot(W, H) * 0.45;
    const cA = Math.cos(a), sA = Math.sin(a), cT = Math.cos(t), sT = Math.sin(t);

    const p = dots.map(d => {
      const x1 = d.x * cA - d.z * sA, z1 = d.x * sA + d.z * cA;
      const y1 = d.y * cT - z1 * sT, z2 = d.y * sT + z1 * cT;
      const k = 1 / (1 + z2 * 0.35);
      return { x: W / 2 + x1 * R * k, y: H / 2 + y1 * R * k, z: z2, k };
    });

    const lim = R * 0.2;
    g.lineWidth = 1;
    for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) {
      const A = p[i], B = p[j], d = Math.hypot(A.x - B.x, A.y - B.y);
      if (d < lim) {
        const depth = (A.z + B.z + 2) / 4;
        let al = (1 - d / lim) * (0.25 + depth * 0.5) * OPACITY;
        const dm = Math.hypot((A.x + B.x) / 2 - mx, (A.y + B.y) / 2 - my);
        if (dm < 120) al = Math.min(1, al + (1 - dm / 120) * 0.6);
        g.strokeStyle = `rgba(${BRAND.line},${al})`;
        g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(B.x, B.y); g.stroke();
      }
    }
    for (const q of p) {
      const depth = (q.z + 1) / 2;
      g.fillStyle = `rgba(${BRAND.dot},${(0.35 + depth * 0.65) * OPACITY})`;
      g.beginPath(); g.arc(q.x, q.y, 1.2 + q.k * 1.3, 0, Math.PI * 2); g.fill();
    }
    requestAnimationFrame(frame);
  }
  frame();
})();

// Scroll motion: cards grow as they reach the middle of the screen and ease down near the edges
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let ticking = false;
  function update() {
    const vh = innerHeight;
    document.querySelectorAll(".card:not(.hidden)").forEach(card => {
      const r = card.getBoundingClientRect();
      const offset = ((r.top + r.height / 2) - vh / 2) / vh;   // -0.5 top .. 0.5 bottom
      const closeness = 1 - Math.min(1, Math.abs(offset) * 2);  // 1 = centered, 0 = at the edge
      card.style.scale = (0.94 + 0.06 * closeness).toFixed(3);
    });
    ticking = false;
  }
  addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  addEventListener("resize", update);
  update();
})();

