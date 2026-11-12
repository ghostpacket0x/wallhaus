// wallhaus script: wallpaper list, gallery, filters, preview, and card reveal
  // Wallpapers are embedded below. Each has a thumb (grid) and full (preview) image.
  const WALLPAPERS = [{"name": "Ember Gaze", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/00.jpg", "full": "wallpapers/00.jpg"}, {"name": "Blue Night City", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/01.jpg", "full": "wallpapers/01.jpg"}, {"name": "Bandaged Stare", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/02.jpg", "full": "wallpapers/02.jpg"}, {"name": "Knight in Blossoms", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/03.jpg", "full": "wallpapers/03.jpg"}, {"name": "Black Rose Knight", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/04.jpg", "full": "wallpapers/04.jpg"}, {"name": "Whatever Doesn't Kill Us", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/05.jpg", "full": "wallpapers/05.jpg"}, {"name": "Monster Ultra", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/06.jpg", "full": "wallpapers/06.jpg"}, {"name": "Berserk Blade", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/07.jpg", "full": "wallpapers/07.jpg"}, {"name": "Silver Hour", "cats": ["4k", "desktop"], "res": "4K \u00b7 Desktop", "thumb": "wallpapers/thumbs/08.jpg", "full": "wallpapers/08.jpg"}, {"name": "Gojo Glasses", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/09.jpg", "full": "wallpapers/09.jpg"}, {"name": "Crystal Eyes", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/10.jpg", "full": "wallpapers/10.jpg"}, {"name": "Lone Tree", "cats": ["4k", "desktop"], "res": "4K \u00b7 Desktop", "thumb": "wallpapers/thumbs/11.jpg", "full": "wallpapers/11.jpg"}, {"name": "Ghost", "cats": ["4k", "desktop"], "res": "4K \u00b7 Desktop", "thumb": "wallpapers/thumbs/12.jpg", "full": "wallpapers/12.jpg"}, {"name": "Spider Web", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/13.jpg", "full": "wallpapers/13.jpg"}, {"name": "Orange Scarf", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/14.jpg", "full": "wallpapers/14.jpg"}, {"name": "Ice Veil", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/15.jpg", "full": "wallpapers/15.jpg"}, {"name": "Asta Shadow", "cats": ["phone"], "res": "Phone", "thumb": "wallpapers/thumbs/16.jpg", "full": "wallpapers/16.jpg"}, {"name": "Fourth Flame", "cats": ["phone"], "res": "Phone", "thumb": "wallpapers/thumbs/17.jpg", "full": "wallpapers/17.jpg"}, {"name": "Manga Panels", "cats": ["phone"], "res": "Phone", "thumb": "wallpapers/thumbs/18.jpg", "full": "wallpapers/18.jpg"}, {"name": "Berserk Eyes", "cats": ["phone"], "res": "Phone", "thumb": "wallpapers/thumbs/19.jpg", "full": "wallpapers/19.jpg"}, {"name": "Ronin Silhouette", "cats": ["phone"], "res": "Phone", "thumb": "wallpapers/thumbs/20.jpg", "full": "wallpapers/20.jpg"}, {"name": "Steel Chain", "cats": ["phone"], "res": "Phone", "thumb": "wallpapers/thumbs/21.jpg", "full": "wallpapers/21.jpg"}, {"name": "Monochrome Bill", "cats": ["phone"], "res": "Phone", "thumb": "wallpapers/thumbs/22.jpg", "full": "wallpapers/22.jpg"}];

  const grid = document.getElementById("grid");
  const viewer = document.getElementById("viewer");

  function render() {
    grid.innerHTML = "";
    WALLPAPERS.forEach((w, i) => {
      const el = document.createElement("article");
      el.className = "card";
      el.dataset.cats = w.cats.join(" ");
      el.innerHTML = `<div class="thumb" style="background:url('${w.thumb}') center/cover"></div>
        <div class="meta"><span>${w.name}</span><small>${w.res}</small></div>`;
      el.addEventListener("click", () => openViewer(i));
      grid.appendChild(el);
    });
  }

  function openViewer(i) {
    const w = WALLPAPERS[i];
    viewer.style.background = `#000 url('${w.full}') center/contain no-repeat`;
    document.getElementById("caption").textContent = `${w.name} · ${w.res}`;
    const dl = document.getElementById("download");
    dl.href = w.full;
    dl.download = w.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".jpg";
    viewer.classList.add("open");
  }
  document.getElementById("close").onclick = () => viewer.classList.remove("open");
  document.addEventListener("keydown", e => { if (e.key === "Escape") viewer.classList.remove("open"); });

  document.getElementById("filters").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === chip));
    const f = chip.dataset.f;
    document.querySelectorAll(".card").forEach(card => {
      const show = f === "all" || card.dataset.cats.split(" ").includes(f);
      card.classList.toggle("hidden", !show);
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

// Dot network: slowly drifting dots joined by faint lines
const canvas = document.getElementById("net");
const ctx = canvas.getContext("2d");
let pts = [];
const LINE_RGB = "150,190,210";   // soft blue-grey, easy on the eyes
const LINK_DIST = 150;
const REDUCED_MOTION = matchMedia("(prefers-reduced-motion: reduce)").matches;
function resizeNet() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const n = Math.min(70, Math.floor(innerWidth * innerHeight / 18000));
  pts = Array.from({ length: n }, () => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18,
    s: Math.random() < .15 ? 2.5 : 1.4,
  }));
}
function tickNet() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const p of pts) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > innerHeight) p.vy *= -1;
  }
  ctx.lineWidth = .7;
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
    if (d < LINK_DIST) {
      ctx.strokeStyle = `rgba(${LINE_RGB},${(1 - d / LINK_DIST) * .22})`;
      ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
    }
  }
  ctx.fillStyle = `rgba(${LINE_RGB},.55)`;
  for (const p of pts) ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
  if (!REDUCED_MOTION) requestAnimationFrame(tickNet);
}
addEventListener("resize", resizeNet);
resizeNet();
tickNet(); // draws once; keeps animating unless reduced motion is on

// Glowing ink-like trail that swirls behind the mouse (skipped if reduced motion is on)
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const ink = document.createElement("canvas");
  ink.id = "ink";
  document.body.appendChild(ink);
  const g = ink.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  function sizeInk() {
    ink.width = innerWidth * dpr;
    ink.height = innerHeight * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  sizeInk();
  addEventListener("resize", sizeInk);

  const HUES = [300, 320, 190, 205, 120, 140]; // pink, blue, green
  const parts = [];
  let lastX = null, lastY = null;
  addEventListener("pointermove", e => {
    const dx = lastX === null ? 0 : e.clientX - lastX;
    const dy = lastY === null ? 0 : e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    for (let i = 0; i < 4; i++) {
      parts.push({
        x: e.clientX + (Math.random() - .5) * 10,
        y: e.clientY + (Math.random() - .5) * 10,
        vx: dx * .15 + (Math.random() - .5) * 1.2,
        vy: dy * .15 + (Math.random() - .5) * 1.2,
        r: 14 + Math.random() * 16,
        life: 1,
        hue: HUES[Math.floor(Math.random() * HUES.length)] + (Math.random() - .5) * 20,
      });
    }
    if (parts.length > 400) parts.splice(0, parts.length - 400);
  });

  let t = 0;
  function frame() {
    t += 0.016;
    // Fade the old frame slightly so streaks linger and dissolve
    g.globalCompositeOperation = "destination-out";
    g.fillStyle = "rgba(0,0,0,0.08)";
    g.fillRect(0, 0, innerWidth, innerHeight);
    g.globalCompositeOperation = "lighter";

    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      // Swirling current, so streaks curl like ink in water
      p.vx += Math.sin(p.y * 0.01 + t) * 0.03;
      p.vy += Math.cos(p.x * 0.01 + t) * 0.03;
      p.vx *= 0.94; p.vy *= 0.94;
      p.x += p.vx; p.y += p.vy;
      p.life -= 0.012;
      if (p.life <= 0) { parts.splice(i, 1); continue; }

      const r = p.r * (1.6 - p.life * 0.6);
      const grd = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      grd.addColorStop(0, `hsla(${p.hue},100%,62%,${p.life * 0.55})`);
      grd.addColorStop(1, `hsla(${p.hue},100%,50%,0)`);
      g.fillStyle = grd;
      g.beginPath();
      g.arc(p.x, p.y, r, 0, Math.PI * 2);
      g.fill();
    }
    requestAnimationFrame(frame);
  }
  frame();
}
