<h1 align="center" style="display:flex;align-items:center;justify-content:center;gap:12px;">
  💻 <span style="font-weight:700;">Portfolio OS</span> 💻
</h1>

<p align="center">
  <i>A desktop &amp; mobile portfolio that behaves like a tiny operating system — live GitHub feed, weather/AQI, an offline Tools app, day/night theming tied to real time in Kolkata, a mouse-reactive background, and a full boot/power sequence.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-Structure-orange?logo=html5" alt="HTML Badge">
  <img src="https://img.shields.io/badge/CSS3-Styling-blue?logo=css3" alt="CSS Badge">
  <img src="https://img.shields.io/badge/JavaScript-Logic-yellow?logo=javascript" alt="JavaScript Badge">
  <img src="https://img.shields.io/badge/Open--Meteo-Weather%2FAQI-2ea44f" alt="Open-Meteo Badge">
  <img src="https://img.shields.io/badge/Cloudflare_Workers-Backend-F38020?logo=cloudflare" alt="Cloudflare Workers Badge">
  <img src="https://img.shields.io/badge/GitHub_Pages-Deploy-222?logo=github" alt="GitHub Pages Badge">
  <img src="https://img.shields.io/badge/License-Proprietary-red" alt="License Badge">
</p>

<div align="center">
  <img src="https://img.shields.io/badge/⚙️_Built_with_Vanilla_Tech_-_No_Frameworks-black?style=for-the-badge" alt="Vanilla Badge">
</div>

---

## 🪄 Overview

**Portfolio OS** is a desktop-simulation portfolio with two separate, purpose-built UIs — one for desktop, one for mobile — sharing a single codebase. It includes a live GitHub project feed, a working weather/AQI widget, an offline Calculator/Converter/Colour tools app, a music player, an auto day/night theme, a public feedback wall, a visit counter, and a premium animated boot & power sequence.

No build step, no frameworks, no dependencies. Push to GitHub, turn on Pages, done.

---

## ✨ Features

- 🖥️ **Dual UI** — dedicated desktop (windows, dock, menu bar) and mobile (app grid, status bar, full-screen apps) experiences from one codebase
- 🪟 **Freely resizable windows** — every desktop window drags from any of its 8 edges/corners, not just one; mobile stays full-screen by design
- 📱 **Native mobile back behavior** — opening an app on mobile pushes a browser history entry, so the phone's own back gesture/button closes it and returns home, instead of leaving the site
- 🌗 **Day/Night theme** — automatically switches based on the real-time clock in Kolkata (India), with a manual override toggle and a small "Day here / Night here" indicator showing the actual local status regardless of the override
- 🖱️ **Mouse-reactive background** — a soft glow follows the pointer and the wallpaper drifts with a subtle parallax, so the whole page feels alive rather than static
- 📡 **Live GitHub feed** — pulls and ranks your repos automatically
- 🌤️ **Weather + AQI widget** — powered by Open-Meteo (free, no API key), uses visitor location with a fallback city
- 🧮 **Tools app** — Calculator, unit Converter (length/weight/temperature), and a Colour picker with HEX/RGB/HSL + shade swatches, fully offline
- 🎵 **Music player** — play/pause/next/previous/loop with a live progress bar, on both desktop (mini player) and mobile (dedicated app)
- 💬 **Feedback wall** — visitors can leave a name + message; anyone else can read who said what and when. Stored as real, versioned commits in this repo's `data/feedback.json` via a secured backend (see `server/`)
- 👀 **Visit counter** — a running total of page visits, shown as a small pill/widget on both desktop and mobile
- ⚡ **Boot & power sequence** — animated typing welcome, Sleep/Reboot/Log Out/Shut Down actions
- ⏱️ **Persistent uptime counter**
- 🔍 **SEO-ready** — Open Graph/Twitter Card meta, custom favicon set, and Schema.org structured data out of the box

---

## 🧰 Project Structure

| Path | Purpose |
|---|---|
| `index.html` | Shared shell: SEO/OG meta, boot screen, desktop & mobile mounts |
| `css/style.css` | Theme (day + night variables), styling, resize handles, mouse-reactive background |
| `js/data.js` | **Your content** — text, links, skills, playlist, widget config, backend API URL |
| `js/shared.js` | Device-agnostic logic: boot sequence, uptime, weather/AQI, Tools app, Feedback app, visit-pill rendering, power actions |
| `js/desktop.js` | Desktop-only: windows (drag + 8-direction resize), dock, calendar, music player |
| `js/mobile.js` | Mobile-only: app-grid home screen, full-screen app view with history-backed back navigation, status bar |
| `js/theme.js` | Day/Night auto theme (Kolkata clock) + manual override + mouse-reactive background driver |
| `js/github.js` | Live GitHub repo fetch + ranking |
| `js/bootstrap.js` | Selects desktop or mobile build based on screen width; fires the one-time visit count |
| `server/` | Optional Cloudflare Worker backend for the visit counter + feedback wall — see `server/README.md` |
| `music/` | Your own licensed mp3s |
| `assets/` | Favicon set + `og-banner.png` |
| `site.webmanifest` | PWA manifest |

---

## 🎨 Design

A vivid indigo/teal theme built on a translucent "carved-glass" surface system, using [Inconsolata](https://fonts.google.com/share?selection.family=Inconsolata:wght@200..900) across the whole site. Every color is a CSS variable, so the entire UI — menu bar, dock, windows, mobile shell — crossfades smoothly between:

- **Day** — light lavender-white canvas, indigo accent (`#5B45F0`), teal secondary (`#14C7A5`)
- **Night** — deep charcoal/navy canvas (`#0A0B14`), glowing indigo accent (`#8C7BFF`), neon teal (`#2FE3B8`)

The active theme is driven by the real-time clock in **Kolkata** (6am–6pm = day) and can be flipped manually at any time via the toggle button next to the clock.

---

## 🎵 Adding Music

The playlist lives in `js/data.js → playlist`. Each entry needs either:

- **`src`** — your own licensed mp3, dropped into `/music`
- **`spotifyId`** — from Spotify's official "Embed track" share link (fully licensed, no self-hosting required)

> Swap in your own licensed music or Spotify embeds — only use audio you have the rights to.

---

## 💬 Feedback Wall & Visit Counter

Both features are **off by default** and stay quietly hidden until configured — nothing else on the site depends on them.

Turning them on requires a small backend, because a static site can't write to GitHub (or count visits persistently) on its own without exposing a secret token in the browser. Full walkthrough — creating a scoped GitHub token, deploying the Cloudflare Worker, wiring it into `js/data.js` — is in **[`server/README.md`](server/README.md)**.

Once connected:
- Feedback entries are committed straight into this repo at `data/feedback.json` (name, message, timestamp).
- The visit counter increments once per real page load and is stored in Cloudflare KV.

---

## 🧑‍💻 Editing Content

All text, links, skills, playlist, and widget/backend settings live in **`js/data.js`**. You shouldn't need to touch any logic or CSS files just to update your bio, projects, or config.

---

## 🚀 Deploy on GitHub Pages

1. Push this folder to a repo.
2. Repo → **Settings → Pages** → Source: **Deploy from branch** → `main` / root.
3. Live at `https://<username>.github.io/<repo>/` within a minute or two.
4. Update the `og:url` / `canonical` tags in `index.html` to your real URL.
5. (Optional) Submit the URL in [Google Search Console](https://search.google.com/search-console) to speed up indexing.
6. (Optional) Set up `server/` to enable the visit counter and feedback wall.

---

## 🧾 License

**All rights reserved.** This project is **not** open source — see [`LICENSE.md`](LICENSE.md).

No part of this repository (code, design, or content) may be copied, reused, redistributed, or deployed elsewhere without **prior written permission** from the author.

---

## 👤 Author

<p align="center">
  <a href="mailto:iamdhrubamajumder@gmail.com" target="_blank">
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
  <img src="https://capsule-render.vercel.app/api?type=waving&color=5B45F0&height=100&section=footer&text=Portfolio%20OS&fontSize=22&fontColor=ffffff&animation=fadeIn" />
</p>
