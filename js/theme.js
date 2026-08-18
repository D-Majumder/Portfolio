// ===========================================================
// Day / Night theme 
// ===========================================================

const THEME_OVERRIDE_KEY = "portfolio-os-theme-override";

function getKolkataHour() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: false
  }).formatToParts(new Date());
  const hourPart = parts.find(p => p.type === "hour")?.value ?? "12";
  return parseInt(hourPart, 10) % 24;
}

function isKolkataDaytime() {
  const hour = getKolkataHour();
  return hour >= 6 && hour < 18;
}

function autoTheme() {
  return isKolkataDaytime() ? "day" : "night";
}

function getThemeOverride() {
  try { return sessionStorage.getItem(THEME_OVERRIDE_KEY); } catch { return null; }
}

function setThemeOverride(theme) {
  try { sessionStorage.setItem(THEME_OVERRIDE_KEY, theme); } catch {}
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  document.querySelectorAll(".theme-toggle-icon").forEach(el => {
    el.textContent = theme === "night" ? "☀️" : "🌙";
  });
  document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
    btn.title = theme === "night" ? "Switch to day mode" : "Switch to night mode";
  });

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "night" ? "#0A0B14" : "#0B1622");
}

function updateThemePlaceLabel() {
  const day = isKolkataDaytime();
  document.querySelectorAll(".theme-place-label").forEach(el => {
    el.textContent = el.dataset.short === "1" ? (day ? "Day" : "Night") : (day ? "Day here" : "Night here");
    el.title = day ? "It's daytime here in Kolkata right now" : "It's nighttime here in Kolkata right now";
  });
}

function refreshTheme() {
  const override = getThemeOverride();
  applyTheme(override || autoTheme());
  updateThemePlaceLabel();
}

function toggleThemeOverride() {
  const active = document.documentElement.getAttribute("data-theme") || autoTheme();
  const next = active === "night" ? "day" : "night";
  setThemeOverride(next);
  applyTheme(next);
}

function initThemeSystem() {
  refreshTheme();
  document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
    if (btn.dataset.wired) return;
    btn.dataset.wired = "1";
    btn.addEventListener("click", toggleThemeOverride);
  });
  if (!window.__themeInterval) {
    window.__themeInterval = setInterval(refreshTheme, 60000);
  }
}

// ---------------------------------------------------------
// Alive background 
// ---------------------------------------------------------
function initAliveBackground() {
  if (window.__aliveBgWired) return;
  window.__aliveBgWired = true;

  const glow = document.getElementById("cursor-glow");
  const field = document.getElementById("blob-field");
  const root = document.documentElement;
  if (!glow || !field) return;

  let raf = null;

  function move(x, y) {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      root.style.setProperty("--mx", `${x}px`);
      root.style.setProperty("--my", `${y}px`);
      const dx = x / window.innerWidth - 0.5;
      const dy = y / window.innerHeight - 0.5;
      field.style.transform = `translate(${dx * -22}px, ${dy * -22}px)`;
      glow.classList.add("active");
      raf = null;
    });
  }

  window.addEventListener("pointermove", (e) => move(e.clientX, e.clientY), { passive: true });
  window.addEventListener("pointerdown", (e) => move(e.clientX, e.clientY), { passive: true });
  window.addEventListener("pointerleave", () => glow.classList.remove("active"));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) glow.classList.remove("active");
  });
}
