// ===========================================================
// Shared logic (device-agnostic).
// ===========================================================

const LAUNCH_DATE = new Date('2025-10-07T12:00:00Z');

let CURRENT_USERNAME = "Guest";

function formatUptime() {
  const diff = Date.now() - LAUNCH_DATE.getTime();
  const days = Math.floor(diff / 86400000);
  const hrs = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `Online ${days}d ${String(hrs).padStart(2,"0")}:${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
}

function formatClock() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ---------------------------------------------------------
// Notifications (toast queue)
// ---------------------------------------------------------
function pushNotification(container, { icon, title, body }) {
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast glass";
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div>
      <div class="toast-title">${title}</div>
      <div class="toast-body">${body}</div>
    </div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("leaving");
    setTimeout(() => toast.remove(), 320);
  }, 6000);
}

function startNotificationLoop(container) {
  const pool = portfolioData.notifications;
  if (!pool || pool.length === 0) return;
  let i = 0;
  setInterval(() => { pushNotification(container, pool[i % pool.length]); i++; }, 22000);
}

// ---------------------------------------------------------
// Weather + AQI (Open-Meteo — free, no API key, CORS-friendly)
// ---------------------------------------------------------
const WEATHER_CODES = {
  0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Fog", 51: "Light drizzle", 53: "Drizzle", 55: "Dense drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow",
  75: "Heavy snow", 80: "Rain showers", 81: "Rain showers", 82: "Violent showers",
  95: "Thunderstorm", 96: "Thunderstorm w/ hail", 99: "Thunderstorm w/ hail"
};

function aqiLabel(usAqi) {
  if (usAqi <= 50) return { label: "Good", color: "#2FB37C" };
  if (usAqi <= 100) return { label: "Moderate", color: "#C7A83D" };
  if (usAqi <= 150) return { label: "Unhealthy (SG)", color: "#D98A3D" };
  if (usAqi <= 200) return { label: "Unhealthy", color: "#C1553B" };
  if (usAqi <= 300) return { label: "Very Unhealthy", color: "#8E4FB3" };
  return { label: "Hazardous", color: "#7A2E2E" };
}

async function fetchWeatherAndAQI() {
  const cfg = portfolioData.widgets.weather;
  const pos = await getPosition().catch(() => null);
  const lat = pos ? pos.coords.latitude : cfg.fallbackLat;
  const lon = pos ? pos.coords.longitude : cfg.fallbackLon;
  const cityLabel = pos ? "Your location" : cfg.fallbackCity;

  const [weatherRes, aqiRes] = await Promise.all([
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m`),
    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`)
  ]);
  const weather = await weatherRes.json();
  const aqi = await aqiRes.json();

  return {
    city: cityLabel,
    temp: Math.round(weather.current.temperature_2m),
    desc: WEATHER_CODES[weather.current.weather_code] || "—",
    humidity: weather.current.relative_humidity_2m,
    wind: Math.round(weather.current.wind_speed_10m),
    aqi: aqi.current?.us_aqi ?? null
  };
}

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject();
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 });
  });
}

function weatherWidgetHTML(data) {
  const badge = data.aqi != null ? aqiLabel(data.aqi) : null;
  return `
    <div class="dw-city">${data.city}</div>
    <div class="dw-temp">${data.temp}°</div>
    <div class="dw-desc">${data.desc}</div>
    <div class="dw-row"><span>Humidity</span><span>${data.humidity}%</span></div>
    <div class="dw-row"><span>Wind</span><span>${data.wind} km/h</span></div>
    ${badge ? `<div class="dw-row"><span>Air Quality</span><span class="dw-aqi-badge" style="background:${badge.color}22;color:${badge.color}">${data.aqi} · ${badge.label}</span></div>` : ""}
  `;
}

async function renderWeatherWidget(container) {
  if (!container) return;
  container.innerHTML = `<div class="dw-loading">Loading weather…</div>`;
  try {
    const data = await fetchWeatherAndAQI();
    container.innerHTML = weatherWidgetHTML(data);
  } catch {
    container.innerHTML = `<div class="dw-loading">Weather unavailable right now.</div>`;
  }
}

// ---------------------------------------------------------
// Tools app — Calculator, Unit Converter, Colour tool.
// ---------------------------------------------------------
function toolsAppHTML() {
  return `
    <h2>Tools</h2>
    <div class="tool-tabs" role="tablist">
      <button class="tool-tab active" data-tool="calc">Calculator</button>
      <button class="tool-tab" data-tool="conv">Converter</button>
      <button class="tool-tab" data-tool="color">Colour</button>
    </div>
    <div class="tool-pane active" data-pane="calc">${calculatorHTML()}</div>
    <div class="tool-pane" data-pane="conv">${converterHTML()}</div>
    <div class="tool-pane" data-pane="color">${colorToolHTML()}</div>
  `;
}

function wireToolsApp(container) {
  if (!container) return;
  container.querySelectorAll(".tool-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      container.querySelectorAll(".tool-tab").forEach(t => t.classList.remove("active"));
      container.querySelectorAll(".tool-pane").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      container.querySelector(`.tool-pane[data-pane="${tab.dataset.tool}"]`).classList.add("active");
    });
  });
  wireCalculator(container.querySelector('[data-pane="calc"]'));
  wireConverter(container.querySelector('[data-pane="conv"]'));
  wireColorTool(container.querySelector('[data-pane="color"]'));
}

// -- Calculator --------------------------------------------------
function calculatorHTML() {
  return `
    <div class="calc">
      <div class="calc-display" id="calc-display">0</div>
      <div class="calc-grid">
        <button class="calc-btn calc-op" data-key="clear">C</button>
        <button class="calc-btn calc-op" data-key="backspace">⌫</button>
        <button class="calc-btn calc-op" data-key="%">%</button>
        <button class="calc-btn calc-accent" data-key="/">÷</button>
        <button class="calc-btn" data-key="7">7</button>
        <button class="calc-btn" data-key="8">8</button>
        <button class="calc-btn" data-key="9">9</button>
        <button class="calc-btn calc-accent" data-key="*">×</button>
        <button class="calc-btn" data-key="4">4</button>
        <button class="calc-btn" data-key="5">5</button>
        <button class="calc-btn" data-key="6">6</button>
        <button class="calc-btn calc-accent" data-key="-">−</button>
        <button class="calc-btn" data-key="1">1</button>
        <button class="calc-btn" data-key="2">2</button>
        <button class="calc-btn" data-key="3">3</button>
        <button class="calc-btn calc-accent" data-key="+">+</button>
        <button class="calc-btn calc-wide" data-key="0">0</button>
        <button class="calc-btn" data-key=".">.</button>
        <button class="calc-btn calc-equals" data-key="=">=</button>
      </div>
    </div>
  `;
}

function wireCalculator(pane) {
  if (!pane) return;
  const display = pane.querySelector("#calc-display");
  let expr = "";

  const safeEval = (str) => {
    if (!/^[0-9+\-*/.%() ]+$/.test(str)) return null;
    try {
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${str.replace(/%/g, "/100")})`)();
      return Number.isFinite(result) ? result : null;
    } catch { return null; }
  };

  const render = () => { display.textContent = expr === "" ? "0" : expr; };

  pane.querySelectorAll("[data-key]").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      if (key === "clear") expr = "";
      else if (key === "backspace") expr = expr.slice(0, -1);
      else if (key === "=") {
        const result = safeEval(expr);
        expr = result === null ? "Error" : String(Math.round(result * 1e10) / 1e10);
      } else {
        if (expr === "Error") expr = "";
        expr += key;
      }
      render();
    });
  });
  render();
}

// -- Unit converter ------------------------------------------------
const CONVERTER_GROUPS = {
  length: { label: "Length", base: "m", units: { mm: 0.001, cm: 0.01, m: 1, km: 1000, inch: 0.0254, ft: 0.3048, yard: 0.9144, mile: 1609.34 } },
  weight: { label: "Weight", base: "kg", units: { mg: 0.000001, g: 0.001, kg: 1, lb: 0.453592, oz: 0.0283495, ton: 1000 } },
  temp:   { label: "Temperature", base: "c", units: { c: "c", f: "f", k: "k" } }
};

function convertTemp(value, from, to) {
  let c;
  if (from === "c") c = value;
  else if (from === "f") c = (value - 32) * 5 / 9;
  else c = value - 273.15;
  if (to === "c") return c;
  if (to === "f") return c * 9 / 5 + 32;
  return c + 273.15;
}

function converterHTML() {
  const groupOptions = Object.entries(CONVERTER_GROUPS).map(([k, g]) => `<option value="${k}">${g.label}</option>`).join("");
  return `
    <div class="conv">
      <select class="conv-select" id="conv-group">${groupOptions}</select>
      <div class="conv-row">
        <input class="conv-input" id="conv-from-val" type="number" value="1" inputmode="decimal">
        <select class="conv-select" id="conv-from-unit"></select>
      </div>
      <div class="conv-swap">⇅</div>
      <div class="conv-row">
        <input class="conv-input" id="conv-to-val" type="number" readonly>
        <select class="conv-select" id="conv-to-unit"></select>
      </div>
    </div>
  `;
}

function wireConverter(pane) {
  if (!pane) return;
  const groupSel = pane.querySelector("#conv-group");
  const fromVal = pane.querySelector("#conv-from-val");
  const toVal = pane.querySelector("#conv-to-val");
  const fromUnit = pane.querySelector("#conv-from-unit");
  const toUnit = pane.querySelector("#conv-to-unit");

  function populateUnits() {
    const units = Object.keys(CONVERTER_GROUPS[groupSel.value].units);
    fromUnit.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join("");
    toUnit.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join("");
    toUnit.selectedIndex = Math.min(1, units.length - 1);
  }

  function recalc() {
    const group = CONVERTER_GROUPS[groupSel.value];
    const val = parseFloat(fromVal.value);
    if (isNaN(val)) { toVal.value = ""; return; }
    if (groupSel.value === "temp") {
      toVal.value = Math.round(convertTemp(val, fromUnit.value, toUnit.value) * 1000) / 1000;
    } else {
      const meters = val * group.units[fromUnit.value];
      toVal.value = Math.round((meters / group.units[toUnit.value]) * 1e6) / 1e6;
    }
  }

  groupSel.addEventListener("change", () => { populateUnits(); recalc(); });
  [fromVal, fromUnit, toUnit].forEach(el => el.addEventListener("input", recalc));
  populateUnits();
  recalc();
}

// -- Colour tool -----------------------------------------------------
function hexToRgb(hex) {
  const m = hex.replace("#", "").match(/.{1,2}/g);
  return m.map(h => parseInt(h, 16));
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
function shade(hex, percent) {
  const [r, g, b] = hexToRgb(hex);
  const adjust = (c) => {
    const v = percent > 0 ? c + (255 - c) * percent : c + c * percent;
    return Math.max(0, Math.min(255, Math.round(v)));
  };
  return "#" + [adjust(r), adjust(g), adjust(b)].map(c => c.toString(16).padStart(2, "0")).join("");
}

function colorToolHTML() {
  return `
    <div class="color-tool">
      <div class="color-pick-row">
        <input type="color" id="color-picker" value="#3E7CB1">
        <div class="color-values">
          <div class="color-val-row"><span>HEX</span><code id="color-hex">#3E7CB1</code></div>
          <div class="color-val-row"><span>RGB</span><code id="color-rgb"></code></div>
          <div class="color-val-row"><span>HSL</span><code id="color-hsl"></code></div>
        </div>
      </div>
      <div class="color-swatches" id="color-swatches"></div>
      <p class="widget-note">Click a swatch to copy its hex code.</p>
    </div>
  `;
}

function wireColorTool(pane) {
  if (!pane) return;
  const picker = pane.querySelector("#color-picker");
  const hexEl = pane.querySelector("#color-hex");
  const rgbEl = pane.querySelector("#color-rgb");
  const hslEl = pane.querySelector("#color-hsl");
  const swatches = pane.querySelector("#color-swatches");

  function update() {
    const hex = picker.value;
    const [r, g, b] = hexToRgb(hex);
    const [h, s, l] = rgbToHsl(r, g, b);
    hexEl.textContent = hex.toUpperCase();
    rgbEl.textContent = `rgb(${r}, ${g}, ${b})`;
    hslEl.textContent = `hsl(${h}, ${s}%, ${l}%)`;

    const steps = [-0.6, -0.3, 0, 0.3, 0.6];
    swatches.innerHTML = steps.map(p => {
      const c = shade(hex, p);
      return `<button class="color-swatch" style="background:${c}" data-hex="${c}" title="${c}"></button>`;
    }).join("");
    swatches.querySelectorAll(".color-swatch").forEach(sw => {
      sw.addEventListener("click", () => {
        navigator.clipboard?.writeText(sw.dataset.hex).catch(() => {});
        sw.classList.add("copied");
        setTimeout(() => sw.classList.remove("copied"), 500);
      });
    });
  }

  picker.addEventListener("input", update);
  update();
}

// ---------------------------------------------------------
// Boot sequence 
// ---------------------------------------------------------
function typeInto(el, text, speed = 48) {
  return new Promise(resolve => {
    let i = 0;
    el.textContent = "";
    const tick = () => {
      if (i < text.length) {
        el.textContent = text.slice(0, i + 1);
        i++;
        setTimeout(tick, speed);
      } else resolve();
    };
    tick();
  });
}

function runBootSequence(onDone) {
  const boot = document.getElementById("boot-screen");
  const mark = document.getElementById("boot-mark");
  const line1 = document.getElementById("type-line-1");
  const line2 = document.getElementById("type-line-2");
  const nameEntry = document.getElementById("name-entry");
  const input = document.getElementById("username-input");
  const continueBtn = document.getElementById("boot-continue");

  boot.classList.remove("fade-out", "hidden");
  boot.style.opacity = "1";
  mark.classList.remove("show");
  line1.textContent = ""; line2.textContent = "";
  nameEntry.classList.remove("show");
  input.value = "";

  (async () => {
    await new Promise(r => setTimeout(r, 120));
    mark.classList.add("show");
    await new Promise(r => setTimeout(r, 550));
    await typeInto(line1, "Welcome");
    await new Promise(r => setTimeout(r, 380));
    await typeInto(line2, "What should we call you?");
    await new Promise(r => setTimeout(r, 250));

    nameEntry.classList.add("show");
    input.focus();

    await new Promise(resolve => {
      let done = false;
      const submit = () => {
        if (done) return;
        done = true;
        CURRENT_USERNAME = input.value.trim() || "Guest";
        resolve();
      };
      continueBtn.addEventListener("click", submit, { once: true });
      input.addEventListener("keydown", function handler(e) {
        if (e.key === "Enter") { input.removeEventListener("keydown", handler); submit(); }
      });
    });

    boot.classList.add("fade-out");
    await new Promise(r => setTimeout(r, 480));
    boot.classList.add("hidden");
    boot.style.opacity = "";
    onDone();
  })();
}

// ---------------------------------------------------------
// Terminal command set (shared by desktop + mobile terminal apps)
// ---------------------------------------------------------
function terminalCommands() {
  return {
    help: () => "Commands: help, whoami, skills, projects, contact, clear",
    whoami: () => `${portfolioData.name} — ${portfolioData.role}`,
    skills: () => portfolioData.skills.join(", "),
    projects: () => portfolioData.featuredBuilds.map(p => `• ${p.title}`).join("\n") + "\n(see the Projects app for the live GitHub feed)",
    contact: () => `${portfolioData.contact.email} · ${portfolioData.socials.github} · ${portfolioData.socials.linkedin}`,
  };
}

// ---------------------------------------------------------
// Community backend — visit counter + feedback wall.
// ---------------------------------------------------------
function apiConfigured() {
  return !!(portfolioData.api && portfolioData.api.baseUrl);
}

function apiUrl(path) {
  return portfolioData.api.baseUrl.replace(/\/$/, "") + path;
}

async function fetchAndBumpVisitCount() {
  if (!apiConfigured()) return null;
  try {
    const res = await fetch(apiUrl("/api/visit"), { method: "POST" });
    if (!res.ok) throw new Error("bad response");
    const data = await res.json();
    return data.count;
  } catch {
    return null;
  }
}

function renderVisitPill(el, count) {
  if (!el) return;
  if (count == null) { el.classList.add("hidden"); return; }
  el.classList.remove("hidden");
  el.innerHTML = `<span>👀</span><span class="visit-count">${count.toLocaleString()}</span>`;
}

function formatFeedbackDate(iso) {
  try {
    return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  } catch { return iso; }
}

function feedbackAppHTML() {
  if (!apiConfigured()) {
    return `
      <h2>Feedback</h2>
      <p>Feedback isn't connected yet — once the backend in <code>/server</code> is deployed and its URL is set in <code>js/data.js</code>, visitors will be able to leave feedback here, stored right in the GitHub repo.</p>`;
  }
  return `
    <h2>Feedback</h2>
    <p>Leave a note — it's saved and anyone else who visits can read it.</p>
    <form class="feedback-form" id="feedback-form">
      <input class="feedback-input" id="feedback-name" type="text" maxlength="60" placeholder="Your name" autocomplete="off" required>
      <textarea class="feedback-textarea" id="feedback-message" maxlength="800" placeholder="Your feedback…" required></textarea>
      <button class="feedback-submit" id="feedback-submit" type="submit">Send</button>
      <div class="feedback-status" id="feedback-status"></div>
    </form>
    <div class="section-label">What people have said</div>
    <div class="feedback-list" id="feedback-list"><p class="gh-loading">Loading feedback…</p></div>`;
}

function feedbackEntryHTML(entry, i) {
  const name = entry.name ? entry.name.replace(/</g, "&lt;") : "Anonymous";
  const message = entry.message ? entry.message.replace(/</g, "&lt;") : "";
  return `
    <div class="feedback-item" data-i="${i}">
      <div class="feedback-item-head">
        <span class="feedback-name">${name}</span>
        <span class="feedback-date">${formatFeedbackDate(entry.date)}</span>
      </div>
      <p class="feedback-message">${message}</p>
    </div>`;
}

async function wireFeedbackApp(container) {
  if (!container || !apiConfigured()) return;
  const form = container.querySelector("#feedback-form");
  const nameEl = container.querySelector("#feedback-name");
  const msgEl = container.querySelector("#feedback-message");
  const statusEl = container.querySelector("#feedback-status");
  const listEl = container.querySelector("#feedback-list");
  const submitBtn = container.querySelector("#feedback-submit");

  async function loadList() {
    try {
      const res = await fetch(apiUrl("/api/feedback"));
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      const items = data.feedback || [];
      listEl.innerHTML = items.length
        ? items.map((entry, i) => feedbackEntryHTML(entry, i)).join("")
        : `<p class="gh-loading">No feedback yet — be the first!</p>`;
    } catch {
      listEl.innerHTML = `<p class="gh-error">Couldn't load feedback right now.</p>`;
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = nameEl.value.trim();
    const message = msgEl.value.trim();
    if (!name || !message) return;
    submitBtn.disabled = true;
    statusEl.textContent = "Sending…";
    try {
      const res = await fetch(apiUrl("/api/feedback"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message })
      });
      if (!res.ok) throw new Error("bad response");
      statusEl.textContent = "Thanks — posted!";
      form.reset();
      await loadList();
    } catch {
      statusEl.textContent = "Couldn't send that right now — try again in a bit.";
    } finally {
      submitBtn.disabled = false;
      setTimeout(() => { statusEl.textContent = ""; }, 4000);
    }
  });

  loadList();
}

// ---------------------------------------------------------
// Power actions
// ---------------------------------------------------------
function powerMenuHTML() {
  return `
    <button class="power-menu-item" data-power="sleep">🌙 Sleep</button>
    <button class="power-menu-item" data-power="reboot">🔄 Reboot</button>
    <button class="power-menu-item" data-power="logout">🚪 Log Out</button>
    <div class="power-menu-sep"></div>
    <button class="power-menu-item" data-power="shutdown">⏻ Shut Down</button>
  `;
}

function doShutdown() {
  window.location.href = "https://www.google.com";
}
