// ===========================================================
// Portfolio content. Edit this file for text/links/skills/etc.
// ===========================================================

const portfolioData = {
  name: "Dhruba Majumder",
  role: "BCA Student • Founder, Hastavya • Builder of CMP",
  cvFile: "Dhruba_Majumder_CV.pdf",
  contact: { email: "iamdhrubamajumder@gmail.com" },
  socials: {
    github: "https://github.com/D-Majumder",
    linkedin: "https://www.linkedin.com/in/iamdhrubamajumder/",
  },

  githubUsername: "D-Majumder",
  pinnedRepoOverride: [
    "Gesture-Board", "CyberGuardian", "Event-Coupon-Management",
    "Password-Vault", "CineVault", "Smart-Time-Table"
  ],
  githubIgnoreList: [],

  featuredBuilds: [
    { title: "CMP — Cognitive Mobility Platform", description: "A wireless bionic wheelchair controlled by EEG/EMG/EOG biosignals. Custom Arduino master/slave firmware, Bluetooth command handling, ultrasonic obstacle caching, and an HC-05 failsafe for disconnects.", tags: ["Arduino", "Embedded", "Bluetooth", "Biosignals"] },
    { title: "Hastavya", description: "Founder of a trade-licensed handcrafted heritage clay-art brand, sourcing traditional clay toys and art from Krishnanagar and selling on Meesho.", tags: ["E-commerce", "Sourcing", "Logistics"] },
    { title: "Abhay Charan Art Academy — Website Redesign", description: "Full visual redesign of the family art academy's website (founded 2000, Mayapur) — six pages rebuilt with a gallery/museum aesthetic, a shared CSS design system, and a WhatsApp contact widget.", tags: ["Web Design", "Design System", "CSS"] }
  ],

  skills: [
    "Arduino / Embedded Systems", "Python", "JavaScript", "Computer Vision (OpenCV)",
    "RAG Pipelines", "Supabase / pgvector", "API Integration", "Cybersecurity",
    "Penetration Testing", "Responsive Web Design", "E-commerce Operations"
  ],

  about: [
    "I'm a final-year BCA student (2027 batch) at Global Knowledge Campus, Kolkata, currently preparing for NIMCET and JECA to pursue an MCA.",
    "Alongside my degree, I run Hastavya, a handcrafted heritage clay-art brand, and manage the Abhay Charan Art Academy — an institution my father founded in 2000 — handling its class schedules, website, and student records.",
    "On the technical side, I build hardware/software systems end to end: from CMP, a wireless bionic wheelchair driven by biosignals, to RAG-powered developer tools and computer-vision projects."
  ],

  notifications: [
    { icon: "👋", title: "Hi there!", body: "Thanks for stopping by — feel free to poke around the dock." },
    { icon: "🛠️", title: "Currently building", body: "CMP — a biosignal-controlled bionic wheelchair." },
    { icon: "🎓", title: "Also on my plate", body: "Prepping for NIMCET & JECA to start my MCA." },
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
