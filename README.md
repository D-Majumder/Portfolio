<h1 align="center" style="display:flex;align-items:center;justify-content:center;gap:12px;">
  💻 <span style="font-weight:700;">Portfolio OS</span> 💻
</h1>

<p align="center">
  <i>A calm, Apple-minimal desktop &amp; mobile portfolio — live GitHub feed, weather/AQI, an offline Tools app, and a full boot/power sequence.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-Structure-orange?logo=html5" alt="HTML Badge">
  <img src="https://img.shields.io/badge/CSS3-Styling-blue?logo=css3" alt="CSS Badge">
  <img src="https://img.shields.io/badge/JavaScript-Logic-yellow?logo=javascript" alt="JavaScript Badge">
  <img src="https://img.shields.io/badge/Open--Meteo-Weather%2FAQI-2ea44f" alt="Open-Meteo Badge">
  <img src="https://img.shields.io/badge/GitHub_Pages-Deploy-222?logo=github" alt="GitHub Pages Badge">
  <img src="https://img.shields.io/badge/License-MIT-lightgrey" alt="License Badge">
</p>

<div align="center">
  <img src="https://img.shields.io/badge/⚙️_Built_with_Vanilla_Tech_-_No_Frameworks-black?style=for-the-badge" alt="Vanilla Badge">
</div>

---

## 🪄 Overview

**Portfolio OS** is a desktop-simulation portfolio with two separate, purpose-built UIs — one for desktop, one for mobile — sharing a single codebase. It includes a live GitHub project feed, a working weather/AQI widget, an offline Calculator/Converter/Colour tools app, a music player, and a premium animated boot & power sequence.

No build step, no frameworks, no dependencies. Push to GitHub, turn on Pages, done.

---

## ✨ Features

- 🖥️ **Dual UI** — dedicated desktop (windows, dock, menu bar) and mobile (app grid, status bar, full-screen apps) experiences from one codebase
- 📡 **Live GitHub feed** — pulls and ranks your repos automatically
- 🌤️ **Weather + AQI widget** — powered by Open-Meteo (free, no API key), uses visitor location with a fallback city
- 🧮 **Tools app** — Calculator, unit Converter (length/weight/temperature), and a Colour picker with HEX/RGB/HSL + shade swatches, fully offline
- 🎵 **Music player** — play/pause/next/previous/loop with a live progress bar, on both desktop (mini player) and mobile (dedicated app)
- ⚡ **Boot & power sequence** — animated typing welcome, Sleep/Reboot/Log Out/Shut Down actions
- ⏱️ **Persistent uptime counter**
- 🔍 **SEO-ready** — Open Graph/Twitter Card meta, custom favicon set, and Schema.org structured data out of the box

---

## 🧰 Project Structure

| Path | Purpose |
|---|---|
| `index.html` | Shared shell: SEO/OG meta, boot screen, desktop & mobile mounts |
| `css/style.css` | Theme and all styling |
| `js/data.js` | **Your content** — text, links, skills, playlist, widget config |
| `js/shared.js` | Device-agnostic logic: boot sequence, uptime, weather/AQI, Tools app, power actions |
| `js/desktop.js` | Desktop-only: windows, dock, calendar, music player |
| `js/mobile.js` | Mobile-only: app-grid home screen, full-screen app view, status bar |
| `js/github.js` | Live GitHub repo fetch + ranking |
| `js/bootstrap.js` | Selects desktop or mobile build based on screen width |
| `music/` | Your own licensed mp3s (see `music/README.txt`) |
| `assets/` | Favicon set + `og-banner.png` |
| `site.webmanifest` | PWA manifest |

---

## 🎨 Design

A light, neutral "carved-glass" theme: off-white canvas (`#EEF0F3`), charcoal text, a single Apple-blue accent (`#0071E3`), and soft inset/outset shadows (`--shadow-carve`) instead of glow effects across every panel, window, and widget.

---

## 🎵 Adding Music

Playlist entries already exist in `js/data.js → playlist` — you just need to supply the audio for each track using one of:

- **`src`** — your own licensed mp3, dropped into `/music`
- **`spotifyId`** — from Spotify's official "Embed track" share link (fully licensed, no self-hosting required)

Full steps are in `music/README.txt`.

> Swap in your own licensed music or Spotify embeds — audio files aren't bundled with this template.

---

## 🧑‍💻 Editing Content

All text, links, skills, playlist, and widget settings live in **`js/data.js`**. You shouldn't need to touch any logic or CSS files just to update your bio, projects, or config.

---

## 🚀 Deploy on GitHub Pages

1. Push this folder to a repo.
2. Repo → **Settings → Pages** → Source: **Deploy from branch** → `main` / root.
3. Live at `https://<username>.github.io/<repo>/` within a minute or two.
4. Update the `og:url` / `canonical` tags in `index.html` to your real URL.
5. (Optional) Submit the URL in [Google Search Console](https://search.google.com/search-console) to speed up indexing.

---

## 🧾 License

Released under the **MIT License** — free to use, modify, and share.

---

## 👤 Author

<p align="center">
  <a href="mailto:dhrubamajumder@proton.me" target="_blank">
    <img src="https://img.shields.io/badge/Email-Dhruba%20Majumder-blue?logo=gmail" alt="Email Badge">
  </a>
  <a href="https://www.linkedin.com/in/iamdhrubamajumder/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-Dhruba%20Majumder-blue?logo=linkedin" alt="LinkedIn Badge">
  </a>
  <a href="https://github.com/D-Majumder" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-D--Majumder-black?logo=github" alt="GitHub Badge">
  </a>
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0071E3&height=100&section=footer&text=Portfolio%20OS&fontSize=22&fontColor=ffffff&animation=fadeIn" />
</p>
