/* Buen Perro — interacciones compartidas */

// ---------- Menú móvil ----------
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
if (toggle && links) {
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "CERRAR" : "MENÚ";
  });
}

// ---------- Revelado al hacer scroll ----------
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealables = document.querySelectorAll(".reveal");
if (!reduceMotion && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealables.forEach((el) => io.observe(el));
} else {
  revealables.forEach((el) => el.classList.add("visible"));
}

// ---------- El clicker ----------
// Sonido de clicker: dos golpes secos (clic-clac) con Web Audio.
let audioCtx = null;
function playClick() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const t0 = audioCtx.currentTime;
    [0, 0.055].forEach((offset, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(i === 0 ? 2400 : 1800, t0 + offset);
      gain.gain.setValueAtTime(0.3, t0 + offset);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + offset + 0.06);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t0 + offset);
      osc.stop(t0 + offset + 0.05);
    });
  } catch (_) {
    /* sin audio disponible: el clicker sigue funcionando en silencio */
  }
}

function dropTreat(x, y) {
  if (reduceMotion) return;
  const treat = document.createElement("span");
  treat.className = "treat";
  treat.textContent = "🦴";
  treat.style.left = x - 10 + "px";
  treat.style.top = y - 10 + "px";
  document.body.appendChild(treat);
  setTimeout(() => treat.remove(), 950);
}

document.querySelectorAll(".clicker").forEach((btn) => {
  const counter = document.querySelector(btn.dataset.counter || "");
  let count = 0;
  btn.addEventListener("click", (ev) => {
    playClick();
    count++;
    if (counter) counter.textContent = String(count);
    const rect = btn.getBoundingClientRect();
    dropTreat(rect.left + rect.width / 2 + (Math.random() * 60 - 30), rect.bottom - 20);
    btn.classList.add("pressed");
    setTimeout(() => btn.classList.remove("pressed"), 90);
  });
});
