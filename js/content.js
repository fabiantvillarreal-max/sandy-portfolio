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

  // --- ABOUT / SANDY.INFO ---
  about: "I'm a multidisciplinary designer based in Barcelona, passionate about the intersection of art, technology, and human experience. I work across AI creative direction, immersive installations, interactive media, and photography — always searching for the emotional core of every project.\n\nCurrently pursuing a Master of Science in Digital Arts and Creative Technologies at La Salle Barcelona. Before that, years of hands-on work crafting campaigns, visual identities, and spatial experiences for brands and cultural projects.\n\nI believe great design doesn't just look good — it makes people feel something.",

  // --- INFO BLOCKS (shown on sandy.info page) ---
  info: {
    education: "MSc Digital Arts & Creative Technologies\nLa Salle — Ramon Llull University, Barcelona",
    disciplines: [
      "AI Creative Direction",
      "Immersive Installations",
      "Interactive Experiences",
      "Visual Storytelling",
      "Art Direction",
      "Photography"
    ],
    tools: [
      "Adobe Creative Suite",
      "Midjourney · Stable Diffusion",
      "After Effects · DaVinci Resolve",
      "Figma",
      "TouchDesigner"
    ],
    languages: "Spanish (native) · English (professional)"
  },

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
