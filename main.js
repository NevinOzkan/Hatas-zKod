(function () {
  "use strict";

  const HEART = "♥";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    const count = Math.min(55, Math.floor((canvas.width * canvas.height) / 18000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.6 + Math.random() * 1.2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        a: 0.12 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function tickParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.0004;
    for (const p of particles) {
      p.x += p.vx + Math.sin(t + p.phase) * 0.02;
      p.y += p.vy + Math.cos(t * 0.8 + p.phase) * 0.02;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 175, 255, ${p.a})`;
      ctx.fill();
    }
    requestAnimationFrame(tickParticles);
  }

  if (!prefersReducedMotion) {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    tickParticles();
  } else {
    canvas.style.display = "none";
  }

  function createHeartEl(className) {
    const el = document.createElement("span");
    el.className = className;
    el.textContent = HEART;
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
    return el;
  }

  function spawnHeartFromCenter() {
    if (prefersReducedMotion) return;
    const el = createHeartEl("heart");
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 220;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    const duration = 2800 + Math.random() * 1400;

    el.style.left = cx + "px";
    el.style.top = cy + "px";
    el.style.color = `hsl(${265 + Math.random() * 35}, 65%, ${72 + Math.random() * 15}%)`;
    el.style.opacity = "0";
    el.style.transform = "translate(-50%, -50%) scale(0.5)";

    requestAnimationFrame(() => {
      el.style.transition = `transform ${duration}ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity ${duration}ms ease-out`;
      el.style.opacity = "0.92";
      el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${0.8 + Math.random() * 0.45})`;
    });

    setTimeout(() => {
      el.style.opacity = "0";
    }, duration * 0.55);

    setTimeout(() => el.remove(), duration + 120);
  }

  function introHearts() {
    if (prefersReducedMotion) return;
    let n = 0;
    const max = 28;
    const interval = setInterval(() => {
      spawnHeartFromCenter();
      n++;
      if (n >= max) clearInterval(interval);
    }, 180);
  }

  function burstAt(x, y) {
    if (prefersReducedMotion) return;
    const count = 10 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const el = createHeartEl("heart heart--burst");
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const spread = 45 + Math.random() * 95;
      const tx = Math.cos(angle) * spread;
      const ty = Math.sin(angle) * spread;
      const duration = 900 + Math.random() * 500;

      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.color = `hsl(${270 + Math.random() * 40}, 70%, ${68 + Math.random() * 18}%)`;
      el.style.fontSize = 28 + Math.random() * 22 + "px";
      el.style.opacity = "0";
      el.style.transform = "translate(-50%, -50%) scale(0.55)";

      requestAnimationFrame(() => {
        el.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${duration}ms ease-out`;
        el.style.opacity = "0.95";
        el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.35)`;
      });

      setTimeout(() => {
        el.style.opacity = "0";
        el.style.transform = `translate(calc(-50% + ${tx * 1.1}px), calc(-50% + ${ty * 1.1}px)) scale(0.95)`;
      }, duration * 0.35);

      setTimeout(() => el.remove(), duration + 100);
    }
  }

  document.addEventListener("click", (e) => {
    burstAt(e.clientX, e.clientY);
  });

  const cursorDot = document.getElementById("cursor-dot");
  const trailContainer = document.getElementById("trail-container");
  const trailLength = prefersReducedMotion ? 0 : 14;
  const trailEls = [];

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  for (let i = 0; i < trailLength; i++) {
    const t = document.createElement("div");
    t.className = "cursor-trail";
    trailContainer.appendChild(t);
    trailEls.push({ el: t, x: mouseX, y: mouseY });
  }

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";
  });

  function animateTrail() {
    if (trailEls.length === 0) {
      requestAnimationFrame(animateTrail);
      return;
    }
    let px = mouseX;
    let py = mouseY;
    for (let i = 0; i < trailEls.length; i++) {
      const item = trailEls[i];
      const dx = px - item.x;
      const dy = py - item.y;
      item.x += dx * 0.28;
      item.y += dy * 0.28;
      const fade = 1 - i / trailEls.length;
      item.el.style.left = item.x + "px";
      item.el.style.top = item.y + "px";
      item.el.style.opacity = (0.35 * fade).toFixed(3);
      item.el.style.transform = `translate(-50%, -50%) scale(${0.5 + fade * 0.5})`;
      px = item.x;
      py = item.y;
    }
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  window.addEventListener("load", () => {
    introHearts();
  });
})();
