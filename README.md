<h1 align="center" id="title" style="display:flex;align-items:center;justify-content:center;gap:12px;">
  💻 <span style="font-weight:700;">Interactive macOS-Style Portfolio</span> 💻
</h1>

<p align="center">
  <i>“A sleek, desktop-inspired portfolio — where design meets interactivity.”</i>
</p>

<p align="center">
  <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80" alt="macOS Portfolio Preview" style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 0 15px rgba(0,0,0,0.25);">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-Structure-orange?logo=html5" alt="HTML Badge">
  <img src="https://img.shields.io/badge/CSS3-Styling-blue?logo=css3" alt="CSS Badge">
  <img src="https://img.shields.io/badge/Tailwind-Utility-blueviolet?logo=tailwindcss" alt="Tailwind Badge">
  <img src="https://img.shields.io/badge/JavaScript-Logic-yellow?logo=javascript" alt="JavaScript Badge">
  <img src="https://img.shields.io/badge/License-MIT-lightgrey" alt="License Badge">
</p>

---

<div align="center">
  <img src="https://img.shields.io/badge/⚙️_Built_with_Vanilla_Tech_-_No_Frameworks-black?style=for-the-badge" alt="Vanilla Badge">
</div>

---

## 🪄 Overview

**Interactive macOS-Style Portfolio** transforms your personal portfolio into a **fully interactive desktop environment** — complete with a menu bar, dock, draggable app windows, and startup animations. Everything is crafted with **pure HTML, CSS, and JavaScript** — no frameworks, no dependencies.

> ✨ *A lightweight, immersive experience that feels like exploring a real operating system.*

---

## 🚀 Features

🖥️ **macOS UI Simulation**  
A full desktop interface with a top menu bar, dock icons, and movable windows.  

🪟 **Window Management**  
Open, close, minimize, maximize, and drag application windows freely.  

📂 **Dynamic Content System**  
Edit all your info (about, skills, projects, etc.) from one JS object — no HTML editing needed.  

⚡ **Boot & Shutdown Animations**  
Startup animation, login screen, and shutdown sequence for added immersion.  

🕒 **Live Clock & Uptime Counter**  
Displays current system time and “site uptime.”  

📱 **Responsive Design**  
Optimized for desktop, but still accessible on mobile and tablet.  

🧩 **Zero Dependencies**  
Built purely with **vanilla JavaScript**, **HTML**, and **Tailwind via CDN**.

---

## 🧰 Tech Stack

| Technology | Purpose |
|-------------|----------|
| 🧱 **HTML5** | Core structure |
| 🎨 **CSS3** | Styling & animations |
| 🌀 **Tailwind CSS** | Utility-first styling |
| ⚙️ **JavaScript (ES6+)** | Window logic & interactivity |
| 🧭 **Lucide Icons** | Clean vector icons |

---

## 🧑‍💻 Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/dhrubamajumder/your-repo-name.git
   ```

2. **Open `portfolio.html`**  
   Find the `<script>` section and update the `portfolioData` object:

   ```js
   const portfolioData = {
       name: "Your Name",
       cvFile: "Your_CV.pdf",
       contact: { email: "you@example.com" },
       socials: {
           github: "https://github.com/yourusername",
           linkedin: "https://linkedin.com/in/yourusername",
           website: "https://your-site.com"
       },
       apps: [ /* Edit window content here */ ]
   };
   ```

3. **Add Icons**
   - Create an `assets/` folder in the root directory.
   - Add 64×64 icons (PNG/SVG).
   - Update icon paths like:
     ```js
     icon: "assets/about-icon.png",
     ```

4. **Deploy Anywhere**  
   Host on **Vercel**, **Netlify**, or **GitHub Pages** — it’s 100% static!

---

## 🧩 Customization Tips

- Modify animations in CSS for personalized boot or shutdown effects.  
- Add more “apps” (About, Projects, Contact) via the `apps` array.  
- Use Lucide or custom SVGs for a unique dock aesthetic.  
- Experiment with blur and glassmorphism for a modern look.  

---

## 🧠 Example App Object

```js
{
  title: "Projects",
  icon: "assets/projects-icon.png",
  content: `
    <h2>Featured Projects</h2>
    <ul>
      <li><strong>Portfolio OS:</strong> The site you're viewing!</li>
      <li><strong>TaskMate:</strong> Productivity app built with vanilla JS.</li>
      <li><strong>DesignFlow:</strong> Figma-to-code tool prototype.</li>
    </ul>
  `
}
```

---

## 🧾 License

This project is released under the **MIT License** — free to use, modify, and share.  
See the `LICENSE.md` file for details.

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
  💻 <i>“Code it like it’s your OS — minimal, elegant, and interactive.”</i> 💻
</p>

<div align="center">
  <img src="https://img.shields.io/badge/🚀_Built_with_HTML_CSS_JS_-_Pure_and_Lightweight_-black?style=for-the-badge" alt="Pure Tech Badge">
</div>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0A84FF&height=100&section=footer&text=Welcome%20to%20My%20Portfolio%20Desktop&fontSize=22&fontColor=ffffff&animation=fadeIn" />
</p>
