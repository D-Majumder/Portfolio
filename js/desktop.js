// ===========================================================
// Desktop experience (>1024px)
// ===========================================================

let highestZIndex = 100;
const openWindows = {};
const dockRefs = {};
let APPS = [];

const ICONS = {
  about: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 20c1.6-3.8 4.6-5.8 7.5-5.8s5.9 2 7.5 5.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  projects: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="6" width="17" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 9h17M8 6V4.8A1.3 1.3 0 0 1 9.3 3.5h5.4A1.3 1.3 0 0 1 16 4.8V6" stroke="currentColor" stroke-width="1.6"/></svg>`,
  terminal: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="4.5" width="17" height="15" rx="2.2" stroke="currentColor" stroke-width="1.6"/><path d="M7 9.5l3 2.6-3 2.6M12.5 15h4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  skills: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 19V10M10 19V5M16 19v-7M20 19v-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  contact: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 7l7.5 6 7.5-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  tools: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="4.5" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.6"/><path d="M14 6h6.5M14 9h4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4 16.5l4-4 4 4-4 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="17" cy="17" r="3.4" stroke="currentColor" stroke-width="1.6"/></svg>`,
  feedback: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 5.5h16v11H9l-4 3.5v-3.5H4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 10h8M8 13h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
};

function buildApps() {
  return [
    { id: "about", title: "About Me", icon: ICONS.about, openOnStart: true, size: { w: 480, h: 460 },
      render: () => `<h2>Hi, I'm ${portfolioData.name.split(" ")[0]} 👋</h2>${portfolioData.about.map(p => `<p>${p}</p>`).join("")}` },
    { id: "projects", title: "Projects", icon: ICONS.projects, size: { w: 560, h: 560 },
      render: () => `
        <h2>Projects</h2>
        <div class="section-label">Featured Builds</div>
        ${portfolioData.featuredBuilds.map(p => `
          <div class="project-card"><div class="project-card-head"><h4>${p.title}</h4></div><p>${p.description}</p>
          <div class="tag-row">${p.tags.map(t => `<span class="tag-chip">${t}</span>`).join("")}</div></div>`).join("")}
        <div class="section-label">Live from GitHub</div>
        <div id="gh-project-list"></div>`,
      onOpen: () => {
        const el = document.getElementById("gh-project-list");
        if (el) GitHubProjects.renderInto(el, { username: portfolioData.githubUsername, ignoreList: portfolioData.githubIgnoreList, pinnedOverride: portfolioData.pinnedRepoOverride });
      }
    },
    { id: "skills", title: "Skills", icon: ICONS.skills, size: { w: 420, h: 380 },
      render: () => `<h2>Skills &amp; Stack</h2><div class="tag-row">${portfolioData.skills.map(s => `<span class="tag-chip">${s}</span>`).join("")}</div>` },
    { id: "terminal", title: "Terminal", icon: ICONS.terminal, size: { w: 500, h: 420 },
      render: () => `<div class="term-body" id="term-output"><div class="term-line">Portfolio OS terminal — type <span class="term-prompt">help</span> to see commands.</div>
        <div class="term-input-row"><span class="term-prompt">${CURRENT_USERNAME.toLowerCase()}@portfolio:~$</span><input class="term-input" id="term-input" autocomplete="off" spellcheck="false"></div></div>`,
      onOpen: () => wireTerminal(document.getElementById("term-input"), document.getElementById("term-output")) },
    { id: "tools", title: "Tools", icon: ICONS.tools, size: { w: 400, h: 560 },
      render: () => toolsAppHTML(),
      onOpen: (win) => wireToolsApp(win)
    },
    { id: "contact", title: "Contact", icon: ICONS.contact, size: { w: 420, h: 320 },
      render: () => `<h2>Get in touch</h2><p>Happy to talk about projects, internships, or anything CMP/Hastavya related.</p>
        <p><a href="mailto:${portfolioData.contact.email}">${portfolioData.contact.email}</a></p>
        <p><a href="${portfolioData.socials.github}" target="_blank" rel="noopener noreferrer">GitHub — ${portfolioData.githubUsername}</a></p>
        <p><a href="${portfolioData.socials.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn — Dhruba Majumder</a></p>` },
    { id: "feedback", title: "Feedback", icon: ICONS.feedback, size: { w: 440, h: 540 },
      render: () => feedbackAppHTML(),
      onOpen: (win) => wireFeedbackApp(win) }
  ];
}

// ---------------------------------------------------------
// Desktop init
// ---------------------------------------------------------
let desktopWiredOnce = false;

function initDesktopOS() {
  document.title = `${portfolioData.name}'s Portfolio`;
  runBootSequence(() => {
    document.getElementById("desktop").classList.remove("hidden");
    document.getElementById("menu-bar-name").textContent = portfolioData.name;

    APPS = buildApps();
    initDock();
    renderWeatherWidget(document.getElementById("desktop-widget"));
    window.__visitCountPromise.then(count => renderVisitPill(document.getElementById("visit-pill"), count));

    if (!desktopWiredOnce) {
      initClockAndCalendar();
      initPowerMenu();
      initMusicPlayer();
      startNotificationLoop(document.getElementById("notification-stack"));
      desktopWiredOnce = true;
    }

    tickClock();
    if (!window.__uptimeInterval) window.__uptimeInterval = setInterval(tickClock, 1000);

    const initialApp = APPS.find(a => a.openOnStart);
    if (initialApp) openWindow(initialApp);

    pushNotification(document.getElementById("notification-stack"), { icon: "👋", title: `Welcome, ${CURRENT_USERNAME}!`, body: "The dock below has everything — projects, skills, tools, and a terminal." });
  });
}

function tickClock() {
  const clockEl = document.getElementById("clock");
  if (clockEl) clockEl.textContent = formatClock();
  const uptimeEl = document.getElementById("uptime-counter");
  if (uptimeEl) uptimeEl.textContent = formatUptime();
}

// ---------------------------------------------------------
// Power menu + sleep / reboot / logout / shutdown
// ---------------------------------------------------------
function initPowerMenu() {
  const mark = document.getElementById("menu-mark");
  const menu = document.getElementById("power-menu");
  menu.innerHTML = powerMenuHTML();

  mark.addEventListener("click", (e) => { e.stopPropagation(); menu.classList.toggle("hidden"); });
  document.addEventListener("click", (e) => { if (!menu.contains(e.target) && e.target !== mark) menu.classList.add("hidden"); });

  menu.addEventListener("click", (e) => {
    const action = e.target.closest("[data-power]")?.dataset.power;
    if (!action) return;
    menu.classList.add("hidden");
    if (action === "sleep") enterSleep();
    else if (action === "reboot") doReboot();
    else if (action === "logout") doLogout();
    else if (action === "shutdown") doShutdown();
  });
}

function enterSleep() {
  const sleepScreen = document.getElementById("sleep-screen");
  sleepScreen.classList.remove("hidden");
  const clockEl = document.getElementById("sleep-clock");
  const tick = () => { clockEl.textContent = new Date().toLocaleTimeString([], { hour12: false }); };
  tick();
  const interval = setInterval(tick, 1000);
  const wake = () => {
    clearInterval(interval);
    sleepScreen.classList.add("hidden");
    sleepScreen.removeEventListener("click", wake);
    document.removeEventListener("keydown", wake);
  };
  sleepScreen.addEventListener("click", wake);
  document.addEventListener("keydown", wake, { once: true });
}

function doReboot() {
  const desktop = document.getElementById("desktop");
  desktop.style.transition = "opacity 0.4s ease";
  desktop.style.opacity = "0";
  setTimeout(() => {
    desktop.classList.add("hidden");
    desktop.style.opacity = "1";
    Object.keys(openWindows).forEach(id => closeWindow(id));
    const boot = document.getElementById("boot-screen");
    boot.style.opacity = "1";
    setTimeout(() => initDesktopOS(), 1200);
  }, 420);
}

function doLogout() {
  const desktop = document.getElementById("desktop");
  desktop.classList.add("hidden");
  Object.keys(openWindows).forEach(id => closeWindow(id));
  const boot = document.getElementById("boot-screen");
  boot.style.opacity = "1";
  initDesktopOS();
}

// ---------------------------------------------------------
// Dock
// ---------------------------------------------------------
function initDock() {
  const dock = document.getElementById("dock");
  dock.innerHTML = "";
  APPS.forEach(app => {
    const item = document.createElement("div");
    item.className = "dock-item";
    item.id = `dock-item-${app.id}`;
    item.innerHTML = `${app.icon}<span class="tooltip">${app.title}</span><div class="active-dot"></div>`;
    item.addEventListener("click", () => {
      const win = openWindows[app.id];
      if (win) { win.classList.remove("minimized"); focusWindow(win); }
      else openWindow(app);
    });
    dock.appendChild(item);
    dockRefs[app.id] = item;
  });
}

// ---------------------------------------------------------
// Window management
// ---------------------------------------------------------
function openWindow(app) {
  const layer = document.getElementById("windows-layer");
  const win = document.createElement("div");
  win.className = "os-window";
  win.id = `window-${app.id}`;
  const w = app.size?.w || 460, h = app.size?.h || 420;
  const offset = Object.keys(openWindows).length * 26;
  win.style.width = w + "px"; win.style.height = h + "px";
  win.style.left = `calc(50% - ${w/2}px + ${offset}px)`;
  win.style.top = `${40 + offset}px`;

  win.innerHTML = `
    <div class="win-titlebar" data-drag-handle>
      <div class="win-dots">
        <button class="win-dot win-dot-close" data-action="close"><svg viewBox="0 0 8 8"><path d="M1 1l6 6M7 1L1 7" stroke="#4d0000" stroke-width="1.4"/></svg></button>
        <button class="win-dot win-dot-min" data-action="minimize"><svg viewBox="0 0 8 8"><path d="M1 4h6" stroke="#5c3d00" stroke-width="1.4"/></svg></button>
        <button class="win-dot win-dot-max" data-action="maximize"><svg viewBox="0 0 8 8"><path d="M2 6L6 2M2 2h4v4" stroke="#003d0a" stroke-width="1.2"/></svg></button>
      </div>
      <span class="win-title">${app.title}</span>
    </div>
    <div class="win-body">${app.render()}</div>
    <div class="win-resize-handle rz-n" data-rz="n"></div>
    <div class="win-resize-handle rz-s" data-rz="s"></div>
    <div class="win-resize-handle rz-e" data-rz="e"></div>
    <div class="win-resize-handle rz-w" data-rz="w"></div>
    <div class="win-resize-handle rz-ne" data-rz="ne"></div>
    <div class="win-resize-handle rz-nw" data-rz="nw"></div>
    <div class="win-resize-handle rz-se" data-rz="se"></div>
    <div class="win-resize-handle rz-sw" data-rz="sw"></div>`;

  layer.appendChild(win);
  openWindows[app.id] = win;
  dockRefs[app.id]?.classList.add("active");
  focusWindow(win);

  win.querySelector('[data-action="close"]').addEventListener("click", () => closeWindow(app.id));
  win.querySelector('[data-action="minimize"]').addEventListener("click", () => win.classList.add("minimized"));
  win.querySelector('[data-action="maximize"]').addEventListener("click", () => toggleMaximize(win));
  win.addEventListener("mousedown", () => focusWindow(win));

  makeDraggable(win, win.querySelector("[data-drag-handle]"));
  win.querySelectorAll("[data-rz]").forEach(handle => makeResizable(win, handle, handle.dataset.rz));
  if (app.onOpen) app.onOpen(win.querySelector(".win-body"));
}

function closeWindow(id) {
  const win = openWindows[id];
  if (!win) return;
  win.remove();
  delete openWindows[id];
  dockRefs[id]?.classList.remove("active");
}

function focusWindow(win) {
  highestZIndex += 1;
  win.style.zIndex = highestZIndex;
  Object.values(openWindows).forEach(w => w.classList.remove("focused"));
  win.classList.add("focused");
}

function toggleMaximize(win) {
  if (win.dataset.maxed === "1") {
    win.style.width = win.dataset.prevW; win.style.height = win.dataset.prevH;
    win.style.left = win.dataset.prevL; win.style.top = win.dataset.prevT;
    win.dataset.maxed = "0";
  } else {
    win.dataset.prevW = win.style.width; win.dataset.prevH = win.style.height;
    win.dataset.prevL = win.style.left; win.dataset.prevT = win.style.top;
    win.style.width = "94%"; win.style.height = "94%"; win.style.left = "3%"; win.style.top = "2%";
    win.dataset.maxed = "1";
  }
}

function makeDraggable(win, handle) {
  let sx, sy, startL, startT, dragging = false;
  handle.addEventListener("mousedown", (e) => {
    if (e.target.closest(".win-dot")) return;
    dragging = true; sx = e.clientX; sy = e.clientY;
    const rect = win.getBoundingClientRect();
    const parentRect = win.parentElement.getBoundingClientRect();
    startL = rect.left - parentRect.left; startT = rect.top - parentRect.top;
    focusWindow(win); e.preventDefault();
  });
  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    win.style.left = `${startL + (e.clientX - sx)}px`;
    win.style.top = `${Math.max(0, startT + (e.clientY - sy))}px`;
  });
  window.addEventListener("mouseup", () => { dragging = false; });
}

function makeResizable(win, handle, dir) {
  let sx, sy, startW, startH, startL, startT, resizing = false;
  const MIN_W = 300, MIN_H = 200;

  handle.addEventListener("mousedown", (e) => {
    resizing = true; sx = e.clientX; sy = e.clientY;
    const rect = win.getBoundingClientRect();
    const parentRect = win.parentElement.getBoundingClientRect();
    startW = rect.width; startH = rect.height;
    startL = rect.left - parentRect.left; startT = rect.top - parentRect.top;
    focusWindow(win);
    e.preventDefault(); e.stopPropagation();
  });

  window.addEventListener("mousemove", (e) => {
    if (!resizing) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;

    if (dir.includes("e")) {
      win.style.width = `${Math.max(MIN_W, startW + dx)}px`;
    }
    if (dir.includes("s")) {
      win.style.height = `${Math.max(MIN_H, startH + dy)}px`;
    }
    if (dir.includes("w")) {
      const newW = Math.max(MIN_W, startW - dx);
      win.style.width = `${newW}px`;
      win.style.left = `${startL + (startW - newW)}px`;
    }
    if (dir.includes("n")) {
      const newH = Math.max(MIN_H, startH - dy);
      win.style.height = `${newH}px`;
      win.style.top = `${Math.max(0, startT + (startH - newH))}px`;
    }
  });
  window.addEventListener("mouseup", () => { resizing = false; });
}

// ---------------------------------------------------------
// Clock + Calendar dropdown
// ---------------------------------------------------------
function initClockAndCalendar() {
  const btn = document.getElementById("clock-btn");
  const pop = document.getElementById("calendar-pop");
  let viewDate = new Date();

  function render() {
    const year = viewDate.getFullYear(), month = viewDate.getMonth();
    const today = new Date();
    const first = new Date(year, month, 1);
    const startDow = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    const monthName = viewDate.toLocaleString(undefined, { month: "long", year: "numeric" });
    let cells = "";
    for (let i = startDow - 1; i >= 0; i--) cells += `<div class="cal-day muted">${prevDays - i}</div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      cells += `<div class="cal-day ${isToday ? "today" : ""}">${d}</div>`;
    }
    const remainder = (startDow + daysInMonth) % 7;
    if (remainder !== 0) for (let d = 1; d <= 7 - remainder; d++) cells += `<div class="cal-day muted">${d}</div>`;
    pop.innerHTML = `
      <div class="cal-header"><button class="cal-nav-btn" id="cal-prev">‹</button><span>${monthName}</span><button class="cal-nav-btn" id="cal-next">›</button></div>
      <div class="cal-grid">${["S","M","T","W","T","F","S"].map(d => `<div class="cal-dow">${d}</div>`).join("")}${cells}</div>`;
    pop.querySelector("#cal-prev").addEventListener("click", (e) => { e.stopPropagation(); viewDate = new Date(year, month - 1, 1); render(); });
    pop.querySelector("#cal-next").addEventListener("click", (e) => { e.stopPropagation(); viewDate = new Date(year, month + 1, 1); render(); });
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    pop.classList.toggle("hidden");
    if (!pop.classList.contains("hidden")) { viewDate = new Date(); render(); }
  });
  document.addEventListener("click", (e) => { if (!pop.contains(e.target) && e.target !== btn) pop.classList.add("hidden"); });
}

// ---------------------------------------------------------
// Music player
// ---------------------------------------------------------
function initMusicPlayer() {
  const player = document.getElementById("music-player");
  const toggleBtn = document.getElementById("music-toggle-btn");
  const audio = document.getElementById("audio-el");
  const playBtn = document.getElementById("player-play");
  const playIcon = document.getElementById("play-icon");
  const prevBtn = document.getElementById("player-prev");
  const nextBtn = document.getElementById("player-next");
  const loopBtn = document.getElementById("player-loop");
  const trackLabel = document.getElementById("player-track");
  const progressFill = document.getElementById("player-progress-fill");

  const playable = (portfolioData.playlist || []).filter(t => t.src);
  let idx = 0, looping = false;

  function loadTrack(i) {
    if (playable.length === 0) { trackLabel.textContent = "No playable tracks yet — see music/README.txt"; return; }
    idx = (i + playable.length) % playable.length;
    audio.src = playable[idx].src;
    trackLabel.textContent = playable[idx].artist ? `${playable[idx].title} — ${playable[idx].artist}` : playable[idx].title;
  }

  toggleBtn.addEventListener("click", () => {
    player.classList.toggle("hidden");
    if (!player.classList.contains("hidden") && !audio.src && playable.length) loadTrack(0);
  });
  playBtn.addEventListener("click", () => {
    if (!playable.length) return;
    if (!audio.src) loadTrack(0);
    if (audio.paused) { audio.play(); playIcon.innerHTML = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>'; }
    else { audio.pause(); playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; }
  });
  prevBtn.addEventListener("click", () => { loadTrack(idx - 1); audio.play(); });
  nextBtn.addEventListener("click", () => { loadTrack(idx + 1); audio.play(); });
  loopBtn.addEventListener("click", () => { looping = !looping; audio.loop = looping; loopBtn.classList.toggle("active", looping); });
  audio.addEventListener("timeupdate", () => { if (audio.duration) progressFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`; });
  audio.addEventListener("ended", () => { if (!looping) { loadTrack(idx + 1); audio.play(); } });

  if (playable.length === 0) trackLabel.textContent = "No playable tracks yet — see music/README.txt";
}

// ---------------------------------------------------------
// Terminal wiring (shared command set from shared.js)
// ---------------------------------------------------------
function wireTerminal(input, output) {
  if (!input) return;
  const commands = terminalCommands();
  input.addEventListener("keypress", (e) => {
    if (e.key !== "Enter") return;
    const raw = input.value.trim();
    const cmd = raw.toLowerCase();
    const promptLine = document.createElement("div");
    promptLine.className = "term-line";
    promptLine.innerHTML = `<span class="term-prompt">${CURRENT_USERNAME.toLowerCase()}@portfolio:~$</span> ${raw}`;
    output.insertBefore(promptLine, input.closest(".term-input-row"));

    if (cmd === "clear") {
      output.querySelectorAll(".term-line").forEach(l => l.remove());
    } else if (commands[cmd]) {
      const resultLine = document.createElement("div");
      resultLine.className = "term-line";
      resultLine.textContent = commands[cmd]();
      output.insertBefore(resultLine, input.closest(".term-input-row"));
    } else if (raw) {
      const resultLine = document.createElement("div");
      resultLine.className = "term-line";
      resultLine.textContent = `command not found: ${raw} (try 'help')`;
      output.insertBefore(resultLine, input.closest(".term-input-row"));
    }
    input.value = "";
    output.scrollTop = output.scrollHeight;
  });
}
