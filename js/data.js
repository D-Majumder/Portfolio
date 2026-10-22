// ===========================================================
// Portfolio content. Edit this file for text/links/skills/etc.
// ===========================================================

const portfolioData = {
  name: "Dhruba Majumder",
  role: "Software Developer • Founder, ANABHAY VENTURES • BCA Student",
  cvFile: "Dhruba_Majumder_CV.pdf",
  contact: { email: "dhrubamajumder@proton.me" },
  socials: {
    github: "https://github.com/D-Majumder",
    linkedin: "https://www.linkedin.com/in/iamdhrubamajumder/",
  },

  githubUsername: "D-Majumder",
  githubSelectedRepos: ["ANABHAY-VENTURES/Witnessgraph", "ANABHAY-VENTURES/civic-sync", "ANABHAY-VENTURES/gradewise", "ANABHAY-VENTURES/news-dash"],
  pinnedRepoOverride: [
    "D-Majumder/gesture-board", "D-Majumder/pulse",
    "D-Majumder/bca", "D-Majumder/event-coupon-management"
  ],
  githubIgnoreList: [],

  featuredBuilds: [
    { title: "Witnessgraph", status: "Research tool", description: "A local-first cybersecurity investigation system for preserving evidence, tracing claims to their sources, exploring relationships, and exporting cases for independent verification.", tags: ["Python", "SQLite", "FastAPI", "React"], url: "https://github.com/ANABHAY-VENTURES/Witnessgraph", linkLabel: "Explore repository" },
    { title: "CivicSync", status: "Working prototype", description: "Turns citizen complaints in English, Hindi, or Bengali into trackable civic reports. Combines AI-assisted understanding with jurisdiction routing and authority-controlled resolution workflows.", tags: ["Python", "FastAPI", "SQLite", "Gemini"], url: "https://anabhay.in/projects/civicsync/", linkLabel: "Read project overview" },
    { title: "GradeWise", status: "Academic tools", description: "Academic conversions and credit-weighted results, with institution-specific formulas linked to official sources where verified, plus target-score planning and custom calculations.", tags: ["React", "TypeScript", "Vite"], url: "https://github.com/ANABHAY-VENTURES/gradewise", linkLabel: "Explore repository" },
    { title: "News-Dash", status: "Full-stack application", description: "A MERN news reader with live article fetching, Gemini-assisted summaries, JWT authentication, and a personal dashboard for saved summaries.", tags: ["React", "Node.js", "Express", "MongoDB"], url: "https://github.com/ANABHAY-VENTURES/news-dash", linkLabel: "Explore repository" },
    { title: "CMP — Cognitive Mobility Platform", status: "Team project · In development", description: "An assistive-mobility project with Team Ekadanta. My contribution covers signal acquisition, Bluetooth master/slave communication, and motor/obstacle-detection integration. Physical safety validation remains outstanding.", tags: ["Embedded C", "Arduino", "Bluetooth", "Sensors"], url: "https://anabhay.in/projects/cognitive-mobility-platform/", linkLabel: "Read project overview" },
    { title: "Hastavya", description: "Founder of a trade-licensed handcrafted heritage clay-art brand, sourcing traditional clay toys and art from Krishnanagar and selling on Meesho.", tags: ["E-commerce", "Sourcing", "Logistics"] },
    { title: "Abhay Charan Art Academy — Website Redesign", description: "Full visual redesign of the family art academy's website (founded 2000, Mayapur) — six pages rebuilt with a gallery/museum aesthetic, a shared CSS design system, and a WhatsApp contact widget.", tags: ["Web Design", "Design System", "CSS"] }
  ],

  skills: [
    "Python", "JavaScript / TypeScript", "React", "Node.js / Express", "FastAPI",
    "SQL / SQLite", "MongoDB", "C / C++", "Arduino / Embedded Systems", "Computer Vision (OpenCV)",
    "RAG Pipelines", "Supabase / pgvector", "API Integration", "Cybersecurity",
    "Penetration Testing", "Responsive Web Design", "E-commerce Operations"
  ],

  about: [
    "I'm a software developer and BCA student at Global Knowledge Campus (2023–2027), and the founder of ANABHAY VENTURES. I learn by building systems across software, security, AI-assisted workflows, and embedded engineering.",
    "At ANABHAY VENTURES, we focus on practical digital solutions: software and web development, intelligent systems, automation, IoT, cybersecurity, and research-led product development.",
    "My selected work includes Witnessgraph, CivicSync, GradeWise, and News-Dash. I also contribute to the Cognitive Mobility Platform with Team Ekadanta, working on signal acquisition, communication, and embedded control integration.",
    "Alongside technology, I run Hastavya, a heritage clay-art brand, and help manage Abhay Charan Art Academy, founded by my father in 2000. My engineering focus is on stronger fundamentals, careful testing, and clear documentation."
  ],

  company: {
    name: "ANABHAY VENTURES",
    role: "Founder",
    url: "https://anabhay.in/",
    description: "Practical technology. Useful systems. Software, intelligent systems, automation, and engineering that connects the digital and physical worlds."
  },

  notifications: [
    { icon: "👋", title: "Hi there!", body: "Thanks for stopping by — feel free to poke around the dock." },
    { icon: "🛠️", title: "Building at ANABHAY", body: "Explore our work in software, intelligent systems, and embedded engineering." },
    { icon: "🎓", title: "Learning by building", body: "BCA at Global Knowledge Campus — systems, security, and software engineering." },
    { icon: "🧵", title: "Side project", body: "Hastavya — handcrafted heritage clay art, sourced from Krishnanagar." },
    { icon: "💬", title: "Say hello", body: "Open the Terminal app and try `contact`." }
  ],


  playlist: [
    { title: "The Child In Us", artist: "Enigma", src: "music/The_Child_In_Us.mp3", spotifyId: "" }
  ],

  // ---------------------------------------------------------
  // Community backend — visit counter + feedback wall.
  // ---------------------------------------------------------
  api: {
    baseUrl: "https://portfolio-os-api.abhaycharanartacademy12.workers.dev"
  },

  // ---------------------------------------------------------
  // Widgets
  // ---------------------------------------------------------
  widgets: {
    // Open-Meteo — free, keyless, used as-is (no config needed).
    weather: {
      fallbackCity: "Kolkata",
      fallbackLat: 22.5726,
      fallbackLon: 88.3639
    }
  }
};
