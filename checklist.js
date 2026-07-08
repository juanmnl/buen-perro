/* Checklist de socialización — render + persistencia en localStorage */

const CATEGORIES = [
  {
    id: "personas",
    icon: "🧑‍🤝‍🧑",
    title: "Personas",
    items: [
      "Hombres con barba",
      "Personas con sombrero, gorra o capucha",
      "Personas con lentes de sol",
      "Niños pequeños (jugando, gritando)",
      "Bebés y coches de bebé",
      "Personas mayores",
      "Personas con bastón, muletas o silla de ruedas",
      "Ciclistas y patinetas",
      "Corredores",
      "Personas con uniforme (repartidor, policía)",
      "Personas con paraguas abierto",
      "Grupos o multitudes (a distancia cómoda)",
    ],
  },
  {
    id: "animales",
    icon: "🐈",
    title: "Otros animales",
    items: [
      "Cachorros sanos y vacunados",
      "Perros adultos tranquilos y sociables",
      "Perros de tamaños distintos (mini y gigante)",
      "Gatos",
      "Aves (palomas en el parque)",
      "Animales de granja o caballos (si habrá contacto)",
    ],
  },
  {
    id: "sonidos",
    icon: "🔊",
    title: "Sonidos",
    items: [
      "Aspiradora",
      "Secadora de pelo",
      "Licuadora y electrodomésticos",
      "Timbre y golpes en la puerta",
      "Tráfico, bocinas y motos",
      "Sirenas y alarmas",
      "Truenos (grabación, volumen bajo → alto)",
      "Fuegos artificiales (grabación, volumen bajo → alto)",
      "Música alta y televisión",
      "Objetos que caen al suelo",
    ],
  },
  {
    id: "entornos",
    icon: "🌍",
    title: "Superficies y lugares",
    items: [
      "Pasto, tierra y arena",
      "Pisos brillantes o resbaladizos",
      "Rejillas metálicas y alcantarillas",
      "Escaleras (subir y bajar)",
      "Ascensor",
      "Viajes cortos en auto",
      "Caminar bajo la lluvia",
      "Visita FELIZ al veterinario (solo premios, sin procedimientos)",
      "Terraza de cafetería o zona con mesas",
      "Mercado o calle comercial (a hora tranquila)",
      "Quedarse solo en una habitación 1–5 minutos",
    ],
  },
  {
    id: "manipulacion",
    icon: "🤲",
    title: "Manipulación corporal",
    items: [
      "Tocar y sostener las patas (una a una)",
      "Simulacro de corte de uñas (solo tocar con el cortaúñas)",
      "Revisar orejas",
      "Levantar labios y mirar dientes",
      "Cepillado suave",
      "Toalla por el cuerpo (simulacro de secado)",
      "Baño o mojar patas con agua tibia",
      "Poner y quitar collar y arnés",
      "Ser cargado brevemente",
      "Abrazo suave / sujeción veterinaria simulada",
    ],
  },
  {
    id: "objetos",
    icon: "🎈",
    title: "Objetos y situaciones",
    items: [
      "Paraguas abriéndose (a distancia)",
      "Bolsas plásticas movidas por el viento",
      "Globos",
      "Escoba y trapeador en movimiento",
      "Maletas con ruedas",
      "Cajas de cartón y objetos nuevos en el suelo",
      "Espejos",
      "Persona poniéndose casco o mascarilla",
    ],
  },
];

const STORE_KEY = "buenperro-checklist-v1";

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  } catch (_) {
    return {};
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (_) {
    /* modo privado: sin persistencia, la sesión sigue funcionando */
  }
}

const root = document.getElementById("checklist");
if (root) {
  const state = loadState();
  const totalItems = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

  const progCount = document.getElementById("prog-count");
  const progTotal = document.getElementById("prog-total");
  const progFill = document.getElementById("prog-fill");
  const progBarEl = document.getElementById("prog-bar-el");
  progTotal.textContent = String(totalItems);

  function itemKey(catId, idx) {
    return catId + ":" + idx;
  }

  function refresh() {
    let done = 0;
    CATEGORIES.forEach((cat) => {
      let catDone = 0;
      cat.items.forEach((_, i) => {
        if (state[itemKey(cat.id, i)]) {
          done++;
          catDone++;
        }
      });
      const counter = document.getElementById("count-" + cat.id);
      if (counter) counter.textContent = catDone + "/" + cat.items.length;
    });
    progCount.textContent = String(done);
    const pct = totalItems ? Math.round((done / totalItems) * 100) : 0;
    progFill.style.width = pct + "%";
    progBarEl.setAttribute("aria-valuenow", String(pct));
  }

  CATEGORIES.forEach((cat) => {
    const section = document.createElement("section");
    section.className = "check-section";
    section.innerHTML =
      '<div class="check-section-head">' +
      "<h2>" + cat.icon + " " + cat.title + "</h2>" +
      '<span class="count" id="count-' + cat.id + '"></span>' +
      "</div>";
    const grid = document.createElement("div");
    grid.className = "check-grid";

    cat.items.forEach((label, i) => {
      const key = itemKey(cat.id, i);
      const item = document.createElement("label");
      item.className = "check-item";
      const box = document.createElement("input");
      box.type = "checkbox";
      box.checked = Boolean(state[key]);
      box.addEventListener("change", () => {
        state[key] = box.checked;
        saveState(state);
        refresh();
      });
      const text = document.createElement("span");
      text.textContent = label;
      item.append(box, text);
      grid.appendChild(item);
    });

    section.appendChild(grid);
    root.appendChild(section);
  });

  const resetBtn = document.getElementById("prog-reset");
  let armTimer = null;
  resetBtn.addEventListener("click", () => {
    if (!resetBtn.dataset.armed) {
      resetBtn.dataset.armed = "1";
      resetBtn.textContent = "¿SEGURO? CLIC DE NUEVO";
      armTimer = setTimeout(() => {
        delete resetBtn.dataset.armed;
        resetBtn.textContent = "REINICIAR";
      }, 3000);
      return;
    }
    clearTimeout(armTimer);
    delete resetBtn.dataset.armed;
    resetBtn.textContent = "REINICIAR";
    Object.keys(state).forEach((k) => delete state[k]);
    saveState(state);
    root.querySelectorAll("input[type=checkbox]").forEach((b) => (b.checked = false));
    refresh();
  });

  refresh();
}
