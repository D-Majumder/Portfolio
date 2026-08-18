// ===========================================================
// Mobile experience (<=1024px).
// ===========================================================

const M_ICONS = {
  about: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 20c1.6-3.8 4.6-5.8 7.5-5.8s5.9 2 7.5 5.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  projects: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="6" width="17" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 9h17M8 6V4.8A1.3 1.3 0 0 1 9.3 3.5h5.4A1.3 1.3 0 0 1 16 4.8V6" stroke="currentColor" stroke-width="1.6"/></svg>`,
  terminal: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="4.5" width="17" height="15" rx="2.2" stroke="currentColor" stroke-width="1.6"/><path d="M7 9.5l3 2.6-3 2.6M12.5 15h4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  skills: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 19V10M10 19V5M16 19v-7M20 19v-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  contact: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 7l7.5 6 7.5-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  tools: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="4.5" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.6"/><path d="M14 6h6.5M14 9h4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4 16.5l4-4 4 4-4 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="17" cy="17" r="3.4" stroke="currentColor" stroke-width="1.6"/></svg>`,
  music: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke="currentColor" stroke-width="1.6"/></svg>`,
  feedback: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 5.5h16v11H9l-4 3.5v-3.5H4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 10h8M8 13h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
};

function buildMobileApps() {
  return [
    { id: "about", title: "About Me", icon: M_ICONS.about, dock: true,
      render: () => `<h2>Hi, I'm ${portfolioData.name.split(" ")[0]} 👋</h2>${portfolioData.about.map(p => `<p>${p}</p>`).join("")}` },
    { id: "projects", title: "Projects", icon: M_ICONS.projects, dock: true,
      render: () => `
        <h2>Projects</h2>
        <div class="section-label">Featured Builds</div>
        ${portfolioData.featuredBuilds.map(p => `
          <div class="project-card"><div class="project-card-head"><h4>${p.title}</h4></div><p>${p.description}</p>
          <div class="tag-row">${p.tags.map(t => `<span class="tag-chip">${t}</span>`).join("")}</div></div>`).join("")}
        <div class="section-label">Live from GitHub</div>
        <div id="m-gh-project-list"></div>`,
      onOpen: () => GitHubProjects.renderInto(document.getElementById("m-gh-project-list"), { username: portfolioData.githubUsername, ignoreList: portfolioData.githubIgnoreList, pinnedOverride: portfolioData.pinnedRepoOverride })
    },
    { id: "skills", title: "Skills", icon: M_ICONS.skills,
      render: () => `<h2>Skills &amp; Stack</h2><div class="tag-row">${portfolioData.skills.map(s => `<span class="tag-chip">${s}</span>`).join("")}</div>` },
    { id: "terminal", title: "Terminal", icon: M_ICONS.terminal,
      render: () => `<div class="term-body" id="m-term-output"><div class="term-line">Portfolio OS terminal — type <span class="term-prompt">help</span> to see commands.</div>
        <div class="term-input-row"><span class="term-prompt">${CURRENT_USERNAME.toLowerCase()}:~$</span><input class="term-input" id="m-term-input" autocomplete="off" spellcheck="false"></div></div>`,
      onOpen: () => wireTerminal(document.getElementById("m-term-input"), document.getElementById("m-term-output")) },
    { id: "tools", title: "Tools", icon: M_ICONS.tools,
      render: () => toolsAppHTML(),
      onOpen: (container) => wireToolsApp(container)
    },
    { id: "music", title: "Music", icon: M_ICONS.music, dock: true,
      render: () => `<h2>Music</h2><div id="m-player-mount"></div>`,
      onOpen: () => renderMobilePlayer(document.getElementById("m-player-mount")) },
    { id: "contact", title: "Contact", icon: M_ICONS.contact, dock: true,
      render: () => `<h2>Get in touch</h2><p>Happy to talk about projects, internships, or anything CMP/Hastavya related.</p>
        <p><a href="mailto:${portfolioData.contact.email}">${portfolioData.contact.email}</a></p>
        <p><a href="${portfolioData.socials.github}" target="_blank" rel="noopener noreferrer">GitHub — ${portfolioData.githubUsername}</a></p>
        <p><a href="${portfolioData.socials.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn — Dhruba Majumder</a></p>` },
    { id: "feedback", title: "Feedback", icon: M_ICONS.feedback,
      render: () => feedbackAppHTML(),
      onOpen: (container) => wireFeedbackApp(container) }
  ];
}

let M_APPS = [];
let mobileAudio = null;
let mobileWiredOnce = false;

function initMobileOS() {
  document.title = `${portfolioData.name}'s Portfolio`;
  runBootSequence(() => {
    document.getElementById("mobile-view").classList.remove("hidden");
    M_APPS = buildMobileApps();

    renderMobileHome();
    if (!mobileWiredOnce) {
      initMobilePowerMenu();
      startNotificationLoop(document.getElementById("mobile-view"));
      mobileWiredOnce = true;
    }

    tickMobileClock();
    if (!window.__uptimeIntervalMobile) window.__uptimeIntervalMobile = setInterval(tickMobileClock, 1000);
  });
}

function tickMobileClock() {
  const el = document.getElementById("m-clock");
  if (el) el.textContent = formatClock();
}

// ---------------------------------------------------------
// Home screen: widget stack + app grid + bottom dock
// ---------------------------------------------------------
function renderMobileHome() {
  const widgetsEl = document.getElementById("m-widgets");
  widgetsEl.innerHTML = `<div class="m-widget-card glass" id="m-weather-widget"></div><div class="m-widget-card glass hidden" id="m-visit-widget"></div>`;
  renderWeatherWidget(document.getElementById("m-weather-widget"));
  window.__visitCountPromise.then(count => renderVisitPill(document.getElementById("m-visit-widget"), count));

  const gridEl = document.getElementById("m-app-grid");
  const gridApps = M_APPS.filter(a => !a.dock);
  gridEl.innerHTML = gridApps.map(app => `
    <div class="m-app-icon" data-app="${app.id}">
      <div class="m-app-icon-glyph">${app.icon}</div>
      <span>${app.title}</span>
    </div>`).join("");
  gridEl.querySelectorAll("[data-app]").forEach(el => el.addEventListener("click", () => openMobileApp(el.dataset.app)));

  const dockEl = document.getElementById("m-dock");
  const dockApps = M_APPS.filter(a => a.dock);
  dockEl.innerHTML = dockApps.map(app => `
    <div class="m-app-icon" data-app="${app.id}">
      <div class="m-app-icon-glyph">${app.icon}</div>
    </div>`).join("");
  dockEl.querySelectorAll("[data-app]").forEach(el => el.addEventListener("click", () => openMobileApp(el.dataset.app)));
}

function openMobileApp(id) {
  const app = M_APPS.find(a => a.id === id);
  if (!app) return;
  const view = document.getElementById("m-app-view");
  const body = document.getElementById("m-app-body");
  document.getElementById("m-app-title").textContent = app.title;
  body.innerHTML = app.render();
  view.classList.remove("hidden");
  if (app.onOpen) app.onOpen(body);

  if (!(history.state && history.state.mApp === id)) {
    history.pushState({ mApp: id }, "", "#" + id);
  }
}

function closeMobileApp(fromPopState) {
  document.getElementById("m-app-view").classList.add("hidden");
  if (!fromPopState && history.state && history.state.mApp) {
    history.back();
  }
}

window.addEventListener("popstate", (e) => {
  const view = document.getElementById("m-app-view");
  if (view && !view.classList.contains("hidden") && !(e.state && e.state.mApp)) {
    closeMobileApp(true);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("m-back-btn");
  if (backBtn) backBtn.addEventListener("click", () => closeMobileApp(false));
});

// ---------------------------------------------------------
// Mobile power menu
// ---------------------------------------------------------
function initMobilePowerMenu() {
  const btn = document.getElementById("m-power-btn");
  const menu = document.getElementById("m-power-menu");
  menu.innerHTML = powerMenuHTML();
  menu.style.position = "fixed";
  menu.style.top = "44px";
  menu.style.right = "16px";
  menu.style.left = "auto";

  btn.addEventListener("click", (e) => { e.stopPropagation(); menu.classList.toggle("hidden"); });
  document.addEventListener("click", (e) => { if (!menu.contains(e.target) && e.target !== btn) menu.classList.add("hidden"); });

  menu.addEventListener("click", (e) => {
    const action = e.target.closest("[data-power]")?.dataset.power;
    if (!action) return;
    menu.classList.add("hidden");
    if (action === "sleep") enterMobileSleep();
    else if (action === "reboot") doMobileReboot();
    else if (action === "logout") doMobileLogout();
    else if (action === "shutdown") doShutdown();
  });
}

function enterMobileSleep() {
  const sleepScreen = document.getElementById("sleep-screen");
  sleepScreen.classList.remove("hidden");
  const clockEl = document.getElementById("sleep-clock");
  const tick = () => { clockEl.textContent = new Date().toLocaleTimeString([], { hour12: false }); };
  tick();
  const interval = setInterval(tick, 1000);
  const wake = () => { clearInterval(interval); sleepScreen.classList.add("hidden"); sleepScreen.removeEventListener("click", wake); document.removeEventListener("keydown", wake); };
  sleepScreen.addEventListener("click", wake);
  document.addEventListener("keydown", wake, { once: true });
}

function doMobileReboot() {
  const mv = document.getElementById("mobile-view");
  mv.style.transition = "opacity 0.4s ease";
  mv.style.opacity = "0";
  setTimeout(() => {
    mv.classList.add("hidden");
    mv.style.opacity = "1";
    document.getElementById("m-app-view").classList.add("hidden");
    const boot = document.getElementById("boot-screen");
    boot.style.opacity = "1";
    setTimeout(() => initMobileOS(), 1200);
  }, 420);
}

function doMobileLogout() {
  document.getElementById("mobile-view").classList.add("hidden");
  document.getElementById("m-app-view").classList.add("hidden");
  const boot = document.getElementById("boot-screen");
  boot.style.opacity = "1";
  initMobileOS();
}

// ---------------------------------------------------------
// Mobile music player 
// ---------------------------------------------------------
function renderMobilePlayer(mount) {
  if (!mount) return;
  const playable = (portfolioData.playlist || []).filter(t => t.src);
  mount.innerHTML = `
    <div class="player-track" id="m-player-track" style="margin-bottom:10px;">${playable.length ? "Ready to play" : "No playable tracks yet — see music/README.txt"}</div>
    <div class="player-progress-track" style="margin-bottom:14px;"><div class="player-progress-fill" id="m-player-progress-fill"></div></div>
    <div class="player-controls" style="justify-content:flex-start; gap:20px;">
      <button id="m-player-prev" class="player-btn">⏮</button>
      <button id="m-player-play" class="player-btn player-btn-main" style="width:44px;height:44px;">▶</button>
      <button id="m-player-next" class="player-btn">⏭</button>
      <button id="m-player-loop" class="player-btn player-btn-toggle">🔁</button>
    </div>
    <div class="tag-row" style="margin-top:20px;">
      ${(portfolioData.playlist || []).map(t => `<span class="tag-chip">${t.title}${t.artist ? " — " + t.artist : ""}</span>`).join("")}
    </div>
  `;

  if (!mobileAudio) mobileAudio = new Audio();
  let idx = 0, looping = false;
  const trackLabel = document.getElementById("m-player-track");
  const progressFill = document.getElementById("m-player-progress-fill");
  const playBtn = document.getElementById("m-player-play");

  function loadTrack(i) {
    if (!playable.length) return;
    idx = (i + playable.length) % playable.length;
    mobileAudio.src = playable[idx].src;
    trackLabel.textContent = playable[idx].artist ? `${playable[idx].title} — ${playable[idx].artist}` : playable[idx].title;
  }

  playBtn.addEventListener("click", () => {
    if (!playable.length) return;
    if (!mobileAudio.src) loadTrack(0);
    if (mobileAudio.paused) { mobileAudio.play(); playBtn.textContent = "⏸"; }
    else { mobileAudio.pause(); playBtn.textContent = "▶"; }
  });
  document.getElementById("m-player-prev").addEventListener("click", () => { loadTrack(idx - 1); mobileAudio.play(); playBtn.textContent = "⏸"; });
  document.getElementById("m-player-next").addEventListener("click", () => { loadTrack(idx + 1); mobileAudio.play(); playBtn.textContent = "⏸"; });
  document.getElementById("m-player-loop").addEventListener("click", (e) => { looping = !looping; mobileAudio.loop = looping; e.target.classList.toggle("active", looping); });
  mobileAudio.addEventListener("timeupdate", () => { if (mobileAudio.duration) progressFill.style.width = `${(mobileAudio.currentTime / mobileAudio.duration) * 100}%`; });
}
