// ===========================================================
// Entry point. Picks desktop.js or mobile.js based on screen size.
// ===========================================================

document.addEventListener("DOMContentLoaded", () => {
  initThemeSystem();
  initAliveBackground();
  // Fetched once per real page load — reboot/logout inside the OS
  // simulation re-runs init but must not count as a new visit.
  window.__visitCountPromise = fetchAndBumpVisitCount();

  const isMobile = window.matchMedia("(max-width: 1024px)").matches;
  if (isMobile) {
    document.body.classList.add("mobile-mode");
    initMobileOS();
  } else {
    document.body.classList.add("desktop-mode");
    initDesktopOS();
  }
});
