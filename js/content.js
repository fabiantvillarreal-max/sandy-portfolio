// js/content.js
// ============================================================
// PORTFOLIO CONTENT — edit this file to update the site
// ============================================================

window.PORTFOLIO = {
  // --- HERO ---
  name: "Sandra Gómez",
  title: "Multidisciplinary Designer",
  tagline: "Merging art, design & artificial intelligence to craft innovative visual experiences.",
  heroImage: "images/profile.jpg",

  // --- ABOUT ---
  about: "Multidisciplinary designer passionate about merging art, design, and artificial intelligence to craft innovative visual experiences. Currently pursuing a Master of Science in Digital Arts and Creative Technologies at La Salle Barcelona. Skilled in visual storytelling, branding, and AI-assisted creation, I constantly explore how technology can elevate emotion, aesthetics, and meaning in every project.",

  // --- PROJECTS ---
  // To add a project: copy one object {} and paste it at the end of the array
  // type: "image" | "video"
  // For videos: paste YouTube or Vimeo URL in the "video" field
  projects: [
    {
      id: 1,
      title: "Escribà — AI Creative Direction",
      description: "AI-generated high-end visual assets and brand imagery for Escribà's artisan pastry collections. Photorealistic 8K quality for global campaigns.",
      category: "AI & Branding",
      type: "image",
      image: "images/project-escriba.jpg",
      video: ""
    },
    {
      id: 2,
      title: "Immersive Room Installation",
      description: "Interactive multimedia experience designed and produced for an immersive spatial installation.",
      category: "Interactive",
      type: "video",
      image: "images/project-inmersiva.jpg",
      video: "https://www.youtube.com/watch?v=REPLACE_WITH_YOUR_VIDEO_ID"
    },
    {
      id: 3,
      title: "Mini Interactive Experience",
      description: "A self-contained interactive experience — not a game, but an immersive journey through sound, visuals and touch.",
      category: "Interactive",
      type: "video",
      image: "images/project-interactiva.jpg",
      video: "https://www.youtube.com/watch?v=REPLACE_WITH_YOUR_VIDEO_ID"
    },
    {
      id: 4,
      title: "Creative Photography",
      description: "Art direction and creative photography for advertising and editorial campaigns.",
      category: "Photography",
      type: "image",
      image: "images/project-photo.jpg",
      video: ""
    }
  ],

  // --- CATEGORIES (for filter tabs) ---
  // Add or remove as needed. "All" is always included automatically.
  categories: ["All", "AI & Branding", "Interactive", "Photography"],

  // --- CONTACT ---
  email: "sandygvz96@gmail.com",
  location: "Barcelona, Spain",
  socials: {
    behance: "https://www.behance.net/sandragomez36",
    linkedin: "",
    instagram: ""
  }
};
